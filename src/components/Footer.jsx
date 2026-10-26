import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { navigate } = useShop();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <span className="footer-logo">Clayé<span>.</span></span>
          <p className="footer-desc">
            Studio keramik kontemporer yang menghidupkan seni tanah liat menjadi karya estetis bernilai tinggi untuk rumah dan kehidupan Anda.
          </p>
          <div className="footer-social">
            <span className="social-link" title="Instagram">📸</span>
            <span className="social-link" title="TikTok">🎵</span>
            <span className="social-link" title="Pinterest">📌</span>
            <span className="social-link" title="WhatsApp">💬</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigasi</h4>
          <ul className="footer-links">
            <li><button onClick={() => navigate('/')} className="footer-link-btn">Beranda</button></li>
            <li><button onClick={() => navigate('/katalog')} className="footer-link-btn">Katalog Produk</button></li>
            <li><button onClick={() => navigate('/keranjang')} className="footer-link-btn">Keranjang Belanja</button></li>
            <li><button onClick={() => navigate('/login')} className="footer-link-btn">Akun Pengguna</button></li>
            <li><button onClick={() => navigate('/admin')} className="footer-link-btn">Admin Dashboard</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Kategori</h4>
          <ul className="footer-links">
            <li><button onClick={() => navigate('/katalog')} className="footer-link-btn">Mangkuk Stoneware</button></li>
            <li><button onClick={() => navigate('/katalog')} className="footer-link-btn">Vas Bunga Artistik</button></li>
            <li><button onClick={() => navigate('/katalog')} className="footer-link-btn">Cangkir & Mug Artisan</button></li>
            <li><button onClick={() => navigate('/katalog')} className="footer-link-btn">Piring Saji</button></li>
            <li><button onClick={() => navigate('/katalog')} className="footer-link-btn">Teko & Aksesoris Teh</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Kontak & Workshop</h4>
          <div className="footer-contact-item">
            <span>📍</span>
            <span>Jl. Kasongan Raya No. 42, Bantul, D.I. Yogyakarta</span>
          </div>
          <div className="footer-contact-item">
            <span>📞</span>
            <span>+62 812 3456 7890</span>
          </div>
          <div className="footer-contact-item">
            <span>✉️</span>
            <span>halo@claye-ceramic.id</span>
          </div>
          <div className="footer-contact-item">
            <span>⏰</span>
            <span>Senin - Sabtu: 09:00 - 18:00 WIB</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <div>© 2026 Clayé Ceramic Studio. All rights reserved. Praktikum E-Commerce.</div>
          <div className="footer-bottom-links">
            <span>Privasi</span>
            <span>Syarat & Ketentuan</span>
            <span>Kebijakan Pengiriman</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
