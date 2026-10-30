import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { cartCount, navigate, openConcierge, currentRoute } = useShop();

  if (currentRoute === '/admin' || currentRoute.startsWith('/admin')) {
    return (
      <footer className="admin-footer-bar">
        <div className="container admin-footer-content">
          <div>CLAYÉ ATELIER MANAGEMENT V2.4 • STUDIO BANDUNG</div>
          <div>Administrasi Kerajinan Keramik dan Inventaris Batch Kecil</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="claye-footer">
      <div className="container claye-footer-inner">
        {/* LOGO STUDIO */}
        <div className="footer-small-logo">CLAYÉ</div>

        {/* FILOSOFI WABI-SABI BAHASA INDONESIA */}
        <p className="footer-wabi-sabi-quote">
          Keramik buatan tangan yang dibentuk dengan kesabaran, merayakan keindahan wabi-sabi dari tanah liat alami dan ketenangan hidup sehari-hari.
        </p>

        {/* LINK NAVIGASI HORIZONTAL */}
        <nav className="footer-horizontal-links">
          <button onClick={() => navigate('/katalog')} className="footer-hlink">
            SEMUA PRODUK
          </button>
          <button onClick={() => navigate('/tentang')} className="footer-hlink">
            TENTANG KAMI
          </button>
          <button onClick={() => navigate('/keranjang')} className="footer-hlink">
            KERANJANG ({cartCount})
          </button>
          <button onClick={() => navigate('/checkout')} className="footer-hlink">
            PEMBAYARAN
          </button>
          <button onClick={() => navigate('/dashboard')} className="footer-hlink">
            AKUN SAYA
          </button>
          <button
            onClick={() => openConcierge('Bagaimana panduan lengkap perawatan keramik unglazed dan stoneware?')}
            className="footer-hlink"
          >
            PERAWATAN KERAMIK
          </button>
          <button onClick={() => navigate('/tentang')} className="footer-hlink">
            STUDIO KAMI
          </button>
          <button
            onClick={() => openConcierge('Hubungi tim concierge untuk pertanyaan pemesanan atau kado')}
            className="footer-hlink"
          >
            KONTAK
          </button>
          <button
            onClick={() => openConcierge('Bagaimana garansi pengemasan dan kebijakan pengembalian?')}
            className="footer-hlink"
          >
            PENGIRIMAN DAN PENGEMBALIAN
          </button>
        </nav>

        {/* HAK CIPTA */}
        <div className="footer-copyright-line">
          © 2025 CLAYÉ Ceramics Studio. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
