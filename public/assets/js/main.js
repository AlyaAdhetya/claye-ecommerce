// =============================================
// CLAYÉ CERAMIC — Main JavaScript
// =============================================

// =============================================
// CART STATE (localStorage)
// =============================================
const CART_KEY = 'claye_cart';
const USER_KEY = 'claye_user';

// Sample products data
const PRODUCTS = [
  { id: 1, name: 'Terra Bowl Klasik', category: 'Mangkuk', price: 185000, oldPrice: 220000, image: 'assets/images/product_bowl.jpg', badge: 'sale', rating: 4.8, reviews: 124 },
  { id: 2, name: 'Vase Organik Elegan', category: 'Vas', price: 320000, oldPrice: null, image: 'assets/images/product_vase.jpg', badge: 'new', rating: 4.9, reviews: 87 },
  { id: 3, name: 'Set Mug Artisan Duo', category: 'Mug', price: 245000, oldPrice: null, image: 'assets/images/product_mug.jpg', badge: 'popular', rating: 4.7, reviews: 203 },
  { id: 4, name: 'Piring Lukis Alam', category: 'Piring', price: 195000, oldPrice: 240000, image: 'assets/images/product_plate.jpg', badge: 'sale', rating: 4.6, reviews: 156 },
  { id: 5, name: 'Teko Teh Tradisional', category: 'Teko', price: 380000, oldPrice: null, image: 'assets/images/product_teapot.jpg', badge: null, rating: 4.9, reviews: 64 },
  { id: 6, name: 'Pot Tanaman Hias', category: 'Pot', price: 155000, oldPrice: null, image: 'assets/images/product_planter.jpg', badge: 'new', rating: 4.5, reviews: 91 },
  { id: 7, name: 'Bowl Sup Rustic', category: 'Mangkuk', price: 165000, oldPrice: null, image: 'assets/images/product_bowl.jpg', badge: 'limited', rating: 4.7, reviews: 48 },
  { id: 8, name: 'Vas Silinder Modern', category: 'Vas', price: 275000, oldPrice: 310000, image: 'assets/images/product_vase.jpg', badge: 'sale', rating: 4.8, reviews: 112 },
];

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  showToast(`"${product.name}" ditambahkan ke keranjang! 🛒`, 'success');
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, qty);
    saveCart(cart);
  }
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// =============================================
// USER STATE
// =============================================
function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
}

function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function logoutUser() { localStorage.removeItem(USER_KEY); }
function isLoggedIn() { return !!getUser(); }

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: '🏺' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =============================================
// NAVBAR
// =============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
  // Set active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileOverlay?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  }
  // Update user UI in navbar
  updateNavbarUser();
  updateCartBadge();
}

function updateNavbarUser() {
  const user = getUser();
  const userBtn = document.querySelector('#navbar-user-btn');
  if (!userBtn) return;
  if (user) {
    userBtn.title = user.name;
    userBtn.innerHTML = `<span style="font-size:0.7rem;font-weight:700;color:var(--color-primary)">${user.name.charAt(0).toUpperCase()}</span>`;
    userBtn.style.background = 'var(--color-cream-dark)';
    userBtn.onclick = () => { window.location.href = 'dashboard-pelanggan.html'; };
  } else {
    userBtn.innerHTML = '👤';
    userBtn.style.background = '';
    userBtn.onclick = () => { window.location.href = 'login.html'; };
  }
}

// =============================================
// SCROLL ANIMATION
// =============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animated'); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// =============================================
// FORMAT CURRENCY
// =============================================
function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// =============================================
// RENDER PRODUCT CARD
// =============================================
function renderProductCard(product) {
  const badgeMap = { new: 'badge-new', sale: 'badge-sale', popular: 'badge-popular', limited: 'badge-limited' };
  const badgeLabels = { new: 'Baru', sale: 'Sale', popular: 'Populer', limited: 'Terbatas' };
  return `
  <div class="product-card animate-on-scroll">
    <div class="product-card-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${product.badge ? `<span class="product-card-badge ${badgeMap[product.badge]}">${badgeLabels[product.badge]}</span>` : ''}
      <div class="product-card-actions">
        <button class="product-card-action-btn" title="Tambah ke Wishlist" onclick="showToast('Ditambahkan ke wishlist ❤️','success')">♡</button>
        <button class="product-card-action-btn" title="Lihat Detail" onclick="window.location='detail-produk.html?id=${product.id}'">👁</button>
      </div>
    </div>
    <div class="product-card-body">
      <div class="product-category">${product.category}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-rating">
        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-price-row">
        <div>
          <div class="product-price">${formatRupiah(product.price)}</div>
          ${product.oldPrice ? `<div class="product-price-old">${formatRupiah(product.oldPrice)}</div>` : ''}
        </div>
        <button class="product-add-btn" onclick="addToCart(${product.id})" title="Tambah ke Keranjang">+</button>
      </div>
    </div>
  </div>`;
}

// =============================================
// INIT SMOOTH SCROLL
// =============================================
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

// =============================================
// COUNTER ANIMATION
// =============================================
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString('id-ID') + (el.dataset.suffix || '');
  }, 16);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        if (!isNaN(target)) animateCounter(e.target, target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// =============================================
// INIT ALL
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initSmoothLinks();
  initCounters();
});
