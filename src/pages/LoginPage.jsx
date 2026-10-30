import React, { useState } from 'react';
import { useShop, DEMO_USERS } from '../context/ShopContext';

export default function LoginPage() {
  const { user, login, register, logout, navigate, showToast, currentRoute } = useShop();

  const [isRegister, setIsRegister] = useState(currentRoute === '/register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

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
    if (isRegister) {
      if (!fullName.trim()) {
        showToast('Harap masukkan nama lengkap Anda.', 'error');
        return;
      }
      if (!email || !password) {
        showToast('Harap lengkapi email dan kata sandi.', 'error');
        return;
      }
      register({ fullName, email, phone });
    } else {
      if (!email || !password) {
        showToast('Harap masukkan email dan kata sandi.', 'error');
        return;
      }
      login(email, password, 'customer');
    }
  };

  return (
    <div className="claye-login-page">
      <div className="container" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div className="auth-card-wrapper">
          {/* Logo */}
          <div className="auth-brand-logo" style={{ textAlign: 'center', marginBottom: '0.25rem' }}>CLAYÉ</div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', letterSpacing: '0.1em', color: '#8C8680', marginBottom: '2rem' }}>
            STUDIO KERAMIK BANDUNG
          </p>

          {/* Tab Masuk / Daftar */}
          <div className="auth-tabs-toggle" style={{ marginBottom: '1.75rem' }}>
            <button
              type="button"
              className={`auth-tab-btn ${!isRegister ? 'is-active' : ''}`}
              onClick={() => setIsRegister(false)}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isRegister ? 'is-active' : ''}`}
              onClick={() => setIsRegister(true)}
            >
              Daftar Akun
            </button>
          </div>

          {/* Heading */}
          <h1 className="auth-main-title" style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
            {isRegister ? 'Buat Akun Baru' : 'Selamat Datang'}
          </h1>
          <p className="auth-lead-sub" style={{ marginBottom: '1.5rem' }}>
            {isRegister
              ? 'Daftar untuk melacak pesanan dan menyimpan alamat pengiriman.'
              : 'Masuk untuk melihat pesanan dan mengelola akun Anda.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isRegister && (
              <div className="checkout-form-group" style={{ marginBottom: 0 }}>
                <label>NAMA LENGKAP *</label>
                <input
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            {isRegister && (
              <div className="checkout-form-group" style={{ marginBottom: 0 }}>
                <label>NO. TELEPON / WHATSAPP</label>
                <input
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div className="checkout-form-group" style={{ marginBottom: 0 }}>
              <label>ALAMAT EMAIL *</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="checkout-form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ marginBottom: 0 }}>KATA SANDI *</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => showToast('Tautan atur ulang dikirim ke email Anda.', 'info')}
                    style={{ background: 'none', border: 'none', color: '#B87355', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="claye-terracotta-btn"
              style={{ width: '100%', marginTop: '0.5rem', padding: '14px' }}
            >
              {isRegister ? 'Daftar Sekarang' : 'Masuk'}
            </button>
          </form>

          {/* Demo login cepat */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #EAE6DF',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#8C8680', marginBottom: '0.75rem', letterSpacing: '0.06em' }}>
              AKSES DEMO CEPAT
            </p>
            <button
              type="button"
              onClick={() => login(DEMO_USERS.customer.email, 'claye2026', 'customer')}
              className="demo-pill-btn"
              style={{ width: '100%' }}
            >
              Masuk Cepat sebagai Pelanggan (Arumi)
            </button>
          </div>

          {/* Ganti mode */}
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#6E6962' }}>
            {isRegister ? (
              <>Sudah punya akun?{' '}
                <button type="button" onClick={() => setIsRegister(false)} style={{ background: 'none', border: 'none', color: '#B87355', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>
                  Masuk di sini
                </button>
              </>
            ) : (
              <>Belum punya akun?{' '}
                <button type="button" onClick={() => setIsRegister(true)} style={{ background: 'none', border: 'none', color: '#B87355', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>
                  Daftar gratis
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
