import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function LoginPage() {
  const { user, login, navigate, showToast } = useShop();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);

  // If already logged in, show redirect prompt
  if (user) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px', background: 'var(--color-surface)', padding: '3rem 2rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👋</span>
          <h2>Halo, {user.name}!</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>
            Anda saat ini telah masuk menggunakan akun <strong>{user.email}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Buka Dashboard Pelanggan
            </button>
            <button onClick={() => navigate('/katalog')} className="btn btn-secondary">
              Mulai Belanja
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Harap isi email dan password!', 'error');
      return;
    }
    if (isRegister && !name) {
      showToast('Harap isi nama lengkap Anda!', 'error');
      return;
    }

    login(email, password);
  };

  const handleFillDemo = (type) => {
    if (type === 'customer') {
      setEmail('pelanggan@claye.id');
      setPassword('ceramic123');
      setName('Clarissa Putri');
      setPhone('081234567890');
    } else {
      // Go directly to admin
      navigate('/admin');
    }
  };

  return (
    <div className="login-page" style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{
          background: 'var(--color-surface)',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)'
        }}>
          {/* LOGO & HEADING */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="navbar-logo" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', display: 'inline-block' }}>
              Clayé<span>.</span>
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-text)' }}>
              {isRegister ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {isRegister ? 'Daftar untuk menikmati reward poin & promo khusus' : 'Masuk ke akun Anda untuk melacak pesanan & wishlist'}
            </p>
          </div>

          {/* TAB SWITCH */}
          <div style={{ display: 'flex', background: 'var(--color-cream-light)', padding: '4px', borderRadius: '10px', marginBottom: '1.75rem' }}>
            <button
              onClick={() => setIsRegister(false)}
              style={{
                flex: 1,
                padding: '0.65rem',
                border: 'none',
                borderRadius: '8px',
                background: !isRegister ? 'white' : 'none',
                fontWeight: !isRegister ? 600 : 500,
                color: !isRegister ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: !isRegister ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer'
              }}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsRegister(true)}
              style={{
                flex: 1,
                padding: '0.65rem',
                border: 'none',
                borderRadius: '8px',
                background: isRegister ? 'white' : 'none',
                fontWeight: isRegister ? 600 : 500,
                color: isRegister ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: isRegister ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer'
              }}
            >
              Daftar Baru
            </button>
          </div>

          {/* DEMO QUICK FILL BUTTONS */}
          <div style={{ marginBottom: '1.5rem', background: '#fdf6e7', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #fae1b3' }}>
            <div style={{ fontWeight: 600, color: '#8c5936', marginBottom: '0.35rem' }}>💡 Quick Demo Login:</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                style={{ flex: 1, padding: '0.4rem', border: '1px solid #e3a857', background: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
              >
                👤 Isi Akun Pelanggan
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                style={{ flex: 1, padding: '0.4rem', border: '1px solid #8c5936', background: '#8c5936', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
              >
                ⚡ Akses Admin Langsung
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
              </div>
            )}

            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nomor Telepon / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kata Sandi</label>
                {!isRegister && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => showToast('Tautan reset password telah dikirim ke email.', 'info')}>
                    Lupa Password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  {showPass ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
              {isRegister ? 'Daftar Sekarang 🚀' : 'Masuk ke Akun 🔑'}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div style={{ textAlign: 'center', margin: '1.5rem 0 1rem', position: 'relative' }}>
            <span style={{ background: 'var(--color-surface)', padding: '0 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
              atau masuk dengan
            </span>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--color-border)' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <button
              onClick={() => {
                login('google.user@gmail.com', 'demo');
              }}
              style={{
                padding: '0.65rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span>🌐</span> Google
            </button>
            <button
              onClick={() => {
                login('apple.user@icloud.com', 'demo');
              }}
              style={{
                padding: '0.65rem',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span>🍎</span> Apple ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
