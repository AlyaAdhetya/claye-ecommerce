import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function AdminPage() {
  const { products, addProduct, deleteProduct, showToast, openConcierge, user, login, logout, navigate } = useShop();

  const [activeSidebarNav, setActiveSidebarNav] = useState('overview');
  const [chartRange, setChartRange] = useState('7d');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inspectOrderData, setInspectOrderData] = useState(null);

  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Cangkir & Mug');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  const [adminOrders, setAdminOrders] = useState([
    {
      id: '#CLY-2026-021',
      patron: 'Nadia Putri',
      initials: 'NP',
      city: 'Jakarta Selatan',
      date: '20 Okt 2026',
      total: 250000,
      paymentStatus: 'Lunas',
      fulfillment: 'Diproses'
    },
    {
      id: '#CLY-2026-022',
      patron: 'Rania Putri',
      initials: 'RP',
      city: 'Bandung Barat',
      date: '21 Okt 2026',
      total: 125000,
      paymentStatus: 'Lunas',
      fulfillment: 'Selesai'
    },
    {
      id: '#CLY-2026-023',
      patron: 'Alya Safitri',
      initials: 'AS',
      city: 'Surabaya Timur',
      date: '22 Okt 2026',
      total: 300000,
      paymentStatus: 'Menunggu',
      fulfillment: 'Menunggu Pembayaran'
    },
    {
      id: '#CLY-2026-024',
      patron: 'Dinda Maharani',
      initials: 'DM',
      city: 'Denpasar, Bali',
      date: '23 Okt 2026',
      total: 150000,
      paymentStatus: 'Lunas',
      fulfillment: 'Diproses'
    }
  ]);

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
      description: newProdDesc || 'Dibentuk di atas roda putar menggunakan glasir mineral alami dan dibakar pada suhu 1240°C di studio Bandung kami.',
      badge: 'baru',
      stock: 12,
      image: '/assets/images/product_mug.jpg'
    });

    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdSubtitle('');
    setNewProdDesc('');
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
              <span className="badge-dot">•</span> AKSES KHUSUS ADMIN
            </div>

            <h2 className="auth-main-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Portal Admin
            </h2>

            <p className="auth-lead-sub" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              {user ? (
                <>Anda saat ini masuk sebagai <strong>{user.name}</strong> dengan peran <em>{user.roleName || 'Pelanggan'}</em>. Halaman ini khusus untuk Admin studio CLAYÉ.</>
              ) : (
                <>Panel kontrol ini memuat pengaturan studio, pemantauan pesanan, dan inventaris. Silakan masuk dengan akun Admin.</>
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => login('admin@claye.id', 'atelier2026', 'admin')}
                className="claye-terracotta-btn"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                Masuk sebagai Admin →
              </button>

              <button
                onClick={() => navigate('/login')}
                className="btn-modal-cancel"
                style={{ width: '100%' }}
              >
                Pilih Akun / Halaman Login Pengguna
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

  return (
    <div className="claye-admin-app-container">
      {/* 2-KOLOM TATA LETAK ADMIN */}
      <div className="admin-page-grid">
        {/* SIDEBAR OPERASIONAL */}
        <aside className="admin-sidebar-menu">
          <div className="sidebar-group">
            <span className="sidebar-group-title">OPERASIONAL ATELIER</span>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('overview')}
            >
              Ringkasan Studio
            </button>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('orders')}
            >
              Pesanan Pelanggan
            </button>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('inventory')}
            >
              Inventaris Batch
            </button>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'glazes' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('glazes')}
            >
              Glasir & Koleksi
            </button>
          </div>

          <div className="sidebar-group" style={{ marginTop: '1.5rem' }}>
            <span className="sidebar-group-title">PELANGGAN & KERAJINAN</span>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'collectors' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('collectors')}
            >
              Kolektor & Pelanggan
            </button>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'yield' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('yield')}
            >
              Analisis Performa
            </button>
            <button
              className={`sidebar-nav-item ${activeSidebarNav === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSidebarNav('settings')}
            >
              Pengaturan Studio
            </button>
          </div>

          {/* WIDGET STATUS KILN */}
          <div className="admin-kiln-status-widget">
            <div className="kiln-status-header">
              <span className="status-label">STATUS KILN</span>
              <span className="firing-tag">PEMBAKARAN 1260°C</span>
            </div>
            <div className="kiln-batch-info">
              Batch #04 Glasir Cone 10
            </div>
          </div>
        </aside>

        {/* KONTEN UTAMA CONTROL PLANE */}
        <main className="admin-main-viewport">
          {/* HEADER KONTROL ATELIER */}
          <div className="control-plane-header-bar">
            <div>
              <div className="atelier-control-plane-badge">
                <span className="badge-dot">•</span> PANEL KONTROL ATELIER
              </div>
              <h1 className="admin-title-serif">Dashboard Admin</h1>
              <p className="admin-subtitle-desc">
                Kelola inventaris studio, pantau proses pembakaran kiln, lacak pengiriman pesanan, dan rawat koleksi keramik.
              </p>
            </div>

            <div className="control-plane-actions-row">
              <button
                onClick={() => openConcierge('Buka monitor suhu kiln batch #14 dan estimasi cooling down')}
                className="btn-admin-dispatch"
              >
                Pengiriman Kiln Batch #14
              </button>
              <button
                onClick={() => showToast('Laporan penjualan studio (.CSV) berhasil diekspor.', 'success')}
                className="btn-admin-export"
              >
                Ekspor Laporan
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-admin-new-drop"
              >
                + Tambah Produk Baru
              </button>
            </div>
          </div>

          {/* 4 KARTU METRIK UTAMA */}
          <div className="admin-metrics-row">
            {/* 1. TOTAL PENDAPATAN */}
            <div className="admin-metric-card">
              <div className="metric-header-row">
                <span className="metric-title">TOTAL PENDAPATAN</span>
              </div>
              <div className="metric-primary-val">Rp12.500.000</div>
              <div className="metric-trend-positive">
                +14.2% <span className="trend-text">vs bulan lalu</span>
              </div>
            </div>

            {/* 2. TOTAL PESANAN */}
            <div className="admin-metric-card">
              <div className="metric-header-row">
                <span className="metric-title">TOTAL PESANAN</span>
              </div>
              <div className="metric-primary-val">86 <span className="val-unit">paket</span></div>
              <div className="metric-alert-pill">
                8 menunggu pengemasan
              </div>
            </div>

            {/* 3. EDISI AKTIF */}
            <div className="admin-metric-card">
              <div className="metric-header-row">
                <span className="metric-title">EDISI AKTIF</span>
              </div>
              <div className="metric-primary-val">24 <span className="val-unit">karya</span></div>
              <div className="metric-alert-pill low-stock">
                3 stok menipis di studio
              </div>
            </div>

            {/* 4. TOTAL PELANGGAN */}
            <div className="admin-metric-card">
              <div className="metric-header-row">
                <span className="metric-title">TOTAL PELANGGAN</span>
              </div>
              <div className="metric-primary-val">58 <span className="val-unit">kolektor</span></div>
              <div className="metric-trend-positive">
                +12 pelanggan baru minggu ini
              </div>
            </div>
          </div>

          {/* 3 AKSI CEPAT */}
          <div className="admin-quick-actions-grid">
            <div className="quick-action-card" onClick={() => setIsAddModalOpen(true)}>
              <div>
                <strong>Tambah Produk Baru</strong>
                <p>Buat edisi glasir & wadah stoneware baru</p>
              </div>
              <span className="quick-action-arrow">›</span>
            </div>

            <div className="quick-action-card" onClick={() => setActiveSidebarNav('orders')}>
              <div>
                <strong>Kelola Pesanan</strong>
                <p>4 pesanan siap kirim langsung dari kiln</p>
              </div>
              <span className="quick-action-arrow">›</span>
            </div>

            <div className="quick-action-card" onClick={() => showToast('Membuka direktori 58 pelanggan kolektor CLAYÉ.', 'info')}>
              <div>
                <strong>Lihat Kolektor</strong>
                <p>Daftar anggota & pratinjau khusus kolektor</p>
              </div>
              <span className="quick-action-arrow">›</span>
            </div>
          </div>

          {/* TAMPILAN INVENTARIS BATCH (JIKA DIPILIH) */}
          {activeSidebarNav === 'inventory' && (
            <div className="admin-section-container" style={{ marginBottom: '2rem' }}>
              <div className="admin-section-top">
                <div>
                  <h3 className="section-serif-heading">Inventaris Keramik Studio ({products.length} Produk)</h3>
                  <p className="section-subtext">Kelola stok langsung, edisi glasir, dan ketersediaan keramik.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-admin-new-drop">
                  + Tambah Keramik Baru
                </button>
              </div>

              <div className="acquisitions-table-wrap" style={{ marginTop: '1rem' }}>
                <table className="claye-patron-table">
                  <thead>
                    <tr>
                      <th>PRODUK</th>
                      <th>KATEGORI</th>
                      <th>HARGA</th>
                      <th>STOK</th>
                      <th>EDISI</th>
                      <th style={{ textAlign: 'right' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="cell-pieces">
                          <div className="pieces-item-preview">
                            <img src={p.image} alt={p.name} />
                            <div>
                              <strong className="piece-title">{p.name}</strong>
                              <span className="piece-variant">{p.subtitle}</span>
                            </div>
                          </div>
                        </td>
                        <td>{p.category}</td>
                        <td>Rp {p.price.toLocaleString('id-ID')}</td>
                        <td><strong>{p.stock} pcs</strong></td>
                        <td><span className="status-pill pill-processing">{p.badge || 'Studio'}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.85rem' }}
                            title="Hapus produk"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2-KOLOM: SALES OVERVIEW & KILN CRAFT FOCUS */}
          <div className="admin-trajectory-split-grid">
            {/* KIRI: GRAFIK PENJUALAN STUDIO */}
            <div className="admin-chart-panel">
              <div className="chart-panel-header">
                <div>
                  <span className="chart-panel-tag">PERFORMA PENJUALAN</span>
                  <h3 className="chart-panel-title">Ringkasan Penjualan</h3>
                  <p className="chart-panel-sub">Grafik pendapatan harian dan arus pengiriman pesanan studio</p>
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

              {/* 3 METRIK ATAS GRAFIK */}
              <div className="chart-metrics-row">
                <div className="cmetric-col">
                  <span className="cmetric-label">RATA-RATA PENGIRIMAN HARIAN</span>
                  <strong className="cmetric-val">Rp1.785.000</strong>
                </div>
                <div className="cmetric-col">
                  <span className="cmetric-label">PUNCAK PENJUALAN</span>
                  <strong className="cmetric-val">Sabtu (Rp2.8M)</strong>
                </div>
                <div className="cmetric-col">
                  <span className="cmetric-label">KEBERHASILAN PEMBAKARAN</span>
                  <strong className="cmetric-val">94.8% Sukses</strong>
                </div>
              </div>

              {/* KURVA SVG GRAFIK PENJUALAN */}
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

                  {/* Tooltip Jumat */}
                  <g transform="translate(345, 12)">
                    <rect width="105" height="26" rx="4" fill="#24201D" />
                    <text x="52" y="11" fill="#FFFFFF" fontSize="6.5" textAnchor="middle" fontWeight="bold">
                      JUMAT 21 OKT • 18 PESANAN
                    </text>
                    <text x="52" y="21" fill="#EAE6DF" fontSize="7.5" textAnchor="middle" fontWeight="bold">
                      Rp2.400.000
                    </text>
                  </g>

                  {/* Label Hari */}
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
                <span className="focus-tag">FOKUS PEMBAKARAN KILN</span>
                <span className="limited-series-pill">EDISI TERBATAS</span>
              </div>

              <div className="focus-image-frame">
                <img
                  src="/assets/images/product_bowl.jpg"
                  alt="Wabi Matcha Chawan Vessel"
                  className="focus-img"
                />
                <div className="focus-overlay-content">
                  <span className="drop-edition-label">EDISI DROP 04</span>
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
                  <strong className="fspec-val">Stoneware Putih Sukabumi</strong>
                </div>
                <div className="fspec-row">
                  <span className="fspec-key">Formulasi Glasir</span>
                  <strong className="fspec-val">Abu Kayu & Besi Matte</strong>
                </div>
              </div>

              <div className="focus-health-footer">
                <div className="health-indicator-dot" />
                <span className="health-label">Kesehatan Inventaris</span>
                <strong className="health-status-text">OPTIMAL</strong>
              </div>
            </div>
          </div>

          {/* TABEL PESANAN TERBARU (ADMIN) */}
          <div className="admin-section-container">
            <div className="admin-section-top">
              <div className="section-title-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 className="section-serif-heading">Pesanan Terbaru</h3>
                  <span className="total-recorded-badge">86 total tercatat</span>
                </div>
                <p className="section-subtext">
                  Transaksi langsung studio dan pengiriman paket pelanggan secara real-time
                </p>
              </div>

              <button
                onClick={() => openConcierge('Tampilkan seluruh 86 daftar pesanan atelier')}
                className="view-all-orders-action"
              >
                Lihat Semua Pesanan →
              </button>
            </div>

            <div className="acquisitions-table-wrap">
              <table className="claye-patron-table admin-orders-table">
                <thead>
                  <tr>
                    <th>ID PESANAN</th>
                    <th>PELANGGAN</th>
                    <th>TANGGAL PESAN</th>
                    <th>TOTAL BIAYA</th>
                    <th>STATUS BAYAR</th>
                    <th>STATUS PENGIRIMAN</th>
                    <th style={{ textAlign: 'right' }}>TINDAKAN</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="cell-order-ref">
                        <strong>{ord.id}</strong>
                      </td>
                      <td className="cell-collector-patron">
                        <div className="patron-badge-cell">
                          <span className="patron-circle-avatar">{ord.initials}</span>
                          <div>
                            <strong>{ord.patron}</strong>
                            <span className="patron-location">{ord.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="cell-date">
                        {ord.date}
                      </td>
                      <td className="cell-total">
                        Rp {ord.total.toLocaleString('id-ID')}
                      </td>
                      <td className="cell-payment-status">
                        <span className={`status-pill ${ord.paymentStatus === 'Lunas' ? 'pill-completed' : 'pill-pending'}`}>
                          • {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="cell-fulfillment">
                        <span className={`status-pill ${ord.fulfillment === 'Selesai' ? 'pill-completed' : ord.fulfillment === 'Diproses' ? 'pill-processing' : 'pill-awaiting'}`}>
                          • {ord.fulfillment}
                        </span>
                      </td>
                      <td className="cell-action" style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setInspectOrderData(ord)}
                          className="admin-inspect-btn"
                        >
                          Periksa →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-orders-table-footer">
              <div className="kraft-seal-note">
                <span className="check-icon-circle">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                Seluruh pengiriman dikemas rapi menggunakan kertas daur ulang unbleached & segel lilin studio.
              </div>
              <div className="showing-dispatches-counter">
                Menampilkan 4 dari 86 paket pengiriman
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: INPUT PRODUK KERAMIK BARU */}
      {isAddModalOpen && (
        <div className="claye-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">REGISTRASI PRODUK STUDIO</span>
                <h3 className="modal-title">+ Tambah Produk Keramik Baru</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-body">
              <div className="form-group-claye">
                <label>Nama Karya / Produk *</label>
                <input
                  type="text"
                  placeholder="contoh: Kyoto Pourer Vessel"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Keterangan Warna & Tekstur Glasir</label>
                <input
                  type="text"
                  placeholder="contoh: Stoneware pasir alami dengan glasir abu kayu"
                  value={newProdSubtitle}
                  onChange={(e) => setNewProdSubtitle(e.target.value)}
                />
              </div>

              <div className="checkout-form-row">
                <div className="form-group-claye">
                  <label>Kategori</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                  >
                    <option value="Cangkir & Mug">Cangkir & Mug</option>
                    <option value="Mangkuk">Mangkuk</option>
                    <option value="Peralatan Makan">Peralatan Makan</option>
                    <option value="Vas">Vas</option>
                    <option value="Kopi & Teh">Kopi & Teh</option>
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
                <label>Deskripsi & Catatan Pembakaran Kiln</label>
                <textarea
                  rows="3"
                  placeholder="Dibentuk di atas roda putar menggunakan tanah liat alami..."
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

      {/* MODAL: INSPEKSI PESANAN */}
      {inspectOrderData && (
        <div className="claye-modal-overlay" onClick={() => setInspectOrderData(null)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">INSPEKSI STATUS PESANAN</span>
                <h3 className="modal-title">{inspectOrderData.id}</h3>
              </div>
              <button onClick={() => setInspectOrderData(null)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="order-modal-details-grid">
                <div>
                  <span className="detail-tag">Pelanggan Kolektor</span>
                  <p><strong>{inspectOrderData.patron}</strong> ({inspectOrderData.city})</p>
                </div>
                <div>
                  <span className="detail-tag">Tanggal Pesan</span>
                  <p><strong>{inspectOrderData.date}</strong></p>
                </div>
                <div>
                  <span className="detail-tag">Total Biaya</span>
                  <p><strong>Rp {inspectOrderData.total.toLocaleString('id-ID')}</strong></p>
                </div>
                <div>
                  <span className="detail-tag">Status Pengiriman</span>
                  <p><span className="status-pill pill-processing">• {inspectOrderData.fulfillment}</span></p>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', background: '#FAF8F5', padding: '1rem', borderRadius: '8px' }}>
                <span className="detail-tag" style={{ display: 'block', marginBottom: '0.5rem' }}>UBAH STATUS PENGIRIMAN</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleUpdateFulfillment(inspectOrderData.id, 'Diproses')}
                    className="btn-modal-action"
                    style={{ background: '#FBEBE4', color: '#A65636', border: '1px solid #F5D3C4' }}
                  >
                    Atur ke Diproses
                  </button>
                  <button
                    onClick={() => handleUpdateFulfillment(inspectOrderData.id, 'Selesai')}
                    className="btn-modal-action"
                    style={{ background: '#E5EFE5', color: '#2B613B', border: '1px solid #C8DEC8' }}
                  >
                    Atur ke Selesai (Terkirim)
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setInspectOrderData(null)} className="btn-modal-cancel">
                Tutup Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
