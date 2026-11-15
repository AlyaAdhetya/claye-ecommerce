import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import MidtransSnapModal from '../components/MidtransSnapModal';

export default function CheckoutPage() {
  const { cart, user, createOrder, updateOrderPayment, navigate, openConcierge, showToast } = useShop();

  const [formData, setFormData] = useState({
    fullName: user ? (user.fullName || user.name) : 'Raden Ayu Paramitha',
    email: user ? user.email : 'paramitha@example.com',
    phone: user ? user.phone : '+62 812 3456 7890',
    address: user ? user.address : 'Jl. Sejuta Kenangan No. 12',
    city: user ? user.city : 'Palembang',
    postalCode: user ? user.postalCode : '30138',
    instructions: 'Titipkan di pos keamanan atau hubungi interkom rumah.'
  });

  const [shippingMethod, setShippingMethod] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('midtrans');
  const [copiedBank, setCopiedBank] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState(null);
  const [isMidtransOpen, setIsMidtransOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const checkoutItems = cart.filter(item => item.selected !== false);
  const itemsToProcess = checkoutItems.length > 0 ? checkoutItems : (cart.length > 0 ? cart : []);
  const shippingCost = shippingMethod === 'express' ? 25000 : 15000;
  const subtotal = itemsToProcess.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithShipping = subtotal + shippingCost;
  const totalPieces = itemsToProcess.reduce((sum, item) => sum + item.quantity, 0);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('8092 1190 44');
    setCopiedBank(true);
    showToast('Nomor rekening BCA CLAYÉ berhasil disalin.', 'success');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      showToast('Harap lengkapi semua kolom rincian pengiriman bertanda bintang (*)', 'error');
      return;
    }

    if (cart.length === 0 || itemsToProcess.length === 0) {
      showToast('Keranjang belanja Anda kosong atau belum ada produk yang dicentang!', 'error');
      navigate('/cart');
      return;
    }

    const courierLabel = shippingMethod === 'express'
      ? 'Pengiriman Kilat (Prioritas)'
      : 'Pengiriman Reguler (Eco Shield)';

    const isMidtrans = paymentMethod === 'midtrans' || paymentMethod === 'qris' || paymentMethod === 'va';
    const initialPaymentStatus = isMidtrans ? 'Menunggu Pembayaran' : 'Menunggu Pembayaran';
    const paymentLabel = isMidtrans
      ? 'Midtrans Snap Gateway (QRIS/VA)'
      : 'Transfer Bank (BCA Manual)';

    const newOrder = createOrder({
      shippingFee: shippingCost,
      paymentMethod: paymentLabel,
      paymentStatus: initialPaymentStatus,
      courier: courierLabel,
      shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      patron: formData.fullName || (user ? (user.fullName || user.name) : 'Arumi'),
      email: formData.email || (user ? user.email : 'arumi@example.com'),
      phone: formData.phone || (user ? user.phone : '+62 812-3456-7890'),
      city: formData.city || (user ? user.city : 'Palembang'),
      address: formData.address || (user ? user.address : 'Jl. Sejuta Kenangan No. 12'),
      postalCode: formData.postalCode || '30138'
    });

    if (isMidtrans) {
      setPendingOrder(newOrder);
      setIsMidtransOpen(true);
      showToast('Membuka gerbang pembayaran Midtrans Snap (Sandbox)...', 'info');
    } else {
      setOrderCompleteData(newOrder);
      showToast('Pesanan berhasil dibuat. Silakan selesaikan pembayaran.', 'success');
    }
  };

  const handleMidtransSuccess = (paymentDetails) => {
    if (pendingOrder) {
      updateOrderPayment(pendingOrder.id, 'Lunas', paymentDetails.paymentMethod);
      setOrderCompleteData({
        ...pendingOrder,
        paymentStatus: 'Lunas',
        paymentMethod: paymentDetails.paymentMethod,
        fulfillment: 'Diproses'
      });
      setIsMidtransOpen(false);
      showToast('Pembayaran Midtrans berhasil diverifikasi!', 'success');
    }
  };

  const handleMidtransClose = () => {
    setIsMidtransOpen(false);
    if (pendingOrder) {
      setOrderCompleteData(pendingOrder);
      showToast('Pesanan disimpan dengan status Menunggu Pembayaran.', 'info');
    }
  };

  if (orderCompleteData) {
    const isPaid = orderCompleteData.paymentStatus === 'Lunas';

    return (
      <div className="claye-checkout-page" style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="checkout-success-card" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #EAE6DF',
            padding: '2.5rem 2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div className="success-icon-badge" style={{
              backgroundColor: isPaid ? '#10B981' : '#F59E0B',
              color: '#FFFFFF',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              {isPaid ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              )}
            </div>

            <span className="order-received-tag" style={{
              display: 'inline-block',
              backgroundColor: isPaid ? '#ECFDF5' : '#FEF3C7',
              color: isPaid ? '#047857' : '#92400E',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '4px',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem'
            }}>
              {isPaid ? 'PEMBAYARAN DIVERIFIKASI (LUNAS)' : 'PESANAN DIDAFTARKAN (MENUNGGU PEMBAYARAN)'}
            </span>

            <h1 className="success-title" style={{ fontSize: '1.65rem', marginBottom: '0.75rem', color: '#262422' }}>
              {isPaid ? 'Terima Kasih, Pesanan Telah Dibayar!' : 'Pesanan Anda Siap Dibayar'}
            </h1>
            <p className="success-body" style={{ color: '#6E6962', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Nomor referensi pesanan Anda adalah <strong>{orderCompleteData.id}</strong>.
              {isPaid
                ? ' Tim kurasi CLAYÉ segera mengemas karya keramik Anda dengan proteksi double-box ramah lingkungan.'
                : ' Silakan selesaikan pembayaran agar pesanan segera masuk ke antrean pengemasan gudang.'}
            </p>

            <div className="success-summary-box" style={{
              backgroundColor: '#FAF8F5',
              borderRadius: '6px',
              border: '1px solid #EAE6DF',
              padding: '1.25rem',
              marginBottom: '1.75rem'
            }}>
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A857F', fontSize: '0.85rem' }}>Total Pembayaran:</span>
                <strong style={{ fontSize: '1.05rem', color: '#262422' }}>Rp {orderCompleteData.grandTotal?.toLocaleString('id-ID')}</strong>
              </div>
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A857F', fontSize: '0.85rem' }}>Status Pembayaran:</span>
                <strong style={{ color: isPaid ? '#10B981' : '#D97706', fontSize: '0.88rem' }}>
                  {orderCompleteData.paymentStatus}
                </strong>
              </div>
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#8A857F', fontSize: '0.85rem' }}>Metode Pembayaran:</span>
                <strong style={{ fontSize: '0.88rem', color: '#262422' }}>{orderCompleteData.paymentMethod}</strong>
              </div>
              <div className="summary-line" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8A857F', fontSize: '0.85rem' }}>Metode Pengiriman:</span>
                <strong style={{ fontSize: '0.88rem', color: '#262422' }}>{orderCompleteData.courier}</strong>
              </div>
            </div>

            {!isPaid && (
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsMidtransOpen(true)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#00ADEF',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 173, 239, 0.3)'
                  }}
                >
                  ⚡ Bayar Sekarang via Midtrans Snap (Sandbox)
                </button>
              </div>
            )}

            <div className="success-actions-row" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-success-primary"
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#B87355',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Lihat di Akun Saya (Dashboard) →
              </button>
              <button
                onClick={() => navigate('/katalog')}
                className="btn-success-secondary"
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  color: '#6E6962',
                  borderRadius: '6px',
                  border: '1px solid #DED8CF',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Jelajahi Koleksi Kurasi
              </button>
            </div>
          </div>
        </div>

        {/* MIDTRANS MODAL PADA HALAMAN SELESAI JIKA INGIN BAYAR ULANG */}
        <MidtransSnapModal
          isOpen={isMidtransOpen}
          onClose={handleMidtransClose}
          onSuccess={handleMidtransSuccess}
          orderData={orderCompleteData}
        />
      </div>
    );
  }

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
            <span className="bc-current">PEMBAYARAN</span>
          </div>
        </div>

        {/* HEADER PEMBAYARAN */}
        <div className="checkout-page-header">
          <div>
            <div className="checkout-dispatch-tag">PENGIRIMAN GUDANG PUSAT CLAYÉ</div>
            <h1 className="checkout-main-title">Pembayaran</h1>
          </div>
          <div className="checkout-header-right-note">
            Satu langkah lagi menuju produk keramik kurasi pilihan Anda yang dikemas dengan rapi dan bergaransi aman.
          </div>
        </div>

        {/* 2-KOLOM TATA LETAK PEMBAYARAN */}
        <div className="checkout-split-layout">
          {/* KOLOM KIRI: 3 TAHAP FORMULIR */}
          <div className="checkout-steps-column">
            {/* TAHAP 1: DATA PENGIRIMAN */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">1</span>
                  <h2 className="step-title-text">Rincian Pengiriman</h2>
                </div>
                <span className="required-tag">• KOLOM WAJIB DIISI</span>
              </div>

              <div className="step-form-body">
                <div className="checkout-form-group">
                  <label>NAMA LENGKAP *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Raden Ayu Paramitha"
                    required
                  />
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>ALAMAT EMAIL *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="paramitha@example.com"
                      required
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>NOMOR TELEPON *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+62 812 3456 7890"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-form-group">
                  <label>ALAMAT LENGKAP RUMAH / TUJUAN *</label>
                  <textarea
                    rows="3"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kecamatan"
                    required
                  />
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>KOTA / KABUPATEN *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Palembang"
                      required
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>KODE POS</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="30138"
                    />
                  </div>
                </div>

                <div className="checkout-form-group">
                  <label>CATATAN KHUSUS PENGIRIMAN (OPSIONAL)</label>
                  <input
                    type="text"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Contoh: Titipkan di pos satpam / hubungi via WA"
                  />
                </div>
              </div>
            </div>

            {/* TAHAP 2: METODE PENGIRIMAN */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">2</span>
                  <h2 className="step-title-text">Opsi Pengiriman</h2>
                </div>
              </div>

              <div className="shipping-options-list">
                {/* Opsi 1: Reguler */}
                <label
                  className={`shipping-option-card ${shippingMethod === 'regular' ? 'selected' : ''}`}
                  onClick={() => setShippingMethod('regular')}
                >
                  <div className="shipping-radio-left">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'regular'}
                      onChange={() => setShippingMethod('regular')}
                    />
                    <div className="shipping-desc-wrap">
                      <div className="shipping-name-row">
                        <strong>Pengiriman Standar</strong>
                        <span className="method-pill standard-pill">STANDAR</span>
                      </div>
                      <p className="shipping-subtext">
                        Kardus berdinding ganda dengan pelindung sarang lebah (honeycomb) ramah lingkungan.
                      </p>
                    </div>
                  </div>
                  <div className="shipping-price-tag">Rp15.000</div>
                </label>

                {/* Opsi 2: Prioritas */}
                <label
                  className={`shipping-option-card ${shippingMethod === 'express' ? 'selected' : ''}`}
                  onClick={() => setShippingMethod('express')}
                >
                  <div className="shipping-radio-left">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <div className="shipping-desc-wrap">
                      <div className="shipping-name-row">
                        <strong>Pengiriman Kilat</strong>
                        <span className="method-pill priority-pill">PRIORITAS</span>
                      </div>
                      <p className="shipping-subtext">
                        Pengiriman prioritas langsung dari gudang distribusi pusat CLAYÉ ke alamat tujuan Anda.
                      </p>
                    </div>
                  </div>
                  <div className="shipping-price-tag">Rp25.000</div>
                </label>
              </div>
            </div>

            {/* TAHAP 3: METODE PEMBAYARAN */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">3</span>
                  <h2 className="step-title-text">Metode Pembayaran</h2>
                </div>
              </div>

              <div className="payment-options-container">
                {/* 1. MIDTRANS PAYMENT GATEWAY (RECOMMENDED / SANDBOX) */}
                <div
                  className={`payment-option-card ${paymentMethod === 'midtrans' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('midtrans')}
                  style={{
                    border: paymentMethod === 'midtrans' ? '2px solid #00ADEF' : '1px solid #E2E8F0',
                    backgroundColor: paymentMethod === 'midtrans' ? '#F0F9FF' : '#FFFFFF',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    backgroundColor: '#00ADEF',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    letterSpacing: '0.05em'
                  }}>
                    OTOMATIS • MIDTRANS SANDBOX
                  </div>

                  <div className="payment-header-row">
                    <div className="payment-radio-title">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'midtrans'}
                        onChange={() => setPaymentMethod('midtrans')}
                      />
                      <strong>Midtrans Snap (QRIS, GoPay, VA BCA/Mandiri, Kartu)</strong>
                    </div>
                    <div className="bank-badges-row">
                      <span className="bank-tag" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>QRIS</span>
                      <span className="bank-tag" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>GOPAY</span>
                      <span className="bank-tag" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>BCA VA</span>
                      <span className="bank-tag" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>MANDIRI</span>
                    </div>
                  </div>
                  <p className="payment-desc-text">
                    Gerbang pembayaran resmi Indonesia dengan verifikasi instan. Dilengkapi simulator pembayaran sandbox untuk pengujian dan demo mata kuliah.
                  </p>
                </div>

                {/* 2. TRANSFER BANK MANUAL */}
                <div
                  className={`payment-option-card ${paymentMethod === 'bank' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <div className="payment-header-row">
                    <div className="payment-radio-title">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                      />
                      <strong>Transfer Bank Langsung (BCA Manual)</strong>
                    </div>
                    <div className="bank-badges-row">
                      <span className="bank-tag">BCA</span>
                      <span className="bank-tag">MANUAL</span>
                    </div>
                  </div>
                  <p className="payment-desc-text">
                    Transfer langsung ke rekening resmi CLAYÉ Studio. Verifikasi pembayaran dilakukan oleh Admin toko.
                  </p>

                  {paymentMethod === 'bank' && (
                    <div className="copyable-account-box" onClick={(e) => e.stopPropagation()}>
                      <div className="account-details-text">
                        <span>Rekening BCA CLAYÉ:</span> <strong>8092 1190 44</strong> <span>(a.n. CLAYÉ Kurasi Keramik)</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="copy-btn-pill"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {copiedBank ? (
                          <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            TERSALIN
                          </>
                        ) : 'SALIN'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: RINGKASAN PESANAN */}
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

              {/* RINCIAN BIAYA */}
              <div className="summary-cost-breakdown">
                <div className="cost-row">
                  <span>Subtotal</span>
                  <strong>Rp {subtotal.toLocaleString('id-ID')}</strong>
                </div>
                <div className="cost-row">
                  <span>Ongkos Kirim ({shippingMethod === 'express' ? 'Pengiriman Kilat' : 'Pengiriman Reguler'})</span>
                  <strong>Rp {shippingCost.toLocaleString('id-ID')}</strong>
                </div>
                <div className="cost-row">
                  <span>Kemasan Protektif CLAYÉ</span>
                  <strong className="free-tag">Gratis</strong>
                </div>

                <div className="cost-total-row">
                  <div>
                    <span className="total-label">Total Pembayaran</span>
                    <span className="total-tax-note">SUDAH TERMASUK PAJAK</span>
                  </div>
                  <div className="total-big-amount">
                    Rp {totalWithShipping.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* TOMBOL BAYAR SEKARANG */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="place-order-cta-btn"
              >
                Buat Pesanan Sekarang →
              </button>
              <p className="order-disclaimer-note">
                Harap periksa kembali rincian data Anda sebelum menyelesaikan pesanan.
              </p>
            </div>

            {/* JAMINAN KUALITAS & KEAMANAN */}
            <div className="studio-trust-badges-card">
              <div className="trust-badge-item">
                <div>
                  <strong>ENKRIPSI DATA 256-BIT AMAN</strong>
                  <p>Data pribadi dan informasi pembayaran Anda terlindungi dengan standar keamanan perbankan.</p>
                </div>
              </div>

              <div className="trust-badge-item">
                <div>
                  <strong>KEMASAN RAMAH LINGKUNGAN BERGARANSI</strong>
                  <p>100% pembungkus sarang lebah dapat terurai alami dan bebas butiran plastik sintetis.</p>
                </div>
              </div>

              <div className="trust-badge-item">
                <div>
                  <strong>JAMINAN KERAJINAN ASLI PENGRAJIN</strong>
                  <p>Setiap produk keramik dikurasi langsung dari mitra pengrajin tembikar, diuji food-safe, dan diinspeksi kualitasnya sebelum dikemas.</p>
                </div>
              </div>
            </div>

            {/* BANTUAN ASISTEN KURASI */}
            <div className="checkout-concierge-callout">
              Butuh bantuan penataan atau pesanan kado khusus?<br />
              <button
                onClick={() => openConcierge('Halo, saya sedang berada di halaman checkout dan butuh bantuan pemesanan')}
                className="concierge-link-action"
              >
                Hubungi tim asisten kurasi kami
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL GERBANG PEMBAYARAN MIDTRANS SNAP */}
      <MidtransSnapModal
        isOpen={isMidtransOpen}
        onClose={handleMidtransClose}
        onSuccess={handleMidtransSuccess}
        orderData={pendingOrder}
      />
    </div>
  );
}
