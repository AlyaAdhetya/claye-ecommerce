import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';

export default function AdminPage() {
  const { products, orders, addProduct, deleteProduct, navigate, showToast } = useShop();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'new-product'
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Mangkuk');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOldPrice, setNewProdOldPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('new');
  const [newProdStock, setNewProdStock] = useState('15');

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 4850000);
  const totalOrdersCount = orders.length + 18;

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('Harap lengkapi nama produk dan harga!', 'error');
      return;
    }

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price: parseInt(newProdPrice),
      oldPrice: newProdOldPrice ? parseInt(newProdOldPrice) : null,
      description: newProdDesc || 'Karya keramik eksklusif studio Clayé.',
      badge: newProdBadge === 'none' ? null : newProdBadge,
      stock: parseInt(newProdStock) || 10,
      image: '/assets/images/product_bowl.jpg',
      specs: {
        material: 'High-fire Stoneware',
        safe: 'Food Grade & Microwave Safe'
      }
    });

    // Reset form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOldPrice('');
    setNewProdDesc('');
    setActiveTab('products');
  };

  return (
    <div className="admin-page" style={{ padding: '2.5rem 0 5rem', background: '#faf8f5', minHeight: '85vh' }}>
      <div className="container">
        {/* ADMIN HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: '#8c5936', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                ADMIN CONSOLE
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Studio Clayé Ceramic</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-text)', marginTop: '0.35rem' }}>
              Dashboard Pengelola Toko
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/katalog')} className="btn btn-secondary">
              👁️ Lihat Toko Publik
            </button>
            <button onClick={() => setActiveTab('new-product')} className="btn btn-primary">
              + Tambah Produk Baru
            </button>
          </div>
        </div>

        {/* STATS METRIC CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Penjualan Bulan Ini
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {formatRupiah(totalRevenue)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#27ae60', marginTop: '0.35rem' }}>
              ↑ +18.4% dari bulan lalu
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Pesanan Masuk
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {totalOrdersCount} Transaksi
            </div>
            <div style={{ fontSize: '0.8rem', color: '#27ae60', marginTop: '0.35rem' }}>
              4 pesanan menunggu proses
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Produk Aktif
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {products.length} SKU
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Semua katalog siap order
            </div>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Rata-rata Rating
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#e3a857' }}>
              ★ 4.85 / 5.0
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Berdasarkan 850+ ulasan
            </div>
          </div>
        </div>

        {/* TABS CONTROL */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'orders' ? 'white' : 'var(--color-text)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📋 Manajemen Pesanan ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'products' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'products' ? 'white' : 'var(--color-text)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🏺 Manajemen Produk ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'new-product' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'new-product' ? 'white' : 'var(--color-text)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ➕ Tambah Produk
          </button>
        </div>

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
              Daftar Pesanan Masuk
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>ID Pesanan</th>
                    <th style={{ padding: '0.75rem' }}>Tanggal</th>
                    <th style={{ padding: '0.75rem' }}>Pelanggan</th>
                    <th style={{ padding: '0.75rem' }}>Detail Item</th>
                    <th style={{ padding: '0.75rem' }}>Total</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {order.id}
                      </td>
                      <td style={{ padding: '1rem 0.75rem', color: 'var(--color-text-muted)' }}>
                        {order.date}
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div><strong>{order.customer ? order.customer.name : 'Pelanggan'}</strong></div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.customer ? order.customer.phone : '-'}</div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        {order.items ? order.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '0.85rem' }}>• {it.name} ({it.quantity}x)</div>
                        )) : '-'}
                      </td>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: 700 }}>
                        {formatRupiah(order.total)}
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <span style={{
                          background: order.status === 'Selesai' ? '#eafaf1' : '#ebf5fb',
                          color: order.status === 'Selesai' ? '#27ae60' : '#2980b9',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <button
                          onClick={() => showToast(`Status pesanan ${order.id} diperbarui menjadi Dikirim 🚚`, 'success')}
                          style={{ background: 'none', border: '1px solid var(--color-border)', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Update Resi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>
                Katalog Produk Aktif
              </h3>
              <button onClick={() => setActiveTab('new-product')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                + Tambah Baru
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Karya</th>
                    <th style={{ padding: '0.75rem' }}>Kategori</th>
                    <th style={{ padding: '0.75rem' }}>Harga</th>
                    <th style={{ padding: '0.75rem' }}>Stok</th>
                    <th style={{ padding: '0.75rem' }}>Badge</th>
                    <th style={{ padding: '0.75rem' }}>Rating</th>
                    <th style={{ padding: '0.75rem' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div>
                          <strong style={{ display: 'block' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: #{p.id}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{p.category}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatRupiah(p.price)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{p.stock || 12} pcs</td>
                      <td style={{ padding: '0.75rem' }}>
                        {p.badge ? (
                          <span style={{ background: '#fdf0ed', color: '#c0392b', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {p.badge.toUpperCase()}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>★ {p.rating || 5.0}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus produk "${p.name}"?`)) deleteProduct(p.id);
                          }}
                          style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                          Hapus 🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: NEW PRODUCT FORM */}
        {activeTab === 'new-product' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', maxWidth: '640px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
              Tambah Karya Keramik Baru
            </h3>

            <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Contoh: Piring Saji Keramik Wabi-Sabi"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Kategori</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'white' }}
                  >
                    {CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Label Badge</label>
                  <select
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'white' }}
                  >
                    <option value="none">Tanpa Badge</option>
                    <option value="new">Baru (New)</option>
                    <option value="sale">Diskon (Sale)</option>
                    <option value="popular">Populer</option>
                    <option value="limited">Limited Edition</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="250000"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Harga Coret (Rp)</label>
                  <input
                    type="number"
                    value={newProdOldPrice}
                    onChange={(e) => setNewProdOldPrice(e.target.value)}
                    placeholder="300000"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Stok Awal</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="15"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Deskripsi Produk</label>
                <textarea
                  rows="3"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Ceritakan bahan, keunikan, dan dimensi produk ini..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  Simpan & Terbitkan Produk 🏺
                </button>
                <button type="button" onClick={() => setActiveTab('products')} className="btn btn-secondary">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
