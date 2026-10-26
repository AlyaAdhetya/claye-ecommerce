import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function DetailPage() {
  const { products, selectedProductId, addToCart, navigate, showToast } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate('/checkout');
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .concat(products.filter(p => p.id !== product.id && p.category !== product.category))
    .slice(0, 3);

  return (
    <div className="detail-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* BREADCRUMB */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Beranda</button>
          {' / '}
          <button onClick={() => navigate('/katalog')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Katalog</button>
          {' / '}
          <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* MAIN PRODUCT DETAIL GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          background: 'var(--color-surface)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          marginBottom: '3rem'
        }}>
          {/* IMAGE PREVIEW */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              background: 'var(--color-cream-light)',
              aspectRatio: '1/1'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {product.badge && (
              <span className={`product-card-badge badge-${product.badge}`} style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                {product.badge.toUpperCase()}
              </span>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div>
            <div style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              {product.category}
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-text)', marginBottom: '0.75rem', lineHeight: '1.2' }}>
              {product.name}
            </h1>

            {/* RATING */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ color: '#e3a857', fontSize: '1.1rem' }}>
                {'★'.repeat(Math.floor(product.rating || 5))}
                {'☆'.repeat(5 - Math.floor(product.rating || 5))}
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{product.rating || 4.8} / 5.0</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>({product.reviews || 95} Ulasan Terverifikasi)</span>
            </div>

            {/* PRICE */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatRupiah(product.price)}
              </span>
              {product.oldPrice && (
                <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                  {formatRupiah(product.oldPrice)}
                </span>
              )}
              {product.oldPrice && (
                <span style={{ background: '#fdf0ed', color: '#c0392b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                  HEMAT {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* SHORT DESCRIPTION */}
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '1.75rem', fontSize: '1rem' }}>
              {product.description}
            </p>

            {/* STOCK STATUS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27ae60', display: 'inline-block' }}></span>
              <span>Stok Siap Kirim: <strong>{product.stock || 15} unit</strong></span>
            </div>

            {/* QUANTITY & ACTIONS */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'white' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '42px', height: '42px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ width: '45px', textAlign: 'center', fontWeight: 600, fontSize: '1rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '42px', height: '42px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product.id, quantity)}
                className="btn btn-secondary"
                style={{ flex: '1', minWidth: '180px' }}
              >
                🛒 Tambah ke Keranjang
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-primary"
                style={{ flex: '1', minWidth: '160px' }}
              >
                Beli Sekarang ⚡
              </button>
            </div>

            {/* TRUST BADGES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', padding: '1rem', background: 'var(--color-cream-light)', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div>📦 <strong>Garansi Aman:</strong> Ganti baru jika retak/pecah</div>
              <div>⚡ <strong>Kirim Cepat:</strong> Pengiriman hari yang sama</div>
              <div>🌱 <strong>Lead Free:</strong> Bebas bahan beracun</div>
              <div>🧼 <strong>Mudah Dicuci:</strong> Dishwasher safe</div>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('desc')}
              style={{
                padding: '0.75rem 0',
                border: 'none',
                background: 'none',
                fontFamily: 'inherit',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: activeTab === 'desc' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'desc' ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Deskripsi Lengkap
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '0.75rem 0',
                border: 'none',
                background: 'none',
                fontFamily: 'inherit',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'specs' ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Spesifikasi Produk
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              style={{
                padding: '0.75rem 0',
                border: 'none',
                background: 'none',
                fontFamily: 'inherit',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: activeTab === 'shipping' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'shipping' ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Pengemasan & Pengiriman
            </button>
          </div>

          <div>
            {activeTab === 'desc' && (
              <div style={{ lineHeight: '1.9', color: 'var(--color-text)' }}>
                <p style={{ marginBottom: '1rem' }}>
                  {product.description}
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Setiap karya keramik Clayé dibuat menggunakan tanah stoneware terpilih dari daerah perbukitan Jawa yang kaya mineral. Melalui proses putar tangan terampil, setiap produk memiliki sentuhan organik unik yang tidak akan pernah Anda temukan pada produk buatan pabrik massal.
                </p>
                <h4 style={{ margin: '1.5rem 0 0.5rem', fontFamily: 'var(--font-serif)' }}>Petunjuk Perawatan:</h4>
                <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
                  <li>Aman dicuci menggunakan sabun cuci piring biasa dan spons lembut.</li>
                  <li>Dapat digunakan di dalam microwave untuk menghangatkan makanan.</li>
                  <li>Hindari perubahan suhu ekstrem secara mendadak (misal langsung menuang air mendidih dari freezer).</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {product.specs ? Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} style={{ padding: '1rem', background: 'var(--color-cream-light)', borderRadius: '8px' }}>
                    <div style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                      {key}
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{val}</div>
                  </div>
                )) : (
                  <p>Spesifikasi standar stoneware Clayé Studio.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
                <p style={{ marginBottom: '1rem' }}>
                  📦 <strong>Proteksi Berlapis 5 Tingkat:</strong> Kertas kado daur ulang → Bubble wrap tebal 4 lapis → Box karton tebal khusus → Sekat pelindung sudut → Packing kayu standar kurir untuk pengiriman luar kota.
                </p>
                <p>
                  🛡️ <strong>Klaim Asuransi Sangat Mudah:</strong> Cukup sertakan video unboxing tanpa jeda saat membuka paket. Jika terjadi keretakan atau kerusakan akibat pengiriman, kami kirimkan unit baru secara gratis!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <div className="section-badge">Rekomendasi</div>
            <h2 className="section-title">Karya Keramik Terkait</h2>
          </div>
          <div className="products-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
