import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const { cart, user, createOrder, navigate, openConcierge, showToast } = useShop();

  const [formData, setFormData] = useState({
    fullName: user ? (user.fullName || user.name) : 'Raden Ayu Paramitha',
    email: user ? user.email : 'paramitha.studio@example.com',
    phone: user ? user.phone : '+62 812 3456 7890',
    address: user ? user.address : 'Jl. Bukit Dago Utara No. 18, Coblong',
    city: user ? user.city : 'Bandung',
    postalCode: user ? user.postalCode : '40135',
    instructions: 'Titipkan di pos keamanan atau hubungi interkom rumah.'
  });

  const [shippingMethod, setShippingMethod] = useState('regular');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [copiedBank, setCopiedBank] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState(null);

  const shippingCost = shippingMethod === 'express' ? 25000 : 15000;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithShipping = subtotal + shippingCost;
  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText('8092 1190 44');
    setCopiedBank(true);
    showToast('Nomor rekening BCA studio berhasil disalin.', 'success');
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      showToast('Harap lengkapi semua kolom rincian pengiriman bertanda bintang (*)', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Keranjang belanja Anda kosong!', 'error');
      navigate('/katalog');
      return;
    }

    const paymentLabel = paymentMethod === 'bank'
      ? 'Transfer Bank (BCA Manual)'
      : paymentMethod === 'qris'
      ? 'E-Wallet Instan & QRIS'
      : 'Virtual Account Otomatis';

    const courierLabel = shippingMethod === 'express'
      ? 'Pengiriman Kilat (Prioritas)'
      : 'Pengiriman Reguler (Eco Shield)';

    const newOrder = createOrder({
      shippingFee: shippingCost,
      paymentMethod: paymentLabel,
      courier: courierLabel,
      shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`
    });

    setOrderCompleteData(newOrder);
    showToast('Pesanan berhasil dibuat. Tim studio bersiap mengemas karya Anda.', 'success');
  };

  if (orderCompleteData) {
    return (
      <div className="claye-checkout-page" style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="checkout-success-card">
            <div className="success-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="order-received-tag">PENGIRIMAN STUDIO DIKONFIRMASI</span>
            <h1 className="success-title">Terima Kasih Atas Pesanan Anda</h1>
            <p className="success-body">
              Pesanan keramik Anda telah terdaftar dengan nomor referensi <strong>{orderCompleteData.id}</strong>. Tim artisan kami di Bandung sedang menyiapkan karya pilihan Anda dengan perlindungan kemasan ramah lingkungan.
            </p>

            <div className="success-summary-box">
              <div className="summary-line">
                <span>Total Pembayaran:</span>
                <strong>Rp {orderCompleteData.grandTotal?.toLocaleString('id-ID')}</strong>
              </div>
              <div className="summary-line">
                <span>Metode Pembayaran:</span>
                <strong>{orderCompleteData.paymentMethod}</strong>
              </div>
              <div className="summary-line">
                <span>Metode Pengiriman:</span>
                <strong>{orderCompleteData.courier}</strong>
              </div>
              <div className="summary-line">
                <span>Estimasi Waktu Tiba:</span>
                <strong>2-3 Hari Kerja</strong>
              </div>
            </div>

            <div className="success-actions-row">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-success-primary"
              >
                Lihat di Akun Saya (Dashboard) →
              </button>
              <button
                onClick={() => navigate('/katalog')}
                className="btn-success-secondary"
              >
                Kembali Jelajahi Koleksi Studio
              </button>
            </div>
          </div>
        </div>
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
            <div className="checkout-dispatch-tag">PENGIRIMAN STUDIO — BATCH 08</div>
            <h1 className="checkout-main-title">Pembayaran</h1>
          </div>
          <div className="checkout-header-right-note">
            Satu langkah lagi menuju pesanan keramik pilihan Anda yang dikemas dengan rapi dan aman dari studio Bandung kami.
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
                      placeholder="paramitha.studio@example.com"
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
                  <label>ALAMAT LENGKAP PENGIRIMAN *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jl. Bukit Dago Utara No. 18, Coblong"
                    required
                  />
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>KOTA *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bandung"
                      required
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>KODE POS *</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="40135"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-form-group">
                  <label>CATATAN PENGIRIMAN (OPSIONAL)</label>
                  <input
                    type="text"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Titipkan di pos keamanan atau hubungi interkom rumah."
                  />
                </div>
              </div>
            </div>

            {/* TAHAP 2: METODE PENGIRIMAN */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-title-group">
                  <span className="step-number-pill">2</span>
                  <h2 className="step-title-text">Metode Pengiriman</h2>
                </div>
              </div>

              <div className="shipping-methods-container">
                {/* PENGIRIMAN REGULER */}
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
                        <strong>Pengiriman Reguler</strong>
                        <span className="method-pill eco-pill">ECO SHIELD</span>
                      </div>
                      <p className="shipping-subtext">
                        Estimasi 2–3 hari kerja. Dilindungi kertas sarang lebah ramah lingkungan & bantalan pulp anti-benturan.
                      </p>
                    </div>
                  </div>
                  <div className="shipping-price-tag">Rp15.000</div>
                </label>

                {/* PENGIRIMAN KILAT */}
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
                        Pengiriman prioritas langsung dari atelier studio ke alamat tujuan Anda.
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
                {/* 1. TRANSFER BANK */}
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
                      <strong>Transfer Bank (Verifikasi Manual Studio)</strong>
                    </div>
                    <div className="bank-badges-row">
                      <span className="bank-tag">BCA</span>
                      <span className="bank-tag">MANDIRI</span>
                      <span className="bank-tag">BNI</span>
                    </div>
                  </div>
                  <p className="payment-desc-text">
                    Transfer langsung ke rekening resmi studio CLAYÉ. Verifikasi bukti pembayaran dalam 2 jam kerja.
                  </p>

                  {paymentMethod === 'bank' && (
                    <div className="copyable-account-box" onClick={(e) => e.stopPropagation()}>
                      <div className="account-details-text">
                        <span>Rekening BCA Studio:</span> <strong>8092 1190 44</strong> <span>(a.n. CLAYÉ Studio)</span>
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

                {/* 2. E-WALLET INSTAN & QRIS */}
                <div
                  className={`payment-option-card ${paymentMethod === 'qris' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('qris')}
                >
                  <div className="payment-header-row">
                    <div className="payment-radio-title">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'qris'}
                        onChange={() => setPaymentMethod('qris')}
                      />
                      <strong>E-Wallet Instan & QRIS</strong>
                    </div>
                    <div className="bank-badges-row">
                      <span className="bank-tag">QRIS</span>
                      <span className="bank-tag">GOPAY</span>
                      <span className="bank-tag">OVO</span>
                      <span className="bank-tag">SHOPEEPAY</span>
                    </div>
                  </div>
                  <p className="payment-desc-text">
                    Pindai kode QRIS langsung melalui aplikasi dompet digital pilihan Anda.
                  </p>

                  {paymentMethod === 'qris' && (
                    <div className="qris-preview-box" onClick={(e) => e.stopPropagation()}>
                      <div className="qris-barcode-dummy">
                        <span>Kode Pembayaran QRIS Studio Otomatis</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. VIRTUAL ACCOUNT */}
                <div
                  className={`payment-option-card ${paymentMethod === 'va' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('va')}
                >
                  <div className="payment-header-row">
                    <div className="payment-radio-title">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'va'}
                        onChange={() => setPaymentMethod('va')}
                      />
                      <strong>Virtual Account (Verifikasi Otomatis)</strong>
                    </div>
                    <div className="bank-badges-row">
                      <span className="bank-tag">BCA VA</span>
                      <span className="bank-tag">MANDIRI VA</span>
                      <span className="bank-tag">BNI VA</span>
                    </div>
                  </div>
                  <p className="payment-desc-text">
                    Nomor Virtual Account dibuat otomatis saat pesanan dikonfirmasi. Tidak perlu unggah bukti transfer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: RINGKASAN PESANAN & JAMINAN */}
          <div className="checkout-summary-column">
            {/* KARTU RINGKASAN */}
            <div className="order-summary-card">
              <div className="order-summary-header">
                <h2 className="summary-title">Ringkasan Pesanan</h2>
                <span className="summary-pieces-count">{totalPieces} PRODUK</span>
              </div>

              {/* DAFTAR ITEM */}
              <div className="summary-items-list">
                {cart.map((item, idx) => (
                  <div key={idx} className="summary-item-card">
                    <div className="summary-item-thumb">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="summary-item-info">
                      <h3 className="summary-item-name">{item.name}</h3>
                      <div className="summary-item-variant">
                        <span
                          className="summary-color-dot"
                          style={{
                            backgroundColor: item.selectedGlaze === 'Hijau Sage' ? '#BDC7B9' : '#EBE5D8'
                          }}
                        />
                        <span>Warna: {item.selectedGlaze || 'Alami'}</span>
                      </div>
                      {item.stamp && (
                        <div className="summary-item-stamp">
                          Grafir: "{item.stamp}"
                        </div>
                      )}
                      <div className="summary-item-qty">
                        Jumlah: {item.quantity}
                      </div>
                    </div>
                    <div className="summary-item-price">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
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
                  <span>Kemasan Protektif Studio</span>
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

            {/* JAMINAN KUALITAS & KEAMANAN (CLEAN TANPA EMOJI) */}
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
                  <strong>JAMINAN KERAJINAN ASLI BANDUNG</strong>
                  <p>Setiap produk keramik dibentuk di atas roda putar, diglasir, dan diinspeksi kualitasnya sebelum dikirim.</p>
                </div>
              </div>
            </div>

            {/* BANTUAN ASISTEN STUDIO */}
            <div className="checkout-concierge-callout">
              Butuh bantuan penataan atau pesanan kado khusus?<br />
              <button
                onClick={() => openConcierge('Halo, saya sedang berada di halaman checkout dan butuh bantuan pemesanan')}
                className="concierge-link-action"
              >
                Hubungi tim asisten studio kami
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
