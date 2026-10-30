import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function AdminPage() {
  const {
    products,
    addProduct,
    deleteProduct,
    updateProductStock,
    showToast,
    openConcierge,
    user,
    login,
    logout,
    navigate
  } = useShop();

  // Active page state for sidebar navigation
  const [activePage, setActivePage] = useState('overview');

  // Chart range toggle for overview / analytics
  const [chartRange, setChartRange] = useState('7d');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectOrderData, setInspectOrderData] = useState(null);

  // Form input for new ceramic product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Cangkir & Mug');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('12');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState('Semua');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('Semua');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');

  // Settings form state
  const [studioSettings, setStudioSettings] = useState({
    studioName: 'CLAYÉ Ceramics Atelier',
    location: 'Jl. Rancabentang No. 29, Dago Pakar, Ciumbuleuit, Bandung, Jawa Barat 40142',
    phone: '+62 811-2233-4455',
    email: 'atelier@claye.id',
    openingHours: 'Selasa – Minggu: 10:00 – 17:00 WIB',
    kilnCapacity: '2 Tungku Gas Reduksi Cone 10 (Total 350 Liter)',
    shippingProtection: true,
    qrisActive: true,
    bcaActive: true
  });

  // Mock initial orders
  const [adminOrders, setAdminOrders] = useState([
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
      total: 250000,
      paymentStatus: 'Lunas',
      paymentMethod: 'Transfer BCA',
      fulfillment: 'Diproses',
      courier: 'JNE Eco-Shield (Garansi Pecah Belah)',
      trackingNumber: 'CLY-EXP-99201-BDG'
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
      total: 125000,
      paymentStatus: 'Lunas',
      paymentMethod: 'QRIS Instan',
      fulfillment: 'Selesai',
      courier: 'Kurir Instan Studio (Same Day)',
      trackingNumber: 'CLY-EXP-99202-BDG'
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
      total: 300000,
      paymentStatus: 'Menunggu',
      paymentMethod: 'Virtual Account Mandiri',
      fulfillment: 'Menunggu Pembayaran',
      courier: 'J&T Cargo Wood Crate',
      trackingNumber: 'CLY-EXP-99203-BDG'
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
      total: 150000,
      paymentStatus: 'Lunas',
      paymentMethod: 'Transfer BCA',
      fulfillment: 'Diproses',
      courier: 'SiCepat Best Eco Shield',
      trackingNumber: 'CLY-EXP-99204-BDG'
    }
  ]);

  // Mock collector patrons data
  const collectors = [
    {
      name: 'Nadia Putri',
      initials: 'NP',
      email: 'nadia.putri@gmail.com',
      phone: '+62 812-9988-7711',
      city: 'Jakarta Selatan',
      tier: 'Patron VIP',
      totalOrders: 6,
      totalSpent: 1850000,
      joinedYear: '2023',
      favoriteGlaze: 'Matte Sage Ash'
    },
    {
      name: 'Rania Putri',
      initials: 'RP',
      email: 'rania.p@outlook.com',
      phone: '+62 813-2211-4455',
      city: 'Bandung Barat',
      tier: 'Kolektor Studio',
      totalOrders: 4,
      totalSpent: 920000,
      joinedYear: '2024',
      favoriteGlaze: 'Batu Pasir dan Gading'
    },
    {
      name: 'Bima Satria',
      initials: 'BS',
      email: 'bima.satria@corporate.id',
      phone: '+62 811-7788-9900',
      city: 'Jakarta Pusat',
      tier: 'Patron VIP',
      totalOrders: 9,
      totalSpent: 3450000,
      joinedYear: '2022',
      favoriteGlaze: 'Iron Rust Tenmoku'
    },
    {
      name: 'Dinda Maharani',
      initials: 'DM',
      email: 'dinda.m@gmail.com',
      phone: '+62 821-5566-7788',
      city: 'Denpasar, Bali',
      tier: 'Kolektor Studio',
      totalOrders: 3,
      totalSpent: 680000,
      joinedYear: '2025',
      favoriteGlaze: 'Wabi Celadon'
    },
    {
      name: 'Alya Safitri',
      initials: 'AS',
      email: 'alya.safitri@yahoo.com',
      phone: '+62 819-3344-5566',
      city: 'Surabaya Timur',
      tier: 'Pembeli Baru',
      totalOrders: 1,
      totalSpent: 300000,
      joinedYear: '2026',
      favoriteGlaze: 'Gading Alami'
    }
  ];

  // Mock Glaze Lab Recipes
  const glazeRecipes = [
    {
      name: 'Matte Sage Ash',
      code: 'GLZ-SGE-01',
      type: 'Abu Kayu Pinus Alami dan Feldspar',
      finish: 'Matte Halus Berserat Mikro',
      cone: 'Cone 10 (1260°C Reduksi)',
      foodSafe: true,
      stockStatus: 'Tersedia di Studio (45 Kg)',
      description: 'Menghasilkan warna hijau lumut pudar khas keramik klasik Korea dan Jepang. Sangat aman untuk minuman asam/panas.'
    },
    {
      name: 'Iron Rust Tenmoku',
      code: 'GLZ-TNM-04',
      type: 'Pasir Besi Alam Sukabumi dan Silika',
      finish: 'Cokelat Gelap Mengilap dengan Kristal Karat',
      cone: 'Cone 10 (1260°C)',
      foodSafe: true,
      stockStatus: 'Tersedia di Studio (30 Kg)',
      description: 'Formulasi pekat yang bereaksi dengan api reduksi tungku, menghasilkan kilau kristal besi eksotis di tepian bibir cangkir.'
    },
    {
      name: 'Raw Terracotta Sand',
      code: 'GLZ-TER-09',
      type: 'Slip Tanah Liat Merah Alami (Unglazed Vitrified)',
      finish: 'Tekstur Pasir Kasar Hangat',
      cone: 'Cone 10 (1240°C - 1260°C)',
      foodSafe: true,
      stockStatus: 'Tersedia di Studio (60 Kg)',
      description: 'Teknik slip tradisional tanpa glasir kaca mengilap. Bagian luar dibiarkan kasar alami untuk cengkeraman tangan mantap.'
    },
    {
      name: 'Celadon Blue Crackle',
      code: 'GLZ-CLD-02',
      type: 'Lempung Vulkanik Hijau dan Silika Murni',
      finish: 'Retak Seribu Halus Mengkilap (Crackle)',
      cone: 'Cone 10 Reduksi Kuat',
      foodSafe: true,
      stockStatus: 'Stok Terbatas (15 Kg)',
      description: 'Glasir berkarakter giok dengan jaring retak estetis di bawah permukaan kaca bening tebal.'
    }
  ];

  // Handlers
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('Harap masukkan nama dan harga karya keramik!', 'error');
      return;
    }

    addProduct({
      name: newProdName,
      subtitle: newProdSubtitle || 'Karya keramik stoneware buatan tangan',
      category: newProdCategory,
      price: parseInt(newProdPrice),
      stock: parseInt(newProdStock) || 12,
      description: newProdDesc || 'Dibentuk di atas roda putar menggunakan glasir mineral alami dan dibakar pada suhu 1260°C di studio Bandung kami.',
      badge: 'baru',
      image: '/assets/images/product_mug.jpg'
    });

    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('12');
    setNewProdSubtitle('');
    setNewProdDesc('');
    showToast(`Produk "${newProdName}" berhasil didaftarkan ke inventaris!`, 'success');
  };

  const handleUpdateFulfillment = (orderId, newStatus) => {
    setAdminOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, fulfillment: newStatus } : ord)
    );
    showToast(`Status pengiriman ${orderId} diubah menjadi "${newStatus}".`, 'success');
    if (inspectOrderData && inspectOrderData.id === orderId) {
      setInspectOrderData({ ...inspectOrderData, fulfillment: newStatus });
    }
  };

  // Filtered orders
  const filteredOrders = adminOrders.filter(ord => {
    const matchStatus = orderStatusFilter === 'Semua' || ord.fulfillment.toLowerCase().includes(orderStatusFilter.toLowerCase()) || (orderStatusFilter === 'Menunggu' && ord.fulfillment.toLowerCase().includes('menunggu'));
    const matchSearch = ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.patron.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.city.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filtered inventory products
  const filteredProducts = products.filter(p => {
    const matchCat = inventoryCategoryFilter === 'Semua' || p.category === inventoryCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(inventorySearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Calculate quick stats
  const totalRevenue = adminOrders.reduce((sum, ord) => sum + ord.total, 0) + 11675000;
  const totalPhysicalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;

  // ROUTE GUARD: Khusus Admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="claye-login-page" style={{ padding: '6rem 0', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div className="auth-card-wrapper" style={{ padding: '3rem 2.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#F5EBE6',
              color: '#B87355',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <div className="studio-edition-badge" style={{ margin: '0 auto 0.75rem' }}>
              AKSES KHUSUS ADMIN
            </div>

            <h2 className="auth-main-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Portal Admin CLAYÉ
            </h2>

            <p className="auth-lead-sub" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              {user ? (
                <>Anda saat ini masuk sebagai <strong>{user.name}</strong> ({user.roleName || 'Pelanggan'}). Halaman ini memerlukan hak akses Admin Atelier.</>
              ) : (
                <>Panel kontrol ini memuat manajemen inventaris keramik, status tungku kiln, dan logistik pengiriman. Silakan masuk dengan akun Admin.</>
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => login('admin@claye.id', 'atelier2026', 'admin')}
                className="claye-terracotta-btn"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                Masuk sebagai Admin Studio →
              </button>

              <button
                onClick={() => navigate('/login')}
                className="btn-modal-cancel"
                style={{ width: '100%' }}
              >
                Pilih Akun Lain / Halaman Login
              </button>

              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6E6962',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  textDecoration: 'underline'
                }}
              >
                Kembali ke Toko Pelanggan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar navigation items definitions
  const sidebarNavItems = [
    {
      group: 'Operasional Utama',
      items: [
        {
          id: 'overview',
          label: 'Ringkasan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          ),
          badge: 'Live',
          badgeClass: 'badge-live'
        },
        {
          id: 'orders',
          label: 'Pesanan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          ),
          badge: `${adminOrders.length}`,
          badgeClass: 'badge-count'
        },
        {
          id: 'inventory',
          label: 'Inventaris',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          ),
          badge: `${products.length}`,
          badgeClass: 'badge-count'
        },
        {
          id: 'kiln',
          label: 'Kiln dan Formula',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          ),
          badge: '1260°C',
          badgeClass: 'badge-fire'
        }
      ]
    },
    {
      group: 'Data dan Pengaturan',
      items: [
        {
          id: 'customers',
          label: 'Pelanggan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
          badge: '58',
          badgeClass: 'badge-count'
        },
        {
          id: 'analytics',
          label: 'Laporan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          )
        },
        {
          id: 'settings',
          label: 'Pengaturan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <div className="claye-admin-app-container">
      <div className="admin-page-grid">
        {/* ===================================================================
            SIDEBAR NAVIGASI PER HALAMAN
            =================================================================== */}
        <aside className="admin-sidebar-menu">
          {/* DAFTAR MENU SIDEBAR */}
          <div className="sidebar-nav-groups-wrap">
            {sidebarNavItems.map((group, gIdx) => (
              <div key={gIdx} className="sidebar-group" style={{ marginBottom: '1.4rem' }}>
                <span className="sidebar-group-title">{group.group}</span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => setActivePage(item.id)}
                    title={item.label}
                  >
                    <span className="snav-icon">{item.icon}</span>
                    <span className="snav-label">{item.label}</span>
                    {item.badge && (
                      <span className={`snav-badge ${item.badgeClass || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* WIDGET STATUS LIVE KILN DI BAWAH SIDEBAR */}
          <div className="admin-kiln-status-widget">
            <div className="kiln-status-header">
              <span className="status-label">STATUS KILN UTAMA</span>
              <span className="firing-tag">1260°C AKTIF</span>
            </div>
            <div className="kiln-batch-info">
              Batch #14 Reduksi Cone 10
            </div>
            <div className="kiln-cooling-timer">
              Pendinginan: ~18 Jam Menuju Unload
            </div>
          </div>

          {/* AKSI BAWAH: LIHAT TOKO & KELUAR */}
          <div className="sidebar-footer-actions">
            <button
              onClick={() => navigate('/')}
              className="sidebar-store-btn"
              title="Lihat Pratinjau Toko Pelanggan"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Lihat Toko Publik</span>
            </button>
            <button
              onClick={logout}
              className="sidebar-logout-btn"
              title="Keluar dari Akun Admin"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        {/* ===================================================================
            VIEWPORT KONTEN UTAMA (BERDASARKAN HALAMAN AKTIF)
            =================================================================== */}
        <main className="admin-main-viewport">
          {/* ===============================================================
              HALAMAN 1: RINGKASAN STUDIO (OVERVIEW)
              =============================================================== */}
          {activePage === 'overview' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>KEGUNAAN HALAMAN RINGKASAN STUDIO</span>
                  </div>
                  <span className="purpose-badge-tag">Pusat Pantauan Utama</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Ikhtisar Operasional Atelier dan Kesehatan Bisnis</h2>
                <div className="purpose-quick-nav" style={{ marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                  <button onClick={() => setIsAddModalOpen(true)} className="purpose-action-btn primary">
                    tambah produk
                  </button>
                  <button onClick={() => setActivePage('orders')} className="purpose-action-btn secondary">
                    lihat pesanan
                  </button>
                  <button onClick={() => setActivePage('inventory')} className="purpose-action-btn secondary">
                    cek stok
                  </button>
                </div>
              </div>

              {/* 4 KARTU METRIK UTAMA */}
              <div className="admin-metrics-row">
                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">TOTAL PENDAPATAN</span>
                  </div>
                  <div className="metric-primary-val">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="metric-trend-positive">
                    +14.2% <span className="trend-text">vs bulan lalu</span>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">TOTAL PESANAN TERCATAT</span>
                  </div>
                  <div className="metric-primary-val">86 <span className="val-unit">paket</span></div>
                  <div className="metric-alert-pill">
                    {adminOrders.filter(o => o.fulfillment === 'Diproses').length} menunggu pengemasan
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">KARYA KERAMIK AKTIF</span>
                  </div>
                  <div className="metric-primary-val">{products.length} <span className="val-unit">karya</span></div>
                  <div className="metric-alert-pill low-stock">
                    {lowStockCount} stok kritis di studio
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">TOTAL KOLEKTOR SETIA</span>
                  </div>
                  <div className="metric-primary-val">58 <span className="val-unit">kolektor</span></div>
                  <div className="metric-trend-positive">
                    +12 kolektor baru bulan ini
                  </div>
                </div>
              </div>

              {/* 2-KOLOM: GRAFIK PENJUALAN & FOCUS KILN */}
              <div className="admin-trajectory-split-grid">
                {/* GRAFIK PENJUALAN */}
                <div className="admin-chart-panel">
                  <div className="chart-panel-header">
                    <div>
                      <span className="chart-panel-tag">PERFORMA PENJUALAN STUDIO</span>
                      <h3 className="chart-panel-title">Tren Pendapatan dan Pengiriman</h3>
                      <p className="chart-panel-sub">Arus transaksi harian produk stoneware langsung dari studio Bandung</p>
                    </div>
                    <div className="chart-range-toggle">
                      <button
                        className={`range-btn ${chartRange === '7d' ? 'active' : ''}`}
                        onClick={() => setChartRange('7d')}
                      >
                        7 Hari Terakhir
                      </button>
                      <button
                        className={`range-btn ${chartRange === '30d' ? 'active' : ''}`}
                        onClick={() => setChartRange('30d')}
                      >
                        30 Hari Terakhir
                      </button>
                    </div>
                  </div>

                  <div className="chart-metrics-row">
                    <div className="cmetric-col">
                      <span className="cmetric-label">RATA-RATA PENGIRIMAN HARIAN</span>
                      <strong className="cmetric-val">Rp1.785.000</strong>
                    </div>
                    <div className="cmetric-col">
                      <span className="cmetric-label">PUNCAK PENJUALAN</span>
                      <strong className="cmetric-val">Jumat (Rp2.4M)</strong>
                    </div>
                    <div className="cmetric-col">
                      <span className="cmetric-label">KEBERHASILAN PEMBAKARAN</span>
                      <strong className="cmetric-val">94.8% Sukses</strong>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="sales-svg-chart-container">
                    <svg viewBox="0 0 540 180" className="sales-chart-svg">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#24201D" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#24201D" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="40" y1="30" x2="520" y2="30" stroke="#EAE6DF" strokeDasharray="3 3" />
                      <line x1="40" y1="75" x2="520" y2="75" stroke="#EAE6DF" strokeDasharray="3 3" />
                      <line x1="40" y1="120" x2="520" y2="120" stroke="#EAE6DF" strokeDasharray="3 3" />
                      <line x1="390" y1="40" x2="390" y2="140" stroke="#8A857F" strokeDasharray="3 3" />
                      <path
                        d="M 50 115 Q 110 118 160 115 T 270 112 T 340 90 T 390 42 T 450 115 T 510 128 L 510 145 L 50 145 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M 50 115 Q 110 118 160 115 T 270 112 T 340 90 T 390 42 T 450 115 T 510 128"
                        fill="none"
                        stroke="#24201D"
                        strokeWidth="2.5"
                      />
                      <circle cx="50" cy="115" r="3.5" fill="#24201D" />
                      <circle cx="160" cy="115" r="3.5" fill="#24201D" />
                      <circle cx="270" cy="112" r="3.5" fill="#24201D" />
                      <circle cx="340" cy="90" r="3.5" fill="#24201D" />
                      <circle cx="390" cy="42" r="5" fill="#24201D" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="450" cy="115" r="3.5" fill="#24201D" />
                      <circle cx="510" cy="128" r="3.5" fill="#24201D" />
                      <text x="50" y="160" fill="#8A857F" fontSize="8" textAnchor="middle">Sen 17</text>
                      <text x="120" y="160" fill="#8A857F" fontSize="8" textAnchor="middle">Sel 18</text>
                      <text x="190" y="160" fill="#8A857F" fontSize="8" textAnchor="middle">Rab 19</text>
                      <text x="270" y="160" fill="#8A857F" fontSize="8" textAnchor="middle">Kam 20</text>
                      <text x="390" y="160" fill="#24201D" fontSize="8" textAnchor="middle" fontWeight="bold">Jum 21</text>
                      <text x="450" y="160" fill="#8A857F" fontSize="8" textAnchor="middle">Sab 22</text>
                      <text x="510" y="160" fill="#8A857F" fontSize="8" textAnchor="middle">Min 23</text>
                    </svg>
                  </div>
                </div>

                {/* KANAN: FOKUS PEMBAKARAN KILN */}
                <div className="admin-kiln-focus-card">
                  <div className="focus-card-header">
                    <span className="focus-tag">FOKUS PEMBAKARAN KILN AKTIF</span>
                    <span className="limited-series-pill">EDISI TERBATAS</span>
                  </div>

                  <div className="focus-image-frame">
                    <img
                      src="/assets/images/product_bowl.jpg"
                      alt="Wabi Matcha Chawan Vessel"
                      className="focus-img"
                    />
                    <div className="focus-overlay-content">
                      <span className="drop-edition-label">BATCH DROP #04</span>
                      <h4 className="focus-vessel-title">Wabi Matcha Chawan</h4>
                    </div>
                    <div className="focus-made-counter">
                      <strong>08/25</strong> Dibuat
                    </div>
                  </div>

                  <div className="focus-specs-list">
                    <div className="fspec-row">
                      <span className="fspec-key">Pembakaran Reduksi Cone 10</span>
                      <strong className="fspec-val">1260°C Terverifikasi</strong>
                    </div>
                    <div className="fspec-row">
                      <span className="fspec-key">Asal Tanah Liat</span>
                      <strong className="fspec-val">Stoneware Sukabumi</strong>
                    </div>
                    <div className="fspec-row">
                      <span className="fspec-key">Formulasi Glasir</span>
                      <strong className="fspec-val">Abu Kayu dan Besi Matte</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePage('kiln')}
                    className="focus-health-footer"
                    style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <span className="health-label">Buka Monitor Kiln Lengkap</span>
                  </button>
                </div>
              </div>

              {/* ANTREAN PESANAN TERAKHIR */}
              <div className="admin-section-container" style={{ marginTop: '2rem' }}>
                <div className="admin-section-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 className="section-serif-heading">Antrean Pengiriman Mendesak ({adminOrders.filter(o => o.fulfillment !== 'Selesai').length} Paket)</h3>
                    <p className="section-subtext">Pesanan yang harus dikemas menggunakan bubble wrap ramah lingkungan dan segel studio hari ini.</p>
                  </div>
                  <button
                    onClick={() => setActivePage('orders')}
                    className="btn-admin-dispatch"
                    style={{ padding: '0.65rem 1.25rem', whiteSpace: 'nowrap' }}
                  >
                    Kelola Pesanan
                  </button>
                </div>

                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table">
                    <thead>
                      <tr>
                        <th>ID PESANAN</th>
                        <th>PELANGGAN</th>
                        <th>KOTA</th>
                        <th>ITEM</th>
                        <th>TOTAL</th>
                        <th>STATUS PENGIRIMAN</th>
                        <th style={{ textAlign: 'right' }}>TINDAKAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOrders.slice(0, 3).map(ord => (
                        <tr key={ord.id}>
                          <td><strong>{ord.id.replace('#', '')}</strong></td>
                          <td><strong>{ord.patron}</strong></td>
                          <td>{ord.city}</td>
                          <td style={{ fontSize: '0.85rem' }}>{ord.itemsSummary}</td>
                          <td>Rp {ord.total.toLocaleString('id-ID')}</td>
                          <td>
                            <span className={`status-pill ${ord.fulfillment === 'Selesai' ? 'pill-completed' : ord.fulfillment === 'Diproses' ? 'pill-processing' : 'pill-awaiting'}`}>
                              {ord.fulfillment}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => setInspectOrderData(ord)}
                              className="admin-inspect-btn"
                            >
                              Periksa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 2: KELOLA PESANAN PELANGGAN (ORDERS)
              =============================================================== */}
          {activePage === 'orders' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>KEGUNAAN HALAMAN KELOLA PESANAN</span>
                  </div>
                  <span className="purpose-badge-tag">Logistik dan Transaksi</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Manajemen Pemrosesan Pesanan dan Pengiriman Studio</h2>
                <div className="purpose-quick-nav" style={{ marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                  <button onClick={() => showToast('Daftar pesanan berhasil disinkronisasi dengan server.', 'success')} className="purpose-action-btn secondary">
                    sinkronkan data
                  </button>
                  <button onClick={() => showToast('Seluruh slip label pengemasan siap dicetak.', 'info')} className="purpose-action-btn secondary">
                    cetak label
                  </button>
                </div>
              </div>

              {/* FILTER & PENCARIAN PESANAN */}
              <div className="admin-filter-bar">
                <div className="filter-tabs-row">
                  {['Semua', 'Diproses', 'Selesai', 'Menunggu'].map(status => (
                    <button
                      key={status}
                      className={`filter-tab-btn ${orderStatusFilter === status ? 'active' : ''}`}
                      onClick={() => setOrderStatusFilter(status)}
                    >
                      {status === 'Semua' ? 'Semua Pesanan' : status === 'Menunggu' ? 'Menunggu Bayar' : status}
                      <span className="filter-counter-badge">
                        {status === 'Semua'
                          ? adminOrders.length
                          : adminOrders.filter(o => o.fulfillment.toLowerCase().includes(status.toLowerCase())).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="filter-search-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari nomor ID, nama pemesan, atau kota..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                  />
                  {orderSearchQuery && (
                    <button onClick={() => setOrderSearchQuery('')} style={{ fontSize: '0.8rem', color: '#999' }}>×</button>
                  )}
                </div>
              </div>

              {/* TABEL LENGKAP PESANAN */}
              <div className="admin-section-container">
                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table admin-orders-table">
                    <thead>
                      <tr>
                        <th>ID PESANAN</th>
                        <th>PELANGGAN</th>
                        <th>KOTA</th>
                        <th>TANGGAL</th>
                        <th>KARYA KERAMIK</th>
                        <th>TOTAL BIAYA</th>
                        <th>STATUS BAYAR</th>
                        <th>STATUS FULFILLMENT</th>
                        <th style={{ textAlign: 'right' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#8A857F' }}>
                            Tidak ada pesanan yang sesuai dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(ord => (
                          <tr key={ord.id}>
                            <td className="cell-order-ref">
                              <strong>{ord.id.replace('#', '')}</strong>
                            </td>
                            <td className="cell-collector-patron">
                              <div className="patron-badge-cell">
                                <span className="patron-circle-avatar">{ord.initials}</span>
                                <strong>{ord.patron}</strong>
                              </div>
                            </td>
                            <td>{ord.city}</td>
                            <td className="cell-date">{ord.date}</td>
                            <td style={{ fontSize: '0.82rem', maxWidth: '180px' }}>
                              {ord.itemsSummary}
                            </td>
                            <td className="cell-total">
                              Rp {ord.total.toLocaleString('id-ID')}
                            </td>
                            <td className="cell-payment-status">
                              <span className={`status-pill ${ord.paymentStatus === 'Lunas' ? 'pill-completed' : 'pill-pending'}`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td>
                              <select
                                value={ord.fulfillment}
                                onChange={(e) => handleUpdateFulfillment(ord.id, e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.78rem',
                                  borderRadius: '4px',
                                  border: '1px solid #EAE6DF',
                                  backgroundColor: ord.fulfillment === 'Selesai' ? '#E8ECE6' : ord.fulfillment === 'Diproses' ? '#FBEBE4' : '#F5F2EB',
                                  color: ord.fulfillment === 'Selesai' ? '#385E3E' : ord.fulfillment === 'Diproses' ? '#B87355' : '#8A857F',
                                  fontWeight: '600'
                                }}
                              >
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai (Terkirim)</option>
                                <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                              </select>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => setInspectOrderData(ord)}
                                className="admin-inspect-btn"
                              >
                                Periksa
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="admin-orders-table-footer">
                  <div className="kraft-seal-note">
                    Semua karya dilindungi double-box honeycomb kraft dan garansi ganti baru bila terjadi kerusakan logistik.
                  </div>
                  <div className="showing-dispatches-counter">
                    Menampilkan {filteredOrders.length} dari {adminOrders.length} paket pesanan
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 3: INVENTARIS PRODUK (INVENTORY)
              =============================================================== */}
          {activePage === 'inventory' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    <span>KEGUNAAN HALAMAN INVENTARIS PRODUK</span>
                  </div>
                  <span className="purpose-badge-tag">Katalog dan Stok Keramik</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Manajemen Stok Fisik Studio dan Katalog E-Commerce</h2>
                <div className="purpose-quick-nav" style={{ marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                  <button onClick={() => setIsAddModalOpen(true)} className="purpose-action-btn primary">
                    tambah produk
                  </button>
                  <button onClick={() => showToast('Stok seluruh katalog telah diperbarui sesuai kondisi rak studio.', 'success')} className="purpose-action-btn secondary">
                    sinkronkan stok
                  </button>
                </div>
              </div>

              {/* MINI STAT ROW INVENTORY */}
              <div className="admin-metrics-row" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">TOTAL KARYA KERAMIK (SKU)</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    {products.length} <span className="val-unit">model</span>
                  </div>
                </div>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">TOTAL STOK FISIK DI STUDIO</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    {totalPhysicalStock} <span className="val-unit">buah</span>
                  </div>
                </div>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">KATEGORI PRODUK AKTIF</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    6 <span className="val-unit">kategori</span>
                  </div>
                </div>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">PERINGATAN STOK TIPIS</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem', color: '#B87355' }}>
                    {lowStockCount} <span className="val-unit">&lt; 5 pcs</span>
                  </div>
                </div>
              </div>

              {/* FILTER & PENCARIAN PRODUK */}
              <div className="admin-filter-bar">
                <div className="filter-tabs-row" style={{ overflowX: 'auto' }}>
                  {['Semua', 'Cangkir & Mug', 'Mangkuk', 'Peralatan Makan', 'Vas', 'Kopi & Teh'].map(cat => (
                    <button
                      key={cat}
                      className={`filter-tab-btn ${inventoryCategoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setInventoryCategoryFilter(cat)}
                    >
                      {cat === 'Cangkir & Mug' ? 'Cangkir dan Mug' : cat === 'Kopi & Teh' ? 'Kopi dan Teh' : cat}
                    </button>
                  ))}
                </div>

                <div className="filter-search-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari karya keramik, glasir, atau nama..."
                    value={inventorySearchQuery}
                    onChange={(e) => setInventorySearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* TABEL INVENTARIS PRODUK */}
              <div className="admin-section-container">
                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table">
                    <thead>
                      <tr>
                        <th>PRODUK DAN EDISI GLASIR</th>
                        <th>KATEGORI</th>
                        <th>HARGA SATUAN</th>
                        <th>STOK TERSEDIA</th>
                        <th>STATUS BADGE</th>
                        <th style={{ textAlign: 'right' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#8A857F' }}>
                            Tidak ada produk keramik yang sesuai dengan filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => (
                          <tr key={p.id}>
                            <td className="cell-pieces">
                              <div className="pieces-item-preview">
                                <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div>
                                  <strong className="piece-title">{p.name}</strong>
                                  <span className="piece-variant">{p.subtitle}</span>
                                </div>
                              </div>
                            </td>
                            <td>{p.category}</td>
                            <td><strong>Rp {p.price.toLocaleString('id-ID')}</strong></td>
                            <td>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  onClick={() => updateProductStock(p.id, -1)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '4px',
                                    border: '1px solid #EAE6DF',
                                    backgroundColor: '#FAF8F5',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Kurangi 1 pcs"
                                >
                                  -
                                </button>
                                <span style={{ fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>
                                  {p.stock || 0} pcs
                                </span>
                                <button
                                  onClick={() => updateProductStock(p.id, 1)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '4px',
                                    border: '1px solid #EAE6DF',
                                    backgroundColor: '#FAF8F5',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Tambah 1 pcs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <span className={`status-pill ${(p.stock || 0) < 5 ? 'pill-pending' : 'pill-completed'}`}>
                                {p.badge || 'Studio'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus produk "${p.name}" dari katalog toko?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'none',
                                  border: 'none',
                                  color: '#c0392b',
                                  cursor: 'pointer',
                                  fontSize: '0.82rem'
                                }}
                                title="Hapus produk"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 4: KILN & FORMULA GLASIR (KILN)
              =============================================================== */}
          {activePage === 'kiln' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                    </svg>
                    <span>KEGUNAAN HALAMAN KILN DAN FORMULA GLASIR</span>
                  </div>
                  <span className="purpose-badge-tag">Tungku dan Laboratorium Keramik</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Pemantauan Siklus Firing Tungku dan Resep Glasir Mineral</h2>
                <div className="purpose-quick-nav" style={{ marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                  <button onClick={() => showToast('Catatan log suhu kiln batch #14 berhasil disimpan.', 'success')} className="purpose-action-btn primary">
                    catat suhu tungku
                  </button>
                  <button onClick={() => openConcierge('Buka kalkulator rasio silika-alumina untuk formula glasir Cone 10')} className="purpose-action-btn secondary">
                    konsultasi resep
                  </button>
                </div>
              </div>

              {/* LIVE KILN CHAMBER STATUS */}
              <div className="kiln-live-monitor-card" style={{
                backgroundColor: '#24201D',
                color: '#FAF8F5',
                borderRadius: '8px',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#B87355', fontWeight: '700', textTransform: 'uppercase' }}>
                      MONITORING SUHU LIVE — TUNGKU KILN 01 BANDUNG
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', marginTop: '0.3rem' }}>
                      Siklus Pembakaran Reduksi Cone 10
                    </h3>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(184, 115, 85, 0.25)',
                    border: '1px solid #B87355',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    color: '#FAF8F5',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E74C3C', animation: 'pulse 1.5s infinite' }} />
                    TAHAP PEMBAKARAN AKTIF: 1260°C
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8A857F' }}>SUHU SAAT INI</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FAF8F5', marginTop: '0.2rem' }}>1260°C</div>
                    <span style={{ fontSize: '0.75rem', color: '#27AE60' }}>Target vitrifikasi tercapai</span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8A857F' }}>DURASI PEMBAKARAN</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FAF8F5', marginTop: '0.2rem' }}>8 Jam 30 Mnt</div>
                    <span style={{ fontSize: '0.75rem', color: '#8A857F' }}>Total siklus 14 jam penuh</span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8A857F' }}>ATMOSFER TUNGKU</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FAF8F5', marginTop: '0.2rem' }}>Reduksi Berat</div>
                    <span style={{ fontSize: '0.75rem', color: '#B87355' }}>Karbon mengikat oksigen mineral</span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8A857F' }}>ESTIMASI PENDINGINAN</span>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FAF8F5', marginTop: '0.2rem' }}>~18 Jam</div>
                    <span style={{ fontSize: '0.75rem', color: '#8A857F' }}>Siap bongkar besok pagi</span>
                  </div>
                </div>

                {/* Progress bar firing */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8A857F', marginBottom: '6px' }}>
                    <span>Bisque 900°C</span>
                    <span>Transisi Kuarsa 1050°C</span>
                    <span style={{ color: '#B87355', fontWeight: 'bold' }}>Puncak 1260°C (Cone 10)</span>
                    <span>Pendinginan 50°C</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', backgroundColor: '#B87355', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              {/* DAFTAR FORMULA GLASIR STUDIO */}
              <div className="admin-section-container">
                <div className="admin-section-top">
                  <div>
                    <h3 className="section-serif-heading">Katalog Formula dan Resep Glasir Studio</h3>
                    <p className="section-subtext">Resep glasir mineral alam yang dikembangkan sendiri di lab studio CLAYÉ Bandung.</p>
                  </div>
                  <button onClick={() => showToast('Formulir racikan glasir baru siap dibuka.', 'info')} className="btn-admin-new-drop">
                    Racik Glasir Baru
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                  {glazeRecipes.map(recipe => (
                    <div key={recipe.code} style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#B87355', letterSpacing: '0.08em' }}>{recipe.code}</span>
                          <span className="status-pill pill-completed" style={{ fontSize: '0.65rem' }}>Food-Safe</span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>{recipe.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: '#6E6962', marginBottom: '0.8rem', fontStyle: 'italic' }}>{recipe.finish}</div>
                        <p style={{ fontSize: '0.85rem', color: '#4A4643', lineHeight: '1.5', marginBottom: '1rem' }}>{recipe.description}</p>
                      </div>

                      <div style={{ borderTop: '1px solid #EAE6DF', paddingTop: '0.8rem', fontSize: '0.78rem', color: '#8A857F' }}>
                        <div><strong>Suhu Bakar:</strong> {recipe.cone}</div>
                        <div><strong>Ketersediaan:</strong> {recipe.stockStatus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 5: KOLEKTOR & PELANGGAN (CUSTOMERS)
              =============================================================== */}
          {activePage === 'customers' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>KEGUNAAN HALAMAN PELANGGAN</span>
                  </div>
                  <span className="purpose-badge-tag">Manajemen Hubungan Pelanggan (CRM)</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Direktori Patronase Kolektor dan Program Loyalitas Studio</h2>
                <div className="purpose-quick-nav" style={{ marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                  <button onClick={() => showToast('Katalog pra-rilis edisi Drop 05 dikirimkan ke 12 Patron VIP.', 'success')} className="purpose-action-btn primary">
                    kirim undangan vip
                  </button>
                  <button onClick={() => showToast('Data 58 kolektor keramik berhasil diekspor ke format CSV.', 'info')} className="purpose-action-btn secondary">
                    ekspor direktori
                  </button>
                </div>
              </div>

              {/* 3 METRIK KOLEKTOR */}
              <div className="admin-metrics-row">
                <div className="admin-metric-card">
                  <span className="metric-title">TOTAL KOLEKTOR TERDAFTAR</span>
                  <div className="metric-primary-val">58 <span className="val-unit">orang</span></div>
                  <div className="metric-trend-positive">+14 pelanggan baru bulan ini</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">TINGKAT RETENSI (REPEAT BUYER)</span>
                  <div className="metric-primary-val">42.8%</div>
                  <div className="metric-trend-positive">Sangat loyal terhadap karya atelier</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">RATA-RATA NILAI TRANSAKSI KOLEKTOR</span>
                  <div className="metric-primary-val">Rp 320.000</div>
                  <div className="metric-trend-positive">Rata-rata 2.4 keramik per pesanan</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">PATRON VIP STUDIO</span>
                  <div className="metric-primary-val">12 <span className="val-unit">kolektor</span></div>
                  <div className="metric-alert-pill">Akses pre-order batch 05 aktif</div>
                </div>
              </div>

              {/* TABEL KOLEKTOR */}
              <div className="admin-section-container">
                <div className="admin-section-top">
                  <div>
                    <h3 className="section-serif-heading">Daftar Kolektor dan Pembeli Terdaftar</h3>
                    <p className="section-subtext">Pelanggan yang mengoleksi edisi cangkir, mangkuk, dan vas buatan studio CLAYÉ.</p>
                  </div>
                </div>

                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table">
                    <thead>
                      <tr>
                        <th>KOLEKTOR</th>
                        <th>KOTA</th>
                        <th>KONTAK</th>
                        <th>TIER LOYALITAS</th>
                        <th>TOTAL PESANAN</th>
                        <th>TOTAL BELANJA</th>
                        <th>GLASIR FAVORIT</th>
                        <th style={{ textAlign: 'right' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectors.map((c, i) => (
                        <tr key={i}>
                          <td className="cell-collector-patron">
                            <div className="patron-badge-cell">
                              <span className="patron-circle-avatar">{c.initials}</span>
                              <div>
                                <strong>{c.name}</strong>
                                <span className="patron-location">Sejak {c.joinedYear}</span>
                              </div>
                            </div>
                          </td>
                          <td>{c.city}</td>
                          <td style={{ fontSize: '0.8rem' }}>
                            <div>{c.email}</div>
                            <div style={{ color: '#8A857F' }}>{c.phone}</div>
                          </td>
                          <td>
                            <span className={`status-pill ${c.tier === 'Patron VIP' ? 'pill-completed' : 'pill-processing'}`}>
                              {c.tier}
                            </span>
                          </td>
                          <td><strong>{c.totalOrders} kali</strong></td>
                          <td><strong>Rp {c.totalSpent.toLocaleString('id-ID')}</strong></td>
                          <td style={{ fontSize: '0.82rem', color: '#6E6962' }}>{c.favoriteGlaze}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => openConcierge(`Hubungi ${c.name} mengenai pemesanan custom keramik studio CLAYÉ`)}
                              className="admin-inspect-btn"
                            >
                              Hubungi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 6: LAPORAN & ANALISIS (ANALYTICS)
              =============================================================== */}
          {activePage === 'analytics' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>KEGUNAAN HALAMAN LAPORAN</span>
                  </div>
                  <span className="purpose-badge-tag">Laporan dan Efisiensi Studio</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Analisis Metrik Penjualan, Efisiensi Firing dan Ekspor Laporan</h2>
                <div className="purpose-quick-nav" style={{ marginTop: '0.85rem', paddingTop: '0.85rem' }}>
                  <button onClick={() => showToast('Laporan Keuangan Bulanan (.CSV) berhasil diunduh.', 'success')} className="purpose-action-btn primary">
                    unduh laporan keuangan
                  </button>
                  <button onClick={() => showToast('Log Efisiensi Tungku Kiln (.CSV) berhasil diunduh.', 'info')} className="purpose-action-btn secondary">
                    unduh log kiln
                  </button>
                </div>
              </div>

              {/* 4 INDIKATOR EFISIENSI */}
              <div className="admin-metrics-row">
                <div className="admin-metric-card">
                  <span className="metric-title">RASIO KEBERHASILAN KILN (YIELD)</span>
                  <div className="metric-primary-val">94.8%</div>
                  <div className="metric-trend-positive">Hanya 5.2% retak alami dan didaur ulang</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">RATA-RATA NILAI PESANAN (AOV)</span>
                  <div className="metric-primary-val">Rp 285.000</div>
                  <div className="metric-trend-positive">+8.5% peningkatan keranjang belanja</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">KATEGORI PALING LARIS</span>
                  <div className="metric-primary-val">Cangkir dan Mug</div>
                  <div className="metric-alert-pill">45% dari seluruh volume pesanan</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">KEUTUHAN PENGIRIMAN LOGISTIK</span>
                  <div className="metric-primary-val">99.8%</div>
                  <div className="metric-trend-positive">Kemasan bubble wrap ramah lingkungan sukses</div>
                </div>
              </div>

              {/* KONTRIBUSI KATEGORI PRODUK */}
              <div className="admin-section-container">
                <div className="admin-section-top">
                  <div>
                    <h3 className="section-serif-heading">Distribusi Penjualan Berdasarkan Kategori Karya</h3>
                    <p className="section-subtext">Persentase kontribusi omzet studio dari masing-masing tipe keramik buatan tangan.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                  {[
                    { category: 'Cangkir dan Mug', pct: '45%', amount: 'Rp 5.625.000', count: '45 pcs', color: '#B87355' },
                    { category: 'Peralatan Makan dan Piring', pct: '25%', amount: 'Rp 3.125.000', count: '21 pcs', color: '#24201D' },
                    { category: 'Mangkuk Stoneware', pct: '18%', amount: 'Rp 2.250.000', count: '15 pcs', color: '#385E3E' },
                    { category: 'Vas dan Wadah Kopi', pct: '12%', amount: 'Rp 1.500.000', count: '8 pcs', color: '#8A857F' }
                  ].map((cat, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{cat.category}</span>
                        <strong style={{ color: cat.color }}>{cat.pct}</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#F0ECE4', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{ width: cat.pct, height: '100%', backgroundColor: cat.color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#8A857F' }}>
                        <span>Total: {cat.amount}</span>
                        <span>{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 7: PENGATURAN STUDIO (SETTINGS)
              =============================================================== */}
          {activePage === 'settings' && (
            <div className="admin-page-view">
              {/* PENJELASAN KEGUNAAN HALAMAN */}
              <div className="admin-purpose-card">
                <div className="purpose-header">
                  <div className="purpose-icon-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>KEGUNAAN HALAMAN PENGATURAN</span>
                  </div>
                  <span className="purpose-badge-tag">Konfigurasi Toko dan Atelier</span>
                </div>
                <h2 className="purpose-title" style={{ marginBottom: '0.25rem' }}>Konfigurasi Profil Atelier, Pengemasan dan Jalur Pembayaran</h2>
              </div>

              {/* FORM PENGATURAN STUDIO */}
              <div className="admin-section-container" style={{ maxWidth: '850px' }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Pengaturan studio atelier berhasil disimpan dan diperbarui.', 'success');
                }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 className="section-serif-heading" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
                      1. Identitas Studio dan Lokasi Atelier
                    </h3>
                    <p className="section-subtext" style={{ marginBottom: '1.25rem' }}>
                      Informasi yang ditampilkan di invoice pelanggan dan profil publik studio CLAYÉ.
                    </p>

                    <div className="form-group-claye">
                      <label>Nama Brand / Atelier *</label>
                      <input
                        type="text"
                        value={studioSettings.studioName}
                        onChange={(e) => setStudioSettings({ ...studioSettings, studioName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group-claye">
                      <label>Alamat Fisik Studio di Bandung *</label>
                      <textarea
                        rows="2"
                        value={studioSettings.location}
                        onChange={(e) => setStudioSettings({ ...studioSettings, location: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                      />
                    </div>

                    <div className="checkout-form-row">
                      <div className="form-group-claye">
                        <label>No. Kontak Concierge WhatsApp</label>
                        <input
                          type="text"
                          value={studioSettings.phone}
                          onChange={(e) => setStudioSettings({ ...studioSettings, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group-claye">
                        <label>Email Resmi Admin Studio</label>
                        <input
                          type="email"
                          value={studioSettings.email}
                          onChange={(e) => setStudioSettings({ ...studioSettings, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group-claye">
                      <label>Jam Kunjungan dan Operasional Atelier</label>
                      <input
                        type="text"
                        value={studioSettings.openingHours}
                        onChange={(e) => setStudioSettings({ ...studioSettings, openingHours: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #EAE6DF', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                    <h3 className="section-serif-heading" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
                      2. Standar Logistik Pengemasan dan Garansi Keramik
                    </h3>
                    <p className="section-subtext" style={{ marginBottom: '1.25rem' }}>
                      Protokol keamanan pengiriman produk stoneware ke seluruh Indonesia.
                    </p>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={studioSettings.shippingProtection}
                        onChange={(e) => setStudioSettings({ ...studioSettings, shippingProtection: e.target.checked })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: '#24201D' }}>
                        <strong>Aktifkan Garansi Pecah Belah 100% Ganti Baru</strong> (Wajib menyertakan video unboxing)
                      </span>
                    </label>
                  </div>

                  <div style={{ borderTop: '1px solid #EAE6DF', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                    <h3 className="section-serif-heading" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
                      3. Jalur Pembayaran Toko
                    </h3>
                    <p className="section-subtext" style={{ marginBottom: '1.25rem' }}>
                      Metode pembayaran yang diizinkan saat pelanggan melakukan checkout.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={studioSettings.qrisActive}
                          onChange={(e) => setStudioSettings({ ...studioSettings, qrisActive: e.target.checked })}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>QRIS Instan (GoPay, OVO, Dana, ShopeePay, Mobile Banking)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={studioSettings.bcaActive}
                          onChange={(e) => setStudioSettings({ ...studioSettings, bcaActive: e.target.checked })}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>Transfer Bank Manual (BCA dan Mandiri Studio Account)</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="claye-terracotta-btn">
                      Simpan Pengaturan
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Perubahan dibatalkan.', 'info')}
                      className="btn-modal-cancel"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================
          MODAL: TAMBAH PRODUK KERAMIK BARU (UNTUK INVENTARIS)
          =================================================================== */}
      {isAddModalOpen && (
        <div className="claye-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">REGISTRASI PRODUK STUDIO</span>
                <h3 className="modal-title">+ Tambah Karya Keramik Baru</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-body">
              <div className="form-group-claye">
                <label>Nama Karya / Produk Keramik *</label>
                <input
                  type="text"
                  placeholder="contoh: Kyoto Pourer Vessel"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Keterangan Warna dan Tekstur Glasir *</label>
                <input
                  type="text"
                  placeholder="contoh: Stoneware pasir alami dengan glasir abu kayu sage"
                  value={newProdSubtitle}
                  onChange={(e) => setNewProdSubtitle(e.target.value)}
                />
              </div>

              <div className="checkout-form-row">
                <div className="form-group-claye">
                  <label>Kategori Produk</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                  >
                    <option value="Cangkir & Mug">Cangkir dan Mug</option>
                    <option value="Mangkuk">Mangkuk</option>
                    <option value="Peralatan Makan">Peralatan Makan</option>
                    <option value="Vas">Vas</option>
                    <option value="Kopi & Teh">Kopi dan Teh</option>
                    <option value="Edisi Terbatas">Edisi Terbatas</option>
                  </select>
                </div>

                <div className="form-group-claye">
                  <label>Harga dalam Rupiah (Rp) *</label>
                  <input
                    type="number"
                    placeholder="185000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-claye">
                <label>Stok Fisik Awal di Studio (pcs)</label>
                <input
                  type="number"
                  placeholder="12"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group-claye">
                <label>Deskripsi Pembuatan dan Catatan Kiln</label>
                <textarea
                  rows="3"
                  placeholder="Dibentuk di atas roda putar menggunakan tanah liat alami Sukabumi, dibakar pada suhu 1260°C..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-modal-action">
                  Publikasikan ke Katalog Toko
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-modal-cancel">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: INSPEKSI DETAIL PESANAN
          =================================================================== */}
      {inspectOrderData && (
        <div className="claye-modal-overlay" onClick={() => setInspectOrderData(null)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">INSPEKSI PESANAN PELANGGAN</span>
                <h3 className="modal-title">{inspectOrderData.id.replace('#', '')}</h3>
              </div>
              <button onClick={() => setInspectOrderData(null)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div style={{ backgroundColor: '#FAF8F5', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', border: '1px solid #EAE6DF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>NAMA PEMESAN</span>
                  <strong>{inspectOrderData.patron}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>ALAMAT PENGIRIMAN</span>
                  <span style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%' }}>
                    {inspectOrderData.address || inspectOrderData.city}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>TANGGAL TRANSAKSI</span>
                  <span>{inspectOrderData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>METODE PEMBAYARAN</span>
                  <span>{inspectOrderData.paymentMethod || 'Transfer Bank'} (<strong>{inspectOrderData.paymentStatus}</strong>)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>EKSPEDISI DAN RESI</span>
                  <span>{inspectOrderData.courier || 'Eco Shield'} ({inspectOrderData.trackingNumber || 'CLY-EXP-BDG'})</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A857F', letterSpacing: '0.08em' }}>
                  KARYA KERAMIK DALAM PAKET
                </span>
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', border: '1px solid #EAE6DF', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{inspectOrderData.itemsSummary || 'Karya Keramik Studio CLAYÉ'}</span>
                  <strong>Rp {inspectOrderData.total.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              <div className="form-group-claye">
                <label>Ubah Status Pengiriman (Fulfillment)</label>
                <select
                  value={inspectOrderData.fulfillment}
                  onChange={(e) => handleUpdateFulfillment(inspectOrderData.id, e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                >
                  <option value="Diproses">Diproses (Sedang Dikemas)</option>
                  <option value="Selesai">Selesai (Terkirim)</option>
                  <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                </select>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Slip label pengemasan untuk ${inspectOrderData.id} siap dicetak.`, 'success');
                    setInspectOrderData(null);
                  }}
                  className="btn-modal-action"
                >
                  Cetak Label Pengemasan
                </button>
                <button
                  type="button"
                  onClick={() => setInspectOrderData(null)}
                  className="btn-modal-cancel"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
