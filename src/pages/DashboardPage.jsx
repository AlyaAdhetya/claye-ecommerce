import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function DashboardPage() {
  const { user, orders, updateProfile, logout, navigate, showToast } = useShop();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses'
  const [editName, setEditName] = useState(user ? user.name : '');
  const [editPhone, setEditPhone] = useState(user ? user.phone : '');
  const [editAddress, setEditAddress] = useState(user ? user.address : '');

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  if (!user) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px', background: 'var(--color-surface)', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔐</span>
          <h2>Akses Terbatas</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>
            Silakan masuk atau buat akun terlebih dahulu untuk mengakses Dashboard Pelanggan.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg">
            Masuk / Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress
    });
  };

  const statusColors = {
    'Selesai': { bg: '#eafaf1', text: '#27ae60' },
    'Dikirim': { bg: '#ebf5fb', text: '#2980b9' },
    'Diproses': { bg: '#fef9e7', text: '#f39c12' },
    'Menunggu Pembayaran': { bg: '#fdf0ed', text: '#e67e22' }
  };

  return (
    <div className="dashboard-page" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* CUSTOMER HEADER CARD */}
        <div style={{
          background: 'var(--color-surface)',
          padding: '2rem 2.5rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--color-cream-dark)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 700
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-text)' }}>
                  {user.name}
                </h2>
                <span style={{ background: '#fdf6e7', color: '#c27d42', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #fae1b3' }}>
                  ⭐ VIP Artisan Member
                </span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                {user.email} • Bergabung sejak {user.joined || '2026'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--color-cream-light)', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Poin Reward</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>{user.points || 1250} Poin</div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ color: '#c0392b', borderColor: '#f5c6cb' }}
            >
              Keluar (Logout) 🚪
            </button>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* SIDEBAR TABS */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.85rem 1.25rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'orders' ? 'white' : 'var(--color-text)',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span>📦</span> Pesanan Saya ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.85rem 1.25rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'profile' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'profile' ? 'white' : 'var(--color-text)',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span>👤</span> Edit Profil Akun
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.85rem 1.25rem',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'addresses' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'addresses' ? 'white' : 'var(--color-text)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span>📍</span> Buku Alamat
            </button>
          </div>

          {/* TAB CONTENT (2 SPAN) */}
          <div style={{
            gridColumn: 'span 2',
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                  Riwayat & Status Pesanan
                </h3>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
                    <p>Belum ada riwayat pesanan.</p>
                    <button onClick={() => navigate('/katalog')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                      Beli Produk Pertama 🏺
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => {
                      const badgeStyle = statusColors[order.status] || { bg: '#eee', text: '#555' };
                      return (
                        <div
                          key={order.id}
                          style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            background: 'white'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                            <div>
                              <strong style={{ color: 'var(--color-primary)' }}>{order.id}</strong>
                              <span style={{ margin: '0 0.5rem', color: 'var(--color-text-muted)' }}>•</span>
                              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{order.date}</span>
                            </div>
                            <span style={{
                              background: badgeStyle.bg,
                              color: badgeStyle.text,
                              padding: '0.3rem 0.8rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 700
                            }}>
                              {order.status}
                            </span>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            {order.items && order.items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                                <span>{item.name} × {item.quantity}</span>
                                <strong>{formatRupiah(item.price * item.quantity)}</strong>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-cream-dark)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
                            <div>
                              <span style={{ color: 'var(--color-text-muted)' }}>Metode: </span>
                              <strong>{order.paymentMethod || 'Online'}</strong>
                              {order.tracking && (
                                <span style={{ marginLeft: '1rem', color: '#2980b9' }}>
                                  Resi: <strong>{order.tracking}</strong>
                                </span>
                              )}
                            </div>
                            <div>
                              <span style={{ color: 'var(--color-text-muted)' }}>Total: </span>
                              <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{formatRupiah(order.total)}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                  Perbarui Informasi Profil
                </h3>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '520px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Alamat Email</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-cream-light)', cursor: 'not-allowed' }}
                    />
                    <small style={{ color: 'var(--color-text-muted)' }}>Email tidak dapat diubah secara mandiri.</small>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nomor Telepon / WhatsApp</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Alamat Pengiriman Utama</label>
                    <textarea
                      rows="3"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                    Simpan Perubahan ✨
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                  Buku Alamat Pengiriman
                </h3>

                <div style={{ border: '2px solid var(--color-primary)', borderRadius: '12px', padding: '1.25rem', background: 'var(--color-cream-light)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>Rumah Utama (Default)</strong>
                    <span style={{ background: 'var(--color-primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Utama</span>
                  </div>
                  <div style={{ fontWeight: 600 }}>{user.name} ({user.phone || '08123456789'})</div>
                  <p style={{ color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>
                    {user.address || 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12180'}
                  </p>
                </div>

                <button onClick={() => showToast('Fitur tambah alamat tambahan siap digunakan.', 'info')} className="btn btn-secondary">
                  + Tambah Alamat Baru
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
