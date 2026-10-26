import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart, navigate, showToast } = useShop();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'CLAYE10') {
      setDiscountPercent(10);
      setAppliedCode('CLAYE10');
      showToast('Kupon CLAYE10 berhasil diterapkan! Diskon 10% 🎉', 'success');
    } else if (code === 'HEMAT20') {
      setDiscountPercent(20);
      setAppliedCode('HEMAT20');
      showToast('Kupon HEMAT20 berhasil diterapkan! Diskon 20% 🔥', 'success');
    } else {
      showToast('Kode kupon tidak valid atau sudah kedaluwarsa.', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setAppliedCode('');
    setCouponCode('');
    showToast('Kupon dibatalkan.', 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div style={{ background: 'var(--color-surface)', padding: '4rem 2rem', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem' }}>🛒</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem' }}>
              Keranjang Belanja Kosong
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Anda belum menambahkan karya keramik ke dalam keranjang. Yuk temukan cangkir, mangkuk, atau vas cantik untuk rumah Anda!
            </p>
            <button onClick={() => navigate('/katalog')} className="btn btn-primary btn-lg">
              Mulai Belanja Sekarang 🏺
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
            Keranjang Belanja Anda
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Terdapat <strong>{cart.reduce((s, i) => s + i.quantity, 0)}</strong> item dalam keranjang Anda.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* ITEMS LIST */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontWeight: 600 }}>Produk</span>
              <button
                onClick={() => {
                  if (window.confirm('Hapus semua produk dari keranjang?')) clearCart();
                }}
                style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Kosongkan Keranjang
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--color-cream-dark)'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                  />

                  <div style={{ flex: '1' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-text)' }}>
                      {item.name}
                    </div>
                    <div style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                      {formatRupiah(item.price)}
                    </div>
                  </div>

                  {/* QUANTITY BUTTONS */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'white' }}>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity - 1)}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      -
                    </button>
                    <span style={{ width: '36px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      +
                    </button>
                  </div>

                  {/* SUBTOTAL & REMOVE */}
                  <div style={{ textAlign: 'right', minWidth: '110px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem' }}>
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.35rem' }}
                    >
                      Hapus ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => navigate('/katalog')} className="btn btn-secondary">
                ← Lanjut Belanja
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
              Ringkasan Pesanan
            </h3>

            {/* COUPON FORM */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Punya Kode Voucher Promo? (Coba: <strong>CLAYE10</strong>)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Kode kupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: '1',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.65rem 1.15rem' }}>
                  Gunakan
                </button>
              </div>
              {appliedCode && (
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eafaf1', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: '#27ae60' }}>
                  <span>✓ Kupon {appliedCode} ({discountPercent}%) diterapkan</span>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 600 }}>
                    ✕
                  </button>
                </div>
              )}
            </form>

            {/* TOTALS */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Subtotal Barang</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatRupiah(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60' }}>
                  <span>Diskon Kupon ({discountPercent}%)</span>
                  <span>- {formatRupiah(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Estimasi Ongkir</span>
                <span style={{ color: '#27ae60', fontWeight: 500 }}>Dihitung saat Checkout</span>
              </div>

              <div style={{ borderTop: '2px dashed var(--color-border)', marginTop: '0.5rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>Total Belanja</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '2rem' }}
            >
              Lanjut ke Checkout 💳
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              🔒 Transaksi aman & terenkripsi dengan jaminan garansi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
