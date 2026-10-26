import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Toast() {
  const { toasts } = useShop();

  if (!toasts.length) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: '🏺'
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>{icons[toast.type] || icons.info}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
