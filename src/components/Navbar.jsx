import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { cartCount, user, logout, currentRoute, navigate, openConcierge } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const isAdminPage = currentRoute === '/admin' || currentRoute.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate('/katalog');
      setSearchOpen(false);
    }
  };

  if (isAdminPage) {
    return (
      <header className="claye-admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-left">
            <button onClick={() => handleNav('/')} className="claye-brand-logo">
              CLAYÉ
            </button>
          </div>

          <div className="admin-topbar-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Cari pesanan, pelanggan, inventaris..."
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="admin-topbar-right">
            <button
              onClick={() => openConcierge('Notifikasi pesanan baru dan pembaruan pembakaran kiln')}
              className="admin-notification-bell"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notif-dot" />
            </button>

            <div className="admin-user-profile" title="Profil Admin">
              <div className="admin-user-avatar">{user ? user.name.charAt(0).toUpperCase() : 'A'}</div>
              <div className="admin-user-details">
                <span className="admin-user-name">{user ? user.name : 'Admin'}</span>
                <span className="admin-user-role">Admin</span>
              </div>
            </div>

            <button
              onClick={() => handleNav('/')}
              className="admin-storefront-switch"
              title="Lihat Pratinjau Toko Pelanggan"
            >
              Lihat Toko →
            </button>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FAF7F2',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
              title="Keluar dari Akun Admin"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`claye-navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="claye-navbar-container">
          {/* LOGO BRAND */}
          <div className="claye-navbar-brand">
            <button onClick={() => handleNav('/')} className="claye-brand-logo">
              CLAYÉ
            </button>
          </div>

          {/* MENU NAVIGASI BAHASA INDONESIA */}
          <nav className="claye-navbar-links">
            <button
              onClick={() => handleNav('/')}
              className={`nav-text-link ${currentRoute === '/' || currentRoute === '' ? 'active' : ''}`}
            >
              BERANDA
            </button>
            <button
              onClick={() => handleNav('/katalog')}
              className={`nav-text-link ${currentRoute === '/katalog' ? 'active' : ''}`}
            >
              KATALOG
            </button>
            <button
              onClick={() => handleNav('/tentang')}
              className={`nav-text-link ${currentRoute === '/tentang' ? 'active' : ''}`}
            >
              TENTANG KAMI
            </button>
            <button
              onClick={() => handleNav(user ? '/dashboard' : '/login')}
              className={`nav-text-link ${currentRoute === '/dashboard' || currentRoute === '/login' ? 'active' : ''}`}
            >
              AKUN SAYA
            </button>
          </nav>

          {/* AKSI KANAN (CLEAN SVG ICONS TANPA EMOJI) */}
          <div className="claye-navbar-actions">
            {/* PENCARIAN */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="nav-action-icon-btn"
              title="Pencarian Produk"
              aria-label="Pencarian"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* KERANJANG BELANJA */}
            <button
              onClick={() => handleNav('/keranjang')}
              className="nav-action-icon-btn bag-btn"
              title="Keranjang Belanja"
              aria-label="Keranjang Belanja"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="bag-count-badge">{cartCount}</span>
              )}
            </button>

            {/* AKUN / PROFIL PENGGUNA */}
            {user ? (
              <button
                onClick={() => handleNav('/dashboard')}
                className="nav-avatar-btn"
                title={`Akun: ${user.name}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="nav-action-icon-btn"
                title="Masuk / Daftar Akun"
                aria-label="Masuk atau Daftar Akun"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}

            {/* HAMBURGER MENU MOBILE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-toggle"
              aria-label="Buka Menu"
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* BOKS PENCARIAN DROPDOWN */}
        {searchOpen && (
          <div className="navbar-search-bar">
            <form onSubmit={handleSearchSubmit} className="search-form-inner container">
              <input
                type="text"
                placeholder="Cari karya keramik: mug, piring, mangkuk, vas, dripper..."
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-submit-btn">Cari</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="search-cancel-btn">Tutup</button>
            </form>
          </div>
        )}

        {/* MENU MOBILE */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-links">
              <button onClick={() => handleNav('/')} className="mobile-link">BERANDA</button>
              <button onClick={() => handleNav('/katalog')} className="mobile-link">KATALOG PRODUK</button>
              <button onClick={() => handleNav('/tentang')} className="mobile-link">TENTANG KAMI</button>
              <button onClick={() => handleNav('/keranjang')} className="mobile-link">KERANJANG ({cartCount})</button>
              <button onClick={() => handleNav(user ? '/dashboard' : '/login')} className="mobile-link">
                {user ? 'AKUN SAYA' : 'MASUK / DAFTAR'}
              </button>
              <button onClick={() => handleNav('/checkout')} className="mobile-link">PEMBAYARAN (CHECKOUT)</button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
