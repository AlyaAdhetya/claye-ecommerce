import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';

export default function Chatbot() {
  const { isChatOpen, setIsChatOpen, chatInitialPrompt, products, viewProduct, addToCart, navigate } = useShop();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Halo, selamat datang di CLAYÉ Studio. Saya adalah asisten concierge studio Anda. Ada yang bisa kami bantu seputar koleksi keramik, panduan perawatan, atau status pesanan Anda?',
      time: '12:00'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatInitialPrompt) {
      handleUserSend(chatInitialPrompt);
    }
  }, [chatInitialPrompt]);

  useEffect(() => {
    if (messagesEndRef.current && isChatOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  const quickPrompts = [
    { label: 'Rekomendasi Cangkir & Mug', query: 'Bisa berikan rekomendasi cangkir keramik terbaik untuk seduh kopi pagi?' },
    { label: 'Cara Perawatan Keramik', query: 'Bagaimana petunjuk perawatan untuk keramik stoneware dan penggunaan microwave?' },
    { label: 'Status & Garansi Pengiriman', query: 'Bagaimana garansi pengemasan aman dan pengiriman dari studio Bandung?' },
    { label: 'Pesanan Khusus / Kado', query: 'Apakah CLAYÉ menerima pesanan custom inisial nama atau kado pernikahan?' }
  ];

  const handleUserSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        suggestions: botResponse.suggestions || null,
        productMatch: botResponse.productMatch || null,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 750);
  };

  const generateBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('mug') || q.includes('cangkir') || q.includes('kopi') || q.includes('sunday')) {
      const sundayMug = products.find(p => p.id === 1);
      return {
        text: 'Produk terfavorit kami untuk ritual kopi harian adalah "The Sunday Mug" (Rp125.000). Dibuat secara manual di atas roda putar dari tanah liat berkualitas, dilapisi glasir mineral dengan tekstur halus. Tersedia varian warna Gading, Hijau Sage, dan Merah Muda Pucat.',
        productMatch: sundayMug,
        suggestions: ['Lihat The Sunday Mug', 'Tambah ke Keranjang', 'Koleksi Peralatan Makan Lain']
      };
    }

    if (q.includes('rawat') || q.includes('cuci') || q.includes('microwave') || q.includes('pecah') || q.includes('oven')) {
      return {
        text: 'Panduan Perawatan Keramik CLAYÉ:\n1. Seluruh stoneware dibakar pada suhu tinggi 1240°C sehingga padat, tahan panas, dan 100% aman untuk makanan & minuman (food grade).\n2. Aman digunakan pada microwave dan mesin pencuci piring (dishwasher).\n3. Untuk menjaga keindahan glasir, pencucian menggunakan spons lembut dan sabun pencuci ramah lingkungan sangat dianjurkan.\n4. Keringkan bagian dasar unglazed sebelum disimpan di rak lemari.',
        suggestions: ['Lihat Semua Katalog', 'Tanya Pengemasan Anti-Pecah']
      };
    }

    if (q.includes('status') || q.includes('kirim') || q.includes('ongkir') || q.includes('packing') || q.includes('garansi') || q.includes('resi')) {
      return {
        text: 'Standar Pengiriman Studio CLAYÉ:\n• Setiap pesanan dikemas menggunakan pembungkus sarang lebah (honeycomb) ramah lingkungan dan bantalan pulp alami tanpa plastik.\n• Garansi 100% penggantian baru jika terjadi kerusakan selama perjalanan ekspedisi dari studio kami di Bandung.\n• Estimasi pengiriman reguler berkisar 2-3 hari kerja.',
        suggestions: ['Buka Halaman Pembayaran', 'Lihat Akun Saya']
      };
    }

    if (q.includes('kado') || q.includes('wedding') || q.includes('custom') || q.includes('hampers') || q.includes('inisial') || q.includes('stempel')) {
      return {
        text: 'Kami menyediakan opsi stempel grafir nama/inisial (+Rp25.000) yang dicetak manual pada tanah liat basah sebelum pembakaran pertama. Untuk pesanan suvenir atau kado dalam jumlah tertentu, tim studio kami siap membantu menyiapkan kemasan khusus.',
        suggestions: ['Lihat The Sunday Mug', 'Jelajahi Katalog']
      };
    }

    return {
      text: 'Terima kasih telah menghubungi CLAYÉ Studio. Kami mengutamakan keaslian bahan alam dan ketenangan hidup. Apakah Anda sedang mencari produk tertentu untuk meja makan, vas dekorasi, atau perlengkapan seduh teh/kopi?',
      suggestions: ['The Sunday Mug', 'Solace Ceramic Bowl', 'Alba Bud Vase', 'Lihat Semua Katalog']
    };
  };

  const handleSuggestionClick = (sug) => {
    if (sug === 'Lihat The Sunday Mug') {
      viewProduct(1);
      setIsChatOpen(false);
    } else if (sug === 'Tambah ke Keranjang') {
      addToCart(1, 1, { glaze: 'Hijau Sage' });
    } else if (sug === 'Koleksi Peralatan Makan Lain' || sug === 'Lihat Semua Katalog' || sug === 'Jelajahi Katalog') {
      navigate('/katalog');
      setIsChatOpen(false);
    } else if (sug === 'Buka Halaman Pembayaran') {
      navigate('/checkout');
      setIsChatOpen(false);
    } else if (sug === 'Lihat Akun Saya') {
      navigate('/dashboard');
      setIsChatOpen(false);
    } else {
      handleUserSend(sug);
    }
  };

  return (
    <>
      {/* TOMBOL MELAYANG (CLEAN SVG CHAT ICON) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="claye-concierge-trigger"
        aria-label="Buka Asisten Studio"
        title="Bantuan & Asisten Studio"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="concierge-trigger-text">Bantuan Studio</span>
        <span className="concierge-trigger-dot" />
      </button>

      {/* JENDELA OBROLAN */}
      {isChatOpen && (
        <div className="claye-chat-overlay" onClick={() => setIsChatOpen(false)}>
          <div className="claye-chat-window" onClick={(e) => e.stopPropagation()}>
            {/* HEADER OBROLAN */}
            <div className="claye-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="chat-avatar-badge">CL</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <h3 className="chat-header-title">Asisten Studio CLAYÉ</h3>
                    <span className="chat-online-indicator" />
                  </div>
                  <p className="chat-header-sub">Studio Bandung • Siap Membantu</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="chat-close-btn"
                title="Tutup Obrolan"
                aria-label="Tutup"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* ISI PERCAKAPAN */}
            <div className="claye-chat-body">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.sender === 'user' ? 'row-user' : 'row-bot'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="bot-mini-avatar">CL</div>
                  )}
                  <div className="chat-bubble-container">
                    <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                      <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{msg.text}</p>

                      {msg.productMatch && (
                        <div className="chat-product-card" onClick={() => { viewProduct(msg.productMatch.id); setIsChatOpen(false); }}>
                          <img src={msg.productMatch.image} alt={msg.productMatch.name} />
                          <div>
                            <strong>{msg.productMatch.name}</strong>
                            <p>Rp {msg.productMatch.price.toLocaleString('id-ID')}</p>
                            <span className="chat-product-action">Lihat Detail Produk →</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="chat-timestamp">{msg.time}</span>

                    {msg.suggestions && (
                      <div className="chat-suggestion-chips">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            className="chat-chip-btn"
                            onClick={() => handleSuggestionClick(sug)}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-bubble-row row-bot">
                  <div className="bot-mini-avatar">CL</div>
                  <div className="chat-bubble bubble-bot typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* TOPIK CEPAT */}
            <div className="chat-quick-prompts">
              <span className="quick-prompt-label">Topik Populer:</span>
              <div className="quick-prompts-scroll">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserSend(p.query)}
                    className="quick-prompt-pill"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FORM INPUT PESAN */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleUserSend(); }}
              className="claye-chat-footer"
            >
              <input
                type="text"
                placeholder="Tulis pertanyaan seputar produk atau pesanan..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="chat-input-field"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!inputValue.trim()}
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
