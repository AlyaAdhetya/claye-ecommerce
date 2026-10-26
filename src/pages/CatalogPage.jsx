import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CatalogPage() {
  const { products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [badgeFilter, setBadgeFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesBadge = badgeFilter === 'all' || p.badge === badgeFilter;
        return matchesCategory && matchesSearch && matchesBadge;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.reviews || 0) - (a.reviews || 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, badgeFilter]);

  return (
    <div className="catalog-page" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* CATALOG HEADER */}
        <div className="catalog-hero" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-badge">Artisan Stoneware</div>
          <h1 className="section-title" style={{ fontSize: '2.6rem' }}>Katalog Produk Keramik</h1>
          <p className="section-desc">
            Jelajahi seluruh karya keramik buatan tangan kami yang memadukan fungsi praktis dan estetika alami.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="catalog-controls" style={{
          background: 'var(--color-surface)',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem'
        }}>
          {/* SEARCH INPUT */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari mangkuk, vas bunga, mug kopi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
                🔍
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="popular">🔥 Paling Populer</option>
                <option value="price-asc">💵 Harga: Rendah ke Tinggi</option>
                <option value="price-desc">💎 Harga: Tinggi ke Rendah</option>
                <option value="rating">⭐ Rating Tertinggi</option>
              </select>

              <select
                value={badgeFilter}
                onChange={(e) => setBadgeFilter(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  background: 'white',
                  fontSize: '0.9rem'
                }}
              >
                <option value="all">Semua Tipe</option>
                <option value="sale">Diskon (Sale)</option>
                <option value="new">Koleksi Baru</option>
                <option value="limited">Edisi Terbatas</option>
              </select>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: selectedCategory === cat ? 'var(--color-primary)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--color-text)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS INFO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          <div>
            Menampilkan <strong>{filteredProducts.length}</strong> karya keramik
            {selectedCategory !== 'Semua' && ` dalam kategori "${selectedCategory}"`}
            {searchQuery && ` untuk pencarian "${searchQuery}"`}
          </div>
          {(selectedCategory !== 'Semua' || searchQuery || badgeFilter !== 'all') && (
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); setBadgeFilter('all'); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🏺</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Karya Tidak Ditemukan</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Maaf, tidak ada produk keramik yang sesuai dengan filter atau pencarian Anda.
            </p>
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); setBadgeFilter('all'); }}
              className="btn btn-primary"
            >
              Tampilkan Semua Koleksi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
