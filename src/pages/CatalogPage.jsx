import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';

export default function CatalogPage() {
  const { products, viewProduct, addToCart, navigate } = useShop();

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'Semua' || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.reviews || 0) - (a.reviews || 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="claye-catalog-page">
      <div className="container">
        {/* BREADCRUMB */}
        <div className="catalog-breadcrumb">
          <button onClick={() => navigate('/')}>BERANDA</button>
          <span className="bc-sep">/</span>
          <span className="bc-current">SEMUA KOLEKSI</span>
        </div>

        {/* HEADER KATALOG */}
        <div className="catalog-page-header">
          <div className="studio-edition-badge">
            <span className="badge-dot">•</span> KOLEKSI KERAMIK ATELIER
          </div>
          <h1 className="catalog-main-title">Katalog Produk Keramik</h1>
          <p className="catalog-lead-text">
            Koleksi stoneware buatan tangan yang dibakar dengan suhu tinggi menggunakan tanah liat mineral nusantara dan glasir alami food-grade.
          </p>
        </div>

        {/* FILTER KATEGORI & PENCARIAN */}
        <div className="catalog-toolbar-panel">
          {/* DAFTAR KATEGORI */}
          <div className="catalog-category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-pill-btn ${selectedCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PENCARIAN & URUTAN */}
          <div className="catalog-search-sort-row">
            <div className="search-field-wrap">
              <input
                type="text"
                placeholder="Cari mug, piring, mangkuk, vas, teko..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="catalog-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Hapus pencarian">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>

            <div className="sort-dropdown-wrap">
              <span className="sort-label">URUTKAN:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="catalog-sort-select"
              >
                <option value="popular">Paling Populer</option>
                <option value="price-asc">Harga: Rendah ke Tinggi</option>
                <option value="price-desc">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* JUMLAH HASIL */}
        <div className="catalog-results-meta">
          Menampilkan <strong>{filteredProducts.length}</strong> karya keramik
          {selectedCategory !== 'Semua' && <span> pada kategori "{selectedCategory}"</span>}
        </div>

        {/* GRID PRODUK */}
        {filteredProducts.length === 0 ? (
          <div className="catalog-empty-notice">
            <h3>Karya Keramik Tidak Ditemukan</h3>
            <p>Coba gunakan kata kunci lain atau hapus filter kategori.</p>
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
              className="claye-terracotta-btn"
              style={{ marginTop: '1rem' }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="claye-curated-grid catalog-grid">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="curated-product-card"
                onClick={() => viewProduct(item.id)}
              >
                <div className="curated-img-wrapper">
                  <img src={item.image} alt={item.name} />
                  {item.badge && (
                    <span className="card-top-badge">
                      {item.badge.toUpperCase()}
                    </span>
                  )}
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
                      {item.glazeOptions?.map((glaze, idx) => (
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
        )}
      </div>
    </div>
  );
}
