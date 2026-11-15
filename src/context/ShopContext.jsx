import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const ShopContext = createContext();

export const ADMIN_CREDENTIALS = {
  role: 'admin',
  roleName: 'Admin',
  name: 'Admin',
  fullName: 'Admin CLAYÉ',
  email: 'admin@claye.id',
  password: 'admin123',
  phone: '+62 811-2233-4455',
  address: 'Jl. Sejuta Kenangan, Palembang, Sumatera Selatan',
  city: 'Palembang',
  province: 'Sumatera Selatan',
  postalCode: '30138',
  country: 'Indonesia',
  patronSince: '2021',
  cohort: 'Admin CLAYÉ'
};

const INITIAL_USER = null;
const INITIAL_CART = [];
const INITIAL_WISHLIST = [];

const INITIAL_ORDERS = [
  {
    id: '#CLY-2026-021',
    patron: 'Nadia Putri',
    initials: 'NP',
    email: 'nadia.putri@gmail.com',
    phone: '+62 812-9988-7711',
    city: 'Jakarta Selatan',
    address: 'Jl. Senopati No. 44, Kebayoran Baru, Jakarta Selatan',
    date: '20 Okt 2026',
    itemsSummary: 'The Sunday Mug (Glasir Batu Pasir)',
    variantSummary: 'Batu Pasir & Gading',
    items: [
      { name: 'The Sunday Mug', glaze: 'Batu Pasir', quantity: 1, price: 125000 }
    ],
    total: 250000,
    shippingFee: 15000,
    grandTotal: 265000,
    paymentStatus: 'Lunas',
    paymentMethod: 'Transfer BCA',
    fulfillment: 'Diproses',
    courier: 'JNE Eco-Shield (Garansi Pecah Belah)',
    trackingNumber: 'CLY-EXP-99201-BDG',
    image: '/assets/images/product_mug.jpg'
  },
  {
    id: '#CLY-2026-022',
    patron: 'Rania Putri',
    initials: 'RP',
    email: 'rania.p@outlook.com',
    phone: '+62 813-2211-4455',
    city: 'Bandung Barat',
    address: 'Komp. Setiabudi Regency No. 12, Bandung Barat',
    date: '21 Okt 2026',
    itemsSummary: 'The Everyday Plate (Glasir Gading)',
    variantSummary: 'Gading (Ivory) • Jml: 1',
    items: [
      { name: 'The Everyday Plate', glaze: 'Gading (Ivory)', quantity: 1, price: 125000 }
    ],
    total: 125000,
    shippingFee: 15000,
    grandTotal: 140000,
    paymentStatus: 'Lunas',
    paymentMethod: 'QRIS Instan',
    fulfillment: 'Selesai',
    courier: 'Kurir Pengiriman Ekstra Proteksi (Same Day)',
    trackingNumber: 'CLY-EXP-99202-BDG',
    image: '/assets/images/product_plate.jpg'
  },
  {
    id: '#CLY-2026-023',
    patron: 'Alya Safitri',
    initials: 'AS',
    email: 'alya.safitri@yahoo.com',
    phone: '+62 819-3344-5566',
    city: 'Surabaya Timur',
    address: 'Jl. Kertajaya Indah No. 88, Surabaya Timur',
    date: '22 Okt 2026',
    itemsSummary: 'Kyoto Pourer Vessel + Mangkuk Solace',
    variantSummary: 'Stoneware Alami',
    items: [
      { name: 'Kyoto Pourer Vessel', glaze: 'Alami', quantity: 1, price: 185000 },
      { name: 'Mangkuk Solace', glaze: 'Gading', quantity: 1, price: 115000 }
    ],
    total: 300000,
    shippingFee: 20000,
    grandTotal: 320000,
    paymentStatus: 'Menunggu',
    paymentMethod: 'Virtual Account Mandiri',
    fulfillment: 'Menunggu Pembayaran',
    courier: 'J&T Cargo Wood Crate',
    trackingNumber: 'CLY-EXP-99203-BDG',
    image: '/assets/images/product_bowl.jpg'
  },
  {
    id: '#CLY-2026-024',
    patron: 'Dinda Maharani',
    initials: 'DM',
    email: 'dinda.m@gmail.com',
    phone: '+62 821-5566-7788',
    city: 'Denpasar, Bali',
    address: 'Jl. Danau Tamblingan No. 17, Sanur, Denpasar, Bali',
    date: '23 Okt 2026',
    itemsSummary: 'Wabi Matcha Chawan Vessel',
    variantSummary: 'Abu Kayu & Besi Matte',
    items: [
      { name: 'Wabi Matcha Chawan Vessel', glaze: 'Celadon', quantity: 1, price: 150000 }
    ],
    total: 150000,
    shippingFee: 20000,
    grandTotal: 170000,
    paymentStatus: 'Lunas',
    paymentMethod: 'Transfer BCA',
    fulfillment: 'Diproses',
    courier: 'SiCepat Best Eco Shield',
    trackingNumber: 'CLY-EXP-99204-BDG',
    image: '/assets/images/product_bowl.jpg'
  }
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_products_id_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map(p => p.id));
        const missingProducts = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
        return [...parsed, ...missingProducts];
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Registry akun terdaftar (Hanya akun yang benar-benar mendaftar yang bisa login)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_registered_users_v5');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('claye_registered_users_v5', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Gagal menyimpan daftar pengguna:', e);
    }
  }, [registeredUsers]);

  // Status user aktif
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_user_active_v8');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Keranjang terisolasi per akun pengguna (akun baru = kosong)
  const [cart, setCart] = useState(() => {
    try {
      const savedUser = localStorage.getItem('claye_user_active_v8');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const userCart = localStorage.getItem(`claye_cart_${u.email?.toLowerCase()}`);
        return userCart ? JSON.parse(userCart) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Wishlist terisolasi per akun pengguna (akun baru = kosong)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedUser = localStorage.getItem('claye_user_active_v8');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const userWish = localStorage.getItem(`claye_wishlist_${u.email?.toLowerCase()}`);
        return userWish ? JSON.parse(userWish) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sinkronkan keranjang & wishlist saat akun berganti
  useEffect(() => {
    if (user && user.email) {
      try {
        const userCart = localStorage.getItem(`claye_cart_${user.email.toLowerCase()}`);
        setCart(userCart ? JSON.parse(userCart) : []);
        const userWish = localStorage.getItem(`claye_wishlist_${user.email.toLowerCase()}`);
        setWishlist(userWish ? JSON.parse(userWish) : []);
      } catch (e) {
        console.warn('Gagal memuat keranjang per user:', e);
      }
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user?.email]);

  // Simpan perubahan keranjang per akun pengguna
  useEffect(() => {
    if (user && user.email) {
      try {
        localStorage.setItem(`claye_cart_${user.email.toLowerCase()}`, JSON.stringify(cart));
      } catch (e) {
        console.warn('Gagal menyimpan keranjang:', e);
      }
    }
  }, [cart, user?.email]);

  // Simpan perubahan wishlist per akun pengguna
  useEffect(() => {
    if (user && user.email) {
      try {
        localStorage.setItem(`claye_wishlist_${user.email.toLowerCase()}`, JSON.stringify(wishlist));
      } catch (e) {
        console.warn('Gagal menyimpan favorit:', e);
      }
    }
  }, [wishlist, user?.email]);

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_orders_id_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map(o => o.id));
        const missingOrders = INITIAL_ORDERS.filter(o => !existingIds.has(o.id));
        return [...parsed, ...missingOrders];
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Jika belum login, rute awal wajib /login
  const [currentRoute, setCurrentRoute] = useState(() => {
    const savedUser = localStorage.getItem('claye_user_active_v8');
    if (!savedUser) {
      if (window.location.hash !== '#/login' && window.location.hash !== '#/register') {
        window.location.hash = '/login';
      }
      return '/login';
    }
    return window.location.hash.replace('#', '') || '/';
  });

  const [selectedProductId, setSelectedProductId] = useState(1);
  const [adminActivePage, setAdminActivePage] = useState('overview');
  const [adminInventoryView, setAdminInventoryView] = useState('storefront'); // 'storefront' | 'table'

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '') || '/';
      // Proteksi rute: jika belum login, kunci ke /login
      if (!user && hash !== '/login' && hash !== '/register') {
        window.location.hash = '/login';
        hash = '/login';
      }
      if (hash.startsWith('/detail/')) {
        const id = parseInt(hash.replace('/detail/', ''));
        if (!isNaN(id)) setSelectedProductId(id);
      }
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Jalankan pengecekan pertama saat mount
    if (!user && window.location.hash !== '#/login' && window.location.hash !== '#/register') {
      window.location.hash = '/login';
      setCurrentRoute('/login');
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Pantau jika status logout terjadi
  useEffect(() => {
    if (!user && currentRoute !== '/login' && currentRoute !== '/register') {
      window.location.hash = '/login';
      setCurrentRoute('/login');
    }
  }, [user, currentRoute]);

  useEffect(() => {
    localStorage.setItem('claye_cart_id_v4', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('claye_user_id_v3', JSON.stringify(user));
    } else {
      localStorage.removeItem('claye_user_id_v3');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('claye_orders_id_v4', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('claye_products_id_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('claye_wishlist_id_v3', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sinkronisasi data awal dari PostgreSQL / Supabase jika kredensial sudah aktif
  useEffect(() => {
    async function initSupabaseData() {
      if (!isSupabaseConfigured()) return;
      try {
        const dbProducts = await supabaseService.getProducts();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts.map(p => ({
            ...p,
            image: p.image_url || '/assets/images/product_mug.jpg',
            category: p.categories?.name || p.category || 'Kurasi Pilihan',
            artisanOrigin: p.artisan_partners?.region_origin || 'Sentra Lokal',
            glazeOptions: p.product_glazes && p.product_glazes.length > 0
              ? p.product_glazes.map(g => ({ id: g.id, name: g.glaze_name, hex: g.hex_preview || '#EBE5D8' }))
              : [{ id: 'default', name: 'Alami', hex: '#EBE5D8' }]
          })));
        }

        const dbOrders = await supabaseService.getOrders();
        if (dbOrders && dbOrders.length > 0) {
          const formatted = dbOrders.map(dbo => ({
            id: dbo.order_number || `#CLY-2026-${dbo.id}`,
            patron: dbo.recipient_name || 'Pelanggan CLAYÉ',
            initials: (dbo.recipient_name || 'CL').substring(0, 2).toUpperCase(),
            email: dbo.recipient_phone || 'admin@claye.id',
            phone: dbo.recipient_phone || '-',
            city: dbo.shipping_city || 'Palembang',
            address: dbo.shipping_address || 'Jl. Sejuta Kenangan',
            date: new Date(dbo.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            itemsSummary: dbo.order_items?.map(oi => oi.product_name_snapshot).join(' + ') || 'Karya Keramik Kurasi',
            variantSummary: dbo.order_items?.map(oi => `${oi.glaze_name_snapshot} • Jml: ${oi.quantity}`).join(', ') || '',
            items: dbo.order_items?.map(oi => ({
              name: oi.product_name_snapshot,
              glaze: oi.glaze_name_snapshot,
              quantity: oi.quantity,
              price: oi.unit_price_snapshot
            })) || [],
            total: dbo.total_items_amount || 0,
            shippingFee: dbo.shipping_fee || 15000,
            grandTotal: dbo.grand_total || 0,
            fulfillment: dbo.fulfillment_status === 'SELESAI' ? 'Selesai' : dbo.fulfillment_status === 'DIPROSES' || dbo.fulfillment_status === 'DIPROSES_KURASI' ? 'Diproses' : 'Menunggu',
            paymentStatus: dbo.payment_status === 'LUNAS' ? 'Lunas' : 'Menunggu',
            paymentMethod: dbo.payment_method || 'Transfer Bank',
            courier: dbo.courier_name || 'Eco Shield',
            trackingNumber: dbo.tracking_number || dbo.order_number
          }));
          setOrders(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const newFromDb = formatted.filter(o => !existingIds.has(o.id));
            return [...newFromDb, ...prev];
          });
        }
      } catch (err) {
        console.warn('Inisialisasi Supabase menggunakan fallback lokal:', err);
      }
    }
    initSupabaseData();
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const addToCart = (productId, quantity = 1, customOpts = {}) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const glaze = customOpts.glaze || (product.glazeOptions && product.glazeOptions[0]?.name) || 'Alami';
    const stamp = customOpts.stamp || '';
    const addCost = stamp ? 25000 : 0;
    const finalPrice = product.price + addCost;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === productId && item.selectedGlaze === glaze && item.stamp === stamp
      );
      if (existingIndex > -1) {
        return prev.map((item, idx) => 
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity, selected: true } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          price: finalPrice,
          basePrice: product.price,
          quantity,
          selectedGlaze: glaze,
          stamp,
          selected: true
        }
      ];
    });

    showToast(`"${product.name}" (${glaze}) berhasil dimasukkan ke keranjang.`, 'success');
  };

  const updateCartQty = (index, qty) => {
    setCart(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const toggleCartItemSelection = (index) => {
    setCart(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selected: item.selected === false ? true : false } : item
      )
    );
  };

  const selectAllCartItems = (selectAll = true) => {
    setCart(prev => prev.map(item => ({ ...item, selected: selectAll })));
  };

  const updateCartItemGlaze = (index, newGlaze) => {
    setCart(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selectedGlaze: newGlaze } : item
      )
    );
    showToast(`Varian tipe/glasir berhasil diubah menjadi "${newGlaze}".`, 'info');
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
    showToast('Produk dihapus dari keranjang belanja.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Karya dihapus dari daftar simpan.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Karya disimpan ke daftar favorit.', 'success');
        return [...prev, productId];
      }
    });
  };

  const selectedCart = cart.filter(item => item.selected !== false);
  const selectedCartTotal = selectedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedCartCount = selectedCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = selectedCartTotal;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      showToast('Harap masukkan alamat email dan kata sandi.', 'error');
      return { success: false, message: 'Harap masukkan alamat email dan kata sandi.' };
    }

    // 1. Verifikasi Akun Admin Resmi
    if (cleanEmail === 'admin@claye.id' || cleanEmail === 'admin') {
      if (cleanPass === 'admin123' || cleanPass === 'claye2026' || cleanPass === 'admin') {
        const adminUser = { ...ADMIN_CREDENTIALS };
        setUser(adminUser);
        localStorage.setItem('claye_user_active_v8', JSON.stringify(adminUser));
        showToast('Masuk berhasil sebagai Administrator CLAYÉ Studio.', 'success');
        navigate('/admin');
        return { success: true };
      } else {
        showToast('Kata sandi Admin salah. Silakan coba kembali.', 'error');
        return { success: false, message: 'Kata sandi Admin salah. Silakan coba kembali.' };
      }
    }

    // 2. Verifikasi Akun Pelanggan (Hanya yang sudah terdaftar di registry)
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!foundUser) {
      showToast('Akun belum terdaftar. Silakan daftar terlebih dahulu.', 'error');
      return {
        success: false,
        message: 'Akun dengan email ini belum terdaftar. Silakan pilih tab "Daftar Akun Baru" untuk mendaftar.'
      };
    }

    if (foundUser.password !== cleanPass) {
      showToast('Kata sandi yang Anda masukkan salah.', 'error');
      return {
        success: false,
        message: 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.'
      };
    }

    // Berhasil Login
    setUser(foundUser);
    localStorage.setItem('claye_user_active_v8', JSON.stringify(foundUser));
    showToast(`Masuk berhasil. Selamat datang di CLAYÉ, ${foundUser.name}!`, 'success');
    navigate('/');
    return { success: true };
  };

  const register = (registerData) => {
    const cleanEmail = (registerData.email || '').trim().toLowerCase();
    const cleanPass = (registerData.password || '').trim();
    const fullName = (registerData.fullName || '').trim();
    const phone = (registerData.phone || '').trim();

    // Validasi format email asli
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast('Format email tidak valid. Gunakan alamat email aktif yang benar.', 'error');
      return { success: false, message: 'Format email tidak valid (contoh: nama@gmail.com).' };
    }

    if (cleanEmail === 'admin@claye.id') {
      showToast('Alamat email admin@claye.id khusus untuk akun Administrator.', 'error');
      return { success: false, message: 'Alamat email admin@claye.id khusus untuk akun Administrator.' };
    }

    // Cek apakah email sudah terdaftar sebelumnya
    const isExisting = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (isExisting) {
      showToast('Email ini sudah pernah didaftarkan. Silakan langsung masuk.', 'error');
      return { success: false, message: 'Email sudah terdaftar. Silakan langsung masuk melalui tab "Masuk".' };
    }

    if (!cleanPass || cleanPass.length < 6) {
      showToast('Kata sandi minimal harus 6 karakter.', 'error');
      return { success: false, message: 'Kata sandi minimal harus 6 karakter.' };
    }

    const newUser = {
      role: 'customer',
      roleName: 'Pelanggan',
      name: fullName.split(' ')[0] || 'Pelanggan',
      fullName: fullName,
      email: cleanEmail,
      password: cleanPass,
      phone: phone || '-',
      address: '',
      city: 'Palembang',
      province: 'Sumatera Selatan',
      postalCode: '30138',
      country: 'Indonesia',
      patronSince: new Date().getFullYear().toString(),
      cohort: 'Pelanggan Baru'
    };

    setRegisteredUsers(prev => [...prev, newUser]);

    // Kosongkan keranjang & favorit untuk akun baru ini (kondisi bersih / fresh awal mula)
    try {
      localStorage.removeItem(`claye_cart_${cleanEmail}`);
      localStorage.removeItem(`claye_wishlist_${cleanEmail}`);
    } catch {
      // ignore
    }

    // Sesuai permintaan: setelah daftar JANGAN langsung login, balik ke tab login
    showToast('Pendaftaran akun berhasil! Silakan masuk menggunakan email dan kata sandi Anda.', 'success');
    return {
      success: true,
      registeredEmail: cleanEmail,
      message: 'Pendaftaran akun berhasil! Silakan masukkan kata sandi untuk login.'
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('claye_user_active_v8');
    setCart([]);
    setWishlist([]);
    showToast('Anda telah keluar dari akun.', 'info');
    navigate('/login');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('claye_user_active_v8', JSON.stringify(updated));
      return updated;
    });
    // Update juga di registeredUsers jika itu pelanggan
    setRegisteredUsers(prev =>
      prev.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...updatedFields } : u)
    );
    showToast('Data akun berhasil diperbarui.', 'success');
  };

  const createOrder = (orderData) => {
    const randNum = Math.floor(100 + Math.random() * 900);
    const orderId = `#CLY-2026-${randNum}`;
    const patronName = orderData.patron || (user ? (user.fullName || user.name) : 'Pelanggan');
    const userCity = orderData.city || (user ? user.city : 'Palembang');
    const userAddress = orderData.address || orderData.shippingAddress || (user ? `${user.address}, ${user.city}` : 'Jl. Sejuta Kenangan No. 12, Palembang');
    const userEmail = orderData.email || (user ? user.email : 'pelanggan@claye.id');
    const userPhone = orderData.phone || (user ? user.phone : '-');

    const targetItems = cart.filter(i => i.selected !== false);
    const itemsToOrder = targetItems.length > 0 ? targetItems : cart;
    const itemsTotal = itemsToOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = {
      id: orderId,
      patron: patronName,
      initials: patronName.substring(0, 2).toUpperCase(),
      email: userEmail,
      phone: userPhone,
      city: userCity,
      address: userAddress,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      itemsSummary: itemsToOrder.map(i => i.name).join(' + '),
      variantSummary: itemsToOrder.map(i => `${i.selectedGlaze || 'Gading'} • Jml: ${i.quantity}`).join(', '),
      items: itemsToOrder.map(i => ({
        name: i.name,
        glaze: i.selectedGlaze,
        stamp: i.stamp,
        quantity: i.quantity,
        price: i.price
      })),
      total: itemsTotal,
      shippingFee: orderData.shippingFee || 15000,
      grandTotal: itemsTotal + (orderData.shippingFee || 15000),
      fulfillment: orderData.fulfillment || (orderData.paymentStatus === 'Menunggu Pembayaran' ? 'Menunggu' : 'Diproses'),
      paymentStatus: orderData.paymentStatus || 'Lunas',
      paymentMethod: orderData.paymentMethod || 'Transfer Bank (BCA)',
      courier: orderData.courier || 'Pengiriman Reguler (Eco Shield)',
      trackingNumber: `CLY-EXP-${randNum}-PLM`,
      image: itemsToOrder[0]?.image || '/assets/images/product_mug.jpg',
      shippingAddress: userAddress
    };

    setOrders(prev => [newOrder, ...prev]);

    // Hapus hanya barang yang fix dibeli; barang yang tidak dicentang tetap tersimpan di keranjang
    setCart(prev => prev.filter(i => i.selected === false));

    // Simpan ke Supabase jika terhubung
    if (isSupabaseConfigured()) {
      supabaseService.createOrder(newOrder, itemsToOrder).catch(err => {
        console.warn('Gagal menyimpan pesanan ke Supabase:', err);
      });
    }

    return newOrder;
  };

  const updateOrderFulfillment = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, fulfillment: newStatus } : ord)
    );
    showToast(`Status pengiriman ${orderId} diubah menjadi "${newStatus}".`, 'success');
  };

  const updateOrderPayment = (orderId, newPaymentStatus, newPaymentMethod = null) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: newPaymentStatus,
            paymentMethod: newPaymentMethod || ord.paymentMethod,
            fulfillment: newPaymentStatus === 'Lunas' ? 'Diproses' : ord.fulfillment
          };
        }
        return ord;
      })
    );
    showToast(`Status pembayaran ${orderId} berhasil diperbarui: ${newPaymentStatus}.`, 'success');
  };

  const syncOrders = async () => {
    if (isSupabaseConfigured()) {
      try {
        const dbOrders = await supabaseService.getOrders();
        if (dbOrders && dbOrders.length > 0) {
          const formatted = dbOrders.map(dbo => ({
            id: dbo.order_number || `#CLY-2026-${dbo.id}`,
            patron: dbo.recipient_name || 'Pelanggan CLAYÉ',
            initials: (dbo.recipient_name || 'CL').substring(0, 2).toUpperCase(),
            email: dbo.recipient_phone || 'admin@claye.id',
            phone: dbo.recipient_phone || '-',
            city: dbo.shipping_city || 'Palembang',
            address: dbo.shipping_address || 'Jl. Sejuta Kenangan',
            date: new Date(dbo.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            itemsSummary: dbo.order_items?.map(oi => oi.product_name_snapshot).join(' + ') || 'Karya Keramik Kurasi',
            variantSummary: dbo.order_items?.map(oi => `${oi.glaze_name_snapshot} • Jml: ${oi.quantity}`).join(', ') || '',
            items: dbo.order_items?.map(oi => ({
              name: oi.product_name_snapshot,
              glaze: oi.glaze_name_snapshot,
              quantity: oi.quantity,
              price: oi.unit_price_snapshot
            })) || [],
            total: dbo.total_items_amount || 0,
            shippingFee: dbo.shipping_fee || 15000,
            grandTotal: dbo.grand_total || 0,
            fulfillment: dbo.fulfillment_status === 'SELESAI' ? 'Selesai' : dbo.fulfillment_status === 'DIPROSES' || dbo.fulfillment_status === 'DIPROSES_KURASI' ? 'Diproses' : 'Menunggu',
            paymentStatus: dbo.payment_status === 'LUNAS' ? 'Lunas' : 'Menunggu',
            paymentMethod: dbo.payment_method || 'Transfer Bank',
            courier: dbo.courier_name || 'Eco Shield',
            trackingNumber: dbo.tracking_number || dbo.order_number
          }));
          setOrders(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const newFromDb = formatted.filter(o => !existingIds.has(o.id));
            return [...newFromDb, ...prev];
          });
          showToast('Data pesanan berhasil disinkronisasi dari database.', 'success');
          return;
        }
      } catch (err) {
        console.warn('Gagal sinkronisasi pesanan dari Supabase:', err);
      }
    }
    showToast('Data pesanan telah diperbarui.', 'success');
  };

  const addProduct = (newProd) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const item = {
      ...newProd,
      id,
      usdPrice: Math.round(newProd.price / 2600),
      rating: 5.0,
      reviews: 0,
      thumbnails: [newProd.image || '/assets/images/product_mug.jpg']
    };
    setProducts(prev => [item, ...prev]);
    showToast(`Produk "${item.name}" berhasil ditambahkan ke katalog kurasi.`, 'success');

    // Simpan ke Supabase jika terhubung
    if (isSupabaseConfigured()) {
      supabaseService.addProduct(item).catch(err => {
        console.warn('Gagal menambah produk ke Supabase:', err);
      });
    }
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produk berhasil dihapus dari katalog.', 'info');
  };

  const updateProductStock = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, (p.stock || 0) + delta);
        if (isSupabaseConfigured()) {
          supabaseService.updateStock(id, nextStock);
        }
        return { ...p, stock: nextStock };
      }
      return p;
    }));
    showToast('Stok karya keramik berhasil disesuaikan.', 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));
    showToast(`Data karya "${updatedFields.name || 'keramik'}" berhasil diperbarui.`, 'success');
  };

  const viewProduct = (id) => {
    setSelectedProductId(id);
    navigate(`/detail/${id}`);
  };

  const openConcierge = (prompt = '') => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const openAdminStorefront = () => {
    setAdminActivePage('inventory');
    setAdminInventoryView('storefront');
    navigate('/admin');
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      user,
      orders,
      wishlist,
      toasts,
      currentRoute,
      selectedProductId,
      cartTotal,
      cartCount,
      selectedCartTotal,
      selectedCartCount,
      isChatOpen,
      chatInitialPrompt,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      setIsChatOpen,
      openConcierge,
      navigate,
      showToast,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      toggleCartItemSelection,
      selectAllCartItems,
      updateCartItemGlaze,
      toggleWishlist,
      login,
      register,
      logout,
      updateProfile,
      createOrder,
      updateOrderFulfillment,
      updateOrderPayment,
      syncOrders,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductStock,
      viewProduct,
      adminActivePage,
      setAdminActivePage,
      adminInventoryView,
      setAdminInventoryView,
      openAdminStorefront
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
