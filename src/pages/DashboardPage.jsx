import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function DashboardPage() {
  const { user, login, orders, wishlist, products, logout, updateProfile, navigate, openConcierge, showToast, viewProduct, addToCart } = useShop();

  const [activeMenu, setActiveMenu] = useState('overview');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [isEditProfileModal, setIsEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user ? user.name : 'Arumi',
    fullName: user ? user.fullName : 'Arumi',
    email: user ? user.email : 'arumi@example.com',
    phone: user ? user.phone : '+62 812-3456-7890',
    address: user ? user.address : 'Jl. Bukit Dago Utara No. 18, Coblong',
    city: user ? user.city : 'Bandung',
    postalCode: user ? user.postalCode : '40135'
  });

  const [isAddressModal, setIsAddressModal] = useState(false);
  const [careModalOpen, setCareModalOpen] = useState(false);

  const currentUser = user || {
    name: 'Arumi',
    fullName: 'Arumi',
    email: 'arumi@example.com',
    phone: '+62 812-3456-7890',
    address: 'Jl. Bukit Dago Utara No. 18, Coblong',
    city: 'Bandung',
    postalCode: '40135',
    patronSince: '2024',
    cohort: 'Pelanggan Tetap'
  };

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
    fullName: user ? (user.fullName || 'Admin CLAYÉ Atelier') : 'Admin CLAYÉ Atelier',
    email: user ? user.email : 'admin@claye.id',
    phone: user ? (user.phone || '+62 811-2233-4455') : '+62 811-2233-4455',
    address: user ? (user.address || 'Studio CLAYÉ, Jl. Rancabentang No. 29, Ciumbuleuit') : 'Studio CLAYÉ, Jl. Rancabentang No. 29, Ciumbuleuit',
    city: user ? (user.city || 'Bandung') : 'Bandung',
    province: 'Jawa Barat',
    postalCode: '40142',
    roleTitle: 'Master Ceramist & Studio Administrator',
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
                <span className="patron-since-text">ADMINISTRATOR ATELIER</span>
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
                <span>Data Studio & Atelier</span>
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
                  <span className="patron-dot" style={{ backgroundColor: 'var(--color-terracotta)' }}>•</span> AKUN ADMINISTRATOR & ATELIER
                </div>
                <h1 className="account-main-title">Akun Admin Saya</h1>
                <p className="account-welcome-sub">
                  Selamat datang di panel akun Administrator Studio CLAYÉ. Kelola informasi profil pengelola, kontak workshop, dan preferensi operasional atelier.
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
                        Data identitas ini digunakan untuk otentikasi login, tanda tangan resi pesanan, dan penanggung jawab atelier.
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
                      <label>PERAN / SPESIALISASI ATELIER</label>
                      <input
                        type="text"
                        value={adminProfileData.roleTitle}
                        onChange={(e) => setAdminProfileData({ ...adminProfileData, roleTitle: e.target.value })}
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label>ALAMAT WORKSHOP STUDIO DI BANDUNG</label>
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
                      <h2 className="patron-section-heading">Data Studio & Workshop CLAYÉ</h2>
                      <p className="patron-section-sub">
                        Informasi operasional studio resmi yang terhubung dengan sistem pesanan pelanggan.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                        📍 Lokasi Workshop & Atelier
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A645D', lineHeight: '1.5' }}>
                        Studio CLAYÉ, Jl. Rancabentang No. 29, Dago Pakar, Ciumbuleuit, Bandung, Jawa Barat 40142.
                      </p>
                    </div>

                    <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>
                        🏺 Studio Galeri & Atelier
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A645D', lineHeight: '1.5' }}>
                        Studio pembuatan keramik handmade stoneware dengan kurasi material mineral alami dan glasir food-safe.
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
                        Status kesehatan operasional atelier saat ini.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>KARYA DI ETALASE</span>
                      <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0.3rem 0' }}>
                        {products.length} Karya
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#5E7958' }}>✓ 100% Siap Dikirim</span>
                    </div>

                    <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>TOTAL PESANAN TERCATAT</span>
                      <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0.3rem 0' }}>
                        86 Paket
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)' }}>Omset Rp 12.500.000</span>
                    </div>

                    <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '6px', border: '1px solid #EAE4DC' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C847B', letterSpacing: '0.06em' }}>KOLEKTOR TERDAFTAR</span>
                      <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0.3rem 0' }}>
                        58 Kolektor
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>+12 kolektor baru bulan ini</span>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </span>
                <span className="pnav-text">Ringkasan Akun</span>
                {activeMenu === 'overview' && <span className="pnav-active-dot" />}
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'orders' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('orders')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </span>
                <span className="pnav-text">Pesanan Saya</span>
                <span className="pnav-counter-pill">{orders.length + 2}</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'saved' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('saved')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <span className="pnav-text">Profil Saya</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'addresses' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('addresses')}
              >
                <span className="pnav-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
                <span className="pnav-text">Keluar dari Akun</span>
              </button>
            </div>
          </nav>

          {/* WIDGET BANTUAN */}
          <div className="patron-sidebar-help-widget" style={{ marginTop: '1.25rem' }}>
            <div className="phelp-badge">Studio Concierge</div>
            <span className="phelp-title">Butuh bantuan pesanan?</span>
            <p className="phelp-desc">Tim concierge studio siap membantu Anda melacak resi dan pertanyaan lainnya.</p>
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
                    <div className="pstat-subtext">Di berbagai batch pembakaran studio</div>
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
                      <p className="dash-block-sub">Pantau perjalanan pesanan keramik Anda dari studio pembakaran hingga tiba di rumah.</p>
                    </div>
                    <button onClick={() => setActiveMenu('orders')} className="dash-text-action">LIHAT SEMUA →</button>
                  </div>

                  <div className="acquisitions-table-wrap">
                    <table className="claye-patron-table">
                      <thead>
                        <tr>
                          <th>NO. PESANAN</th>
                          <th>TANGGAL</th>
                          <th>KARYA KERAMIK</th>
                          <th>TOTAL</th>
                          <th>STATUS</th>
                          <th style={{ textAlign: 'right' }}>RINCIAN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 3).map((ord) => (
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
                            <td className="cell-total">Rp {ord.total.toLocaleString('id-ID')}</td>
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
                  </div>
                </div>

                {/* BANNER PERAWATAN */}
                <div className="studio-care-guarantee-card">
                  <div className="care-guarantee-left">
                    <div className="care-guarantee-text">
                      <h4 className="care-title">Jaminan Kualitas &amp; Perawatan Studio</h4>
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
                  <button className="patron-filter-chip active">Semua ({orders.length + 2})</button>
                  <button className="patron-filter-chip">Diproses (1)</button>
                  <button className="patron-filter-chip">Selesai ({orders.length + 1})</button>
                </div>

                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table">
                    <thead>
                      <tr>
                        <th>NO. PESANAN</th>
                        <th>TANGGAL</th>
                        <th>KARYA KERAMIK</th>
                        <th>TOTAL</th>
                        <th>STATUS PENGIRIMAN</th>
                        <th style={{ textAlign: 'right' }}>RINCIAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
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
                          <td className="cell-total">Rp {ord.total.toLocaleString('id-ID')}</td>
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
                    <h2 className="dash-block-title">Buku Alamat</h2>
                    <p className="dash-block-sub">Kelola alamat pengiriman untuk kemasan keramik Anda.</p>
                  </div>
                  <button onClick={() => showToast('Formulir alamat baru siap diisi.', 'info')} className="dash-text-action">+ TAMBAH ALAMAT</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="address-card-item primary">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Rumah Pribadi</strong>
                        <span className="primary-dest-pill" style={{ marginLeft: '0.65rem' }}>ALAMAT UTAMA</span>
                      </div>
                      <button onClick={() => setIsAddressModal(true)} className="panel-btn-primary" style={{ fontSize: '0.78rem' }}>Edit</button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
                      Penerima: <strong style={{ color: 'var(--color-charcoal)' }}>{currentUser.name}</strong><br />
                      {currentUser.address}<br />
                      {currentUser.city}, {currentUser.province || 'Jawa Barat'} {currentUser.postalCode}<br />
                      Telp: {currentUser.phone}
                    </p>
                  </div>

                  <div className="address-card-item secondary">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>Kantor / Studio Bandung</strong>
                      <button onClick={() => showToast('Alamat kantor ditetapkan sebagai alamat utama.', 'success')} className="panel-btn-ghost" style={{ fontSize: '0.78rem' }}>Jadikan Utama</button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: '1.6' }}>
                      Jl. Riau No. 54, Citarum, Bandung 40115<br />
                      Nomor Telepon: +62 811-2233-4455
                    </p>
                  </div>
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
                  <button onClick={() => openConcierge('Tanya lebih banyak tentang perawatan keramik CLAYÉ')} className="dash-text-action">TANYA STUDIO →</button>
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
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>Tim studio siap menjawab pertanyaan spesifik Anda tentang glasir, penyimpanan, dan perawatan jangka panjang.</p>
                  </div>
                  <button onClick={() => openConcierge('Tanya lebih banyak tentang perawatan keramik')} className="claye-terracotta-btn" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Tanya Asisten Studio →</button>
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
                <span className="modal-subtitle">ARSIP PESANAN STUDIO</span>
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
                <h4>Daftar Karya Keramik</h4>
                {selectedOrderModal.items?.map((it, idx) => (
                  <div key={idx} className="modal-item-row">
                    <span>{it.name} ({it.glaze || 'Glasir Khusus'}) × {it.quantity}</span>
                    <strong>Rp {(it.price * it.quantity).toLocaleString('id-ID')}</strong>
                  </div>
                ))}
                <div className="modal-item-row" style={{ borderTop: '1px solid #EAE6DF', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <span>Ongkos Kirim (Proteksi Kemasan Ekstra)</span>
                  <strong>Rp 15.000</strong>
                </div>
                <div className="modal-item-row total-row">
                  <span>Total Pembayaran</span>
                  <strong style={{ fontSize: '1.2rem', color: '#24201D' }}>
                    Rp {(selectedOrderModal.total + 15000).toLocaleString('id-ID')}
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

      {/* MODAL: KELOLA ALAMAT */}
      {isAddressModal && (
        <div className="claye-modal-overlay" onClick={() => setIsAddressModal(false)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">TUJUAN PENGIRIMAN</span>
                <h3 className="modal-title">Kelola Alamat Pengiriman</h3>
              </div>
              <button onClick={() => setIsAddressModal(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="address-card-item primary">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong>Rumah Pribadi (Alamat Utama)</strong>
                  <span className="primary-dest-pill">Aktif</span>
                </div>
                <p>{currentUser.address}, {currentUser.city}, {currentUser.postalCode}</p>
                <p>Nomor Telepon: {currentUser.phone}</p>
              </div>

              <div className="address-card-item secondary" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong>Kantor / Studio Bandung</strong>
                  <button
                    onClick={() => showToast('Alamat kantor ditetapkan sebagai alamat utama.', 'success')}
                    style={{ background: 'none', border: 'none', color: '#B87355', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Jadikan Utama
                  </button>
                </div>
                <p>Jl. Riau No. 54, Citarum, Bandung 40115</p>
                <p>Nomor Telepon: +62 811-2233-4455</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  showToast('Formulir alamat baru siap diisi.', 'info');
                  setIsAddressModal(false);
                }}
                className="btn-modal-action"
              >
                + Tambah Alamat Baru
              </button>
              <button onClick={() => setIsAddressModal(false)} className="btn-modal-cancel">
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PANDUAN PERAWATAN */}
      {careModalOpen && (
        <div className="claye-modal-overlay" onClick={() => setCareModalOpen(false)}>
          <div className="claye-modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">PANDUAN STUDIO</span>
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
                Tanya Asisten Studio →
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
