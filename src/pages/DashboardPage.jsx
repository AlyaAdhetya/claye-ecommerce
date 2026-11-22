import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function DashboardPage() {
  const {
    user,
    login,
    orders,
    wishlist,
    products,
    registeredUsers,
    logout,
    updateProfile,
    navigate,
    openConcierge,
    showToast,
    viewProduct,
    addToCart,
    addresses,
    saveAddress,
    setPrimaryAddress,
    deleteAddress,
    primaryAddress,
    PALEMBANG_KECAMATAN,
    SHIPPING_ZONES
  } = useShop();

  const [activeMenu, setActiveMenu] = useState('overview');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [isEditProfileModal, setIsEditProfileModal] = useState(false);
  const currentUser = user || {
    name: 'Pelanggan',
    fullName: 'Pelanggan CLAYÉ',
    email: '',
    phone: '',
    address: '',
    city: 'Palembang',
    postalCode: '30138',
    patronSince: '2026',
    cohort: 'Pelanggan Baru'
  };

  const [editFormData, setEditFormData] = useState({
    name: user?.name || 'Pelanggan',
    fullName: user?.fullName || 'Pelanggan CLAYÉ',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Palembang',
    postalCode: user?.postalCode || '30138'
  });

  // State untuk form & modal Buku Alamat
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    id: '',
    label: 'Rumah Pribadi',
    recipientName: '',
    phone: '',
    address: '',
    kecamatan: 'Ilir Barat I',
    patokan: '',
    postalCode: '30138',
    isPrimary: true
  });

  const handleOpenAddAddress = () => {
    setAddressForm({
      id: '',
      label: 'Rumah Pribadi',
      recipientName: currentUser.fullName || currentUser.name || '',
      phone: currentUser.phone || '',
      address: '',
      kecamatan: 'Ilir Barat I',
      patokan: '',
      postalCode: '30138',
      isPrimary: (addresses || []).length === 0
    });
    setEditingAddress({ isNew: true });
  };

  const handleOpenEditAddress = (addr) => {
    setAddressForm({
      id: addr.id,
      label: addr.label || 'Rumah Pribadi',
      recipientName: addr.recipientName || currentUser.fullName || currentUser.name || '',
      phone: addr.phone || currentUser.phone || '',
      address: addr.address || '',
      kecamatan: addr.kecamatan || 'Ilir Barat I',
      patokan: addr.patokan || '',
      postalCode: addr.postalCode || '30138',
      isPrimary: !!addr.isPrimary
    });
    setEditingAddress(addr);
  };

  const handleSaveAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.address.trim()) {
      showToast('Harap masukkan alamat lengkap pengiriman!', 'error');
      return;
    }
    saveAddress(addressForm);
    setEditingAddress(null);
  };

  const [careModalOpen, setCareModalOpen] = useState(false);

  // Filter pesanan KHUSUS milik akun yang sedang login (Akun baru = 0 pesanan / kondisi kosongan)
  const myOrders = orders.filter(ord =>
    ord.email && currentUser.email && ord.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(editFormData);
    setIsEditProfileModal(false);
  };

  const savedProductsList = products.filter(p => wishlist.includes(p.id));

  // State khusus tab dan form Akun Admin
  const [adminTab, setAdminTab] = useState('profile');
  const [adminProfileData, setAdminProfileData] = useState({
    name: user ? user.name : 'Admin',
    fullName: user ? (user.fullName || 'Admin CLAYÉ') : 'Admin CLAYÉ',
    email: user ? user.email : 'admin@claye.id',
    phone: user ? (user.phone || '+62 811-2233-4455') : '+62 811-2233-4455',
    address: user ? (user.address || 'Jl. Sejuta Kenangan, Palembang, Sumatera Selatan') : 'Jl. Sejuta Kenangan, Palembang, Sumatera Selatan',
    city: user ? (user.city || 'Palembang') : 'Palembang',
    province: 'Sumatera Selatan',
    postalCode: '30138',
    roleTitle: 'Head Curator & Store Administrator',
    joinedYear: '2021'
  });

  const handleAdminProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(adminProfileData);
    showToast('Profil Akun Administrator berhasil disimpan dan diperbarui.', 'success');
  };

  // =========================================================================
  // TAMPILAN KHUSUS: HALAMAN AKUN SAYA / AKUN ADMIN
  // =========================================================================
  if (user && user.role === 'admin') {
    return (
      <div className="claye-patron-dashboard-page admin-account-page">
        <div className="patron-page-grid">
          {/* SIDEBAR PROFIL ADMIN (NEMPEL DI PINGGIR LAYAR SEPERTI ADMIN) */}
          <aside className="patron-sidebar-menu">
            <div className="patron-profile-identity">
              <div className="patron-avatar-circle" style={{ backgroundColor: 'var(--color-charcoal)', color: '#FFFFFF' }}>
                A
              </div>
              <div className="patron-name-wrap">
                <h2 className="patron-display-name">{adminProfileData.name}</h2>
                <span className="patron-since-text">ADMINISTRATOR TOKO KURASI</span>
              </div>
            </div>

            <div style={{ padding: '0 0.5rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#6A645D', lineHeight: '1.5' }}>
                <div><strong>Email:</strong> {adminProfileData.email}</div>
                <div><strong>Status:</strong> Pengelola Aktif (Sejak 2021)</div>
              </div>
            </div>

            <nav className="patron-nav-menu">
              <button
                className={`patron-nav-item ${adminTab === 'profile' ? 'is-active' : ''}`}
                onClick={() => setAdminTab('profile')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profil Administrator</span>
              </button>

              <button
                className={`patron-nav-item ${adminTab === 'studio' ? 'is-active' : ''}`}
                onClick={() => setAdminTab('studio')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Data Toko & Gudang</span>
              </button>

              <button
                className={`patron-nav-item ${adminTab === 'activity' ? 'is-active' : ''}`}
                onClick={() => setAdminTab('activity')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Ringkasan Toko</span>
              </button>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                onClick={logout}
                className="patron-logout-btn"
                title="Keluar dari Akun Admin"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Keluar dari Akun Admin</span>
              </button>
            </div>
          </aside>

          {/* VIEWPORT KONTEN UTAMA ADMIN */}
          <main className="patron-main-viewport">
            {/* BREADCRUMB */}
            <div className="dashboard-breadcrumb">
              <button onClick={() => navigate('/')}>BERANDA</button>
              <span className="bc-sep">/</span>
              <button onClick={() => navigate('/admin')}>DASHBOARD ADMIN</button>
              <span className="bc-sep">/</span>
              <span className="bc-current">AKUN ADMIN SAYA</span>
            </div>

            {/* HEADER AKUN ADMIN */}
            <div className="dashboard-account-header">
              <div>
                <div className="studio-patron-pill" style={{ backgroundColor: '#FAF2EC', color: 'var(--color-terracotta)', border: '1px solid #E9D5C8' }}>
                  <span className="patron-dot" style={{ backgroundColor: 'var(--color-terracotta)' }}>•</span> AKUN ADMINISTRATOR & KURASI
                </div>
                <h1 className="account-main-title">Akun Admin Saya</h1>
                <p className="account-welcome-sub">
                  Selamat datang di panel akun Administrator Toko CLAYÉ. Kelola informasi profil pengelola, kontak showroom, dan preferensi operasional.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/admin')}
                  className="claye-terracotta-btn"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  ← Buka Dashboard Admin
                </button>
              </div>
            </div>

            {/* KONTEN TAB */}
            <div className="patron-main-content">

              {/* KONTEN DETAIL AKUN ADMIN */}
              <div className="patron-content-card">
                {/* TAB 1: FORM PROFIL ADMIN */}
                {adminTab === 'profile' && (
                  <div>
                    <div className="patron-section-title-row">
                      <div>
                        <h2 className="patron-section-heading">Informasi Profil Administrator</h2>
                        <p className="patron-section-sub">
                          Data identitas ini digunakan untuk otentikasi login, tanda tangan resi pesanan, dan penanggung jawab kurasi.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleAdminProfileSubmit} className="patron-edit-profile-form" style={{ marginTop: '1.5rem' }}>
                      <div className="form-grid-two">
                        <div className="checkout-form-group">
                          <label>NAMA PANGGILAN ADMIN *</label>
                          <input
                            type="text"
                            value={adminProfileData.name}
                            onChange={(e) => setAdminProfileData({ ...adminProfileData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="checkout-form-group">
                          <label>NAMA LENGKAP PENGELOLA *</label>
                          <input
                            type="text"
                            value={adminProfileData.fullName}
                            onChange={(e) => setAdminProfileData({ ...adminProfileData, fullName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-grid-two">
                        <div className="checkout-form-group">
                          <label>EMAIL ADMINISTRATOR *</label>
                          <input
                            type="email"
                            value={adminProfileData.email}
                            onChange={(e) => setAdminProfileData({ ...adminProfileData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="checkout-form-group">
                          <label>NO. WHATSAPP HOTLINE</label>
                          <input
                            type="tel"
                            value={adminProfileData.phone}
                            onChange={(e) => setAdminProfileData({ ...adminProfileData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="checkout-form-group">
                        <label>PERAN / SPESIALISASI KURASI</label>
                        <input
                          type="text"
                          value={adminProfileData.roleTitle}
                          onChange={(e) => setAdminProfileData({ ...adminProfileData, roleTitle: e.target.value })}
                        />
                      </div>

                      <div className="checkout-form-group">
                        <label>ALAMAT TOKO & SHOWROOM DI PALEMBANG</label>
                        <textarea
                          rows="2"
                          value={adminProfileData.address}
                          onChange={(e) => setAdminProfileData({ ...adminProfileData, address: e.target.value })}
                          style={{ width: '100%', padding: '0.85rem', border: '1px solid #EAE6DF', borderRadius: '4px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="submit" className="claye-terracotta-btn" style={{ padding: '12px 24px' }}>
                          Simpan Perubahan Akun Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/admin')}
                          className="btn-modal-cancel"
                          style={{ padding: '12px 20px' }}
                        >
                          Buka Dashboard Admin
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 2: DATA STUDIO & WORKSHOP */}
                {adminTab === 'studio' && (
                  <div>
                    <div className="patron-section-title-row">
                      <div>
                        <h2 className="patron-section-heading">Data Toko & Showroom CLAYÉ</h2>
                        <p className="patron-section-sub">
                          Informasi operasional toko dan pusat kurasi resmi yang terhubung dengan sistem pesanan pelanggan.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                          📍 Lokasi Workshop & Atelier
                        </strong>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A645D', lineHeight: '1.5' }}>
                          CLAYÉ, Jl. Sejuta Kenangan, Palembang, Sumatera Selatan 30138.
                        </p>
                      </div>

                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                          🏺 Studio Galeri & Atelier
                        </strong>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A645D', lineHeight: '1.5' }}>
                          Galeri kurasi keramik dan stoneware dari pengrajin mitra dengan standar material alami dan glasir food-safe.
                        </p>
                      </div>

                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                          🛡️ Protokol Pengemasan Eco-Shield
                        </strong>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A645D', lineHeight: '1.5' }}>
                          Garansi 100% Ganti Baru jika produk pecah saat pengiriman ekspedisi, dikemas menggunakan sarang lebah ramah lingkungan dan peti kayu untuk karya besar.
                        </p>
                      </div>

                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => navigate('/admin')}
                          className="claye-terracotta-btn"
                          style={{ padding: '12px 20px' }}
                        >
                          Konfigurasi Lengkap di Pengaturan Admin →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: RINGKASAN TOKO */}
                {adminTab === 'activity' && (
                  <div>
                    <div className="patron-section-title-row">
                      <div>
                        <h2 className="patron-section-heading">Ringkasan Aktivitas Toko</h2>
                        <p className="patron-section-sub">
                          Status operasional toko kurasi saat ini.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>PRODUK DI ETALASE</span>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0.3rem 0' }}>
                          {products.length} Produk Kurasi
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#5E7958' }}>✓ 100% Siap Dikirim</span>
                      </div>

                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>TOTAL PESANAN TERCATAT</span>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0.3rem 0' }}>
                          {orders.length} Paket
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)' }}>
                          Omset Rp {orders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>KOLEKTOR TERDAFTAR</span>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0.3rem 0' }}>
                          {registeredUsers?.length || 0} Kolektor
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                          {(registeredUsers?.length || 0) > 0 ? `${registeredUsers.length} kolektor terdaftar` : 'Menunggu pelanggan'}
                        </span>
                      </div>

                      <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>STATUS PENGIRIMAN</span>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#5E7958', margin: '0.3rem 0' }}>
                          100% Aman
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>Garansi Pengiriman Eco-Shield</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button onClick={() => navigate('/admin')} className="claye-terracotta-btn" style={{ padding: '12px 20px' }}>
                        Buka Dashboard Utama →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // JIKA BELUM LOGIN: Arahkan ke portal login pelanggan
  if (!user) {
    return (
      <div className="claye-login-page" style={{ padding: '6rem 0', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div className="auth-card-wrapper" style={{ padding: '3rem 2.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#F3EFEA',
              color: '#24201D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <div className="studio-edition-badge" style={{ margin: '0 auto 0.75rem' }}>
              <span className="badge-dot">•</span> PORTAL PELANGGAN
            </div>

            <h2 className="auth-main-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Akun Saya (Portal Pembeli)
            </h2>

            <p className="auth-lead-sub" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              Silakan masuk ke akun Pelanggan Anda untuk melihat riwayat pesanan keramik, nomor resi pengiriman ekspedisi, serta mengelola alamat pengiriman.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => login('arumi@example.com', 'claye2026', 'customer')}
                className="claye-terracotta-btn"
                style={{ width: '100%', padding: '14px' }}
              >
                Masuk Cepat sebagai Pembeli (Arumi) →
              </button>

              <button
                onClick={() => navigate('/login')}
                className="btn-modal-cancel"
                style={{ width: '100%' }}
              >
                Masuk Akun Lain / Daftar Akun Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="claye-patron-dashboard-page">
      <div className="patron-page-grid">
        {/* SIDEBAR AKUN (NEMPEL DI PINGGIR LAYAR SEPERTI ADMIN) */}
        <aside className="patron-sidebar-menu">
          {/* PROFIL IDENTITAS */}
          <div className="patron-profile-identity">
            <div className="patron-avatar-circle">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="patron-name-wrap">
              <h2 className="patron-display-name">{currentUser.name}</h2>
              <span className="patron-since-text">Pelanggan Tetap · {currentUser.patronSince || '2024'}</span>
              <span className="patron-email-sub">{currentUser.email}</span>
            </div>
          </div>

          <nav className="patron-nav-menu">
            {/* GRUP 1: AKTIVITAS BELANJA */}
            <div className="patron-nav-group">
              <div className="patron-nav-group-title">Aktivitas Belanja</div>

              <button
                className={`patron-nav-item ${activeMenu === 'overview' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('overview')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                </span>
                <span className="pnav-text">Ringkasan Akun</span>
                {activeMenu === 'overview' && <span className="pnav-active-dot" />}
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'orders' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('orders')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                </span>
                <span className="pnav-text">Pesanan Saya</span>
                {myOrders.length > 0 && <span className="pnav-counter-pill">{myOrders.length}</span>}
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'saved' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('saved')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </span>
                <span className="pnav-text">Daftar Favorit</span>
                {wishlist.length > 0 && <span className="pnav-counter-pill">{wishlist.length}</span>}
              </button>
            </div>

            {/* GRUP 2: PENGATURAN AKUN */}
            <div className="patron-nav-group">
              <div className="patron-nav-group-title">Pengaturan Akun</div>

              <button
                className={`patron-nav-item ${activeMenu === 'profile' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('profile')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </span>
                <span className="pnav-text">Profil Saya</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'addresses' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('addresses')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </span>
                <span className="pnav-text">Buku Alamat</span>
              </button>
            </div>

            {/* GRUP 3: INFORMASI */}
            <div className="patron-nav-group">
              <div className="patron-nav-group-title">Informasi &amp; Bantuan</div>

              <button
                className={`patron-nav-item ${activeMenu === 'care' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('care')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                </span>
                <span className="pnav-text">Panduan Perawatan</span>
              </button>
            </div>

            {/* KELUAR */}
            <div className="patron-nav-logout-group" style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                className="patron-nav-item pnav-logout"
                onClick={logout}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                </span>
                <span className="pnav-text">Keluar dari Akun</span>
              </button>
            </div>
          </nav>

          {/* WIDGET BANTUAN */}
          <div className="patron-sidebar-help-widget" style={{ marginTop: '1.25rem' }}>
            <div className="phelp-badge">Asisten Kurasi CLAYÉ</div>
            <span className="phelp-title">Butuh bantuan pesanan?</span>
            <p className="phelp-desc">Tim asisten kurasi kami siap membantu Anda melacak resi dan pertanyaan seputar produk.</p>
            <button className="phelp-btn" onClick={() => openConcierge('Halo, saya butuh bantuan terkait pesanan keramik saya')}>Tanya Concierge Studio →</button>
          </div>
        </aside>

        {/* VIEWPORT KONTEN UTAMA */}
        <main className="patron-main-viewport">
          {/* BREADCRUMB */}
          <div className="dashboard-breadcrumb">
            <button onClick={() => navigate('/')}>BERANDA</button>
            <span className="bc-sep">/</span>
            <span className="bc-current">AKUN SAYA</span>
          </div>

          {/* HEADER AKUN */}
          <div className="dashboard-account-header">
            <div>
              <div className="studio-patron-pill">
                <span className="patron-dot">•</span> PELANGGAN TERDAFTAR
              </div>
              <h1 className="account-main-title">Akun Saya</h1>
              <p className="account-welcome-sub">
                Selamat datang kembali, {currentUser.name}. Berikut ringkasan pesanan keramik dan riwayat arsip Anda.
              </p>
            </div>

            <div className="archived-cohort-badge">
              <div className="cohort-text">
                <span className="cohort-label">KOLEKTOR TERDAFTAR</span>
                <strong className="cohort-name">{currentUser.cohort || 'Angkatan Batch 04'}</strong>
              </div>
            </div>
          </div>

          {/* KONTEN UTAMA AKUN - CONDITIONAL PER MENU */}
          <div className="patron-main-content">

            {/* ============================================ */}
            {/* VIEW: RINGKASAN AKUN (overview) */}
            {/* ============================================ */}
            {activeMenu === 'overview' && (
              <>
                {/* 3 KARTU METRIK */}
                <div className="patron-metrics-row">
                  <div className="patron-stat-card">
                    <div className="pstat-header">
                      <span className="pstat-label">TOTAL PRODUK DIPESAN</span>
                    </div>
                    <div className="pstat-big-num">5</div>
                    <div className="pstat-subtext">Dari berbagai kurasi mitra pengrajin</div>
                  </div>

                  <div className="patron-stat-card">
                    <div className="pstat-header">
                      <span className="pstat-label">SEDANG DIPROSES</span>
                      <span className="pstat-badge active-badge">AKTIF</span>
                    </div>
                    <div className="pstat-big-num">1</div>
                    <div className="pstat-subtext">Dalam tahap inspeksi &amp; pengemasan</div>
                  </div>

                  <div className="patron-stat-card">
                    <div className="pstat-header">
                      <span className="pstat-label">SELESAI DIKIRIM</span>
                      <span className="pstat-icon check-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </span>
                    </div>
                    <div className="pstat-big-num">4</div>
                    <div className="pstat-subtext">Terkirim aman &amp; terkurasi</div>
                  </div>
                </div>

                {/* TABEL PESANAN TERBARU */}
                <div className="dashboard-section-block">
                  <div className="dash-block-header">
                    <div>
                      <h2 className="dash-block-title">Riwayat Pesanan Terbaru</h2>
                      <p className="dash-block-sub">Pantau perjalanan pesanan keramik Anda dari gudang pengiriman hingga tiba di rumah.</p>
                    </div>
                    <button onClick={() => setActiveMenu('orders')} className="dash-text-action">LIHAT SEMUA →</button>
                  </div>

                  <div className="acquisitions-table-wrap">
                    {myOrders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#FAF8F5', borderRadius: '6px', border: '1px dashed #DED8CF' }}>
                        <p style={{ fontSize: '0.92rem', color: '#6E6962', marginBottom: '1rem' }}>
                          Anda belum memiliki riwayat pesanan. Mulai jelajahi karya keramik buatan tangan kami.
                        </p>
                        <button onClick={() => navigate('/katalog')} className="claye-terracotta-btn" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                          Jelajahi Koleksi Kurasi →
                        </button>
                      </div>
                    ) : (
                      <table className="claye-patron-table">
                        <thead>
                          <tr>
                            <th>NO. PESANAN</th>
                            <th>TANGGAL</th>
                            <th>PRODUK KERAMIK</th>
                            <th>TOTAL</th>
                            <th>STATUS</th>
                            <th style={{ textAlign: 'right' }}>RINCIAN</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myOrders.slice(0, 3).map((ord) => (
                            <tr key={ord.id}>
                              <td className="cell-order-ref"><strong>{ord.id}</strong></td>
                              <td className="cell-date">{ord.date}</td>
                              <td className="cell-pieces">
                                <div className="pieces-item-preview">
                                  <img src={ord.image || '/assets/images/product_mug.jpg'} alt="Foto produk" />
                                  <div>
                                    <strong className="piece-title">{ord.itemsSummary || 'The Sunday Mug'}</strong>
                                    <span className="piece-variant">{ord.variantSummary || 'Batu Pasir & Gading'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="cell-total">Rp {((ord.grandTotal !== undefined ? ord.grandTotal : (ord.total + (ord.shippingFee || 0))) || 0).toLocaleString('id-ID')}</td>
                              <td className="cell-fulfillment">
                                <span className={`status-pill ${ord.fulfillment === 'SELESAI' ? 'pill-completed' : 'pill-processing'}`}>• {ord.fulfillment}</span>
                              </td>
                              <td className="cell-details" style={{ textAlign: 'right' }}>
                                <button onClick={() => setSelectedOrderModal(ord)} className="order-view-btn">LIHAT ›</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* BANNER PERAWATAN */}
                <div className="studio-care-guarantee-card">
                  <div className="care-guarantee-left">
                    <div className="care-guarantee-text">
                      <h4 className="care-title">Jaminan Kualitas &amp; Perawatan Keramik</h4>
                      <p className="care-body">Semua stoneware CLAYÉ diproses food-safe dan dibakar pada suhu 1240°C. Butuh panduan merawat bagian dasar unglazed atau penyimpanan jangka panjang?</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveMenu('care')} className="read-care-ritual-btn">BACA PANDUAN PERAWATAN</button>
                </div>
              </>
            )}

            {/* ============================================ */}
            {/* VIEW: PESANAN SAYA (orders) */}
            {/* ============================================ */}
            {activeMenu === 'orders' && (
              <div className="dashboard-section-block">
                <div className="dash-block-header">
                  <div>
                    <h2 className="dash-block-title">Pesanan Saya</h2>
                    <p className="dash-block-sub">Seluruh riwayat pesanan keramik dan status pengiriman Anda.</p>
                  </div>
                  <button onClick={() => openConcierge('Cek nomor resi pengiriman untuk pesanan aktif saya')} className="dash-text-action">LACAK RESI →</button>
                </div>

                <div className="patron-orders-filter-row">
                  <button className="patron-filter-chip active">Semua ({myOrders.length})</button>
                  <button className="patron-filter-chip">Diproses ({myOrders.filter(o => o.fulfillment !== 'Selesai').length})</button>
                  <button className="patron-filter-chip">Selesai ({myOrders.filter(o => o.fulfillment === 'Selesai').length})</button>
                </div>

                <div className="acquisitions-table-wrap">
                  {myOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FAF8F5', borderRadius: '6px', border: '1px dashed #DED8CF' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
                      <h3 style={{ fontSize: '1.15rem', color: '#262422', marginBottom: '0.35rem' }}>Belum Ada Riwayat Pesanan</h3>
                      <p style={{ fontSize: '0.85rem', color: '#8A857F', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
                        Pesanan keramik yang Anda beli akan tercatat di sini lengkap dengan nomor resi dan pelacakan pengiriman.
                      </p>
                      <button onClick={() => navigate('/katalog')} className="claye-terracotta-btn">
                        Mulai Belanja Keramik →
                      </button>
                    </div>
                  ) : (
                    <table className="claye-patron-table">
                      <thead>
                        <tr>
                          <th>NO. PESANAN</th>
                          <th>TANGGAL</th>
                          <th>PRODUK KERAMIK</th>
                          <th>TOTAL</th>
                          <th>STATUS PENGIRIMAN</th>
                          <th style={{ textAlign: 'right' }}>RINCIAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="cell-order-ref"><strong>{ord.id}</strong></td>
                            <td className="cell-date">{ord.date}</td>
                            <td className="cell-pieces">
                              <div className="pieces-item-preview">
                                <img src={ord.image || '/assets/images/product_mug.jpg'} alt="Foto produk" />
                                <div>
                                  <strong className="piece-title">{ord.itemsSummary || 'The Sunday Mug'}</strong>
                                  <span className="piece-variant">{ord.variantSummary || 'Batu Pasir & Gading'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="cell-total">Rp {((ord.grandTotal !== undefined ? ord.grandTotal : (ord.total + (ord.shippingFee || 0))) || 0).toLocaleString('id-ID')}</td>
                            <td className="cell-fulfillment">
                              <span className={`status-pill ${ord.fulfillment === 'SELESAI' ? 'pill-completed' : 'pill-processing'}`}>• {ord.fulfillment}</span>
                            </td>
                            <td className="cell-details" style={{ textAlign: 'right' }}>
                              <button onClick={() => setSelectedOrderModal(ord)} className="order-view-btn">LIHAT ›</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="explore-archive-bottom-btn">
                  <button onClick={() => openConcierge('Tampilkan seluruh arsip pesanan keramik tahun 2024-2026')} className="explore-archives-btn">
                    JELAJAHI SELURUH ARSIP PESANAN →
                  </button>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* VIEW: PROFIL SAYA (profile) */}
            {/* ============================================ */}
            {activeMenu === 'profile' && (
              <div className="dashboard-section-block">
                <div className="dash-block-header">
                  <div>
                    <h2 className="dash-block-title">Profil Saya</h2>
                    <p className="dash-block-sub">Perbarui informasi pribadi dan kontak akun Anda di sini.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="patron-profile-form-grid">
                    <div className="form-group-claye">
                      <label>Nama Panggilan</label>
                      <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required />
                    </div>
                    <div className="form-group-claye">
                      <label>Nama Lengkap</label>
                      <input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} required />
                    </div>
                    <div className="form-group-claye">
                      <label>Alamat Email</label>
                      <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} required />
                    </div>
                    <div className="form-group-claye">
                      <label>Nomor Telepon / WhatsApp</label>
                      <input type="tel" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} required />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button type="submit" className="claye-terracotta-btn" style={{ padding: '0.7rem 1.5rem', fontSize: '0.85rem' }}>Simpan Perubahan Profil</button>
                    <button type="button" onClick={() => showToast('Instruksi reset kata sandi dikirim ke email.', 'info')} className="panel-btn-ghost">Ubah Kata Sandi</button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================ */}
            {/* VIEW: BUKU ALAMAT (addresses) */}
            {/* ============================================ */}
            {activeMenu === 'addresses' && (
              <div className="dashboard-section-block">
                <div className="dash-block-header">
                  <div>
                    <h2 className="dash-block-title">Buku Alamat Pengiriman</h2>
                    <p className="dash-block-sub">Kelola alamat tujuan pengantaran kurir mandiri CLAYÉ di Kota Palembang.</p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="dash-text-action"
                    style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#B87355', fontWeight: 700 }}
                  >
                    + TAMBAH ALAMAT BARU
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(addresses || []).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#FCFAF7', border: '1px dashed #D8D2C6', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 1rem', color: '#6E6962', fontSize: '0.9rem' }}>Belum ada alamat pengiriman yang tersimpan.</p>
                      <button onClick={handleOpenAddAddress} className="claye-terracotta-btn" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                        + Tambah Alamat Sekarang
                      </button>
                    </div>
                  ) : (
                    (addresses || []).map((addr) => {
                      const matchedZone = SHIPPING_ZONES?.find(z => z.kecamatan?.includes(addr.kecamatan)) || SHIPPING_ZONES?.[0];
                      return (
                        <div key={addr.id} className={`address-card-item ${addr.isPrimary ? 'primary' : 'secondary'}`} style={{
                          border: addr.isPrimary ? '2px solid #B87355' : '1px solid #EAE6DF',
                          backgroundColor: addr.isPrimary ? '#FFFBF8' : '#FFFFFF',
                          borderRadius: '8px',
                          padding: '1.25rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '1rem', color: 'var(--color-charcoal)' }}>{addr.label || 'Alamat'}</strong>
                              {addr.isPrimary ? (
                                <span className="primary-dest-pill" style={{
                                  backgroundColor: '#EAF3E9', color: '#2E6930', border: '1px solid #C4DFC1',
                                  fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px'
                                }}>
                                  ✓ ALAMAT UTAMA (CHECKOUT)
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setPrimaryAddress(addr.id)}
                                  className="panel-btn-ghost"
                                  style={{
                                    fontSize: '0.74rem', padding: '3px 8px', color: '#B87355',
                                    border: '1px solid #E5C3B3', borderRadius: '4px', cursor: 'pointer', background: '#FFFFFF'
                                  }}
                                >
                                  Jadikan Utama
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditAddress(addr)}
                                className="panel-btn-primary"
                                style={{
                                  fontSize: '0.76rem', padding: '5px 12px', cursor: 'pointer',
                                  backgroundColor: '#24201D', color: '#FFFFFF', borderRadius: '4px', border: 'none'
                                }}
                              >
                                Edit
                              </button>
                              {!addr.isPrimary && (addresses || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => deleteAddress(addr.id)}
                                  style={{
                                    fontSize: '0.76rem', padding: '5px 10px', cursor: 'pointer',
                                    backgroundColor: 'transparent', color: '#DC2626', borderRadius: '4px',
                                    border: '1px solid #FCA5A5'
                                  }}
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: '0.88rem', color: '#4A4641', lineHeight: '1.65' }}>
                            <div>Penerima: <strong style={{ color: 'var(--color-charcoal)' }}>{addr.recipientName || currentUser.name}</strong> ({addr.phone || currentUser.phone || '-'})</div>
                            <div style={{ color: '#24201D', marginTop: '2px' }}>{addr.address || 'Belum ada detail nama jalan & nomor rumah'}</div>
                            {addr.patokan && (
                              <div style={{ fontSize: '0.8rem', color: '#8A857F' }}>Patokan: {addr.patokan}</div>
                            )}
                            <div style={{ fontSize: '0.82rem', color: '#6E6962', marginTop: '4px' }}>
                              Kec. {addr.kecamatan || 'Ilir Barat I'}, Kota Palembang {addr.postalCode || '30138'}
                              {matchedZone && (
                                <span style={{ marginLeft: '8px', color: '#B87355', fontWeight: 600 }}>
                                  ({matchedZone.label} — Ongkir COD Rp {matchedZone.price.toLocaleString('id-ID')})
                                </span>
                              )}
                            </div>
                          </div>

                          {addr.isPrimary && (
                            <div style={{
                              marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid #F3EBDD',
                              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#2E6930', fontWeight: 600
                            }}>
                              <span>🛵</span>
                              <span>Alamat ini otomatis terpasang saat Anda melakukan Checkout pesanan COD di CLAYÉ.</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* VIEW: DAFTAR FAVORIT (saved) */}
            {/* ============================================ */}
            {activeMenu === 'saved' && (
              <div className="dashboard-section-block">
                <div className="dash-block-header">
                  <div>
                    <h2 className="dash-block-title">Daftar Favorit ({savedProductsList.length})</h2>
                    <p className="dash-block-sub">Koleksi keramik yang Anda tandai untuk pesanan mendatang.</p>
                  </div>
                </div>

                {savedProductsList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-muted)' }}>
                    <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Belum ada keramik dalam daftar favorit Anda.</p>
                    <button onClick={() => navigate('/katalog')} className="claye-terracotta-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>Jelajahi Katalog →</button>
                  </div>
                ) : (
                  <div className="claye-curated-grid" style={{ marginTop: '1.5rem' }}>
                    {savedProductsList.map((item) => (
                      <div key={item.id} className="curated-product-card" onClick={() => viewProduct(item.id)}>
                        <div className="curated-img-wrapper">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="curated-card-info">
                          <div className="card-title-price-row">
                            <h3 className="curated-item-name">{item.name}</h3>
                            <span className="curated-item-price">Rp {item.price.toLocaleString('id-ID')}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(item.id, 1); }}
                            className="quick-add-pill-btn"
                            style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
                          >
                            Masukkan Keranjang
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================================ */}
            {/* VIEW: PANDUAN PERAWATAN (care) */}
            {/* ============================================ */}
            {activeMenu === 'care' && (
              <div className="dashboard-section-block">
                <div className="dash-block-header">
                  <div>
                    <h2 className="dash-block-title">Panduan Perawatan Keramik</h2>
                    <p className="dash-block-sub">Semua stoneware CLAYÉ dibakar pada suhu 1240°C dan diproses food-safe untuk ketahanan jangka panjang.</p>
                  </div>
                  <button onClick={() => openConcierge('Tanya lebih banyak tentang perawatan keramik CLAYÉ')} className="dash-text-action">TANYA TOKO →</button>
                </div>

                <div className="patron-care-grid">
                  <div className="patron-care-card">
                    <div className="patron-care-num">01</div>
                    <div className="patron-care-title">Pencucian Harian</div>
                    <p className="patron-care-body">Seluruh karya stoneware CLAYÉ aman untuk mesin cuci piring, namun mencuci manual dengan spons halus dan sabun ramah lingkungan sangat dianjurkan untuk merawat keindahan glasir.</p>
                  </div>
                  <div className="patron-care-card">
                    <div className="patron-care-num">02</div>
                    <div className="patron-care-title">Microwave &amp; Oven Aman</div>
                    <p className="patron-care-body">Keramik stoneware kami aman digunakan dalam microwave. Hindari penggunaan oven dengan perubahan suhu ekstrem yang tiba-tiba dari kondisi dingin.</p>
                  </div>
                  <div className="patron-care-card">
                    <div className="patron-care-num">03</div>
                    <div className="patron-care-title">Mencegah Thermal Shock</div>
                    <p className="patron-care-body">Hindari memindahkan keramik langsung dari kulkas ke pemanggang bersuhu tinggi dalam seketika. Biarkan adaptasi suhu secara bertahap.</p>
                  </div>
                  <div className="patron-care-card">
                    <div className="patron-care-num">04</div>
                    <div className="patron-care-title">Dasar Unglazed &amp; Patina Wabi-Sabi</div>
                    <p className="patron-care-body">Dasar yang dipoles diamond aman dari resapan air. Pastikan keramik kering sempurna sebelum ditumpuk. Patina alami yang muncul adalah tanda keindahan keramik handmade.</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem', background: '#FAF7F2', border: '1px solid #ECE4DA', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Ada pertanyaan tentang perawatan karya Anda?</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>Tim asisten kurasi siap menjawab pertanyaan spesifik Anda tentang glasir, penyimpanan, dan perawatan jangka panjang.</p>
                  </div>
                  <button onClick={() => openConcierge('Tanya lebih banyak tentang perawatan keramik')} className="claye-terracotta-btn" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Tanya Asisten Kurasi →</button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL: RINCIAN PESANAN */}
      {selectedOrderModal && (
        <div className="claye-modal-overlay" onClick={() => setSelectedOrderModal(null)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">ARSIP PESANAN PELANGGAN</span>
                <h3 className="modal-title">{selectedOrderModal.id}</h3>
              </div>
              <button onClick={() => setSelectedOrderModal(null)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="order-modal-details-grid">
                <div>
                  <span className="detail-tag">Tanggal Pesanan</span>
                  <p><strong>{selectedOrderModal.date}</strong></p>
                </div>
                <div>
                  <span className="detail-tag">Status Pengiriman</span>
                  <p><span className="status-pill pill-completed">• {selectedOrderModal.fulfillment}</span></p>
                </div>
                <div>
                  <span className="detail-tag">Nomor Resi</span>
                  <p><strong>{selectedOrderModal.trackingNumber}</strong></p>
                </div>
                <div>
                  <span className="detail-tag">Jasa Ekspedisi</span>
                  <p><strong>{selectedOrderModal.courier}</strong></p>
                </div>
              </div>

              <div className="order-modal-items-table">
                <h4>Daftar Produk Keramik</h4>
                {selectedOrderModal.items?.map((it, idx) => (
                  <div key={idx} className="modal-item-row">
                    <span>{it.name} ({it.glaze || 'Glasir Khusus'}) × {it.quantity}</span>
                    <strong>Rp {(it.price * it.quantity).toLocaleString('id-ID')}</strong>
                  </div>
                ))}
                <div className="modal-item-row" style={{ borderTop: '1px solid #EAE6DF', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <span>Ongkos Antar ({selectedOrderModal.courier || 'Antar Langsung Tim CLAYÉ'})</span>
                  <strong>Rp {(selectedOrderModal.shippingFee !== undefined ? selectedOrderModal.shippingFee : 10000).toLocaleString('id-ID')}</strong>
                </div>
                <div className="modal-item-row total-row">
                  <span>Total Pembayaran (COD)</span>
                  <strong style={{ fontSize: '1.2rem', color: '#24201D' }}>
                    Rp {((selectedOrderModal.grandTotal !== undefined ? selectedOrderModal.grandTotal : (selectedOrderModal.total + (selectedOrderModal.shippingFee || 0))) || 0).toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setSelectedOrderModal(null);
                  openConcierge(`Bantu saya melacak resi pengiriman ${selectedOrderModal.trackingNumber}`);
                }}
                className="btn-modal-action"
              >
                Lacak Status Ekspedisi →
              </button>
              <button onClick={() => setSelectedOrderModal(null)} className="btn-modal-cancel">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UBAH PROFIL */}
      {isEditProfileModal && (
        <div className="claye-modal-overlay" onClick={() => setIsEditProfileModal(false)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">DATA PRIBADI</span>
                <h3 className="modal-title">Ubah Profil Saya</h3>
              </div>
              <button onClick={() => setIsEditProfileModal(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="modal-body">
              <div className="form-group-claye">
                <label>Nama Panggilan</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Alamat Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-modal-action">
                  Simpan Perubahan
                </button>
                <button type="button" onClick={() => setIsEditProfileModal(false)} className="btn-modal-cancel">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INTERAKTIF: TAMBAH & EDIT ALAMAT PENGIRIMAN */}
      {editingAddress && (
        <div className="claye-modal-overlay" onClick={() => setEditingAddress(null)}>
          <div className="claye-modal-content" style={{ maxWidth: '580px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">PENGATURAN ALAMAT PENGIRIMAN</span>
                <h3 className="modal-title">{editingAddress.isNew ? 'Tambah Alamat Baru' : 'Edit Alamat Pengiriman'}</h3>
              </div>
              <button onClick={() => setEditingAddress(null)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveAddressSubmit}>
              <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                    LABEL ALAMAT *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    placeholder="Contoh: Rumah Pribadi, Kantor, Studio"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                      NAMA PENERIMA *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.recipientName}
                      onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                      placeholder="Nama lengkap penerima"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                      NO. WHATSAPP / TELEPON *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#4A4641' }}>
                        KECAMATAN DI PALEMBANG *
                      </label>
                    </div>
                    <select
                      value={addressForm.kecamatan}
                      onChange={(e) => setAddressForm({ ...addressForm, kecamatan: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1.5px solid #B87355', backgroundColor: '#FCFAF7', fontWeight: 600, color: '#24201D' }}
                    >
                      {PALEMBANG_KECAMATAN?.map(k => (
                        <option key={k.name} value={k.name}>
                          Kec. {k.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                      KOTA
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Kota Palembang"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6', backgroundColor: '#F3F0EA', color: '#6E6962', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                    ALAMAT LENGKAP (JALAN, NO. RUMAH, RT/RW, KELURAHAN) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kelurahan, blok perumahan..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6', resize: 'vertical', lineHeight: '1.55' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                      PATOKAN / LANDMARK (OPSIONAL)
                    </label>
                    <input
                      type="text"
                      value={addressForm.patokan}
                      onChange={(e) => setAddressForm({ ...addressForm, patokan: e.target.value })}
                      placeholder="Contoh: Depan masjid, pagar putih"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#4A4641', marginBottom: '4px' }}>
                      KODE POS
                    </label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      placeholder="30138"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '5px', border: '1px solid #D8D2C6' }}
                    />
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FCFAF7', padding: '12px 14px', borderRadius: '6px',
                  border: '1px solid #EAE6DF', display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <input
                    type="checkbox"
                    id="isPrimaryCheckbox"
                    checked={addressForm.isPrimary}
                    onChange={(e) => setAddressForm({ ...addressForm, isPrimary: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isPrimaryCheckbox" style={{ fontSize: '0.84rem', color: '#262422', cursor: 'pointer', margin: 0, fontWeight: 600 }}>
                    Jadikan sebagai Alamat Utama (Otomatis digunakan saat Checkout pesanan COD)
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '1rem 1.5rem', borderTop: '1px solid #EAE6DF' }}>
                <button type="button" onClick={() => setEditingAddress(null)} className="btn-modal-cancel" style={{ cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" className="btn-modal-action" style={{ cursor: 'pointer', backgroundColor: '#B87355', color: '#FFFFFF', border: 'none', padding: '9px 20px', borderRadius: '4px', fontWeight: 600 }}>
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PANDUAN PERAWATAN */}
      {careModalOpen && (
        <div className="claye-modal-overlay" onClick={() => setCareModalOpen(false)}>
          <div className="claye-modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">PANDUAN PERAWATAN KERAMIK</span>
                <h3 className="modal-title">Panduan Perawatan Keramik</h3>
              </div>
              <button onClick={() => setCareModalOpen(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="care-guide-step">
                <h4>1. Pencucian Harian</h4>
                <p>Seluruh karya stoneware CLAYÉ aman untuk mesin cuci piring, namun mencuci secara manual dengan spons halus dan sabun ramah lingkungan sangat dianjurkan untuk merawat keindahan glasir.</p>
              </div>
              <div className="care-guide-step" style={{ marginTop: '1rem' }}>
                <h4>2. Mencegah Perubahan Suhu Mendadak</h4>
                <p>Hindari memindahkan keramik langsung dari kulkas yang sangat dingin ke oven pemanggang bersuhu tinggi dalam seketika.</p>
              </div>
              <div className="care-guide-step" style={{ marginTop: '1rem' }}>
                <h4>3. Bagian Bawah Tanah Liat Mentah (Unglazed)</h4>
                <p>Dasar keramik yang telah dipoles diamond aman dari resapan air, namun pastikan keramik telah kering sempurna sebelum ditumpuk di dalam lemari.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setCareModalOpen(false);
                  openConcierge('Tanya lebih banyak tentang perawatan keramik');
                }}
                className="btn-modal-action"
              >
                Tanya Asisten Kurasi →
              </button>
              <button onClick={() => setCareModalOpen(false)} className="btn-modal-cancel">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

