import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { cartCount, user, currentRoute, navigate } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/' && (currentRoute === '/' || currentRoute === '')) return true;
    return currentRoute.startsWith(path) && path !== '/';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <button
            onClick={() => handleNav('/')}
            className="navbar-logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Clayé<span>.</span>
          </button>

          <ul className="navbar-nav">
            <li>
              <button
                onClick={() => handleNav('/')}
                className={`nav-link-btn ${isActive('/') ? 'active' : ''}`}
              >
                Beranda
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('/katalog')}
                className={`nav-link-btn ${isActive('/katalog') ? 'active' : ''}`}
              >
                Katalog Produk
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('/admin')}
                className={`nav-link-btn ${isActive('/admin') ? 'active' : ''}`}
                style={{ color: '#c27d42', fontWeight: 600 }}
              >
                ⚡ Admin Panel
              </button>
            </li>
          </ul>

          <div className="navbar-actions">
            {user ? (
              <button
                onClick={() => handleNav('/dashboard')}
                className="navbar-icon-btn"
                title={`Profil: ${user.name}`}
                style={{ background: '#ede6dd', fontWeight: 'bold', color: '#8c5936' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="navbar-icon-btn"
                title="Login / Masuk"
              >
                👤
              </button>
            )}

            <button
              onClick={() => handleNav('/keranjang')}
              className="navbar-icon-btn"
              title="Keranjang Belanja"
              style={{ position: 'relative' }}
            >
              🛒
              {cartCount > 0 && (
                <span className="cart-badge" style={{ display: 'flex' }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-panel">
          <div className="mobile-menu-header">
            <span className="navbar-logo">Clayé<span>.</span></span>
            <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
          </div>
          <ul className="mobile-menu-nav">
            <li><button onClick={() => handleNav('/')} className="mobile-link">🏠 Beranda</button></li>
            <li><button onClick={() => handleNav('/katalog')} className="mobile-link">🏺 Katalog Produk</button></li>
            <li><button onClick={() => handleNav('/keranjang')} className="mobile-link">🛒 Keranjang ({cartCount})</button></li>
            {user ? (
              <li><button onClick={() => handleNav('/dashboard')} className="mobile-link">👤 Dashboard ({user.name})</button></li>
            ) : (
              <li><button onClick={() => handleNav('/login')} className="mobile-link">🔐 Masuk / Daftar</button></li>
            )}
            <li><button onClick={() => handleNav('/admin')} className="mobile-link" style={{ color: '#c27d42' }}>⚡ Admin Panel</button></li>
          </ul>
        </div>
      </div>
    </>
  );
}
