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
      <div className="container">


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

        {/* TATA LETAK 2 KOLOM */}
        <div className="patron-dashboard-layout">
          {/* SIDEBAR AKUN */}
          <aside className="patron-sidebar-card">
            <div className="patron-profile-identity">
              <div className="patron-avatar-circle">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="patron-name-wrap">
                <h2 className="patron-display-name">{currentUser.name}</h2>
                <span className="patron-since-text">ANGGOTA SEJAK {currentUser.patronSince || '2024'}</span>
              </div>
            </div>

            <nav className="patron-nav-menu">
              <button
                className={`patron-nav-item ${activeMenu === 'overview' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('overview')}
              >
                <span className="pnav-text">Ringkasan Akun</span>
                {activeMenu === 'overview' && <span className="pnav-active-dot" />}
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'profile' ? 'is-active' : ''}`}
                onClick={() => { setActiveMenu('profile'); setIsEditProfileModal(true); }}
              >
                <span className="pnav-text">Profil Saya</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'orders' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('orders')}
              >
                <span className="pnav-text">Pesanan Saya</span>
                <span className="pnav-counter-pill">{orders.length + 2}</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'addresses' ? 'is-active' : ''}`}
                onClick={() => { setActiveMenu('addresses'); setIsAddressModal(true); }}
              >
                <span className="pnav-text">Buku Alamat</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'saved' ? 'is-active' : ''}`}
                onClick={() => setActiveMenu('saved')}
              >
                <span className="pnav-text">Daftar Favorit</span>
                <span className="pnav-counter-pill">{wishlist.length}</span>
              </button>

              <button
                className={`patron-nav-item ${activeMenu === 'care' ? 'is-active' : ''}`}
                onClick={() => setCareModalOpen(true)}
              >
                <span className="pnav-text">Panduan Perawatan</span>
              </button>

              <div className="pnav-divider" />

              <button
                className="patron-nav-item pnav-logout"
                onClick={logout}
              >
                <span className="pnav-text">Keluar dari Akun</span>
              </button>
            </nav>
          </aside>

          {/* KONTEN UTAMA AKUN */}
          <main className="patron-main-content">
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
                <div className="pstat-subtext">Dalam tahap inspeksi & pengemasan</div>
              </div>

              <div className="patron-stat-card">
                <div className="pstat-header">
                  <span className="pstat-label">SELESAI DIKIRIM</span>
                  <span className="pstat-icon check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                </div>
                <div className="pstat-big-num">4</div>
                <div className="pstat-subtext">Terkirim aman & terkurasi</div>
              </div>
            </div>

            {/* TAB DAFTAR FAVORIT JIKA DIPILIH */}
            {activeMenu === 'saved' && (
              <div className="dashboard-section-block">
                <div className="dash-block-header">
                  <div>
                    <h2 className="dash-block-title">Daftar Favorit ({savedProductsList.length})</h2>
                    <p className="dash-block-sub">Koleksi keramik yang Anda tandai untuk pesanan mendatang.</p>
                  </div>
                  <button onClick={() => setActiveMenu('overview')} className="dash-text-action">
                    Kembali ke Ringkasan →
                  </button>
                </div>

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
              </div>
            )}

            {/* TABEL PESANAN TERBARU */}
            <div className="dashboard-section-block">
              <div className="dash-block-header">
                <div>
                  <h2 className="dash-block-title">Riwayat Pesanan Terbaru</h2>
                  <p className="dash-block-sub">Pantau perjalanan pesanan keramik Anda dari studio pembakaran hingga tiba di rumah.</p>
                </div>
                <button
                  onClick={() => openConcierge('Cek nomor resi pengiriman untuk pesanan aktif saya')}
                  className="dash-text-action"
                >
                  LIHAT SEMUA RIWAYAT →
                </button>
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
                        <td className="cell-order-ref">
                          <strong>{ord.id}</strong>
                        </td>
                        <td className="cell-date">
                          {ord.date}
                        </td>
                        <td className="cell-pieces">
                          <div className="pieces-item-preview">
                            <img src={ord.image || '/assets/images/product_mug.jpg'} alt="Foto produk" />
                            <div>
                              <strong className="piece-title">{ord.itemsSummary || 'The Sunday Mug'}</strong>
                              <span className="piece-variant">{ord.variantSummary || 'Batu Pasir & Gading'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="cell-total">
                          Rp {ord.total.toLocaleString('id-ID')}
                        </td>
                        <td className="cell-fulfillment">
                          <span className={`status-pill ${ord.fulfillment === 'SELESAI' ? 'pill-completed' : 'pill-processing'}`}>
                            • {ord.fulfillment}
                          </span>
                        </td>
                        <td className="cell-details" style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedOrderModal(ord)}
                            className="order-view-btn"
                          >
                            LIHAT ›
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="explore-archive-bottom-btn">
                <button
                  onClick={() => openConcierge('Tampilkan seluruh arsip pesanan keramik tahun 2024-2026')}
                  className="explore-archives-btn"
                >
                  JELAJAHI SELURUH ARSIP PESANAN →
                </button>
              </div>
            </div>

            {/* 2 KARTU INFORMASI: DATA PRIBADI & ALAMAT */}
            <div className="patron-twin-cards-grid">
              {/* DATA PRIBADI */}
              <div className="patron-info-panel">
                <div className="panel-badge-row">
                  <span className="panel-label">DATA PRIBADI</span>
                </div>
                <h3 className="panel-heading">Informasi Akun</h3>
                <p className="panel-desc">Kredensial kontak utama yang terhubung dengan akun Anda.</p>

                <div className="panel-fields-list">
                  <div className="field-group">
                    <span className="field-label">NAMA LENGKAP</span>
                    <strong className="field-val">{currentUser.fullName || currentUser.name}</strong>
                  </div>
                  <div className="field-group">
                    <span className="field-label">ALAMAT EMAIL</span>
                    <strong className="field-val">{currentUser.email}</strong>
                  </div>
                  <div className="field-group">
                    <span className="field-label">NOMOR TELEPON</span>
                    <strong className="field-val">{currentUser.phone}</strong>
                  </div>
                </div>

                <div className="panel-actions-row">
                  <button
                    onClick={() => setIsEditProfileModal(true)}
                    className="panel-btn-primary"
                  >
                    UBAH DATA
                  </button>
                  <button
                    onClick={() => showToast('Instruksi pengaturan ulang kata sandi dikirim ke email.', 'info')}
                    className="panel-btn-ghost"
                  >
                    Ubah Kata Sandi
                  </button>
                </div>
              </div>

              {/* ALAMAT PENGIRIMAN */}
              <div className="patron-info-panel">
                <div className="panel-badge-row">
                  <span className="panel-label">TUJUAN PENGIRIMAN</span>
                  <span className="primary-dest-pill">Utama</span>
                </div>
                <h3 className="panel-heading">Alamat Pengiriman</h3>
                <p className="panel-desc">Alamat tujuan untuk ekspedisi dan kemasan keramik aman.</p>

                <div className="destination-address-box">
                  <div className="dest-title-row">
                    <strong>Rumah Pribadi</strong>
                    <span className="dest-country">{currentUser.country || 'Indonesia'}</span>
                  </div>
                  <p className="dest-recipient">Penerima: {currentUser.name}</p>
                  <p className="dest-street">
                    {currentUser.address}
                  </p>
                  <p className="dest-city">
                    {currentUser.city}, {currentUser.province || 'Jawa Barat'} {currentUser.postalCode}
                  </p>
                  <p className="dest-phone">
                    Telp: {currentUser.phone}
                  </p>
                </div>

                <div className="panel-actions-row">
                  <button
                    onClick={() => setIsAddressModal(true)}
                    className="panel-btn-primary"
                  >
                    KELOLA ALAMAT (2)
                  </button>
                  <button
                    onClick={() => setIsAddressModal(true)}
                    className="panel-btn-ghost"
                  >
                    + Tambah Alamat Baru
                  </button>
                </div>
              </div>
            </div>

            {/* JAMINAN PERAWATAN KERAMIK */}
            <div className="studio-care-guarantee-card">
              <div className="care-guarantee-left">
                <div className="care-guarantee-text">
                  <h4 className="care-title">Jaminan Kualitas & Perawatan Studio</h4>
                  <p className="care-body">
                    Semua stoneware CLAYÉ diproses food-safe dan dibakar pada suhu 1240°C. Butuh panduan merawat bagian dasar unglazed atau penyimpanan jangka panjang?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCareModalOpen(true)}
                className="read-care-ritual-btn"
              >
                BACA PANDUAN PERAWATAN
              </button>
            </div>
          </main>
        </div>
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
