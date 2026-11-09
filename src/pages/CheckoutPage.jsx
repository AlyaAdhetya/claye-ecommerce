import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const { cart, user, createOrder, navigate, openConcierge, showToast } = useShop();

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
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [copiedBank, setCopiedBank] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState(null);

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
      shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      patron: formData.fullName || (user ? (user.fullName || user.name) : 'Arumi'),
      email: formData.email || (user ? user.email : 'arumi@example.com'),
      phone: formData.phone || (user ? user.phone : '+62 812-3456-7890'),
      city: formData.city || (user ? user.city : 'Palembang'),
      address: formData.address || (user ? user.address : 'Jl. Sejuta Kenangan No. 12'),
      postalCode: formData.postalCode || '30138'
    });

    setOrderCompleteData(newOrder);
    showToast('Pesanan berhasil dibuat. Tim kurasi bersiap mengemas produk Anda.', 'success');
  };

  if (orderCompleteData) {
    return (
      <div className="claye-checkout-page" style={{ padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="checkout-success-card">
            <div className="success-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="order-received-tag">PESANAN KURASI DIKONFIRMASI</span>
            <h1 className="success-title">Terima Kasih Atas Pesanan Anda</h1>
            <p className="success-body">
              Pesanan keramik Anda telah terdaftar dengan nomor referensi <strong>{orderCompleteData.id}</strong>. Tim logistik CLAYÉ sedang menyiapkan produk kurasi pilihan Anda dengan perlindungan kemasan ramah lingkungan.
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
                Kembali Jelajahi Koleksi Kurasi
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
                      <strong>Transfer Bank (Verifikasi Manual Admin)</strong>
                    </div>
                    <div className="bank-badges-row">
                      <span className="bank-tag">BCA</span>
                      <span className="bank-tag">MANDIRI</span>
                      <span className="bank-tag">BNI</span>
                    </div>
                  </div>
                  <p className="payment-desc-text">
                    Transfer langsung ke rekening resmi CLAYÉ. Verifikasi bukti pembayaran dalam 2 jam kerja.
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

                {/* 2. QRIS / E-WALLET */}
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
                      <strong>E-Wallet & QRIS Instan</strong>
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
                        <span>Kode Pembayaran QRIS CLAYÉ Otomatis</span>
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
    </div>
  );
}
