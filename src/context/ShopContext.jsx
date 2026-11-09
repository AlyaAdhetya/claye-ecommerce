import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

const ShopContext = createContext();

export const DEMO_USERS = {
  customer: {
    role: 'customer',
    roleName: 'Pelanggan',
    name: 'Arumi',
    fullName: 'Arumi',
    email: 'arumi@example.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Sejuta Kenangan No. 12',
    city: 'Palembang',
    province: 'Sumatera Selatan',
    postalCode: '30138',
    country: 'Indonesia',
    patronSince: '2024',
    cohort: 'Pelanggan Tetap'
  },
  admin: {
    role: 'admin',
    roleName: 'Admin',
    name: 'Admin',
    fullName: 'Admin CLAYÉ',
    email: 'admin@claye.id',
    phone: '+62 811-2233-4455',
    address: 'Jl. Sejuta Kenangan, Palembang, Sumatera Selatan',
    city: 'Palembang',
    province: 'Sumatera Selatan',
    postalCode: '30138',
    country: 'Indonesia',
    patronSince: '2021',
    cohort: 'Admin CLAYÉ'
  }
};

const INITIAL_USER = null;

const INITIAL_CART = [
  {
    ...INITIAL_PRODUCTS[0], // The Sunday Mug
    quantity: 1,
    selectedGlaze: 'Hijau Sage',
    stamp: 'Arumi',
    customPrice: 125000
  },
  {
    ...INITIAL_PRODUCTS[3], // The Everyday Plate
    quantity: 1,
    selectedGlaze: 'Gading (Ivory)',
    stamp: '',
    customPrice: 150000
  }
];

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
  },
  {
    id: '#CLY-2026-003',
    patron: 'Arumi',
    initials: 'AR',
    email: 'arumi@example.com',
    phone: '+62 812-3456-7890',
    city: 'Palembang',
    address: 'Jl. Sejuta Kenangan No. 12, Palembang',
    date: '24 Okt 2026',
    itemsSummary: 'The Sunday Mug (Neko Wave Edition)',
    variantSummary: 'Biru Kobalt Ombak • Jml: 1',
    items: [
      { name: 'The Sunday Mug (Neko Wave Edition)', glaze: 'Biru Kobalt Ombak', quantity: 1, price: 135000 }
    ],
    total: 135000,
    shippingFee: 15000,
    grandTotal: 150000,
    fulfillment: 'Selesai',
    paymentStatus: 'Lunas',
    paymentMethod: 'Transfer Bank (BCA)',
    courier: 'Pengiriman Reguler (Eco Shield)',
    trackingNumber: 'CLY-EXP-89021-PLM',
    image: '/assets/images/product_neko_mug.jpg'
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

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_cart_id_v4');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_user_id_v3');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_orders_id_v4');
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

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_wishlist_id_v3');
      return saved ? JSON.parse(saved) : [2, 3];
    } catch {
      return [2, 3];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Jika belum login, rute awal wajib /login
  const [currentRoute, setCurrentRoute] = useState(() => {
    const savedUser = localStorage.getItem('claye_user_id_v3');
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

  const login = (email, password, forcedRole = null) => {
    const isAdmin = forcedRole === 'admin' || (email && email.toLowerCase().includes('admin'));

    if (isAdmin) {
      const adminUser = {
        ...DEMO_USERS.admin,
        email: email || DEMO_USERS.admin.email
      };
      setUser(adminUser);
      showToast('Masuk berhasil sebagai Admin CLAYÉ.', 'success');
      navigate('/admin');
      return;
    }

    const isDemoCustomer = !email || email.toLowerCase() === DEMO_USERS.customer.email.toLowerCase() || email.toLowerCase() === 'fie@example.com';
    const customerUser = {
      ...DEMO_USERS.customer,
      name: isDemoCustomer ? DEMO_USERS.customer.name : (email.split('@')[0].replace(/[._]/g, ' ')),
      fullName: isDemoCustomer ? DEMO_USERS.customer.fullName : (email.split('@')[0].replace(/[._]/g, ' ')),
      email: email || DEMO_USERS.customer.email,
      role: 'customer',
      roleName: 'Pelanggan'
    };
    setUser(customerUser);
    showToast(`Masuk berhasil sebagai Pelanggan. Selamat datang di CLAYÉ, ${customerUser.name}.`, 'success');
    // Setelah login, arahkan ke Beranda di mana header Beranda, Katalog, Tentang Kami aktif
    navigate('/');
  };

  const register = (registerData) => {
    const newUser = {
      role: 'customer',
      roleName: 'Pelanggan',
      name: registerData.name || (registerData.fullName ? registerData.fullName.split(' ')[0] : 'Pelanggan'),
      fullName: registerData.fullName || 'Pelanggan Baru CLAYÉ',
      email: registerData.email,
      phone: registerData.phone || '+62 812-0000-0000',
      address: registerData.address || 'Jl. Sejuta Kenangan, Palembang',
      city: registerData.city || 'Palembang',
      province: 'Sumatera Selatan',
      postalCode: registerData.postalCode || '30138',
      country: 'Indonesia',
      patronSince: '2026',
      cohort: 'Angkatan Batch 05'
    };
    setUser(newUser);
    showToast(`Pendaftaran akun pembeli berhasil. Selamat bergabung, ${newUser.name}.`, 'success');
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    showToast('Anda telah keluar dari akun.', 'info');
    navigate('/login');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
    showToast('Data akun berhasil diperbarui.', 'success');
  };

  const createOrder = (orderData) => {
    const randNum = Math.floor(100 + Math.random() * 900);
    const orderId = `#CLY-2026-${randNum}`;
    const patronName = orderData.patron || (user ? (user.fullName || user.name) : 'Arumi');
    const userCity = orderData.city || (user ? user.city : 'Palembang');
    const userAddress = orderData.address || orderData.shippingAddress || (user ? `${user.address}, ${user.city}` : 'Jl. Sejuta Kenangan No. 12, Palembang');
    const userEmail = orderData.email || (user ? user.email : 'arumi@example.com');
    const userPhone = orderData.phone || (user ? user.phone : '+62 812-3456-7890');

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
      fulfillment: 'Diproses',
      paymentStatus: 'Lunas',
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
