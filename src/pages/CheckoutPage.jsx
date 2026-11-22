import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const {
    cart,
    user,
    createOrder,
    navigate,
    openConcierge,
    showToast,
    // ── Global State Pengiriman Kota Palembang dari ShopContext ──
    shippingZone,
    setShippingZone,
    selectedKecamatan,
    setKecamatan,
    SHIPPING_ZONES,
    PALEMBANG_KECAMATAN,
    addresses,
    primaryAddress
  } = useShop();

  // Ambil alamat aktif: utamakan primaryAddress dari Buku Alamat
  const activeAddr = primaryAddress || (addresses && addresses.find(a => a.isPrimary)) || (addresses && addresses[0]) || null;

  const [formData, setFormData] = useState({
    fullName: activeAddr ? (activeAddr.recipientName || user?.fullName || user?.name || '') : (user ? (user.fullName || user.name) : ''),
    email: user ? (user.email || '') : '',
    phone: activeAddr ? (activeAddr.phone || user?.phone || '') : (user ? (user.phone || '') : ''),
    address: activeAddr ? (activeAddr.address || user?.address || '') : (user ? (user.address || '') : ''),
    city: 'Kota Palembang',
    postalCode: activeAddr ? (activeAddr.postalCode || '30138') : (user ? (user.postalCode || '30138') : '30138'),
    kecamatan: activeAddr ? (activeAddr.kecamatan || selectedKecamatan || 'Ilir Barat I') : (selectedKecamatan || 'Ilir Barat I'),
    patokan: activeAddr ? (activeAddr.patokan || '') : '',
    instructions: ''
  });

  // Sinkronkan ongkos kirim dan zona ke alamat utama saat pertama masuk ke checkout
  useEffect(() => {
    if (activeAddr && activeAddr.kecamatan) {
      setKecamatan(activeAddr.kecamatan);
    }
  }, [activeAddr?.id]);

  const [orderCompleteData, setOrderCompleteData] = useState(null);

  const selectedZone = SHIPPING_ZONES?.find(z => z.id === shippingZone) || SHIPPING_ZONES?.[0] || {
    id: 'plb_pusat',
    label: 'Palembang Pusat (Ilir Barat & IT I)',
    price: 8000,
    estimate: 'Antar Langsung Tim CLAYÉ (1–2 Jam)'
  };
  const shippingCost = selectedZone.price;

  const checkoutItems = cart.filter(item => item.selected !== false);
  const itemsToProcess = checkoutItems.length > 0 ? checkoutItems : (cart.length > 0 ? cart : []);
  const subtotal = itemsToProcess.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithShipping = subtotal + shippingCost;
  const totalPieces = itemsToProcess.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-detect kecamatan dari teks alamat secara cerdas jika pengguna mengetik nama area/kelurahan/jalan
  const detectKecamatanFromAddress = (text) => {
    if (!text || text.length < 3) return null;
    const lower = text.toLowerCase();

    // 1. Cek nama kecamatan resmi
    for (const kec of (PALEMBANG_KECAMATAN || [])) {
      if (lower.includes(kec.name.toLowerCase())) {
        return kec.name;
      }
    }

    // 2. Cek kata kunci area / landmark / jalan populer di Kota Palembang
    const KEYWORDS_MAP = [
      { kw: 'demang lebar daun', kec: 'Ilir Barat I' },
      { kw: 'demang', kec: 'Ilir Barat I' },
      { kw: 'lorok pakjo', kec: 'Ilir Barat I' },
      { kw: 'bukit lama', kec: 'Ilir Barat I' },
      { kw: 'bukit baru', kec: 'Ilir Barat I' },
      { kw: 'bukit besar', kec: 'Ilir Barat I' },
      { kw: 'kampus', kec: 'Ilir Barat I' },
      { kw: 'bukit kecil', kec: 'Bukit Kecil' },
      { kw: 'tangga buntung', kec: 'Ilir Barat II' },
      { kw: '35 ilir', kec: 'Ilir Barat II' },
      { kw: 'sudirman', kec: 'Ilir Timur I' },
      { kw: 'cinde', kec: 'Ilir Timur I' },
      { kw: 'duku', kec: 'Ilir Timur I' },
      { kw: 'rajawali', kec: 'Ilir Timur I' },
      { kw: 'sekip', kec: 'Kemuning' },
      { kw: 'pipa reja', kec: 'Kemuning' },
      { kw: 'basuki rahmat', kec: 'Kemuning' },
      { kw: 'sukarami', kec: 'Sukarami' },
      { kw: 'talang buruk', kec: 'Sukarami' },
      { kw: 'km 5', kec: 'Sukarami' },
      { kw: 'km 6', kec: 'Sukarami' },
      { kw: 'km 7', kec: 'Sukarami' },
      { kw: 'km 8', kec: 'Sukarami' },
      { kw: 'km 9', kec: 'Sukarami' },
      { kw: 'km 10', kec: 'Sukarami' },
      { kw: 'km 11', kec: 'Alang-Alang Lebar' },
      { kw: 'km 12', kec: 'Alang-Alang Lebar' },
      { kw: 'alang alang lebar', kec: 'Alang-Alang Lebar' },
      { kw: 'talang kelapa', kec: 'Alang-Alang Lebar' },
      { kw: 'kenten', kec: 'Sako' },
      { kw: 'perumnas sako', kec: 'Sako' },
      { kw: 'sako', kec: 'Sako' },
      { kw: 'kalidoni', kec: 'Kalidoni' },
      { kw: 'pusri', kec: 'Kalidoni' },
      { kw: 'lemabang', kec: 'Ilir Timur II' },
      { kw: 'sematang borang', kec: 'Sematang Borang' },
      { kw: 'gandus', kec: 'Gandus' },
      { kw: 'jakabaring', kec: 'Jakabaring' },
      { kw: 'silaberanti', kec: 'Jakabaring' },
      { kw: 'plaju', kec: 'Plaju' },
      { kw: 'kertapati', kec: 'Kertapati' },
      { kw: 'seberang ulu', kec: 'Seberang Ulu I' },
      { kw: '7 ulu', kec: 'Seberang Ulu I' },
      { kw: '14 ulu', kec: 'Seberang Ulu II' },
    ];

    for (const item of KEYWORDS_MAP) {
      if (lower.includes(item.kw)) {
        return item.kec;
      }
    }
    return null;
  };

  // Handler saat customer mengetik alamat lengkap (auto-detect kecamatan & zona)
  const handleAddressTextChange = (text) => {
    setFormData(prev => ({ ...prev, address: text }));
    const detectedKec = detectKecamatanFromAddress(text);
    if (detectedKec && detectedKec !== formData.kecamatan) {
      handleKecamatanChange(detectedKec, true);
    }
  };

  // Ketika customer memilih kecamatan di Palembang, otomatis tentukan zona & sesuaikan ongkir
  const handleKecamatanChange = (kecName, fromAddressDetect = false) => {
    const foundKec = PALEMBANG_KECAMATAN?.find(k => k.name === kecName);
    setFormData(prev => ({ ...prev, kecamatan: kecName }));
    if (foundKec) {
      setKecamatan(kecName);
      const matchedZone = SHIPPING_ZONES?.find(z => z.id === foundKec.zoneId);
      if (matchedZone) {
        showToast(
          fromAddressDetect
            ? `Alamat terdeteksi di Kec. ${kecName}: Zona & ongkir otomatis diatur ke ${matchedZone.label} (Rp ${matchedZone.price.toLocaleString('id-ID')})`
            : `Kecamatan ${kecName}: Zona otomatis terkoneksi ke ${matchedZone.label} (Ongkir Rp ${matchedZone.price.toLocaleString('id-ID')})`,
          'info'
        );
      }
    }
  };

  // Terapkan alamat dari Buku Alamat ke formulir checkout
  const handleSelectSavedAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      fullName: addr.recipientName || prev.fullName,
      phone: addr.phone || prev.phone,
      address: addr.address || prev.address,
      kecamatan: addr.kecamatan || prev.kecamatan,
      postalCode: addr.postalCode || prev.postalCode,
      patokan: addr.patokan || prev.patokan
    }));
    if (addr.kecamatan) {
      handleKecamatanChange(addr.kecamatan);
    }
    showToast(`Alamat "${addr.label}" diterapkan ke formulir pengiriman.`, 'info');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('Harap lengkapi nama penerima, nomor HP/WhatsApp, dan alamat lengkap tujuan (*)', 'error');
      return;
    }

    if (cart.length === 0 || itemsToProcess.length === 0) {
      showToast('Keranjang belanja Anda kosong atau belum ada produk yang dicentang!', 'error');
      navigate('/cart');
      return;
    }

    const fullShippingAddress = `${formData.address.trim()}${formData.patokan ? ' (Patokan: ' + formData.patokan.trim() + ')' : ''}, Kec. ${formData.kecamatan || 'Ilir Barat I'}, Kota Palembang ${formData.postalCode}`;

    const newOrder = createOrder({
      shippingFee: shippingCost,
      discountAmount: 0,
      couponCode: null,
      grandTotal: totalWithShipping,
      paymentMethod: 'COD (Bayar Tunai di Tempat ke Tim CLAYÉ)',
      paymentStatus: 'Menunggu Pembayaran',
      fulfillment: 'Diproses',
      courier: `Antar Langsung Tim CLAYÉ Studio – ${selectedZone.label} (${selectedZone.estimate})`,
      shippingAddress: fullShippingAddress,
      patron: formData.fullName,
      email: formData.email || (user ? user.email : ''),
      phone: formData.phone,
      city: 'Kota Palembang',
      address: fullShippingAddress,
      postalCode: formData.postalCode
    });

    setOrderCompleteData(newOrder);
    showToast('Pesanan COD berhasil dibuat! Tim CLAYÉ akan mengantar langsung ke alamat Anda.', 'success');
  };

  // ── HALAMAN SUKSES PEMESANAN COD ─────────────────────────────────────────────
  if (orderCompleteData) {
    return (
      <div className="claye-checkout-page" style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="checkout-success-card" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #EAE6DF',
            padding: '2.5rem 2rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
          }}>
            {/* Icon sukses */}
            <div style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              width: '58px', height: '58px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <span style={{
              display: 'inline-block',
              backgroundColor: '#ECFDF5',
              color: '#047857',
              fontSize: '0.74rem', fontWeight: 800,
              padding: '4px 12px', borderRadius: '4px',
              letterSpacing: '0.08em', marginBottom: '0.75rem',
              textAlign: 'center'
            }}>
              PESANAN COD KOTA PALEMBANG DITERIMA ✓
            </span>

            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.75rem', color: '#262422', textAlign: 'center' }}>
              Pesanan Anda Siap Diantar Sendiri oleh Tim CLAYÉ
            </h1>
            <p style={{ color: '#6E6962', lineHeight: '1.6', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
              Nomor referensi pesanan: <strong>{orderCompleteData.id}</strong>.<br />
              Pengrajin/tim CLAYÉ Studio akan segera menghubungi WhatsApp <strong>{orderCompleteData.phone}</strong> untuk konfirmasi titik temu & waktu pengantaran langsung ke alamat Anda.
            </p>

            {/* Kotak Instruksi COD Mandiri */}
            <div style={{
              backgroundColor: '#FFF9F3',
              border: '1.5px solid #F3D5C0',
              borderRadius: '8px',
              padding: '1.1rem 1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>🤝</span>
                <strong style={{ fontSize: '0.86rem', color: '#7C4A2D' }}>
                  SERAH TERIMA KERAMIK & PEMBAYARAN COD MANDIRI
                </strong>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#6A3E24', margin: 0, lineHeight: '1.6' }}>
                Siapkan uang tunai sebesar <strong>Rp {orderCompleteData.grandTotal?.toLocaleString('id-ID')}</strong>. Uang dibayarkan langsung secara tunai kepada tim CLAYÉ yang datang mengantar keramik Anda. Tanpa pihak ketiga, aman dan dipantau mandiri.
              </p>
            </div>

            <div style={{
              backgroundColor: '#FAF8F5', borderRadius: '8px',
              border: '1px solid #EAE6DF', padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A857F', fontSize: '0.84rem' }}>Subtotal Keramik:</span>
                <strong style={{ fontSize: '0.86rem', color: '#262422' }}>Rp {orderCompleteData.total?.toLocaleString('id-ID')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A857F', fontSize: '0.84rem' }}>Ongkos Antar ({orderCompleteData.courier}):</span>
                <strong style={{ fontSize: '0.86rem', color: '#262422' }}>Rp {orderCompleteData.shippingFee?.toLocaleString('id-ID')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A857F', fontSize: '0.84rem' }}>Metode Pembayaran:</span>
                <strong style={{ fontSize: '0.86rem', color: '#B87355' }}>COD (Bayar Tunai di Tempat)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingTop: '10px', borderTop: '1px dashed #DED8CF' }}>
                <span style={{ color: '#262422', fontSize: '0.94rem', fontWeight: 700 }}>Total Uang Tunai yang Disiapkan:</span>
                <strong style={{ fontSize: '1.15rem', color: '#B87355', fontWeight: 800 }}>
                  Rp {orderCompleteData.grandTotal?.toLocaleString('id-ID')}
                </strong>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#6E6962', paddingTop: '8px', borderTop: '1px solid #EAE6DF' }}>
                <span style={{ color: '#8A857F' }}>Alamat Pengantaran:</span><br />
                <strong style={{ color: '#262422' }}>{orderCompleteData.address}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ padding: '12px 22px', backgroundColor: '#B87355', color: '#FFFFFF', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Lihat di Akun Saya →
              </button>
              <button
                onClick={() => navigate('/katalog')}
                style={{ padding: '12px 22px', backgroundColor: 'transparent', color: '#6E6962', borderRadius: '6px', border: '1px solid #DED8CF', fontWeight: 600, cursor: 'pointer' }}
              >
                Jelajahi Koleksi Lain
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── HALAMAN CHECKOUT UTAMA ──────────────────────────────────────────────────
  return (
    <div className="claye-checkout-page">
      <div className="container">
        {/* BREADCRUMB */}
        <div className="checkout-breadcrumb-row">
          <div className="checkout-breadcrumb">
            <button onClick={() => navigate('/')}>BERANDA</button>
            <span className="bc-sep">/</span>
            <button onClick={() => navigate('/keranjang')}>KERANJANG BELANJA</button>
            <span className="bc-sep">/</span>
            <span className="bc-current">PENGANTARAN & COD KOTA PALEMBANG</span>
          </div>
        </div>

        {/* HEADER CHECKOUT */}
        <div className="checkout-page-header">
          <div>
            <div className="checkout-dispatch-tag" style={{ letterSpacing: '0.12em' }}>
              KHUSUS KOTA PALEMBANG • DIANTAR LANGSUNG OLEH TIM CLAYÉ
            </div>
            <h1 className="checkout-main-title">Pengantaran & Pembayaran COD</h1>
          </div>
          <div className="checkout-header-right-note">
            Kami mengantar pesanan Anda sendiri langsung dari studio tembikar kami di Palembang. Tanpa kurir ekspedisi pihak ketiga — pembayaran uang tunai diperiksa mandiri di tempat.
          </div>
        </div>

        <div className="checkout-split-layout">
          {/* KOLOM KIRI: FORMULIR RINCIAN */}
          <div className="checkout-steps-column">

            {/* STEP 1: DATA PENERIMA & ALAMAT LENGKAP */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">1</span>
                  <h2 className="step-title-text">Rincian Penerima & Alamat di Kota Palembang</h2>
                </div>
                <span className="required-tag">• KOLOM WAJIB DIISI</span>
              </div>

              <div className="step-form-body">
                {/* PILIH ALAMAT DARI BUKU ALAMAT PENGGUNA */}
                {addresses && addresses.length > 0 && (
                  <div style={{
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid #EAE4DC',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>📍</span>
                        <strong style={{ fontSize: '0.8rem', color: '#262422', letterSpacing: '0.04em' }}>
                          PILIH DARI BUKU ALAMAT ANDA:
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/akun')}
                        style={{
                          fontSize: '0.74rem',
                          color: '#B87355',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                          textDecoration: 'underline'
                        }}
                      >
                        Kelola di Buku Alamat →
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {addresses.map(addr => {
                        const isCurrent = formData.address === addr.address && formData.kecamatan === addr.kecamatan;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(addr)}
                            style={{
                              padding: '7px 14px',
                              borderRadius: '20px',
                              border: isCurrent ? '1.5px solid #B87355' : '1px solid #D8D2C6',
                              backgroundColor: isCurrent ? '#FFF8F3' : '#FFFFFF',
                              color: isCurrent ? '#B87355' : '#4A4641',
                              fontWeight: isCurrent ? 700 : 500,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: isCurrent ? '0 1px 3px rgba(184,115,85,0.2)' : 'none'
                            }}
                          >
                            <span>{isCurrent ? '✓' : '•'}</span>
                            <span>{addr.label}</span>
                            {addr.isPrimary && (
                              <span style={{
                                backgroundColor: isCurrent ? '#B87355' : '#EAE6DF',
                                color: isCurrent ? '#FFFFFF' : '#6E6962',
                                fontSize: '0.65rem',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                fontWeight: 700
                              }}>
                                Utama
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nama Penerima */}
                <div className="checkout-form-group">
                  <label>NAMA LENGKAP PENERIMA *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="contoh: Raden Ayu Paramitha"
                    required
                  />
                </div>

                {/* No Telepon & Email */}
                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>NOMOR HP / WHATSAPP AKTIF *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="contoh: 0812-3456-7890 (untuk konfirmasi serah terima)"
                      required
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>ALAMAT EMAIL (OPSIONAL)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                {/* Pilih Kecamatan di Kota Palembang (Otomatis menyesuaikan ongkir) */}
                <div className="checkout-form-row" style={{ alignItems: 'flex-start' }}>
                  <div className="checkout-form-group" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <label style={{ margin: 0 }}>KECAMATAN DI KOTA PALEMBANG *</label>
                      <span style={{ fontSize: '0.72rem', color: '#2E6930', fontWeight: 700 }}>
                        ✓ Ongkir otomatis: Rp {selectedZone.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <select
                      value={formData.kecamatan}
                      onChange={(e) => handleKecamatanChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '6px',
                        border: '1.5px solid #B87355',
                        backgroundColor: '#FCFAF7',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: 'var(--color-charcoal)'
                      }}
                    >
                      {PALEMBANG_KECAMATAN?.map(kec => (
                        <option key={kec.name} value={kec.name}>
                          Kec. {kec.name}
                        </option>
                      ))}
                    </select>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px',
                      backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7',
                      borderRadius: '5px', padding: '6px 10px'
                    }}>
                      <span style={{ color: '#16A34A', fontSize: '0.82rem', fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>
                        Terhubung otomatis ke <strong>{selectedZone.label}</strong> (Ongkos kirim otomatis: <strong>Rp {selectedZone.price.toLocaleString('id-ID')}</strong>)
                      </span>
                    </div>
                  </div>

                  <div className="checkout-form-group" style={{ width: '130px' }}>
                    <label>KOTA</label>
                    <input
                      type="text"
                      value="Kota Palembang"
                      disabled
                      style={{
                        backgroundColor: '#F7F5F0',
                        color: '#6E6962',
                        cursor: 'not-allowed',
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>

                {/* ── BLOK ALAMAT LENGKAP: DIBESARKAN, RAPI, DAN NYAMAN ── */}
                <div className="checkout-form-group" style={{
                  backgroundColor: '#FCFAF7',
                  border: '1.5px solid #E8E2D7',
                  borderRadius: '8px',
                  padding: '1.15rem 1.25rem',
                  marginTop: '0.5rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0, fontSize: '0.74rem', color: '#262422', fontWeight: 800, letterSpacing: '0.08em' }}>
                      ALAMAT LENGKAP TUJUAN PENGANTARAN *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#8A857F' }}>
                      Kecamatan & tarif terhubung otomatis
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={formData.address}
                    onChange={(e) => handleAddressTextChange(e.target.value)}
                    placeholder="Tuliskan nama jalan, nomor rumah/toko, RT/RW, kelurahan, blok perumahan, atau nama gang. Contoh: Jl. Demang Lebar Daun No. 42, RT 15 RW 04, Kel. Lorok Pakjo (Pagar hitam samping minimarket)"
                    required
                    style={{
                      width: '100%',
                      minHeight: '115px',
                      padding: '12px 14px',
                      fontSize: '0.92rem',
                      lineHeight: '1.6',
                      borderRadius: '6px',
                      border: '1px solid #D8D2C6',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                      color: '#262422',
                      resize: 'vertical',
                      display: 'block'
                    }}
                  />

                  {/* Patokan / Landmark opsional untuk memudahkan tim yang mengantar */}
                  <div style={{ marginTop: '0.85rem' }}>
                    <label style={{ fontSize: '0.7rem', color: '#6E6962', fontWeight: 600, marginBottom: '0.3rem', display: 'block' }}>
                      PATOKAN KHUSUS / PETUNJUK LOKASI (MEMBANTU TIM MENEMUKAN RUMAH)
                    </label>
                    <input
                      type="text"
                      value={formData.patokan}
                      onChange={(e) => setFormData({ ...formData, patokan: e.target.value })}
                      placeholder="contoh: Seberang Masjid Al-Ikhlas / depan pagar ada pohon mangga"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: '0.85rem',
                        borderRadius: '5px',
                        border: '1px solid #D8D2C6',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Catatan khusus waktu antar */}
                <div className="checkout-form-group">
                  <label>CATATAN JADWAL ANTAR (OPSIONAL)</label>
                  <input
                    type="text"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="contoh: Bisa diantar sore setelah jam 16.00 WIB / hubungi sebelum jalan"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: WILAYAH KOTA PALEMBANG & ONGKIR OTOMATIS (TERKUNCI SESUAI KECAMATAN) */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">2</span>
                  <h2 className="step-title-text">Zona Pengantaran Mandiri di Kota Palembang</h2>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  backgroundColor: '#F0FDF4',
                  color: '#166534',
                  border: '1px solid #BBF7D0',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🔒 Otomatis Terhubung
                </span>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                {/* KARTU STATUS ZONA OTOMATIS TERKUNCI (TIDAK DAPAT DIUBAH MANUAL) */}
                <div style={{
                  backgroundColor: '#FFF8F3',
                  border: '1.5px solid #B87355',
                  borderRadius: '10px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 2px 6px rgba(184, 115, 85, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: '240px' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '50%',
                        backgroundColor: '#B87355', color: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.3rem', flexShrink: 0
                      }}>
                        🛵
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '1.05rem', color: '#262422' }}>
                            {selectedZone.label}
                          </strong>
                          <span style={{
                            backgroundColor: '#EAF3E9',
                            color: '#2E6930',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #C4DFC1'
                          }}>
                            ✓ Terdeteksi: Kec. {formData.kecamatan || 'Ilir Barat I'}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#6E6962', lineHeight: '1.5' }}>
                          {selectedZone.desc}
                        </p>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            ⏱ {selectedZone.estimate}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: '#8A857F' }}>
                            Diantar langsung oleh tim internal CLAYÉ Studio (Garansi Aman 100%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#8A857F', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Tarif Pengantaran
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#B87355' }}>
                        Rp {selectedZone.price.toLocaleString('id-ID')}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#166534', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                        ✓ Terkunci Sesuai Kecamatan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: METODE PEMBAYARAN COD MANDIRI */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">3</span>
                  <h2 className="step-title-text">Metode Pembayaran COD (Tunai di Tempat)</h2>
                </div>
              </div>

              <div style={{ padding: '0 1.5rem 1.5rem' }}>
                <div style={{
                  border: '2px solid #B87355',
                  borderRadius: '10px',
                  backgroundColor: '#FFF8F3',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: '46px', height: '46px',
                    backgroundColor: '#B87355',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M6 12h.01M18 12h.01"></path>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1.02rem', color: '#262422' }}>Cash on Delivery (COD) Mandiri</strong>
                      <span style={{
                        backgroundColor: '#B87355', color: '#FFFFFF',
                        fontSize: '0.65rem', fontWeight: 800,
                        padding: '2px 8px', borderRadius: '20px',
                        letterSpacing: '0.06em'
                      }}>
                        BAYAR TUNAI KE TIM CLAYÉ
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6E6962', lineHeight: '1.55' }}>
                      Anda membayar uang tunai langsung kepada pengrajin/tim CLAYÉ yang tiba di rumah Anda. Kami memeriksa produk bersama Anda di tempat untuk memastikan keramik tiba dalam kondisi sempurna tanpa cacat.
                    </p>
                    <div style={{
                      marginTop: '12px',
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FDE68A',
                      borderRadius: '6px',
                      padding: '9px 12px',
                      fontSize: '0.82rem',
                      color: '#92400E'
                    }}>
                      💡 Siapkan uang tunai sebesar <strong>Rp {totalWithShipping.toLocaleString('id-ID')}</strong> saat tim kami tiba.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: RINGKASAN PESANAN & TOTAL COD */}
          <div className="checkout-summary-column">
            <div className="checkout-order-summary-card">
              <div className="summary-card-header">
                <h3 className="summary-title">Ringkasan Pesanan</h3>
                <span className="summary-count-badge">{totalPieces} Barang</span>
              </div>

              {/* LIST PRODUK MINI */}
              <div className="summary-items-list">
                {itemsToProcess.map((item, idx) => (
                  <div key={idx} className="summary-item-row">
                    <img src={item.image} alt={item.name} className="summary-item-img" />
                    <div className="summary-item-info">
                      <strong className="summary-name">{item.name}</strong>
                      <span className="summary-variant">Glasir: {item.selectedGlaze || 'Alami'}</span>
                      {item.stamp && (
                        <span className="summary-stamp">Grafir: "{item.stamp}"</span>
                      )}
                      <div className="summary-qty-price">
                        <span>Jml: {item.quantity}</span>
                        <strong>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RINCIAN BIAYA OTOMATIS */}
              <div className="summary-cost-breakdown" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #EAE6DF' }}>
                <div className="cost-row">
                  <span>Subtotal ({totalPieces} produk)</span>
                  <strong>Rp {subtotal.toLocaleString('id-ID')}</strong>
                </div>

                <div className="cost-row">
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Ongkos Antar ({selectedZone.label})</span>
                    <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                      ✓ Terkoneksi ke Kec. {formData.kecamatan || 'Ilir Barat I'}
                    </span>
                  </span>
                  <strong>Rp {shippingCost.toLocaleString('id-ID')}</strong>
                </div>

                <div className="cost-row">
                  <span>Kemasan Protektif CLAYÉ</span>
                  <strong className="free-tag">Gratis</strong>
                </div>

                <div className="cost-total-row">
                  <div>
                    <span className="total-label">Total COD Tunai</span>
                    <span className="total-tax-note">DIBAYAR KE TIM CLAYÉ</span>
                  </div>
                  <div className="total-big-amount">
                    Rp {totalWithShipping.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="place-order-cta-btn"
              >
                Proses Pesanan Sekarang (COD) →
              </button>
              <p className="order-disclaimer-note">
                Pesanan akan langsung dipersiapkan dan diantar oleh pengrajin/tim CLAYÉ Palembang.
              </p>
            </div>

            {/* JAMINAN PELAYANAN MANDIRI */}
            <div className="studio-trust-badges-card">
              <div className="trust-badge-item">
                <div>
                  <strong>🛵 DIANTAR LANGSUNG TIM CLAYÉ</strong>
                  <p>Bukan kurir pihak ketiga — kami mengantar sendiri pesanan keramik Anda agar garansi bebas pecah 100% terjaga.</p>
                </div>
              </div>
              <div className="trust-badge-item">
                <div>
                  <strong>💵 PEMBAYARAN COD MANDIRI</strong>
                  <p>Uang tunai diterima langsung oleh tim kami saat serah terima di depan rumah Anda.</p>
                </div>
              </div>
              <div className="trust-badge-item">
                <div>
                  <strong>📦 KEMASAN RAMAH LINGKUNGAN</strong>
                  <p>100% pelindung sarang lebah (honeycomb) ramah lingkungan tanpa butiran styrofoam sintetis.</p>
                </div>
              </div>
            </div>

            <div className="checkout-concierge-callout">
              Ada pertanyaan seputar lokasi antar di Palembang?<br />
              <button
                onClick={() => openConcierge('Halo tim CLAYÉ, saya ingin bertanya tentang jadwal antar mandiri di Palembang')}
                className="concierge-link-action"
              >
                Hubungi asisten kurasi CLAYÉ Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
