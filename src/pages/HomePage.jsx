import React from 'react';
import { useShop } from '../context/ShopContext';

export default function HomePage() {
  const { products, navigate, viewProduct, addToCart, openConcierge } = useShop();

  const featured = products.slice(0, 4);

  return (
    <div className="claye-home-page">
      {/* HERO SECTION */}
      <section className="claye-hero-section">
        <div className="container claye-hero-grid">
          {/* KOLOM KIRI HERO */}
          <div className="hero-text-col">
            <div className="studio-edition-badge">
              <span className="badge-dot">•</span> KURASI KOLEKSI 2025
            </div>
            <h1 className="hero-editorial-title">
              Kurasi Keramik Estetik,<br />
              Terpilih untuk Keseharian.
            </h1>
            <p className="hero-editorial-desc">
              Koleksi keramik stoneware pilihan yang dikurasi langsung dari berbagai pengrajin dan studio tembikar terbaik untuk menghadirkan keindahan alami dan ketenangan ke dalam ruang tinggal Anda. Setiap produk diseleksi secara ketat demi kualitas dan estetika terbaik.
            </p>
            <div className="hero-cta-wrap">
              <button
                onClick={() => navigate('/katalog')}
                className="claye-terracotta-btn"
              >
                JELAJAHI KOLEKSI
              </button>
            </div>
          </div>

          {/* KOLOM KANAN HERO - FOTOGRAFI KOLEKSI */}
          <div className="hero-visual-col">
            <div className="hero-image-frame">
              <img
                src="/assets/images/hero_bg.jpg"
                alt="Keramik Stoneware Kurasi Pilihan CLAYÉ"
                className="hero-main-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* KOLEKSI UNGGULAN */}
      <section className="claye-featured-section">
        <div className="container">
          <div className="featured-section-header">
            <div className="curated-pieces-badge">
              <span className="badge-dot">•</span> KOLEKSI PILIHAN
            </div>
            <h2 className="featured-heading">Koleksi Unggulan</h2>
            <p className="featured-subheading">
              Pilihan karya keramik fungsional dan dekoratif hasil kurasi untuk ruang hunian Anda.
            </p>
          </div>

          {/* GRID 4 PRODUK */}
          <div className="claye-curated-grid">
            {featured.map((item) => (
              <div
                key={item.id}
                className="curated-product-card"
                onClick={() => viewProduct(item.id)}
              >
                <div className="curated-img-wrapper">
                  <img src={item.image} alt={item.name} />
                  <div className="curated-card-overlay">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item.id, 1, { glaze: item.glazeOptions?.[0]?.name });
                      }}
                      className="quick-add-pill-btn"
                    >
                      + Tambah Cepat
                    </button>
                  </div>
                </div>

                <div className="curated-card-info">
                  <div className="card-title-price-row">
                    <h3 className="curated-item-name">{item.name}</h3>
                    <span className="curated-item-price">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="card-subtitle-dots-row">
                    <span className="curated-item-subtitle">{item.subtitle}</span>
                    <div className="color-swatch-dots">
                      {item.glazeOptions?.slice(0, 2).map((glaze, idx) => (
                        <span
                          key={idx}
                          className="swatch-dot"
                          style={{ backgroundColor: glaze.hex }}
                          title={glaze.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-collections-row">
            <button
              onClick={() => navigate('/katalog')}
              className="view-archive-link-btn"
            >
              LIHAT SELURUH KOLEKSI TERKURASI →
            </button>
          </div>
        </div>
      </section>

      {/* KOMITMEN KURASI */}
      <section className="claye-promise-banner">
        <div className="container">
          <div className="promise-inner-card">
            <span className="promise-small-label">STANDAR KURASI CLAYÉ</span>
            <h2 className="promise-serif-title">Dikurasi Teliti dari Studio Pengrajin Terbaik</h2>
            <p className="promise-body-text">
              Kami tidak memproduksi secara massal sendiri, melainkan berkeliling mencari dan mengurasi karya keramik terbaik dari pengrajin lokal berbakat dan mitra studio tembikar terpercaya. Setiap karya seperti Sunday Mug maupun mangkuk Solace diseleksi melalui kontrol kualitas ketat untuk memastikan Anda menerima produk berkualitas artisan bernilai tinggi.
            </p>
            <div className="promise-action-link" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/tentang')}
                className="atelier-inquiry-btn"
                style={{ backgroundColor: 'var(--color-charcoal)', color: '#FFFFFF', borderColor: 'var(--color-charcoal)' }}
              >
                Tentang CLAYÉ & Cerita Kurasi →
              </button>
              <button
                onClick={() => openConcierge('Ceritakan bagaimana CLAYÉ mengurasi produk dari mitra pengrajin')}
                className="atelier-inquiry-btn"
              >
                Konsultasi Produk Kurasi
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
