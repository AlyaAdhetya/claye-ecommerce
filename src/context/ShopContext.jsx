import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Products state (can be edited/added in Admin)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('claye_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ORD-8921',
          date: '24 Okt 2026',
          items: [{ name: 'Terra Bowl Klasik', quantity: 2, price: 185000 }],
          total: 395000,
          status: 'Dikirim',
          tracking: 'JNE-8829104829',
          paymentMethod: 'BCA Virtual Account'
        },
        {
          id: 'ORD-8714',
          date: '12 Okt 2026',
          items: [{ name: 'Set Mug Artisan Duo', quantity: 1, price: 245000 }],
          total: 270000,
          status: 'Selesai',
          tracking: 'SICEPAT-72910381',
          paymentMethod: 'GoPay / QRIS'
        }
      ];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Routing State
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });
  const [selectedProductId, setSelectedProductId] = useState(1);

  // Sync hash routing
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
    // Initialize
    if (window.location.hash.startsWith('#/detail/')) {
      const id = parseInt(window.location.hash.replace('#/detail/', ''));
      if (!isNaN(id)) setSelectedProductId(id);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('claye_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('claye_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('claye_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('claye_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('claye_products', JSON.stringify(products));
  }, [products]);

  // Navigate helper
  const navigate = (path) => {
    window.location.hash = path;
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const addToCart = (productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    showToast(`"${product.name}" ditambahkan ke keranjang! 🛒`, 'success');
  };

  const updateCartQty = (productId, qty) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Produk dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (email, password) => {
    const mockUser = {
      name: email.split('@')[0].replace('.', ' '),
      email: email,
      phone: '081234567890',
      address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
      points: 1250,
      joined: 'Februari 2026'
    };
    setUser(mockUser);
    showToast(`Selamat datang kembali, ${mockUser.name}! 👋`, 'success');
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    showToast('Berhasil keluar dari akun.', 'info');
    navigate('/');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
    showToast('Profil berhasil diperbarui! ✨', 'success');
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const addProduct = (newProd) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const item = { ...newProd, id, rating: 5.0, reviews: 0 };
    setProducts(prev => [item, ...prev]);
    showToast(`Produk "${item.name}" berhasil ditambahkan! 🏺`, 'success');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produk berhasil dihapus.', 'info');
  };

  const viewProduct = (id) => {
    setSelectedProductId(id);
    navigate(`/detail/${id}`);
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      user,
      orders,
      toasts,
      currentRoute,
      selectedProductId,
      cartTotal,
      cartCount,
      navigate,
      showToast,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      login,
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
