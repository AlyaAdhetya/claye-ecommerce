import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart, navigate, showToast, openConcierge } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'CLAYE10' || code === 'WABI10') {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      showToast(`Kupon ${code} berhasil digunakan. Diskon 10% diterapkan.`, 'success');
    } else {
      showToast('Kupon tidak valid. Coba gunakan: CLAYE10', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="claye-cart-page" style={{ padding: '5rem 0 7rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '580px' }}>
          <div className="empty-cart-card">
            <div className="studio-edition-badge" style={{ margin: '0 auto 1rem' }}>
              <span className="badge-dot">•</span> KERANJANG KOSONG
            </div>
            <h2 className="empty-cart-title">Keranjang Belanja Anda Masih Kosong</h2>
            <p className="empty-cart-desc">
              Anda belum memilih karya keramik buatan tangan. Temukan cangkir, mangkuk, atau vas cantik untuk melengkapi ruang tinggal Anda.
            </p>
            <button
              onClick={() => navigate('/katalog')}
              className="claye-terracotta-btn"
              style={{ marginTop: '1.5rem' }}
            >
              JELAJAHI KOLEKSI STUDIO →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="claye-cart-page">
      <div className="container">
        {/* BREADCRUMB */}
        <div className="cart-breadcrumb">
          <button onClick={() => navigate('/')}>BERANDA</button>
          <span className="bc-sep">/</span>
          <span className="bc-current">KERANJANG BELANJA ({totalPieces})</span>
        </div>

        {/* HEADER */}
        <div className="cart-page-header">
          <div>
            <div className="studio-edition-badge">
              <span className="badge-dot">•</span> KARYA SIAP DIKEMAS
            </div>
            <h1 className="cart-main-title">Keranjang Belanja</h1>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Kosongkan semua produk dari keranjang belanja?')) clearCart();
            }}
            className="clear-cart-link-btn"
          >
            Kosongkan Keranjang
          </button>
        </div>

        {/* 2-KOLOM GRID KERANJANG */}
        <div className="cart-grid-layout">
          {/* DAFTAR ITEM */}
          <div className="cart-items-column">
            {cart.map((item, idx) => (
              <div key={idx} className="cart-item-row-card">
                <div className="cart-item-photo">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <div className="item-title-delete-row">
                    <h3 className="cart-item-title">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="cart-remove-item-btn"
                      title="Hapus produk"
                      aria-label="Hapus"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  <div className="cart-item-glaze-tag">
                    <span
                      className="swatch-mini-dot"
                      style={{
                        backgroundColor: item.selectedGlaze === 'Hijau Sage' ? '#BDC7B9' : '#EBE5D8'
                      }}
                    />
                    <span>Warna Glasir: {item.selectedGlaze || 'Alami'}</span>
                  </div>

                  {item.stamp && (
                    <div className="cart-item-stamp-tag">
                      Grafir Khusus: "{item.stamp}" (+Rp25.000)
                    </div>
                  )}

                  <div className="cart-item-unit-price">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>

                  <div className="cart-qty-subtotal-row">
                    <div className="stepper-quantity-control sm">
                      <button
                        onClick={() => updateCartQty(idx, item.quantity - 1)}
                        className="stepper-btn"
                        aria-label="Kurang"
                      >
                        -
                      </button>
                      <span className="stepper-value">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(idx, item.quantity + 1)}
                        className="stepper-btn"
                        aria-label="Tambah"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-line-total">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-packaging-assurance">
              <div>
                <strong>Gratis Kemasan Protektif Studio Termasuk</strong>
                <p>Bantalan pulp daur ulang dan pelindung sarang lebah menjamin keramik Anda tiba tanpa risiko pecah.</p>
              </div>
            </div>
          </div>

          {/* RINGKASAN BIAYA */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h2 className="summary-title" style={{ marginBottom: '1.25rem' }}>
                Ringkasan Biaya
              </h2>

              {/* FORM KUPON PROMO */}
              <form onSubmit={handleApplyCoupon} className="coupon-form-wrap">
                <input
                  type="text"
                  placeholder="Kode Kupon (contoh: CLAYE10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="coupon-input-field"
                />
                <button type="submit" className="coupon-apply-btn">
                  Terapkan
                </button>
              </form>

              {appliedCoupon && (
                <div className="applied-coupon-pill">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {appliedCoupon} (Diskon 10%)
                  </span>
                  <button onClick={() => { setDiscountPercent(0); setAppliedCoupon(''); }} aria-label="Hapus kupon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              )}

              <div className="summary-cost-breakdown" style={{ marginTop: '1.5rem' }}>
                <div className="cost-row">
                  <span>Subtotal ({totalPieces} produk)</span>
                  <strong>Rp {subtotal.toLocaleString('id-ID')}</strong>
                </div>

                {discountAmount > 0 && (
                  <div className="cost-row" style={{ color: '#2B613B' }}>
                    <span>Diskon Kupon Studio</span>
                    <strong>-Rp {discountAmount.toLocaleString('id-ID')}</strong>
                  </div>
                )}

                <div className="cost-row">
                  <span>Estimasi Ongkos Kirim Reguler</span>
                  <strong>Rp 15.000</strong>
                </div>

                <div className="cost-row">
                  <span>Kemasan Protektif Studio</span>
                  <strong className="free-tag">Gratis</strong>
                </div>

                <div className="cost-total-row">
                  <div>
                    <span className="total-label">Estimasi Total</span>
                    <span className="total-tax-note">SUDAH TERMASUK PAJAK</span>
                  </div>
                  <div className="total-big-amount">
                    Rp {(finalTotal + 15000).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="place-order-cta-btn"
                style={{ marginTop: '1.5rem' }}
              >
                Lanjut ke Pembayaran →
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => navigate('/katalog')}
                  className="sub-action-link"
                >
                  ← Lanjut Belanja
                </button>
              </div>
            </div>

            <div className="checkout-concierge-callout" style={{ marginTop: '1.5rem' }}>
              Punya pertanyaan seputar warna glasir atau pesanan khusus?<br />
              <button
                onClick={() => openConcierge('Halo asisten studio, saya butuh bantuan konsultasi isi keranjang')}
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
