import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { products, navigate, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const featuredProducts = products.slice(0, 4);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Terima kasih! Kupon diskon 15% telah dikirim ke email Anda 🎁', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="homepage">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌿 100% Handcrafted Stoneware Ceramic</div>
          <h1 className="hero-title">
            Keindahan Alami dalam <em>Setiap Sentuhan</em>
          </h1>
          <p className="hero-desc">
            Menghadirkan harmoni alam dan estetika kontemporer ke dalam hunian Anda melalui karya seni keramik buatan tangan para artisan terbaik Indonesia.
          </p>
          <div className="hero-actions">
            <button onClick={() => navigate('/katalog')} className="btn btn-primary btn-lg">
              Jelajahi Koleksi 🏺
            </button>
            <button onClick={() => navigate('/katalog')} className="btn btn-secondary btn-lg">
              Produk Terlaris
            </button>
          </div>
        </div>
      </section>

      {/* VALUES / FEATURES */}
      <section className="section" style={{ background: 'var(--color-cream-light)', padding: '3.5rem 0' }}>
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🖐️</div>
              <h3 className="feature-title">100% Buatan Tangan</h3>
              <p className="feature-desc">Setiap karya dibentuk satu per satu dengan teknik putar dan cetak tangan tradisional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Bahan Alami & Food-Safe</h3>
              <p className="feature-desc">Menggunakan tanah liat pilihan bebas timbal, 100% aman untuk makanan dan minuman.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3 className="feature-title">Garansi Anti Pecah</h3>
              <p className="feature-desc">Pengemasan bubble wrap kayu berlapis dengan garansi ganti baru 100% jika pecah di jalan.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Karakter Eksklusif</h3>
              <p className="feature-desc">Variasi tekstur glasir alami membuat setiap karya memiliki kepribadian yang tiada duanya.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Pilihan Terfavorit</div>
            <h2 className="section-title">Koleksi Unggulan</h2>
            <p className="section-desc">Karya paling digemari yang siap mempercantik ruang makan dan sudut santai Anda.</p>
          </div>

          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => navigate('/katalog')} className="btn btn-secondary btn-lg">
              Lihat Seluruh Katalog ({products.length} Produk) →
            </button>
          </div>
        </div>
      </section>

      {/* ARTISAN STORY / ABOUT BANNER */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <img
                src="/assets/images/products_collection.jpg"
                alt="Koleksi Clayé Ceramic"
                className="about-image"
              />
              <div className="about-float-card">
                <span className="about-float-number">1250°C</span>
                <span className="about-float-label">Suhu pembakaran tungku kayu & listrik bertekanan</span>
              </div>
            </div>

            <div className="about-text-col">
              <div className="section-badge">Filosofi Studio</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                Dari Tanah Liat, Menjadi Warisan Bernilai
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '1.25rem' }}>
                Di studio Clayé, kami percaya bahwa benda sehari-hari haruslah memiliki jiwa. Berawal dari workshop sederhana di Yogyakarta, kami memadukan kekayaan tanah Indonesia dengan desain estetika kontemporer Wabi-Sabi yang merayakan ketidaksempurnaan alami.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
                Setiap cangkir, mangkuk, dan vas melalui 8 tahapan proses teliti selama 14 hari—dari pembentukan, pengeringan perlahan, pembakaran biskuit, pencelupan glasir mineral, hingga pembakaran akhir.
              </p>

              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-number">5.000+</div>
                  <div className="stat-label">Karya Terjual</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Artisan Lokal</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99.4%</div>
                  <div className="stat-label">Kepuasan Pelanggan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Testimoni Pembeli</div>
            <h2 className="section-title">Apa Kata Mereka?</h2>
            <p className="section-desc">Pengalaman nyata para pecinta keramik dan interior rumah di seluruh Indonesia.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "Kualitas keramiknya luar biasa tebal dan kokoh. Warna terracotta dan tekstur naturalnya bener-bener estetik buat foto makanan di kafe saya!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">DN</div>
                <div>
                  <div className="author-name">Dian Novitasari</div>
                  <div className="author-title">Pemilik Café & Food Stylist, Bandung</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "Pengiriman dari Jogja ke Surabaya sampai dengan sangat aman, packing kayu tebal dan rapi tanpa lecet sedikit pun. Set mug-nya jadi favorit suami tiap pagi."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">RP</div>
                <div>
                  <div className="author-name">Rangga Pratama</div>
                  <div className="author-title">Interior Enthusiast, Surabaya</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "Sangat bangga punya karya artisan lokal sekelas Clayé. Desainnya minimalis elegan setara brand keramik luar negeri dengan harga yang sangat masuk akal."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AL</div>
                <div>
                  <div className="author-name">Amanda Lestari</div>
                  <div className="author-title">Arsitek, Jakarta Selatan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section" style={{ background: 'var(--color-primary)', color: 'white', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginBottom: '1rem', color: '#fff' }}>
            Bergabung dengan Komunitas Clayé
          </h2>
          <p style={{ opacity: 0.85, fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Dapatkan informasi koleksi terbaru yang dirilis terbatas, undangan workshop keramik eksklusif, dan voucher diskon 15% untuk pembelian pertama Anda.
          </p>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Masukkan alamat email Anda..."
              required
              style={{
                flex: '1',
                minWidth: '280px',
                padding: '0.9rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem'
              }}
            />
            <button type="submit" className="btn btn-secondary" style={{ background: '#e3a857', border: 'none', color: '#2b1b11', fontWeight: 600 }}>
              Daftar Sekarang ✉️
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
