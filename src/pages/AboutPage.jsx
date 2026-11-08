import React from 'react';
import { useShop } from '../context/ShopContext';

export default function AboutPage() {
  const { navigate, openConcierge } = useShop();

  const curators = [
    {
      name: 'Azwina Clayora',
      role: 'Pendiri & Lead Curator',
      experience: '12 Tahun Eksplorasi Seni Keramik',
      bio: 'Menjelajahi sentra-sentra tembikar tradisional di Jawa Barat, Yogyakarta, hingga Bali untuk membangun kemitraan langsung dengan para pengrajin lokal berbakat dan memilih karya terbaik mereka.',
      image: '/assets/images/hero_bg.jpg'
    },
    {
      name: 'Alsywila Adhira',
      role: 'Kepala Kontrol Kualitas & Standar Food-Safe',
      experience: '8 Tahun Riset Material & Glasir',
      bio: 'Memeriksa setiap batch produk yang masuk dari pengrajin mitra. Memastikan standar pembakaran suhu tinggi, uji ketahanan microwave/dishwasher, serta 100% bebas timbal dan racun.',
      image: '/assets/images/product_vase.jpg'
    },
    {
      name: 'Altaz R.',
      role: 'Kepala Logistik & Standar Kemasan Aman',
      experience: '9 Tahun Spesialis Barang Pecah Belah',
      bio: 'Merancang sistem pengemasan protektif sarang lebah (honeycomb) ramah lingkungan dan memastikan setiap produk pesanan sampai dengan selamat di tangan pelanggan ke seluruh Indonesia.',
      image: '/assets/images/product_bowl.jpg'
    }
  ];

  const curationSteps = [
    {
      step: '01',
      title: 'Riset & Kemitraan Pengrajin',
      subtitle: 'Menjalin Relasi Langsung dengan Sentra Tembikar',
      desc: 'Kami berkeliling dan bermitra langsung dengan studio tembikar independen serta pengrajin lokal di berbagai daerah seperti Kasongan, Sukabumi, Bandung, dan Bali tanpa perantara spekulatif.'
    },
    {
      step: '02',
      title: 'Kurasi & Seleksi Desain',
      subtitle: 'Hanya Karya Bernilai Estetika Tinggi',
      desc: 'Kami memilih produk yang memiliki keseimbangan fungsi dan estetika wabi-sabi: nyaman digenggam, proporsi seimbang, serta menampilkan karakter alami tanah liat dan glasir mineral.'
    },
    {
      step: '03',
      title: 'Uji Kualitas & Standar Food-Safe',
      subtitle: 'Pemeriksaan Teliti Satu Per Satu',
      desc: 'Setiap karya keramik diperiksa kelayakan fisiknya—memastikan tidak ada retak rambut tersembunyi, dasar produk dihaluskan agar tidak menggores meja, dan glasir 100% aman untuk makanan panas.'
    },
    {
      step: '04',
      title: 'Pergudangan & Katalogisasi Transparan',
      subtitle: 'Penyimpanan Terpusat di Palembang',
      desc: 'Produk yang lolos seleksi disimpan di fasilitas gudang terpusat kami dengan kontrol kelembapan ideal, lalu difoto dan didokumentasikan spesifikasinya secara transparan di katalog online CLAYÉ.'
    },
    {
      step: '05',
      title: 'Pengemasan Aman & Garansi Pengiriman',
      subtitle: 'Garansi 100% Ganti Baru Jika Pecah',
      desc: 'Pesanan dikemas menggunakan bantalan pulp daur ulang dan honeycomb wrap tebal. Kami memberikan garansi penggantian baru tanpa biaya jika barang rusak dalam perjalanan ekspedisi.'
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
      title: '100% Food-Safe & Lolos Uji Keamanan',
      desc: 'Seluruh produk keramik yang kami kurasi diverifikasi bebas timbal (lead-free), kadmium, dan bahan kimia beracun sehingga aman untuk hidangan makanan serta minuman harian.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      title: 'Standar Keramik Stoneware Kokoh',
      desc: 'Kami hanya menyeleksi produk berbahan stoneware hasil pembakaran suhu tinggi (high-fire 1200°C–1260°C) yang padat, tahan retak, serta aman untuk microwave dan mesin cuci piring.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      ),
      title: 'Pengemasan Ramah Lingkungan & Anti-Pecah',
      desc: 'Menggunakan kertas sarang lebah (honeycomb paper) dan kardus daur ulang protektif berlapis tanpa styrofoam, dengan garansi 100% ganti baru jika pecah dalam pengiriman.'
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
      desc: 'Kami membeli produk langsung dari pengrajin dengan harga yang adil, membantu studio tembikar lokal memperluas jangkauan pasar ke pelanggan modern di seluruh Indonesia.'
    }
  ];

  return (
    <div className="claye-about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-inner">
            <div className="studio-edition-badge" style={{ marginBottom: '1rem' }}>
              TENTANG KAMI • PLATFORM KURASI KERAMIK
            </div>
            <h1 className="about-hero-title">
              Menghubungkan Karya Pengrajin Keramik Lokal dengan Ruang Hidup Anda
            </h1>
            <p className="about-hero-lead">
              CLAYÉ adalah platform toko kurasi keramik dan stoneware estetik. Kami tidak memproduksi barang sendiri, melainkan mencari, menyeleksi, dan mengambil karya tembikar terbaik langsung dari pengrajin lokal dan studio independen terpercaya di berbagai daerah Indonesia untuk dijual kembali kepada Anda dengan jaminan mutu, keamanan kemasan, dan transparansi penuh.
            </p>
            <div className="about-hero-actions">
              <button onClick={() => navigate('/katalog')} className="claye-terracotta-btn">
                Jelajahi Koleksi Kurasi
              </button>
              <button
                onClick={() => openConcierge('Halo tim CLAYÉ, saya ingin bertanya tentang cara kurasi produk dan kemitraan pengrajin')}
                className="btn-modal-cancel"
                style={{ padding: '14px 24px', backgroundColor: 'transparent', borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
              >
                Konsultasi Produk & Galeri
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
              <span className="stat-caption">Produk Terkurasi & Lolos Kontrol Kualitas</span>
            </div>
            <div className="about-stat-item">
              <strong className="stat-number">15+</strong>
              <span className="stat-caption">Mitra Pengrajin & Studio Lokal</span>
            </div>
            <div className="about-stat-item">
              <strong className="stat-number">2021</strong>
              <span className="stat-caption">Berdiri sebagai Toko Kurasi di Palembang</span>
            </div>
            <div className="about-stat-item">
              <strong className="stat-number">0%</strong>
              <span className="stat-caption">Bahan Kimia Beracun (100% Food-Safe)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CERITA DAN MISI KURASI */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <span className="story-kicker">CERITA DAN MISI KAMI</span>
              <h2 className="story-serif-heading">
                Mengapa Kami Memilih Model Kurasi & Reseller?
              </h2>
              <div className="story-body-text">
                <p>
                  Indonesia kaya akan sentra keramik dan tembikar tradisional—mulai dari Kasongan di Yogyakarta, Plered di Purwakarta, Sukabumi, hingga studio-studio artisan di Bali. Di tempat-tempat ini, tangan-tangan terampil menghasilkan keramik dengan estetika organik dan kehangatan yang tiada duanya.
                </p>
                <p>
                  Namun, banyak pengrajin berbakat menghadapi tantangan dalam pemasaran digital, standardisasi kontrol kualitas barang pecah belah, dan pengemasan jarak jauh yang aman. Di situlah CLAYÉ hadir sebagai jembatan.
                </p>
                <p>
                  Kami tidak membuka pabrik pembuatan sendiri. Kami memilih peran sebagai kurator dan penjual kembali (reseller resmi) yang selektif. Kami mengambil produk unggulan langsung dari para pengrajin, membelinya secara adil, melakukan pemeriksaan mutu ketat, lalu menyediakannya di etalase e-commerce ini agar Anda dapat memilikinya dengan mudah dan aman.
                </p>
              </div>

              <div className="story-quote-box">
                <p className="quote-text">
                  "Misi kami sederhana: menghargai keahlian perajin lokal dengan membawa karya terbaik mereka masuk ke ruang-ruang tinggal modern, terlindung dengan standar pengemasan terbaik dan kontrol kualitas terpercaya."
                </p>
                <span className="quote-author">— Azwina Clayora, Pendiri CLAYÉ</span>
              </div>
            </div>

            <div className="about-story-visual">
              <div className="story-image-card">
                <img
                  src="/assets/images/products_collection.jpg"
                  alt="Koleksi Keramik Kurasi CLAYÉ"
                  className="story-main-img"
                />
                <div className="story-image-caption">
                  <span>Showroom & Pusat Distribusi Palembang</span>
                  <span>Koleksi Terkurasi 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROSES KURASI 5 TAHAP */}
      <section className="about-process-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="studio-edition-badge">
              DARI SENTRA PENGRAJIN KE RUMAH ANDA
            </div>
            <h2 className="section-serif-title">5 Tahap Proses Kurasi & Penjualan Kami</h2>
            <p className="section-sub-desc">
              Bagaimana kami memastikan setiap produk keramik yang Anda terima memiliki mutu tinggi dan selamat sampai di tujuan.
            </p>
          </div>

          <div className="process-timeline-grid">
            {curationSteps.map((step) => (
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

      {/* 5. PROFIL TIM KURASI */}
      <section className="about-artisans-section">
        <div className="container">
          <div className="section-header-centered">
            <div className="studio-edition-badge">
              TIM DI BALIK CLAYÉ
            </div>
            <h2 className="section-serif-title">Kurator dan Pengelola Kualitas</h2>
            <p className="section-sub-desc">
              Tim yang berdedikasi mencari, menyeleksi, dan memastikan produk keramik terbaik sampai ke tangan Anda.
            </p>
          </div>

          <div className="artisans-grid">
            {curators.map((curator, idx) => (
              <div key={idx} className="artisan-card">
                <div className="artisan-img-wrap">
                  <img src={curator.image} alt={curator.name} />
                  <span className="artisan-exp-tag">{curator.experience}</span>
                </div>
                <div className="artisan-info">
                  <h3 className="artisan-name">{curator.name}</h3>
                  <span className="artisan-role">{curator.role}</span>
                  <p className="artisan-bio">{curator.bio}</p>
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
            <h2 className="section-serif-title">Nilai dan Standar Kurasi Kami</h2>
            <p className="section-sub-desc">
              Integritas material, transparansi asal-usul produk, dan rasa tanggung jawab adalah komitmen utama kami kepada Anda.
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

      {/* 7. KUNJUNGAN SHOWROOM */}
      <section className="about-visit-section">
        <div className="container">
          <div className="visit-inner-banner">
            <div className="visit-content-col">
              <span className="visit-badge">GALERI & SHOWROOM KURASI</span>
              <h2 className="visit-title">Kunjungi Galeri Kurasi Kami di Palembang</h2>
              <p className="visit-desc">
                Ingin melihat langsung tekstur, bobot, dan keindahan warna glasir berbagai keramik pilihan kami? Galeri dan showroom CLAYÉ di Palembang terbuka bagi Anda yang ingin memilih produk secara langsung sebelum membeli.
              </p>
              <div className="visit-details-list">
                <div className="vdetail-item">
                  <strong>Lokasi Showroom & Gudang:</strong>
                  <span>Jl. Sejuta Kenangan, Palembang, Sumatera Selatan</span>
                </div>
                <div className="vdetail-item">
                  <strong>Jam Operasional Galeri:</strong>
                  <span>Senin – Sabtu: 08:00 – 19:00 WIB (Minggu Tutup)</span>
                </div>
                <div className="vdetail-item">
                  <strong>Layanan Konsultasi Meja Makan:</strong>
                  <span>Tersedia sesi konsultasi gratis untuk padu padan peralatan makan dan dekorasi interior.</span>
                </div>
              </div>

              <div className="visit-cta-row">
                <button
                  onClick={() => openConcierge('Halo tim CLAYÉ, saya ingin reservasi jadwal kunjungan ke galeri kurasi di Palembang')}
                  className="claye-terracotta-btn"
                >
                  Jadwalkan Kunjungan Galeri
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
                  alt="Suasana Galeri Kurasi CLAYÉ Palembang"
                  className="visit-main-img"
                />
                <div className="visit-floating-tag">
                  <span>Galeri & Showroom Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
