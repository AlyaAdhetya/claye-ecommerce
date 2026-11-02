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
              <span className="badge-dot">•</span> EDISI STUDIO 2025
            </div>
            <h1 className="hero-editorial-title">
              Karya Keramik Estetik,<br />
              Dibuat untuk Keseharian.
            </h1>
            <p className="hero-editorial-desc">
              Keramik stoneware buatan tangan yang dibakar dengan kesabaran untuk menghadirkan keindahan alami dan ketenangan ke dalam ruang tinggal Anda. Setiap karya membawa karakter otentik sang perajin.
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

          {/* KOLOM KANAN HERO - FOTOGRAFI STUDIO */}
          <div className="hero-visual-col">
            <div className="hero-image-frame">
              <img
                src="/assets/images/hero_bg.jpg"
                alt="Keramik Stoneware Buatan Tangan CLAYÉ"
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
              Pilihan karya keramik fungsional dan dekoratif untuk ruang hunian Anda.
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
              LIHAT SELURUH KOLEKSI STUDIO →
            </button>
          </div>
        </div>
      </section>

      {/* KOMITMEN KERAJINAN TANGAN */}
      <section className="claye-promise-banner">
        <div className="container">
          <div className="promise-inner-card">
            <span className="promise-small-label">KOMITMEN STUDIO CLAYÉ</span>
            <h2 className="promise-serif-title">Dibentuk Sepenuhnya oleh Tangan Manusia</h2>
            <p className="promise-body-text">
              Kami menolak pencetakan massal instan. Setiap karya Sunday Mug maupun mangkuk Solace memiliki sedikit perbedaan organik yang unik; bobot dalam jemari dan lengkungan bibir cangkir adalah bukti nyata bahwa waktu, ketulusan, dan tanah liat menyatu menjadi karya bernilai tinggi.
            </p>
            <div className="promise-action-link" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/tentang')}
                className="atelier-inquiry-btn"
                style={{ backgroundColor: 'var(--color-charcoal)', color: '#FFFFFF', borderColor: 'var(--color-charcoal)' }}
              >
                Tentang Studio & Cerita Kami →
              </button>
              <button
                onClick={() => openConcierge('Ceritakan proses kurasi karya keramik di studio CLAYÉ')}
                className="atelier-inquiry-btn"
              >
                Konsultasi Karya Keramik
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
