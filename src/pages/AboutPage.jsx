import React from 'react';
import { useShop } from '../context/ShopContext';

export default function AboutPage() {
  const { navigate, openConcierge } = useShop();

  const artisans = [
    {
      name: 'Rian Wicaksono',
      role: 'Master Ceramist dan Pendiri Studio',
      experience: '12 Tahun Praktik Keramik',
      bio: 'Lulusan Seni Rupa ITB yang mendedikasikan hidupnya pada teknik pembentukan roda putar manual. Terinspirasi oleh filosofi kesederhanaan Jepang dan tanah liat pegunungan Jawa Barat.',
      image: '/assets/images/hero_bg.jpg'
    },
    {
      name: 'Maya Larasati',
      role: 'Kepala Formulasi Glasir Mineral',
      experience: '8 Tahun Riset Material',
      bio: 'Meracik seluruh glasir studio menggunakan mineral alam Indonesia, abu kayu pinus, dan pasir silika tanpa bahan kimia sintetis atau logam berat beracun.',
      image: '/assets/images/product_vase.jpg'
    },
    {
      name: 'Danu Setiawan',
      role: 'Master Craftsman dan Kontrol Kualitas',
      experience: '9 Tahun Pengrajin Keramik',
      bio: 'Bertanggung jawab penuh atas kualitas fisik dan estetika setiap karya. Memastikan ketahanan keramik stoneware yang kokoh, berbobot pas, dan nyaman digunakan sehari-hari.',
      image: '/assets/images/product_bowl.jpg'
    }
  ];

  const craftSteps = [
    {
      step: '01',
      title: 'Pemilihan dan Penempaan Tanah Liat',
      subtitle: 'Stoneware Alami Jawa Barat',
      desc: 'Kami memilih tanah liat stoneware berkualitas dari Sukabumi dan Purwakarta. Tanah liat diuleni dan ditempa (wedging) manual untuk membuang seluruh gelembung udara mikro, memastikan kekenyalan optimal dan menghindari retak saat pembakaran.'
    },
    {
      step: '02',
      title: 'Pembentukan di Roda Putar',
      subtitle: 'Wheel Throwing Satu Per Satu',
      desc: 'Setiap cangkir, mangkuk, dan teko dibentuk perlahan di atas roda putar oleh tangan pengrajin. Kami membiarkan bekas sentuhan jemari alami tetap terlihat sebagai tanda otentikasi karya buatan tangan yang hidup.'
    },
    {
      step: '03',
      title: 'Pengeringan dan Pembakaran Bisque',
      subtitle: 'Suhu 900°C Selama 10 Jam',
      desc: 'Karya setengah kering dipangkas (trimming) bagian bawahnya dan dibiarkan mengering secara alami selama 7 hari di ruang studio bersuhu sejuk sebelum masuk pembakaran awal bisque 900°C agar cukup kuat menyerap glasir.'
    },
    {
      step: '04',
      title: 'Formulasi dan Pencelupan Glasir Alami',
      subtitle: '100% Food-Safe dan Tanpa Timbal',
      desc: 'Formula glasir khas CLAYÉ dibuat dari abu kayu, feldspar, dan lempung vulkanik. Keramik dicelup atau disapu tangan satu per satu untuk menciptakan gradasi warna wabi-sabi yang unik dan tahan gores.'
    },
    {
      step: '05',
      title: 'Proses Pematangan Keramik (High-Fire)',
      subtitle: 'Stoneware Padat Tahan Lama',
      desc: 'Karya melewati proses pematangan bersuhu tinggi agar partikel tanah memadat sempurna menjadi keramik non-porous yang kokoh, higienis, serta aman untuk microwave, dishwasher, dan penggunaan harian.'
    }
  ];

  const values = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 11 14 15 10"></polyline>
        </svg>
      ),
      title: '100% Aman untuk Makanan (Food-Safe)',
      desc: 'Seluruh karya keramik CLAYÉ bebas dari timbal (lead-free), kadmium, dan racun kimia sintetis. Aman untuk minuman hangat dan makanan panas.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      title: 'Kekuatan Stoneware Tahan Lama',
      desc: 'Melalui pembakaran 1260°C, material memiliki ketahanan tinggi terhadap benturan ringan, aman dimasukkan ke mesin pencuci piring (dishwasher) dan microwave.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      ),
      title: 'Slow Living dan Keberlanjutan',
      desc: 'Kami mempraktikkan daur ulang tanah liat sisa produksi tanpa limbah (zero clay waste), menggunakan kemasan kardus daur ulang, dan menolak produksi massal instan.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: 'Pemberdayaan Pengrajin Lokal',
      desc: 'Setiap karya mendukung studio independen di Bandung dan rantai pasokan bahan baku lokal perajin tanah liat tradisional Indonesia.'
    }
  ];

  return (
    <div className="claye-about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-inner">
            <div className="studio-edition-badge" style={{ marginBottom: '1rem' }}>
              STUDIO DAN FILOSOFI CLAYÉ
            </div>
            <h1 className="about-hero-title">
              Menghidupkan Jiwa Tanah Liat dan Ketenangan Wabi-Sabi
            </h1>
            <p className="about-hero-lead">
              CLAYÉ lahir di perbukitan Dago, Bandung, dari kecintaan pada keindahan yang bersahaja.
              Kami menciptakan keramik stoneware fungsional yang dibentuk manual dengan kesabaran,
              merayakan ketidaksempurnaan alami dari tanah liat dan sentuhan tangan manusia.
            </p>
            <div className="about-hero-actions">
              <button onClick={() => navigate('/katalog')} className="claye-terracotta-btn">
                Jelajahi Karya Kami
              </button>
              <button
                onClick={() => openConcierge('Halo tim studio CLAYÉ, saya ingin bertanya tentang jadwal kunjungan studio dan pemesanan khusus')}
                className="btn-modal-cancel"
                style={{ padding: '14px 24px', backgroundColor: 'transparent', borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
              >
                Konsultasi dan Kunjungan Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="about-stats-strip">
        <div className="container">
          <div className="about-stats-grid">
            <div className="about-stat-item">
              <strong className="stat-number">100%</strong>
              <span className="stat-caption">Buatan Tangan (Handmade Stoneware)</span>
            </div>
            <div className="about-stat-item">
              <strong className="stat-number">5+</strong>
              <span className="stat-caption">Tahun Dedikasi Kerajinan Seni</span>
            </div>
            <div className="about-stat-item">
              <strong className="stat-number">2021</strong>
              <span className="stat-caption">Didirikan di Dago Pakar, Bandung</span>
            </div>
            <div className="about-stat-item">
              <strong className="stat-number">0%</strong>
              <span className="stat-caption">Bahan Kimia Beracun dan Timbal</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CERITA DAN FILOSOFI WABI-SABI */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <span className="story-kicker">FILOSOFI ATELIER</span>
              <h2 className="story-serif-heading">
                Keindahan dalam Kesederhanaan yang Tidak Sempurna
              </h2>
              <div className="story-body-text">
                <p>
                  Di era di mana segala sesuatu diproduksi secara massal dan serba cepat, CLAYÉ memilih jalur yang melambat.
                  Kami memeluk konsep estetika <em>Wabi-Sabi</em> — sebuah cara pandang yang menghargai keindahan dalam ketidakteraturan,
                  kesederhanaan, dan siklus alami waktu.
                </p>
                <p>
                  Setiap karya keramik yang kami keluarkan dari tungku pembakaran membawa sedikit variasi tekstur, perbedaan lekukan glasir,
                  serta bintik-bintik mineral pasir besi alami. Hal tersebut bukanlah cacat, melainkan tanda kehidupan dan sentuhan tulus
                  dari jemari sang pembuat karya.
                </p>
                <p>
                  Cangkir kopi yang pas dalam genggaman, mangkuk sup dengan kehangatan stoneware yang menenangkan, atau piring saji yang
                  membuat santapan harian terasa istimewa — itulah esensi dari apa yang kami ciptakan setiap hari di studio.
                </p>
              </div>

              <div className="story-quote-box">
                <p className="quote-text">
                  "Tanah liat mengajarkan kerendahan hati: jika dipaksa terburu-buru, ia akan retak. Namun jika diiringi kesabaran dan kehangatan api, ia menjadi karya abadi yang menemani keseharian manusia."
                </p>
                <span className="quote-author">— Rian Wicaksono, Pendiri CLAYÉ</span>
              </div>
            </div>

            <div className="about-story-visual">
              <div className="story-image-card">
                <img
                  src="/assets/images/products_collection.jpg"
                  alt="Koleksi Keramik Studio CLAYÉ"
                  className="story-main-img"
                />
                <div className="story-image-caption">
                  <span>Atelier Dago Pakar, Bandung</span>
                  <span>Batch Edisi Studio 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROSES PEMBUATAN 5 TAHAP */}
      <section className="about-process-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="studio-edition-badge">
              DARI TANAH MENJADI KARYA
            </div>
            <h2 className="section-serif-title">5 Tahap Proses Pembuatan Keramik Kami</h2>
            <p className="section-sub-desc">
              Setiap cangkir dan wadah keramik CLAYÉ membutuhkan waktu proses 2 hingga 3 minggu dari awal hingga siap digunakan.
            </p>
          </div>

          <div className="process-timeline-grid">
            {craftSteps.map((step) => (
              <div key={step.step} className="process-card">
                <div className="process-step-badge">{step.step}</div>
                <h3 className="process-card-title">{step.title}</h3>
                <span className="process-card-sub">{step.subtitle}</span>
                <p className="process-card-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROFIL PENGRAJIN / ARTISAN */}
      <section className="about-artisans-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="studio-edition-badge">
              TANGAN DI BALIK CLAYÉ
            </div>
            <h2 className="section-serif-title">Perajin dan Pengelola Studio</h2>
            <p className="section-sub-desc">
              Orang-orang yang menuangkan dedikasi, waktu, dan rasa ke dalam setiap inci tanah liat yang dibentuk.
            </p>
          </div>

          <div className="artisans-grid">
            {artisans.map((artisan, idx) => (
              <div key={idx} className="artisan-card">
                <div className="artisan-img-wrap">
                  <img src={artisan.image} alt={artisan.name} />
                  <span className="artisan-exp-tag">{artisan.experience}</span>
                </div>
                <div className="artisan-info">
                  <h3 className="artisan-name">{artisan.name}</h3>
                  <span className="artisan-role">{artisan.role}</span>
                  <p className="artisan-bio">{artisan.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NILAI-NILAI KAMI */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="studio-edition-badge">
              KOMITMEN KUALITAS
            </div>
            <h2 className="section-serif-title">Nilai dan Standar Kerajinan Kami</h2>
            <p className="section-sub-desc">
              Integritas material dan rasa tanggung jawab lingkungan adalah pilar utama dari setiap karya yang meninggalkan studio kami.
            </p>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon-circle">
                  {v.icon}
                </div>
                <h3 className="value-card-title">{v.title}</h3>
                <p className="value-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. KUNJUNGAN STUDIO DAN WORKSHOP */}
      <section className="about-visit-section">
        <div className="container">
          <div className="visit-inner-banner">
            <div className="visit-content-col">
              <span className="visit-badge">KUNJUNGI ATELIER KAMI</span>
              <h2 className="visit-title">Rasakan Suasana Studio di Dago Pakar, Bandung</h2>
              <p className="visit-desc">
                Studio kami terbuka bagi para penikmat keramik yang ingin melihat langsung proses pembentukan di roda putar,
                merasakan tekstur tanah liat, atau memilih karya keramik langsung dari rak pembakaran.
              </p>
              <div className="visit-details-list">
                <div className="vdetail-item">
                  <strong>Lokasi Studio:</strong>
                  <span>Jl. Rancabentang No. 29, Dago Pakar, Ciumbuleuit, Bandung, Jawa Barat 40142</span>
                </div>
                <div className="vdetail-item">
                  <strong>Jam Kunjungan:</strong>
                  <span>Selasa – Minggu: 10:00 – 17:00 WIB (Senin Tutup untuk Pemeliharaan Studio)</span>
                </div>
                <div className="vdetail-item">
                  <strong>Sesi Workshop Keramik:</strong>
                  <span>Tersedia kelas privat roda putar (Wheel Throwing) setiap akhir pekan melalui reservasi.</span>
                </div>
              </div>

              <div className="visit-cta-row">
                <button
                  onClick={() => openConcierge('Halo tim CLAYÉ, saya ingin reservasi kunjungan studio atau privat workshop keramik')}
                  className="claye-terracotta-btn"
                >
                  Reservasi Kunjungan Studio
                </button>
                <button
                  onClick={() => navigate('/katalog')}
                  className="btn-modal-cancel"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-border)', color: 'var(--color-charcoal)' }}
                >
                  Lihat Katalog Online
                </button>
              </div>
            </div>

            <div className="visit-visual-col">
              <div className="visit-visual-frame">
                <img
                  src="/assets/images/hero_bg.jpg"
                  alt="Suasana Studio CLAYÉ Bandung"
                  className="visit-main-img"
                />
                <div className="visit-floating-tag">
                  <span>Studio & Galeri Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
