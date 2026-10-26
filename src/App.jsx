import React from 'react';
import { useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import DetailPage from './pages/DetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const { currentRoute } = useShop();

  const renderCurrentPage = () => {
    if (currentRoute === '' || currentRoute === '/') {
      return <HomePage />;
    }
    if (currentRoute === '/katalog') {
      return <CatalogPage />;
    }
    if (currentRoute.startsWith('/detail')) {
      return <DetailPage />;
    }
    if (currentRoute === '/keranjang') {
      return <CartPage />;
    }
    if (currentRoute === '/checkout') {
      return <CheckoutPage />;
    }
    if (currentRoute === '/login') {
      return <LoginPage />;
    }
    if (currentRoute === '/dashboard') {
      return <DashboardPage />;
    }
    if (currentRoute === '/admin') {
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
      <Toast />
    </div>
  );
}
