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
const INITIAL_ORDERS = [];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_products_id_v6');
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

  // Registry akun terdaftar (bersih tanpa dummy, pengguna baru mendaftar di tab Register)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const isClean = localStorage.getItem('claye_clean_reset_v3');
      if (!isClean) {
        localStorage.removeItem('claye_registered_users_v5');
        localStorage.removeItem('claye_registered_users_v4');
        return [];
      }
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
      const isClean = localStorage.getItem('claye_clean_reset_v3');
      if (!isClean) {
        localStorage.removeItem('claye_user_active_v8');
        return INITIAL_USER;
      }
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
      const isClean = localStorage.getItem('claye_clean_reset_v3');
      if (!isClean) {
        localStorage.removeItem('claye_orders_id_v6');
        localStorage.removeItem('claye_orders_id_v5');
        localStorage.removeItem('claye_orders_id_v4');
        localStorage.setItem('claye_clean_reset_v3', 'true');
        return [];
      }
      const saved = localStorage.getItem('claye_orders_id_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Pastikan tidak ada data dummy lawas yang tersisa
        const cleanOrders = parsed.filter(o =>
          !o.id?.includes('021') &&
          !o.id?.includes('022') &&
          !o.id?.includes('023') &&
          !o.id?.includes('024') &&
          o.patron !== 'Nadia Putri' &&
          o.patron !== 'Rania Putri' &&
          o.patron !== 'Alya Safitri' &&
          o.patron !== 'Dinda Maharani'
        );
        return cleanOrders;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ── KUPON & ZONA PENGIRIMAN KOTA PALEMBANG (Antar Mandiri Tim CLAYÉ & COD) ──
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shippingZone, setShippingZoneState] = useState('plb_pusat');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Ilir Barat I');

  const COUPON_LIST = {
    'CLAYE10': 10,
    'WABI10': 10,
    'CLAYE15': 15,
    'GRATIS': 100,
  };

  // Pembagian zona khusus internal Kota Palembang (antar mandiri langsung oleh tim CLAYÉ)
  const SHIPPING_ZONES = [
    {
      id: 'plb_pusat',
      label: 'Palembang Pusat (Ilir Barat & IT I)',
      desc: 'Demang Lebar Daun, Bukit Lama/Baru, Lorok Pakjo, Kampus, Duku, Sudirman & sekitarnya',
      price: 8000,
      estimate: 'Antar Langsung Tim CLAYÉ (1–2 Jam)',
      kecamatan: ['Ilir Barat I', 'Ilir Barat II', 'Bukit Kecil', 'Ilir Timur I']
    },
    {
      id: 'plb_utara_timur',
      label: 'Palembang Utara & Timur (Kemuning, Sukarami, Sako, Kalidoni)',
      desc: 'Sekip, Pipa Reja, Km 5–12, Talang Kelapa, Kenten, Kalidoni, Gandus',
      price: 12000,
      estimate: 'Antar Langsung Tim CLAYÉ (2–3 Jam)',
      kecamatan: ['Kemuning', 'Sukarami', 'Alang-Alang Lebar', 'Ilir Timur II', 'Ilir Timur III', 'Sako', 'Kalidoni', 'Sematang Borang', 'Gandus']
    },
    {
      id: 'plb_seberang_ulu',
      label: 'Palembang Seberang Ulu & Jakabaring',
      desc: 'Jakabaring, Plaju, Kertapati, Tangga Takat, Silaberanti, SU I & SU II',
      price: 15000,
      estimate: 'Antar Langsung Tim CLAYÉ (Hari yang Sama)',
      kecamatan: ['Seberang Ulu I', 'Seberang Ulu II', 'Jakabaring', 'Plaju', 'Kertapati']
    },
  ];

  const PALEMBANG_KECAMATAN = [
    { name: 'Ilir Barat I', zoneId: 'plb_pusat' },
    { name: 'Ilir Barat II', zoneId: 'plb_pusat' },
    { name: 'Bukit Kecil', zoneId: 'plb_pusat' },
    { name: 'Ilir Timur I', zoneId: 'plb_pusat' },
    { name: 'Kemuning', zoneId: 'plb_utara_timur' },
    { name: 'Sukarami', zoneId: 'plb_utara_timur' },
    { name: 'Alang-Alang Lebar', zoneId: 'plb_utara_timur' },
    { name: 'Ilir Timur II', zoneId: 'plb_utara_timur' },
    { name: 'Ilir Timur III', zoneId: 'plb_utara_timur' },
    { name: 'Sako', zoneId: 'plb_utara_timur' },
    { name: 'Kalidoni', zoneId: 'plb_utara_timur' },
    { name: 'Sematang Borang', zoneId: 'plb_utara_timur' },
    { name: 'Gandus', zoneId: 'plb_utara_timur' },
    { name: 'Seberang Ulu I', zoneId: 'plb_seberang_ulu' },
    { name: 'Seberang Ulu II', zoneId: 'plb_seberang_ulu' },
    { name: 'Jakabaring', zoneId: 'plb_seberang_ulu' },
    { name: 'Plaju', zoneId: 'plb_seberang_ulu' },
    { name: 'Kertapati', zoneId: 'plb_seberang_ulu' },
  ];

  // Sinkronisasi otomatis: pilih kecamatan -> otomatis setting zona & ongkir
  const setKecamatan = (kecName) => {
    setSelectedKecamatan(kecName);
    const foundKec = PALEMBANG_KECAMATAN.find(k => k.name.toLowerCase() === (kecName || '').toLowerCase());
    if (foundKec) {
      setShippingZoneState(foundKec.zoneId);
    }
  };

  // Sinkronisasi otomatis: pilih zona -> otomatis sesuaikan kecamatan pertama di zona tsb
  const setShippingZone = (zoneId) => {
    setShippingZoneState(zoneId);
    const targetZone = SHIPPING_ZONES.find(z => z.id === zoneId);
    if (targetZone && targetZone.kecamatan && !targetZone.kecamatan.includes(selectedKecamatan)) {
      setSelectedKecamatan(targetZone.kecamatan[0]);
    }
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (!clean) return { success: false, message: 'Kode kupon tidak boleh kosong.' };
    const pct = COUPON_LIST[clean];
    if (pct !== undefined) {
      setAppliedCoupon(clean);
      setDiscountPercent(pct);
      showToast(`Kupon ${clean} berhasil digunakan. Diskon ${pct}% diterapkan.`, 'success');
      return { success: true, percent: pct };
    }
    showToast('Kupon tidak valid. Coba gunakan: CLAYE10', 'error');
    return { success: false, message: 'Kupon tidak ditemukan.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setDiscountPercent(0);
    showToast('Kupon berhasil dihapus.', 'info');
  };

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
    try {
      localStorage.setItem('claye_orders_id_v6', JSON.stringify(orders));
      localStorage.setItem('claye_orders_id_v5', JSON.stringify(orders));
      localStorage.setItem('claye_orders_id_v4', JSON.stringify(orders));
    } catch (e) {
      console.warn('Gagal menyimpan pesanan:', e);
    }
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('claye_products_id_v6', JSON.stringify(products));
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

    // Varian kode produk (misal: CER-BWL-001) atau default
    const code = customOpts.productCode || (product.productCodes && product.productCodes.length > 0 ? product.productCodes[0] : null);
    const finalPrice = product.price;

    setCart(prev => {
      const existingIndex = prev.findIndex(item =>
        item.id === productId && item.selectedCode === code
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
          selectedCode: code,
          selected: true
        }
      ];
    });

    const codeLabel = code ? ` (${code})` : '';
    showToast(`"${product.name}"${codeLabel} berhasil dimasukkan ke keranjang.`, 'success');
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

  const updateCartItemCode = (index, newCode) => {
    setCart(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, selectedCode: newCode } : item
      )
    );
    showToast(`Pilihan kode produk berhasil diubah menjadi "${newCode}".`, 'info');
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
      if (cleanPass === 'admin123' || cleanPass === 'claye2026' || cleanPass === 'admin' || cleanPass === 'atelier2026') {
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

  // ── MANAJEMEN BUKU ALAMAT PENGGUNA (TERHUBUNG KE CHECKOUT COD) ──
  const [addresses, setAddresses] = useState(() => {
    try {
      const savedUser = localStorage.getItem('claye_user_active_v8');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u && u.email) {
          const savedAddr = localStorage.getItem(`claye_addresses_${u.email.toLowerCase()}`);
          if (savedAddr) return JSON.parse(savedAddr);
          return [
            {
              id: 'addr_1',
              label: 'Rumah Pribadi',
              recipientName: u.fullName || u.name || 'Pelanggan',
              phone: u.phone || '',
              address: u.address || '',
              kecamatan: u.kecamatan || 'Ilir Barat I',
              city: 'Kota Palembang',
              province: 'Sumatera Selatan',
              postalCode: u.postalCode || '30138',
              patokan: u.patokan || '',
              isPrimary: true
            }
          ];
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sinkronkan alamat saat user berganti akun
  useEffect(() => {
    if (user && user.email) {
      try {
        const savedAddr = localStorage.getItem(`claye_addresses_${user.email.toLowerCase()}`);
        if (savedAddr) {
          setAddresses(JSON.parse(savedAddr));
        } else {
          const defaultList = [
            {
              id: 'addr_1',
              label: 'Rumah Pribadi',
              recipientName: user.fullName || user.name || 'Pelanggan',
              phone: user.phone || '',
              address: user.address || '',
              kecamatan: user.kecamatan || 'Ilir Barat I',
              city: 'Kota Palembang',
              province: 'Sumatera Selatan',
              postalCode: user.postalCode || '30138',
              patokan: user.patokan || '',
              isPrimary: true
            }
          ];
          setAddresses(defaultList);
          localStorage.setItem(`claye_addresses_${user.email.toLowerCase()}`, JSON.stringify(defaultList));
        }
      } catch (e) {
        console.warn('Gagal memuat buku alamat:', e);
      }
    } else {
      setAddresses([]);
    }
  }, [user?.email]);

  const saveAddressesToStorage = (newAddresses) => {
    setAddresses(newAddresses);
    if (user && user.email) {
      try {
        localStorage.setItem(`claye_addresses_${user.email.toLowerCase()}`, JSON.stringify(newAddresses));
      } catch (e) {
        console.warn('Gagal menyimpan buku alamat:', e);
      }
    }
  };

  const saveAddress = (addressData) => {
    let updated;
    const isNew = !addressData.id;
    const addressId = addressData.id || `addr_${Date.now()}`;
    const newEntry = {
      ...addressData,
      id: addressId,
      city: 'Kota Palembang',
      province: 'Sumatera Selatan',
      postalCode: addressData.postalCode || '30138'
    };

    if (isNew) {
      const willBePrimary = addressData.isPrimary || addresses.length === 0;
      newEntry.isPrimary = willBePrimary;
      if (willBePrimary) {
        updated = addresses.map(a => ({ ...a, isPrimary: false })).concat([newEntry]);
      } else {
        updated = [...addresses, newEntry];
      }
      showToast(`Alamat "${newEntry.label}" berhasil ditambahkan.`, 'success');
    } else {
      if (addressData.isPrimary) {
        updated = addresses.map(a => a.id === addressId ? { ...newEntry, isPrimary: true } : { ...a, isPrimary: false });
      } else {
        const hadPrimary = addresses.some(a => a.id !== addressId && a.isPrimary);
        if (!hadPrimary) newEntry.isPrimary = true;
        updated = addresses.map(a => a.id === addressId ? newEntry : a);
      }
      showToast(`Alamat "${newEntry.label}" berhasil diperbarui.`, 'success');
    }

    saveAddressesToStorage(updated);

    if (newEntry.isPrimary) {
      if (newEntry.kecamatan) {
        setKecamatan(newEntry.kecamatan);
      }
      updateProfile({
        address: newEntry.address,
        kecamatan: newEntry.kecamatan,
        phone: newEntry.phone || user?.phone,
        patokan: newEntry.patokan
      });
    }

    return newEntry;
  };

  const setPrimaryAddress = (addressId) => {
    const target = addresses.find(a => a.id === addressId);
    if (!target) return;

    const updated = addresses.map(a => ({
      ...a,
      isPrimary: a.id === addressId
    }));
    saveAddressesToStorage(updated);

    if (target.kecamatan) {
      setKecamatan(target.kecamatan);
    }
    updateProfile({
      address: target.address,
      kecamatan: target.kecamatan,
      phone: target.phone || user?.phone,
      patokan: target.patokan
    });

    showToast(`"${target.label}" ditetapkan sebagai alamat utama pengiriman COD.`, 'success');
  };

  const deleteAddress = (addressId) => {
    const target = addresses.find(a => a.id === addressId);
    if (!target) return;

    if (target.isPrimary && addresses.length > 1) {
      showToast('Alamat utama tidak dapat dihapus. Silakan pilih alamat lain sebagai utama terlebih dahulu.', 'error');
      return;
    }

    const updated = addresses.filter(a => a.id !== addressId);
    if (updated.length > 0 && !updated.some(a => a.isPrimary)) {
      updated[0].isPrimary = true;
    }
    saveAddressesToStorage(updated);
    showToast(`Alamat "${target.label}" berhasil dihapus.`, 'info');
  };

  const primaryAddress = addresses.find(a => a.isPrimary) || addresses[0] || null;

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

    const discountAmount = orderData.discountAmount !== undefined
      ? orderData.discountAmount
      : (discountPercent > 0 ? Math.round((itemsTotal * discountPercent) / 100) : 0);
    const shippingFee = orderData.shippingFee !== undefined ? orderData.shippingFee : 10000;
    const computedGrandTotal = orderData.grandTotal !== undefined
      ? orderData.grandTotal
      : Math.max(0, itemsTotal - discountAmount + shippingFee);

    const newOrder = {
      id: orderId,
      patron: patronName,
      initials: patronName.substring(0, 2).toUpperCase(),
      email: userEmail,
      phone: userPhone,
      city: userCity,
      address: userAddress,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      itemsSummary: itemsToOrder.map(i => i.selectedCode ? `${i.name} (${i.selectedCode})` : i.name).join(' + '),
      variantSummary: itemsToOrder.map(i => `${i.selectedCode ? `Kode: ${i.selectedCode}` : 'Standar'} • Jml: ${i.quantity}`).join(', '),
      items: itemsToOrder.map(i => ({
        name: i.name,
        code: i.selectedCode,
        selectedCode: i.selectedCode,
        quantity: i.quantity,
        price: i.price
      })),
      total: itemsTotal,
      discount: discountAmount,
      couponCode: orderData.couponCode || appliedCoupon || null,
      shippingFee: shippingFee,
      grandTotal: computedGrandTotal,
      fulfillment: orderData.fulfillment || 'Sedang Dikemas',
      paymentStatus: orderData.paymentStatus || 'Menunggu Pembayaran',
      paymentMethod: orderData.paymentMethod || 'COD (Bayar di Tempat)',
      courier: orderData.courier || 'Kurir CLAYÉ – Dalam Kota Palembang',
      trackingNumber: `CLY-COD-${randNum}-PLM`,
      image: itemsToOrder[0]?.image || '/assets/images/product_mug.jpg',
      shippingAddress: userAddress
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('claye_orders_id_v6', JSON.stringify(updated));
        localStorage.setItem('claye_orders_id_v5', JSON.stringify(updated));
        localStorage.setItem('claye_orders_id_v4', JSON.stringify(updated));
      } catch (e) {
        console.warn('Gagal menyimpan pesanan baru:', e);
      }
      return updated;
    });

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
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated = { ...ord, fulfillment: newStatus };
          // Jika status fulfillment diubah menjadi "Selesai (Terkirim & Lunas)", otomatis tandai pembayaran Lunas
          if (newStatus.startsWith('Selesai')) {
            updated.paymentStatus = 'Lunas';
          } else {
            // Jika masih Sedang Dikemas atau Sedang Diantar, COD menunggu pembayaran saat serah terima
            if (ord.paymentMethod && ord.paymentMethod.includes('COD')) {
              updated.paymentStatus = 'Menunggu Pembayaran';
            }
          }
          return updated;
        }
        return ord;
      })
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
      updateCartItemGlaze: updateCartItemCode,
      updateCartItemCode,
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
      openAdminStorefront,
      appliedCoupon,
      discountPercent,
      shippingZone,
      setShippingZone,
      selectedKecamatan,
      setSelectedKecamatan,
      setKecamatan,
      SHIPPING_ZONES,
      PALEMBANG_KECAMATAN,
      applyCoupon,
      removeCoupon,
      registeredUsers,
      isSupabaseConfigured,
      addresses,
      saveAddress,
      setPrimaryAddress,
      deleteAddress,
      primaryAddress
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
