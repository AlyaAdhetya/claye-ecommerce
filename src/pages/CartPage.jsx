import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CartPage() {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleCartItemSelection,
    selectAllCartItems,
    updateCartItemGlaze,
    products,
    navigate,
    showToast,
    openConcierge,
    // ── pengiriman Palembang dari context ──
    shippingZone,
    setShippingZone,
    selectedKecamatan,
    setKecamatan,
    SHIPPING_ZONES,
    PALEMBANG_KECAMATAN,
  } = useShop();

  const selectedItems = cart.filter(item => item.selected !== false);
  const allSelected = cart.length > 0 && cart.every(item => item.selected !== false);
  const selectedCount = selectedItems.length;
  const totalPieces = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const allTotalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedZone = SHIPPING_ZONES.find(z => z.id === shippingZone) || SHIPPING_ZONES[0];
  const shippingCost = selectedCount > 0 ? selectedZone.price : 0;
  const finalTotal = subtotal + shippingCost;

  const getAvailableGlazes = (item) => {
    const prod = products?.find(p => p.id === item.id || p.name === item.name);
    if (prod && prod.glazeOptions && prod.glazeOptions.length > 0) {
      return prod.glazeOptions.map(g => g.name);
    }
    return [
      'Glasir Gading Alami',
      'Glasir Abu Kayu Sage',
      'Glasir Batu Pasir',
      'Glasir Biru Samudra (Neko)',
      'Glasir Hitam Arang Tenmoku'
    ];
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
              Anda belum memilih produk keramik pilihan. Temukan cangkir, mangkuk, atau vas cantik hasil kurasi untuk melengkapi ruang tinggal Anda.
            </p>
            <button
              onClick={() => navigate('/katalog')}
              className="claye-terracotta-btn"
              style={{ marginTop: '1.5rem' }}
            >
              JELAJAHI KOLEKSI KURASI →
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
          <span className="bc-current">KERANJANG BELANJA ({allTotalPieces})</span>
        </div>

        {/* HEADER */}
        <div className="cart-page-header">
          <div>
            <div className="studio-edition-badge">
              <span className="badge-dot">•</span> PRODUK SIAP DIKEMAS
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

        <div className="cart-grid-layout">
          {/* DAFTAR ITEM */}
          <div className="cart-items-column">
            {/* BAR PILIH SEMUA */}
            <div className="cart-select-all-bar" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.85rem 1.25rem', backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)', borderRadius: '4px', marginBottom: '1rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-charcoal)' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => selectAllCartItems(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-terracotta)', cursor: 'pointer' }}
                />
                <span>Pilih Semua ({selectedCount}/{cart.length} Produk Terpilih)</span>
              </label>
              {cart.length - selectedCount > 0 && (
                <span style={{ fontSize: '0.78rem', color: '#8A857F' }}>
                  {cart.length - selectedCount} produk disimpan di keranjang untuk nanti
                </span>
              )}
            </div>

            {cart.map((item, idx) => (
              <div key={idx} className="cart-item-row-card" style={{
                opacity: item.selected === false ? 0.65 : 1,
                transition: 'opacity 0.2s ease, border-color 0.2s ease',
                borderColor: item.selected === false ? '#EAE6DF' : '#DED8CF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem 0 0' }}>
                  <input
                    type="checkbox"
                    checked={item.selected !== false}
                    onChange={() => toggleCartItemSelection(idx)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-terracotta)', cursor: 'pointer' }}
                    title={item.selected !== false ? 'Batalkan pilihan' : 'Pilih untuk dibeli'}
                    aria-label={`Pilih ${item.name}`}
                  />
                </div>

                <div className="cart-item-photo">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <div className="item-title-delete-row">
                    <h3 className="cart-item-title">{item.name}</h3>
                    <button onClick={() => removeFromCart(idx)} className="cart-remove-item-btn" title="Hapus produk" aria-label="Hapus">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  <div className="cart-item-glaze-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', margin: '0.35rem 0' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Tipe / Glasir:</span>
                    <select
                      value={item.selectedGlaze || 'Glasir Gading Alami'}
                      onChange={(e) => updateCartItemGlaze(idx, e.target.value)}
                      style={{ padding: '3px 8px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #DED8CF', backgroundColor: '#FAF8F5', color: 'var(--color-charcoal)', cursor: 'pointer' }}
                    >
                      {getAvailableGlazes(item).map((glazeName) => (
                        <option key={glazeName} value={glazeName}>{glazeName}</option>
                      ))}
                    </select>
                  </div>

                  {item.stamp && (
                    <div className="cart-item-stamp-tag">Grafir Khusus: "{item.stamp}" (+Rp25.000)</div>
                  )}

                  <div className="cart-item-unit-price">Rp {item.price.toLocaleString('id-ID')}</div>

                  <div className="cart-qty-subtotal-row">
                    <div className="stepper-quantity-control sm">
                      <button onClick={() => updateCartQty(idx, item.quantity - 1)} className="stepper-btn" aria-label="Kurang">-</button>
                      <span className="stepper-value">{item.quantity}</span>
                      <button onClick={() => updateCartQty(idx, item.quantity + 1)} className="stepper-btn" aria-label="Tambah">+</button>
                    </div>
                    <div className="cart-item-line-total">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-packaging-assurance">
              <div>
                <strong>Gratis Kemasan Protektif CLAYÉ Termasuk</strong>
                <p>Bantalan pulp daur ulang dan pelindung sarang lebah menjamin keramik Anda tiba tanpa risiko pecah. Produk yang tidak dicentang akan tetap tersimpan aman di keranjang.</p>
              </div>
            </div>
          </div>

          {/* RINGKASAN BIAYA */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h2 className="summary-title" style={{ marginBottom: '1.25rem' }}>Ringkasan Biaya</h2>

              {/* INFO PENGANTARAN KOTA PALEMBANG */}
              <div style={{
                marginBottom: '1rem',
                padding: '12px 14px',
                backgroundColor: '#FAF8F5',
                border: '1px solid #EAE6DF',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1rem' }}>🛵</span>
                    <strong style={{ fontSize: '0.82rem', color: '#262422' }}>
                      Pengantaran Mandiri Kota Palembang
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#B87355', fontWeight: 700 }}>
                    Mulai Rp 8.000
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#6E6962', lineHeight: '1.45' }}>
                  Diantar langsung oleh tim internal CLAYÉ Studio. Rincian alamat & kecamatan tujuan diisi langsung di halaman berikutnya.
                </p>
              </div>

              {/* RINCIAN BIAYA */}
              <div className="summary-cost-breakdown">
                <div className="cost-row">
                  <span>Subtotal ({totalPieces} produk terpilih)</span>
                  <strong>Rp {subtotal.toLocaleString('id-ID')}</strong>
                </div>

                <div className="cost-row">
                  <span>Estimasi Ongkos Kirim (Palembang)</span>
                  <strong>{selectedCount > 0 ? `Rp ${shippingCost.toLocaleString('id-ID')}` : 'Rp 0'}</strong>
                </div>

                <div className="cost-row">
                  <span>Kemasan Protektif CLAYÉ</span>
                  <strong className="free-tag">Gratis</strong>
                </div>

                <div className="cost-total-row">
                  <div>
                    <span className="total-label">Estimasi Total COD</span>
                    <span className="total-tax-note">DIBAYAR TUNAI KE KURIR</span>
                  </div>
                  <div className="total-big-amount">
                    Rp {(selectedCount > 0 ? finalTotal : 0).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedCount === 0) {
                    showToast('Silakan pilih minimal 1 karya keramik yang ingin dibeli.', 'error');
                    return;
                  }
                  navigate('/checkout');
                }}
                disabled={selectedCount === 0}
                className="place-order-cta-btn"
                style={{ marginTop: '1.5rem', opacity: selectedCount === 0 ? 0.6 : 1, cursor: selectedCount === 0 ? 'not-allowed' : 'pointer' }}
              >
                {selectedCount === 0 ? 'Pilih Produk untuk Checkout' : `Lanjut ke Pembayaran (${totalPieces} pcs) →`}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button onClick={() => navigate('/katalog')} className="sub-action-link">← Lanjut Belanja</button>
              </div>
            </div>

            <div className="checkout-concierge-callout" style={{ marginTop: '1.5rem' }}>
              Punya pertanyaan seputar kurasi warna glasir atau pesanan khusus?<br />
              <button
                onClick={() => openConcierge('Halo asisten CLAYÉ, saya butuh bantuan konsultasi isi keranjang')}
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
