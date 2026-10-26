import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const { cart, user, createOrder, navigate, showToast } = useShop();

  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone : '',
    email: user ? user.email : '',
    address: user ? user.address : '',
    city: 'Jakarta Selatan',
    postalCode: '12180',
    notes: 'Mohon tambahkan packing kayu ekstra ya kak.',
    courier: 'jne',
    paymentMethod: 'bca'
  });

  const [completedOrder, setCompletedOrder] = useState(null);

  const couriers = [
    { id: 'jne', name: 'JNE Express (Standard Woodpack)', time: '2-3 Hari', price: 25000 },
    { id: 'sicepat', name: 'SiCepat Cargo (Garansi Aman)', time: '1-2 Hari', price: 35000 },
    { id: 'gosend', name: 'GoSend Instant (Area Terbatas)', time: 'Hari Ini (3-4 Jam)', price: 48000 }
  ];

  const paymentMethods = [
    { id: 'bca', name: 'BCA Virtual Account', icon: '🏦', desc: 'Verifikasi instan otomatis 24 jam' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏛️', desc: 'Transfer dari Livin by Mandiri' },
    { id: 'qris', name: 'QRIS (GoPay, OVO, ShopeePay, DANA)', icon: '📱', desc: 'Scan barcode QRIS langsung' },
    { id: 'cc', name: 'Kartu Kredit / Debit Online', icon: '💳', desc: 'Visa, MasterCard, JCB terproteksi 3DS' }
  ];

  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const selectedCourier = couriers.find(c => c.id === formData.courier) || couriers[0];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? selectedCourier.price : 0;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      showToast('Harap lengkapi nama, nomor telepon, dan alamat pengiriman!', 'error');
      return;
    }

    const order = createOrder({
      customer: formData,
      items: cart,
      subtotal,
      shippingFee,
      total: grandTotal,
      courier: selectedCourier.name,
      paymentMethod: paymentMethods.find(p => p.id === formData.paymentMethod)?.name || 'BCA Virtual Account',
      status: 'Menunggu Pembayaran'
    });

    setCompletedOrder(order);
    setStep(3);
    showToast('Pesanan berhasil dibuat! Silakan lakukan pembayaran 🎉', 'success');
  };

  if (step === 3 && completedOrder) {
    return (
      <div className="checkout-success" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{
            background: 'var(--color-surface)',
            padding: '3rem 2.5rem',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#eafaf1',
              color: '#27ae60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              margin: '0 auto 1.5rem'
            }}>
              ✓
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              Pesanan Berhasil Dibuat!
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              Terima kasih telah berbelanja di studio Clayé. Instruksi pembayaran telah dikirim ke email Anda.
            </p>

            <div style={{
              background: 'var(--color-cream-light)',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'left',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Nomor Pesanan:</span>
                <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{completedOrder.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Metode Pembayaran:</span>
                <strong>{completedOrder.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Pembayaran:</span>
                <strong style={{ fontSize: '1.3rem', color: 'var(--color-primary)' }}>{formatRupiah(completedOrder.total)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Kurir Pengiriman:</span>
                <strong>{completedOrder.courier}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg">
                Lihat di Dashboard Pelanggan 👤
              </button>
              <button onClick={() => navigate('/katalog')} className="btn btn-secondary btn-lg">
                Belanja Lagi 🏺
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Tidak ada item untuk di-checkout</h2>
        <button onClick={() => navigate('/katalog')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        {/* HEADER & STEPS */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 className="section-title" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
            Proses Pembayaran & Checkout
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Langkah aman dan cepat untuk menyelesaikan pesanan karya keramik Anda.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* FORM COLUMN */}
          <form onSubmit={handlePlaceOrder} style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* SECTION 1: DATA PENERIMA */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: 'var(--color-primary)', color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                Alamat & Kontak Penerima
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nama Lengkap *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Budi Santoso"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 08123456789"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Alamat Email (untuk resi digital) *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="budi@example.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Alamat Lengkap *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Kota / Kabupaten</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Kode Pos</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: OPSI KURIR */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: 'var(--color-primary)', color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                Pilihan Pengiriman & Proteksi Keramik
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {couriers.map(c => (
                  <label
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: formData.courier === c.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: formData.courier === c.id ? 'var(--color-cream-light)' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="courier"
                        value={c.id}
                        checked={formData.courier === c.id}
                        onChange={handleInputChange}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Estimasi: {c.time}</div>
                      </div>
                    </div>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatRupiah(c.price)}</strong>
                  </label>
                ))}
              </div>
            </div>

            {/* SECTION 3: METODE PEMBAYARAN */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: 'var(--color-primary)', color: 'white', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>3</span>
                Metode Pembayaran
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {paymentMethods.map(pm => (
                  <label
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: formData.paymentMethod === pm.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: formData.paymentMethod === pm.id ? 'var(--color-cream-light)' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={formData.paymentMethod === pm.id}
                        onChange={handleInputChange}
                      />
                      <span style={{ fontSize: '1.4rem' }}>{pm.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{pm.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{pm.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Bayar Sekarang — {formatRupiah(grandTotal)} 🔒
            </button>
          </form>

          {/* SIDEBAR ORDER SUMMARY */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>
              Pesanan Anda ({cart.length} Jenis Produk)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flex: '1' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {item.quantity} × {formatRupiah(item.price)}
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.95rem' }}>{formatRupiah(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Subtotal Barang:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Ongkos Kirim ({selectedCourier.name.split(' ')[0]}):</span>
                <span>{formatRupiah(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#27ae60' }}>
                <span>Packing Kayu & Bubble Wrap:</span>
                <span>GRATIS</span>
              </div>
              <div style={{ borderTop: '2px dashed var(--color-border)', marginTop: '0.5rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Bayar:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
