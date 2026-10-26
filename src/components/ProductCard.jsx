import React from 'react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart, viewProduct, showToast } = useShop();

  const badgeMap = {
    new: 'badge-new',
    sale: 'badge-sale',
    popular: 'badge-popular',
    limited: 'badge-limited'
  };

  const badgeLabels = {
    new: 'Baru',
    sale: 'Sale',
    popular: 'Populer',
    limited: 'Terbatas'
  };

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onClick={() => viewProduct(product.id)}
          style={{ cursor: 'pointer' }}
        />
        {product.badge && (
          <span className={`product-card-badge ${badgeMap[product.badge] || 'badge-new'}`}>
            {badgeLabels[product.badge] || product.badge}
          </span>
        )}
        <div className="product-card-actions">
          <button
            className="product-card-action-btn"
            title="Tambah ke Wishlist"
            onClick={() => showToast(`"${product.name}" ditambahkan ke wishlist ❤️`, 'success')}
          >
            ♡
          </button>
          <button
            className="product-card-action-btn"
            title="Lihat Detail"
            onClick={() => viewProduct(product.id)}
          >
            👁
          </button>
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-category">{product.category}</div>
        <div
          className="product-name"
          onClick={() => viewProduct(product.id)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </div>
        <div className="product-rating">
          <span className="stars">
            {'★'.repeat(Math.floor(product.rating || 5))}
            {'☆'.repeat(5 - Math.floor(product.rating || 5))}
          </span>
          <span className="rating-count">({product.reviews || 0})</span>
        </div>
        <div className="product-price-row">
          <div>
            <div className="product-price">{formatRupiah(product.price)}</div>
            {product.oldPrice && (
              <div className="product-price-old">{formatRupiah(product.oldPrice)}</div>
            )}
          </div>
          <button
            className="product-add-btn"
            onClick={() => addToCart(product.id)}
            title="Tambah ke Keranjang"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
