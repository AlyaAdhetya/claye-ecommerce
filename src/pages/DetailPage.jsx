import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function DetailPage() {
  const { products, selectedProductId, addToCart, wishlist, toggleWishlist, navigate, viewProduct, openConcierge } = useShop();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedGlaze, setSelectedGlaze] = useState(
    product.glazeOptions?.[0]?.name || 'Gading (Ivory)'
  );
  const [stampText, setStampText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeAccordion, setActiveAccordion] = useState('dimensions');

  const hasStamp = stampText.trim().length > 0;
  const unitPrice = product.price + (hasStamp ? 25000 : 0);
  const totalPrice = unitPrice * quantity;

  const isSaved = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, {
      glaze: selectedGlaze,
      stamp: stampText.trim()
    });
  };

  const pairings = [
    products.find(p => p.id === 5) || products[4],
    products.find(p => p.id === 6) || products[5],
    products.find(p => p.id === 7) || products[6]
  ].filter(Boolean);

  return (
    <div className="claye-detail-page">
      <div className="container">
        {/* NAVIGASI ATAS & BATCH */}
        <div className="detail-top-nav-bar">
          <div className="detail-breadcrumb">
            <button onClick={() => navigate('/')}>BERANDA</button>
            <span className="bc-sep">/</span>
            <button onClick={() => navigate('/katalog')}>KATALOG</button>
            <span className="bc-sep">/</span>
            <button onClick={() => navigate('/katalog')}>{product.category.toUpperCase()}</button>
            <span className="bc-sep">/</span>
            <span className="bc-current">{product.name.toUpperCase()}</span>
          </div>

          <div className="studio-batch-header-badge">
            <span className="batch-dot">•</span> {product.batchInfo || 'BATCH STUDIO NO. 14 / 40 BUATAN TANGAN'}
          </div>
        </div>

        {/* TATA LETAK PRODUK UTAMA */}
        <div className="detail-main-layout">
          {/* KOLOM KIRI: GALERI FOTO */}
          <div className="detail-visual-column">
            <div className="main-image-display">
              <img src={activeImage} alt={product.name} />
              <button
                className="image-inspect-zoom-btn"
                title="Perbesar Tampilan Glasir"
                aria-label="Perbesar Foto"
                onClick={() => openConcierge(`Jelaskan detail tekstur dan permukaan glasir ${product.name}`)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
            </div>

            {/* BARIS THUMBNAIL */}
            <div className="thumbnail-gallery-row">
              {(product.thumbnails || [product.image, '/assets/images/product_bowl.jpg', '/assets/images/products_collection.jpg']).map((thumb, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${activeImage === thumb ? 'active-thumb' : ''}`}
                  onClick={() => setActiveImage(thumb)}
                >
                  <img src={thumb} alt={`${product.name} sudut ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* CALLOUT KEASLIAN BUATAN TANGAN */}
            <div className="hand-formed-callout">
              <span className="craft-indicator-bullet">•</span>
              <div className="craft-text">
                <strong>Karakter Buatan Tangan Unik</strong>
                <p>Setiap {product.name} memiliki sedikit perbedaan alami pada lengkungan, berat, dan bintik mineral glasir.</p>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: PANEL PEMBELIAN */}
          <div className="detail-info-column">
            <div className="origin-edition-pill">
              {product.editionInfo || 'STUDIO BALI • EDISI NO. 14'}
            </div>

            <h1 className="product-editorial-title">{product.name}</h1>

            <div className="product-price-tax-row">
              <span className="product-main-price">
                Rp {unitPrice.toLocaleString('id-ID')}
              </span>
              <span className="tax-included-tag">(Sudah Termasuk Pajak)</span>
            </div>

            <p className="product-lead-description">
              {product.description}
            </p>

            {/* PILIHAN WARNA GLASIR */}
            <div className="glaze-finish-section">
              <div className="glaze-section-header">
                <span className="glaze-label">PILIHAN WARNA GLASIR /</span>
                <span className="glaze-selected-name">{selectedGlaze.toUpperCase()} (DIPILIH)</span>
              </div>

              <div className="glaze-swatches-row">
                {product.glazeOptions?.map((glaze) => (
                  <button
                    key={glaze.id}
                    className={`glaze-swatch-item ${selectedGlaze === glaze.name ? 'is-selected' : ''}`}
                    onClick={() => setSelectedGlaze(glaze.name)}
                    type="button"
                  >
                    <span
                      className="swatch-color-circle"
                      style={{ backgroundColor: glaze.hex }}
                    />
                    <span className="swatch-text-name">{glaze.name.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PERSONALISASI GRAFIR NAMA / INISIAL */}
            <div className="personalization-box">
              <div className="personalization-header">
                <span className="pers-label">TAMBAH GRAFIR NAMA ATAU INISIAL (OPSIONAL)</span>
                <span className="pers-cost">+Rp25.000</span>
              </div>
              <div className="pers-input-wrap">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="contoh: AML (maksimal 6 huruf)"
                  value={stampText}
                  onChange={(e) => setStampText(e.target.value.toUpperCase())}
                  className="pers-text-input"
                />
              </div>
              <p className="pers-footnote">
                Dicetak manual pada tanah liat basah sebelum pembakaran pertama (bisque firing).
              </p>
            </div>

            {/* KUANTITAS & TOMBOL BELI */}
            <div className="detail-cta-row">
              <div className="stepper-quantity-control">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="stepper-btn"
                  aria-label="Kurangi jumlah"
                >
                  -
                </button>
                <span className="stepper-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="stepper-btn"
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="detail-add-cart-btn"
              >
                MASUKKAN KERANJANG • Rp {totalPrice.toLocaleString('id-ID')}
              </button>
            </div>

            {/* AKSI PENDUKUNG */}
            <div className="detail-sub-actions">
              <button
                onClick={() => navigate('/katalog')}
                className="sub-action-link"
              >
                ← KEMBALI BELANJA
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`sub-action-link wishlist-btn ${isSaved ? 'saved' : ''}`}
              >
                {isSaved ? 'TERSIMPAN DI FAVORIT' : 'SIMPAN KE DAFTAR FAVORIT'}
              </button>
            </div>

            {/* 3 FITUR PRODUK (CLEAN TANPA EMOJI) */}
            <div className="detail-features-badges-row">
              <div className="feat-badge-item">
                <div className="feat-texts">
                  <strong>RODA PUTAR MANUAL</strong>
                  <span>Stoneware padat tahan panas</span>
                </div>
              </div>
              <div className="feat-badge-item">
                <div className="feat-texts">
                  <strong>AMAN MESIN CUCI PIRING</strong>
                  <span>Standar food grade & microwave</span>
                </div>
              </div>
              <div className="feat-badge-item">
                <div className="feat-texts">
                  <strong>KEMASAN BEBAS PLASTIK</strong>
                  <span>Pelindung honeycomb ramah lingkungan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AKORDION: SPESIFIKASI & PROVENANSI */}
        <section className="provenance-section">
          <div className="provenance-header">
            <span className="prov-small-tag">SPESIFIKASI PRODUK</span>
            <h2 className="prov-serif-title">Detail & Panduan Perawatan</h2>
          </div>

          <div className="provenance-accordions">
            {/* AKORDION 1: DIMENSI */}
            <div className={`accordion-panel ${activeAccordion === 'dimensions' ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'dimensions' ? '' : 'dimensions')}
              >
                <span className="acc-title">Detail & Dimensi Produk</span>
                <span className="acc-arrow">{activeAccordion === 'dimensions' ? '▲' : '▼'}</span>
              </button>

              {activeAccordion === 'dimensions' && (
                <div className="accordion-content">
                  <div className="dimensions-spec-grid">
                    <div className="spec-row">
                      <span className="spec-label">Tinggi</span>
                      <span className="spec-val">{product.specs?.height || '8.5 cm'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Berat Kering</span>
                      <span className="spec-val">{product.specs?.dryWeight || 'Sekitar 340 gram'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Diameter Bibir</span>
                      <span className="spec-val">{product.specs?.rimDiameter || '9.0 cm'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Teknik</span>
                      <span className="spec-val">{product.specs?.technique || 'Roda Putar Tradisional'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Kapasitas Cairan</span>
                      <span className="spec-val">{product.specs?.liquidCapacity || '320 ml'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Asal Studio</span>
                      <span className="spec-val">{product.specs?.origin || 'Bali, Indonesia'}</span>
                    </div>
                  </div>
                  <p className="spec-footer-note">
                    {product.materialsCare}
                  </p>
                </div>
              )}
            </div>

            {/* AKORDION 2: MATERIAL & PERAWATAN */}
            <div className={`accordion-panel ${activeAccordion === 'materials' ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'materials' ? '' : 'materials')}
              >
                <span className="acc-title">Material & Panduan Perawatan</span>
                <span className="acc-arrow">{activeAccordion === 'materials' ? '▲' : '▼'}</span>
              </button>

              {activeAccordion === 'materials' && (
                <div className="accordion-content">
                  <p>{product.materialsCare}</p>
                  <ul className="care-bullet-points">
                    <li>• Aman digunakan untuk penghangatan microwave harian dan siklus dishwasher rumah tangga.</li>
                    <li>• Untuk dasar cangkir yang unglazed, cuci dengan spons lembut dan keringkan secara merata.</li>
                    <li>• Dibakar pada suhu tinggi 1240°C menghasilkan ketahanan jangka panjang yang kokoh.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* AKORDION 3: PENGIRIMAN & KEMASAN */}
            <div className={`accordion-panel ${activeAccordion === 'shipping' ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
              >
                <span className="acc-title">Informasi Pengiriman & Kemasan Aman</span>
                <span className="acc-arrow">{activeAccordion === 'shipping' ? '▲' : '▼'}</span>
              </button>

              {activeAccordion === 'shipping' && (
                <div className="accordion-content">
                  <p>{product.shippingInfo}</p>
                  <p>Semua pesanan dikirim langsung dari studio Bandung dalam waktu 24 jam kerja dengan garansi 100% ganti baru jika mengalami kerusakan selama pengiriman.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PRODUK PELENGKAP */}
        <section className="pairings-section">
          <div className="pairings-section-header">
            <div>
              <span className="pairings-small-tag">REKOMENDASI KOMBINASI</span>
              <h2 className="pairings-title">Lengkapi Ritual Pagi Anda</h2>
            </div>
            <button onClick={() => navigate('/katalog')} className="view-all-objects-link">
              LIHAT SEMUA KARYA →
            </button>
          </div>

          <div className="pairings-grid">
            {pairings.map((pair) => (
              <div key={pair.id} className="pairing-card" onClick={() => viewProduct(pair.id)}>
                <div className="pairing-img-wrap">
                  <img src={pair.image} alt={pair.name} />
                  {pair.badge === 'ritual' && <span className="pair-match-badge">KOMBINASI PAS</span>}
                </div>
                <div className="pairing-info">
                  <h3 className="pairing-name">{pair.name}</h3>
                  <p className="pairing-sub">{pair.subtitle}</p>
                  <div className="pairing-price-row">
                    <span className="pairing-price">Rp {pair.price.toLocaleString('id-ID')}</span>
                    <button
                      className="pairing-quick-add"
                      title="Tambah ke Keranjang"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(pair.id, 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BANNER KOMITMEN */}
        <div className="detail-bottom-promise">
          <span className="detail-promise-label">KOMITMEN CLAYÉ</span>
          <h2 className="detail-promise-title">Dibentuk Sepenuhnya oleh Tangan Manusia</h2>
          <p className="detail-promise-body">
            Kami menghindari proses produksi massal terburu-buru. Tidak ada dua Sunday Mug yang persis sama; bobot dalam jemari dan lengkungan bibir cangkir adalah pengingat tenang bahwa waktu, kesabaran, dan ketulusan menyatu di setiap karya Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
