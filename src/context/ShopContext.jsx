import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const ShopContext = createContext();

export const DEMO_USERS = {
  customer: {
    role: 'customer',
    roleName: 'Pelanggan',
    name: 'Arumi',
    fullName: 'Arumi',
    email: 'arumi@example.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Bukit Dago Utara No. 18, Coblong',
    city: 'Bandung',
    province: 'Jawa Barat',
    postalCode: '40135',
    country: 'Indonesia',
    patronSince: '2024',
    cohort: 'Pelanggan Tetap'
  },
  admin: {
    role: 'admin',
    roleName: 'Admin',
    name: 'Admin',
    fullName: 'Admin',
    email: 'admin@claye.id',
    phone: '+62 811-2233-4455',
    address: 'Studio CLAYÉ, Jl. Rancabentang No. 29, Ciumbuleuit',
    city: 'Bandung',
    province: 'Jawa Barat',
    postalCode: '40142',
    country: 'Indonesia',
    patronSince: '2021',
    cohort: 'Admin CLAYÉ'
  }
};

const INITIAL_USER = DEMO_USERS.customer;

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
    id: '#CLY-2026-003',
    date: '22 Okt 2026',
    itemsSummary: 'The Sunday Mug + The Everyday Plate',
    variantSummary: 'Batu Pasir & Gading',
    items: [
      { name: 'The Sunday Mug', glaze: 'Batu Pasir', quantity: 1, price: 125000 },
      { name: 'The Everyday Plate', glaze: 'Gading (Ivory)', quantity: 1, price: 150000 }
    ],
    total: 275000,
    shippingFee: 15000,
    grandTotal: 290000,
    fulfillment: 'SELESAI',
    paymentStatus: 'LUNAS',
    paymentMethod: 'Transfer Bank (BCA)',
    courier: 'Pengiriman Reguler (Eco Shield)',
    trackingNumber: 'CLY-EXP-89021-BDG',
    image: '/assets/images/product_mug.jpg'
  },
  {
    id: '#CLY-2026-002',
    date: '18 Okt 2026',
    itemsSummary: 'The Everyday Plate',
    variantSummary: 'Gading (Ivory) • Jml: 1',
    items: [
      { name: 'The Everyday Plate', glaze: 'Gading (Ivory)', quantity: 1, price: 150000 }
    ],
    total: 150000,
    shippingFee: 15000,
    grandTotal: 165000,
    fulfillment: 'DIPROSES',
    paymentStatus: 'LUNAS',
    paymentMethod: 'E-Wallet Instan (QRIS)',
    courier: 'Pengiriman Reguler (Eco Shield)',
    trackingNumber: 'CLY-EXP-87944-BDG',
    image: '/assets/images/product_plate.jpg'
  },
  {
    id: '#CLY-2026-001',
    date: '12 Okt 2026',
    itemsSummary: 'The Sunday Mug',
    variantSummary: 'Glasir Hijau Sage • Jml: 1',
    items: [
      { name: 'The Sunday Mug', glaze: 'Hijau Sage', quantity: 1, price: 125000 }
    ],
    total: 125000,
    shippingFee: 15000,
    grandTotal: 140000,
    fulfillment: 'SELESAI',
    paymentStatus: 'LUNAS',
    paymentMethod: 'Virtual Account (BCA)',
    courier: 'Pengiriman Reguler (Eco Shield)',
    trackingNumber: 'CLY-EXP-86104-BDG',
    image: '/assets/images/product_mug.jpg'
  }
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_products_id_v1');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_cart_id_v1');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_user_id_v1');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_orders_id_v1');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_wishlist_id_v1');
      return saved ? JSON.parse(saved) : [2, 3];
    } catch {
      return [2, 3];
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash.replace('#', '') || '/';
  });
  const [selectedProductId, setSelectedProductId] = useState(1);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      if (hash.startsWith('/detail/')) {
        const id = parseInt(hash.replace('/detail/', ''));
        if (!isNaN(id)) setSelectedProductId(id);
      }
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash.startsWith('#/detail/')) {
      const id = parseInt(window.location.hash.replace('#/detail/', ''));
      if (!isNaN(id)) setSelectedProductId(id);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('claye_cart_id_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('claye_user_id_v1', JSON.stringify(user));
    } else {
      localStorage.removeItem('claye_user_id_v1');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('claye_orders_id_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('claye_products_id_v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('claye_wishlist_id_v1', JSON.stringify(wishlist));
  }, [wishlist]);

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
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
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
          stamp
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (email, password, forcedRole = null) => {
    const isAdmin = forcedRole === 'admin' || (email && email.toLowerCase().includes('admin'));

    if (isAdmin) {
      const adminUser = {
        ...DEMO_USERS.admin,
        email: email || DEMO_USERS.admin.email
      };
      setUser(adminUser);
      showToast('Masuk berhasil sebagai Admin.', 'success');
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
    showToast(`Masuk berhasil sebagai Pelanggan. Selamat datang, ${customerUser.name}.`, 'success');
    navigate('/dashboard');
  };

  const register = (registerData) => {
    // Registrasi hanya untuk pembeli/pelanggan
    const newUser = {
      role: 'customer',
      roleName: 'Pelanggan',
      name: registerData.name || (registerData.fullName ? registerData.fullName.split(' ')[0] : 'Pelanggan'),
      fullName: registerData.fullName || 'Pelanggan Baru CLAYÉ',
      email: registerData.email,
      phone: registerData.phone || '+62 812-0000-0000',
      address: registerData.address || 'Bandung, Jawa Barat',
      city: registerData.city || 'Bandung',
      province: 'Jawa Barat',
      postalCode: registerData.postalCode || '40135',
      country: 'Indonesia',
      patronSince: '2026',
      cohort: 'Angkatan Batch 05'
    };
    setUser(newUser);
    showToast(`Pendaftaran akun pembeli berhasil. Selamat bergabung, ${newUser.name}.`, 'success');
    navigate('/dashboard');
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
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      itemsSummary: cart.map(i => i.name).join(' + '),
      variantSummary: cart.map(i => `${i.selectedGlaze || 'Gading'} • Jml: ${i.quantity}`).join(', '),
      items: cart.map(i => ({
        name: i.name,
        glaze: i.selectedGlaze,
        stamp: i.stamp,
        quantity: i.quantity,
        price: i.price
      })),
      total: cartTotal,
      shippingFee: orderData.shippingFee || 15000,
      grandTotal: (cartTotal + (orderData.shippingFee || 15000)),
      fulfillment: 'DIPROSES',
      paymentStatus: 'LUNAS',
      paymentMethod: orderData.paymentMethod || 'Transfer Bank (BCA)',
      courier: orderData.courier || 'Pengiriman Reguler (Eco Shield)',
      trackingNumber: `CLY-EXP-${randNum}-BDG`,
      image: cart[0]?.image || '/assets/images/product_mug.jpg',
      shippingAddress: orderData.shippingAddress || (user ? `${user.address}, ${user.city}` : 'Bandung, Jawa Barat')
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
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
    showToast(`Produk "${item.name}" berhasil ditambahkan ke katalog studio.`, 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produk berhasil dihapus dari katalog.', 'info');
  };

  const viewProduct = (id) => {
    setSelectedProductId(id);
    navigate(`/detail/${id}`);
  };

  const openConcierge = (prompt = '') => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
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
      toggleWishlist,
      login,
      register,
      logout,
      updateProfile,
      createOrder,
      addProduct,
      deleteProduct,
      viewProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
