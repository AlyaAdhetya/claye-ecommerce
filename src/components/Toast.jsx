import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Toast() {
  const { toasts } = useShop();

  if (!toasts.length) return null;

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
      case 'error':
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
      case 'warning':
        return <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>!</span>;
      default:
        return <span style={{ fontSize: '0.7rem' }}>•</span>;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className="toast-icon-badge">{renderIcon(toast.type)}</span>
          <span className="toast-message-text">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
