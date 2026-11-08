import React from 'react';
import { useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import DetailPage from './pages/DetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const { currentRoute, user } = useShop();

  // Jika belum login, pisahkan tampilan dari halaman lainnya dan tampilkan hanya halaman login
  if (!user || currentRoute === '/login' || currentRoute === '/register' || currentRoute === '/admin/login') {
    return (
      <div className="app-layout auth-isolated-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FDFBF7' }}>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginPage />
        </main>
        <Toast />
      </div>
    );
  }

  const renderCurrentPage = () => {
    if (currentRoute === '' || currentRoute === '/') {
      return <HomePage />;
    }
    if (currentRoute === '/katalog' || currentRoute === '/shop') {
      return <CatalogPage />;
    }
    if (currentRoute === '/tentang' || currentRoute === '/about') {
      return <AboutPage />;
    }
    if (currentRoute.startsWith('/detail')) {
      return <DetailPage />;
    }
    if (currentRoute === '/keranjang' || currentRoute === '/cart') {
      return <CartPage />;
    }
    if (currentRoute === '/checkout') {
      return <CheckoutPage />;
    }
    if (currentRoute === '/dashboard' || currentRoute === '/account' || currentRoute === '/admin/akun' || currentRoute === '/admin/profile') {
      return <DashboardPage />;
    }
    if (currentRoute === '/admin' || currentRoute.startsWith('/admin')) {
      return <AdminPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>
      <Footer />
      <Chatbot />
      <Toast />
    </div>
  );
}
