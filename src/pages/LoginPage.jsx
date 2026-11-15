import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function LoginPage() {
  const { user, login, register, logout, navigate, showToast, currentRoute } = useShop();

  const [isRegister, setIsRegister] = useState(currentRoute === '/register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah login sebagai pelanggan
  if (user && user.role !== 'admin') {
    return (
      <div className="claye-login-page" style={{ padding: '5rem 0 6rem', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <div className="auth-card-wrapper">
            <h2 className="auth-main-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Halo, {user.name}</h2>
            <p className="auth-lead-sub" style={{ marginBottom: '2rem' }}>Anda sudah masuk sebagai <strong>{user.email}</strong>.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => navigate('/dashboard')} className="claye-terracotta-btn" style={{ width: '100%' }}>
                Lihat Akun Saya
              </button>
              <button onClick={() => navigate('/katalog')} className="btn-modal-cancel" style={{ width: '100%' }}>
                Lanjutkan Belanja
              </button>
              <button
                onClick={logout}
                style={{ background: 'none', border: 'none', color: '#827D76', fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.25rem', textDecoration: 'underline' }}
              >
                Keluar dari Akun
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isRegister) {
        if (!fullName.trim()) {
          showToast('Harap masukkan nama lengkap Anda.', 'error');
          setIsLoading(false);
          return;
        }
        if (!email || !password) {
          showToast('Harap lengkapi email dan kata sandi.', 'error');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          showToast('Kata sandi minimal harus 6 karakter.', 'error');
          setIsLoading(false);
          return;
        }
        register({ fullName, email, phone });
      } else {
        if (!email || !password) {
          showToast('Harap masukkan email dan kata sandi.', 'error');
          setIsLoading(false);
          return;
        }
        login(email, password);
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="claye-login-page" style={{ padding: '3.5rem 1rem 4.5rem', width: '100%' }}>
      <div className="container" style={{ maxWidth: '460px', margin: '0 auto' }}>
        <div className="auth-card-wrapper" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #EAE6DF',
          padding: '2.5rem 2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Logo */}
          <div className="auth-brand-logo" style={{
            textAlign: 'center',
            fontSize: '1.9rem',
            fontFamily: 'var(--font-serif, "Cinzel", "Playfair Display", Georgia, serif)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#262422',
            marginBottom: '0.25rem'
          }}>
            CLAYÉ
          </div>
          <p style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#8C8680',
            marginBottom: '2rem'
          }}>
            Koleksi & Kurasi Keramik Nusantara
          </p>

          {/* Tab Masuk / Daftar */}
          <div className="auth-tabs-toggle" style={{
            display: 'flex',
            backgroundColor: '#F5F2EB',
            borderRadius: '6px',
            padding: '4px',
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              className={`auth-tab-btn ${!isRegister ? 'is-active' : ''}`}
              onClick={() => setIsRegister(false)}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
                color: !isRegister ? '#262422' : '#8C8680',
                boxShadow: !isRegister ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isRegister ? 'is-active' : ''}`}
              onClick={() => setIsRegister(true)}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
                color: isRegister ? '#262422' : '#8C8680',
                boxShadow: isRegister ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Heading */}
          <h1 className="auth-main-title" style={{
            fontSize: '1.45rem',
            fontFamily: 'var(--font-serif, "Cinzel", "Playfair Display", Georgia, serif)',
            color: '#262422',
            marginBottom: '0.35rem'
          }}>
            {isRegister ? 'Registrasi Akun Baru' : 'Selamat Datang Kembali'}
          </h1>
          <p className="auth-lead-sub" style={{ fontSize: '0.85rem', color: '#6E6962', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            {isRegister
              ? 'Daftarkan data Anda untuk kemudahan pelacakan pesanan dan simpan preferensi keramik kurasi.'
              : 'Silakan masuk menggunakan email dan kata sandi terdaftar Anda.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {isRegister && (
              <div className="checkout-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', color: '#4A4641', display: 'block', marginBottom: '6px' }}>
                  NAMA LENGKAP *
                </label>
                <input
                  type="text"
                  placeholder="contoh: Arumi Paramitha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #DED8CF',
                    fontSize: '0.9rem',
                    backgroundColor: '#FAF8F5'
                  }}
                  required
                />
              </div>
            )}

            {isRegister && (
              <div className="checkout-form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', color: '#4A4641', display: 'block', marginBottom: '6px' }}>
                  NOMOR TELEPON / WHATSAPP
                </label>
                <input
                  type="tel"
                  placeholder="contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #DED8CF',
                    fontSize: '0.9rem',
                    backgroundColor: '#FAF8F5'
                  }}
                />
              </div>
            )}

            <div className="checkout-form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', color: '#4A4641', display: 'block', marginBottom: '6px' }}>
                ALAMAT EMAIL *
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #DED8CF',
                  fontSize: '0.9rem',
                  backgroundColor: '#FAF8F5'
                }}
                required
              />
            </div>

            <div className="checkout-form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', color: '#4A4641', marginBottom: 0 }}>
                  KATA SANDI *
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => showToast('Petunjuk pemulihan kata sandi telah dikirim ke email terdaftar Anda.', 'info')}
                    style={{ background: 'none', border: 'none', color: '#B87355', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isRegister ? 'Minimal 6 karakter' : 'Masukkan kata sandi Anda'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '6px',
                    border: '1px solid #DED8CF',
                    fontSize: '0.9rem',
                    backgroundColor: '#FAF8F5'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8A857F',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="claye-terracotta-btn"
              style={{
                width: '100%',
                marginTop: '0.65rem',
                padding: '14px',
                fontSize: '0.92rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <span>{isRegister ? 'Daftar Akun CLAYÉ' : 'Masuk ke Sistem'}</span>
              )}
            </button>
          </form>

          {/* Ganti mode */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #F0ECE4', fontSize: '0.85rem', color: '#6E6962' }}>
            {isRegister ? (
              <span>
                Sudah memiliki akun terdaftar?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ background: 'none', border: 'none', color: '#B87355', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Masuk di sini
                </button>
              </span>
            ) : (
              <span>
                Belum memiliki akun pelanggan?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ background: 'none', border: 'none', color: '#B87355', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Daftar akun baru
                </button>
              </span>
            )}
          </div>

          {/* Catatan Keamanan Produksi */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.72rem', color: '#A09B93', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Dilindungi enkripsi aman 256-bit SSL CLAYÉ Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
