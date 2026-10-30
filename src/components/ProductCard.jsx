import React from 'react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart, viewProduct, showToast, toggleWishlist, wishlist } = useShop();

  const isSaved = wishlist.includes(product.id);

  const badgeLabels = {
    new: 'Baru',
    sale: 'Promo',
    popular: 'Populer',
    limited: 'Terbatas'
  };

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  return (
    <div className="curated-product-card" onClick={() => viewProduct(product.id)}>
      <div className="curated-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        {product.badge && (
          <span className="card-top-badge">
            {badgeLabels[product.badge] || product.badge.toUpperCase()}
          </span>
        )}
        <div className="curated-card-overlay">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
            }}
            className="quick-add-pill-btn"
          >
            + Tambah Cepat
          </button>
        </div>
      </div>

      <div className="curated-card-info">
        <div className="card-title-price-row">
          <h3 className="curated-item-name">{product.name}</h3>
          <span className="curated-item-price">{formatRupiah(product.price)}</span>
        </div>
        <div className="card-subtitle-dots-row">
          <span className="curated-item-subtitle">{product.subtitle || product.category}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            title={isSaved ? 'Hapus dari favorit' : 'Simpan favorit'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isSaved ? '#B87355' : 'none'}
              stroke={isSaved ? '#B87355' : '#827D76'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
