import React, { useState, useEffect } from 'react';

export default function MidtransSnapModal({
  isOpen,
  onClose,
  onSuccess,
  orderData
}) {
  const [activeTab, setActiveTab] = useState('qris'); // 'qris', 'va', 'card'
  const [selectedBank, setSelectedBank] = useState('bca');
  const [copiedVA, setCopiedVA] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit
  const [cardData, setCardData] = useState({
    number: '4811 1111 1111 1114',
    expiry: '12/28',
    cvv: '123'
  });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const grandTotal = orderData.grandTotal || (orderData.total + (orderData.shippingFee || 15000));
  const orderId = orderData.id || '#CLY-2026-999';

  const getVANumber = () => {
    const phoneDigits = (orderData.phone || '081234567890').replace(/\D/g, '').slice(-8);
    switch (selectedBank) {
      case 'bca': return `8092 0${phoneDigits}`;
      case 'mandiri': return `8870 8${phoneDigits}`;
      case 'bni': return `9881 2${phoneDigits}`;
      case 'bri': return `1280 0${phoneDigits}`;
      default: return `8092 0${phoneDigits}`;
    }
  };

  const handleCopyVA = () => {
    navigator.clipboard?.writeText(getVANumber().replace(/\s/g, ''));
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleSimulatePayment = (paymentMethodName) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        paymentMethod: paymentMethodName,
        paymentStatus: 'Lunas',
        paidAt: new Date().toISOString()
      });
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(26, 24, 22, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '520px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '92vh',
        animation: 'midtransSlideUp 0.25s ease-out'
      }}>
        {/* HEADER MIDTRANS SNAP */}
        <div style={{
          backgroundColor: '#0F2537',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #00ADEF'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: '#00ADEF',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '3px',
                letterSpacing: '0.05em'
              }}>
                MIDTRANS SNAP
              </span>
              <span style={{
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                SANDBOX
              </span>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'sans-serif' }}>
              CLAYÉ Curated Ceramics
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Sisa Waktu Bayar</span>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: timeLeft < 180 ? '#EF4444' : '#38BDF8'
            }}>
              ⏱️ {formattedTime}
            </span>
          </div>
        </div>

        {/* ORDER AMOUNT SUMMARY BAR */}
        <div style={{
          backgroundColor: '#F8FAFC',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>ID Pesanan</span>
            <strong style={{ fontSize: '0.88rem', color: '#1E293B', fontFamily: 'monospace' }}>{orderId}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Total Pembayaran</span>
            <strong style={{ fontSize: '1.15rem', color: '#0F2537' }}>
              Rp {grandTotal.toLocaleString('id-ID')}
            </strong>
          </div>
        </div>

        {/* TABS METODE PEMBAYARAN */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('qris')}
            style={{
              flex: 1,
              padding: '0.85rem 0.5rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === 'qris' ? '3px solid #00ADEF' : '3px solid transparent',
              backgroundColor: activeTab === 'qris' ? '#F0F9FF' : '#FFFFFF',
              color: activeTab === 'qris' ? '#0284C7' : '#64748B',
              cursor: 'pointer'
            }}
          >
            QRIS / GoPay
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('va')}
            style={{
              flex: 1,
              padding: '0.85rem 0.5rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === 'va' ? '3px solid #00ADEF' : '3px solid transparent',
              backgroundColor: activeTab === 'va' ? '#F0F9FF' : '#FFFFFF',
              color: activeTab === 'va' ? '#0284C7' : '#64748B',
              cursor: 'pointer'
            }}
          >
            Virtual Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            style={{
              flex: 1,
              padding: '0.85rem 0.5rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              borderBottom: activeTab === 'card' ? '3px solid #00ADEF' : '3px solid transparent',
              backgroundColor: activeTab === 'card' ? '#F0F9FF' : '#FFFFFF',
              color: activeTab === 'card' ? '#0284C7' : '#64748B',
              cursor: 'pointer'
            }}
          >
            Kartu Kredit / Debit
          </button>
        </div>

        {/* ISI TAB PEMBAYARAN */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {isProcessing ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #E2E8F0',
                borderTopColor: '#00ADEF',
                borderRadius: '50%',
                margin: '0 auto 1.25rem',
                animation: 'spin 0.8s linear infinite'
              }} />
              <h3 style={{ fontSize: '1.05rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Memverifikasi Pembayaran...
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                Menghubungkan ke API Midtrans Sandbox & memperbarui status pesanan.
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: QRIS */}
              {activeTab === 'qris' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    maxWidth: '220px',
                    margin: '0 auto 1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    {/* QR Code SVG Visual */}
                    <svg viewBox="0 0 100 100" width="160" height="160" style={{ margin: '0 auto', display: 'block' }}>
                      <rect width="100" height="100" fill="#FFFFFF" />
                      {/* Top-left marker */}
                      <rect x="5" y="5" width="28" height="28" fill="#0F2537" rx="3" />
                      <rect x="9" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                      <rect x="13" y="13" width="12" height="12" fill="#0F2537" rx="1" />

                      {/* Top-right marker */}
                      <rect x="67" y="5" width="28" height="28" fill="#0F2537" rx="3" />
                      <rect x="71" y="9" width="20" height="20" fill="#FFFFFF" rx="2" />
                      <rect x="75" y="13" width="12" height="12" fill="#0F2537" rx="1" />

                      {/* Bottom-left marker */}
                      <rect x="5" y="67" width="28" height="28" fill="#0F2537" rx="3" />
                      <rect x="9" y="71" width="20" height="20" fill="#FFFFFF" rx="2" />
                      <rect x="13" y="75" width="12" height="12" fill="#0F2537" rx="1" />

                      {/* Pattern dots */}
                      <rect x="38" y="10" width="6" height="6" fill="#0F2537" />
                      <rect x="48" y="10" width="6" height="6" fill="#0F2537" />
                      <rect x="38" y="22" width="16" height="6" fill="#0F2537" />
                      <rect x="10" y="38" width="6" height="16" fill="#0F2537" />
                      <rect x="22" y="44" width="6" height="12" fill="#0F2537" />
                      <rect x="38" y="38" width="24" height="24" fill="#00ADEF" rx="2" />
                      <text x="50" y="53" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">CLAYÉ</text>
                      <rect x="68" y="38" width="8" height="14" fill="#0F2537" />
                      <rect x="80" y="44" width="10" height="6" fill="#0F2537" />
                      <rect x="38" y="68" width="14" height="6" fill="#0F2537" />
                      <rect x="58" y="68" width="6" height="16" fill="#0F2537" />
                      <rect x="42" y="80" width="10" height="10" fill="#0F2537" />
                      <rect x="70" y="72" width="20" height="18" fill="#0F2537" />
                    </svg>

                    <div style={{
                      marginTop: '0.65rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#0F2537',
                      letterSpacing: '0.08em'
                    }}>
                      QRIS STANDAR NASIONAL
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '340px', margin: '0 auto 1.25rem', lineHeight: '1.4' }}>
                    Buka aplikasi e-wallet (GoPay, OVO, ShopeePay, DANA) atau m-Banking (BCA, Mandiri, BRI) lalu pindai QRIS di atas.
                  </p>

                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    fontSize: '0.78rem',
                    color: '#92400E',
                    marginBottom: '1rem',
                    textAlign: 'left'
                  }}>
                    <strong>💡 Mode Ujian / Sandbox:</strong> Klik tombol simulasi di bawah untuk mensimulasikan notifikasi pembayaran berhasil dari Midtrans secara instan.
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment('Midtrans QRIS (GoPay/ShopeePay)')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span>✓</span> Simulasikan Scan QRIS Berhasil (Sandbox)
                  </button>
                </div>
              )}

              {/* TAB 2: VIRTUAL ACCOUNT */}
              {activeTab === 'va' && (
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
                    PILIH BANK TUJUAN
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
                    {[
                      { id: 'bca', name: 'BCA VA' },
                      { id: 'mandiri', name: 'MANDIRI' },
                      { id: 'bni', name: 'BNI VA' },
                      { id: 'bri', name: 'BRI VA' }
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '6px',
                          border: selectedBank === bank.id ? '2px solid #00ADEF' : '1px solid #CBD5E1',
                          backgroundColor: selectedBank === bank.id ? '#F0F9FF' : '#FFFFFF',
                          color: selectedBank === bank.id ? '#0284C7' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {bank.name}
                      </button>
                    ))}
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Nomor Virtual Account {selectedBank.toUpperCase()}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1.25rem', letterSpacing: '0.05em', color: '#0F2537', fontFamily: 'monospace' }}>
                        {getVANumber()}
                      </strong>
                      <button
                        type="button"
                        onClick={handleCopyVA}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: copiedVA ? '#10B981' : '#0F2537',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {copiedVA ? 'TERESALIN' : 'SALIN VA'}
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                    1. Buka m-Banking atau ATM Bank Anda.<br />
                    2. Masuk menu Transfer ke Virtual Account.<br />
                    3. Masukkan nomor VA di atas dengan nominal persis: <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong>.
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(`Midtrans ${selectedBank.toUpperCase()} Virtual Account`)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span>✓</span> Simulasikan Transfer VA Berhasil (Sandbox)
                  </button>
                </div>
              )}

              {/* TAB 3: KARTU KREDIT / DEBIT */}
              {activeTab === 'card' && (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      NOMOR KARTU (SANDBOX TEST CARD)
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        MASA BERLAKU (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulatePayment('Midtrans Visa/MasterCard')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span>🔒</span> Bayar dengan Kartu (Sandbox 3D-Secure)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div style={{
          backgroundColor: '#F8FAFC',
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Batal / Bayar Nanti
          </button>

          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
            Powered by <strong>Midtrans Payment API</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
