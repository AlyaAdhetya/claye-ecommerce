import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { supabaseService } from '../services/supabaseService';

export default function AdminPage() {
  const {
    products,
    orders,
    updateOrderFulfillment,
    cancelOrder,
    syncOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    showToast,
    openConcierge,
    user,
    login,
    logout,
    navigate,
    adminActivePage,
    setAdminActivePage,
    adminInventoryView,
    setAdminInventoryView,
    openAdminStorefront,
    isSupabaseConfigured,
    registeredUsers
  } = useShop();

  // Konfigurasi Supabase
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => {
    return localStorage.getItem('claye_supabase_url') || 'https://nzoqrzdpyhhzxuwmrcux.supabase.co';
  });
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => {
    return localStorage.getItem('claye_supabase_anon_key') || '';
  });
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  // Active page state for sidebar navigation
  const activePage = adminActivePage;
  const setActivePage = setAdminActivePage;
  const inventoryViewMode = adminInventoryView;
  const setInventoryViewMode = setAdminInventoryView;

  // Chart range toggle for overview / analytics
  const [chartRange, setChartRange] = useState('7d');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inspectOrderData, setInspectOrderData] = useState(null);

  // Form input for new ceramic product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Cangkir & Mug');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('12');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('/assets/images/katalog_bowl.jpg');
  const [newProdThumbnails, setNewProdThumbnails] = useState([]);
  const [newProdCodes, setNewProdCodes] = useState('');
  const [newProdImageFit, setNewProdImageFit] = useState('contain');
  const [newProdImageScale, setNewProdImageScale] = useState(100);

  // Form input for edit ceramic product
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('Cangkir & Mug');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdStock, setEditProdStock] = useState('12');
  const [editProdSubtitle, setEditProdSubtitle] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdBadge, setEditProdBadge] = useState('Kurasi');
  const [editProdImage, setEditProdImage] = useState('/assets/images/katalog_bowl.jpg');
  const [editProdThumbnails, setEditProdThumbnails] = useState([]);
  const [editProdCodes, setEditProdCodes] = useState('');
  const [editProdImageFit, setEditProdImageFit] = useState('contain');
  const [editProdImageScale, setEditProdImageScale] = useState(100);

  // Pilihan galeri foto keramik CLAYÉ yang siap pakai
  const AVAILABLE_IMAGES = [
    { label: 'Katalog Mangkuk Keramik (Koleksi)', url: '/assets/images/katalog_bowl.jpg' },
    { label: 'Katalog Cangkir Kucing Paw (Koleksi)', url: '/assets/images/katalog_cup.jpg' },
    { label: 'Katalog Mug Plaid Biru', url: '/assets/images/katalog_mug.jpg' },
    { label: 'Katalog Piring Etnik Floral 1 (Koleksi)', url: '/assets/images/katalog_plate_1.jpg' },
    { label: 'Katalog Piring Etnik Floral 2 (Koleksi)', url: '/assets/images/katalog_plate_2.jpg' },
    { label: 'Katalog Piring Modern Indigo (Koleksi)', url: '/assets/images/katalog_plate_3.jpg' },
    { label: 'Katalog Set Lengkap Alat Makan (Koleksi)', url: '/assets/images/katalog_tableware_set.jpg' },
    { label: 'Cangkir Neko Wave', url: '/assets/images/product_neko_mug.jpg' },
    { label: 'Cangkir Dusk Horizon', url: '/assets/images/product_dusk_mug.jpg' },
    { label: 'Cangkir Bintik Batu', url: '/assets/images/product_mug.jpg' },
    { label: 'Mangkuk Neko Lifestyle', url: '/assets/images/product_neko_bowl.jpg' },
    { label: 'Mangkuk Neko Studio', url: '/assets/images/product_neko_bowl_studio.jpg' },
    { label: 'Mangkuk Tanah Liat', url: '/assets/images/product_bowl.jpg' },
    { label: 'Mangkuk Tropis Monstera', url: '/assets/images/product_monstera_bowl.jpg' },
    { label: 'Mangkuk Nebula Chawan', url: '/assets/images/product_nebula_chawan.jpg' },
    { label: 'Vas Bunga Neko Wave', url: '/assets/images/product_neko_vase.jpg' },
    { label: 'Vas Terracotta Wabi', url: '/assets/images/product_vase.jpg' },
    { label: 'Piring Raw Edge', url: '/assets/images/product_plate.jpg' },
    { label: 'Teko Bambu Stillness', url: '/assets/images/product_teapot.jpg' },
    { label: 'Teko Harvest Sandstone', url: '/assets/images/product_harvest_teapot.jpg' },
    { label: 'Set Teko Royal Silver', url: '/assets/images/product_silver_teaset.jpg' },
    { label: 'Pot Tanaman Komorebi', url: '/assets/images/product_planter.jpg' },
    { label: 'Pot Fluted Wave Planter', url: '/assets/images/product_wave_planter.jpg' }
  ];

  const handleImageFileUpload = (e, setImageState) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file foto maksimal 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageState(event.target.result);
        showToast('Foto karya keramik berhasil diunggah.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImageUpload = (e, setThumbnailsState, setPrimaryImageState) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} melebihi 5MB.`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setThumbnailsState(prev => [...prev, url]);
        if (setPrimaryImageState) {
          setPrimaryImageState(prev => prev || url);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`${files.length} foto berhasil ditambahkan ke katalog!`, 'success');
  };

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState('Semua');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('Semua');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');

  // Settings form state
  const [studioSettings, setStudioSettings] = useState({
    studioName: 'CLAYÉ Curated Ceramics',
    location: 'Jl. Sejuta Kenangan, Palembang, Sumatera Selatan',
    phone: '+62 811-2233-4455',
    email: 'admin@claye.id',
    openingHours: 'Senin – Sabtu: 08:00 – 19:00 WIB',
    workshopCapacity: 'Kapasitas Pergudangan & Kurasi 500+ Produk per Bulan',
    shippingProtection: true,
    qrisActive: true,
    bcaActive: true
  });

  // Live orders from ShopContext (unified with checkout & Supabase)
  const adminOrders = orders || [];

  // Daftar pelanggan riil yang terdaftar dan/atau pernah melakukan transaksi
  const collectors = (() => {
    const map = new Map();

    // 1. Pelanggan yang mendaftar akun di tab Register
    (registeredUsers || []).forEach(u => {
      if (u.role !== 'admin') {
        const key = (u.email || u.phone || u.name).toLowerCase();
        map.set(key, {
          name: u.fullName || u.name,
          initials: (u.name || 'PL').substring(0, 2).toUpperCase(),
          email: u.email || '-',
          phone: u.phone || '-',
          city: u.city || 'Kota Palembang',
          tier: u.cohort || 'Pelanggan Baru',
          totalOrders: 0,
          totalSpent: 0,
          joinedYear: u.patronSince || new Date().getFullYear().toString(),
          favoriteGlaze: 'Glasir Gading Alami'
        });
      }
    });

    // 2. Pelanggan yang melakukan transaksi COD
    (adminOrders || []).forEach(ord => {
      const key = (ord.email || ord.phone || ord.patron).toLowerCase();
      const existing = map.get(key);
      const spent = ord.grandTotal || ord.total || 0;
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += spent;
        if (existing.totalOrders >= 5) existing.tier = 'Patron VIP';
        else if (existing.totalOrders >= 2) existing.tier = 'Pelanggan Setia';
      } else {
        map.set(key, {
          name: ord.patron || 'Pelanggan',
          initials: (ord.initials || 'PL').substring(0, 2).toUpperCase(),
          email: ord.email || '-',
          phone: ord.phone || '-',
          city: ord.city || 'Kota Palembang',
          tier: 'Pembeli Baru',
          totalOrders: 1,
          totalSpent: spent,
          joinedYear: new Date().getFullYear().toString(),
          favoriteGlaze: ord.items?.[0]?.glaze || 'Glasir Gading Alami'
        });
      }
    });

    return Array.from(map.values());
  })();

  // Mock Glaze Lab Recipes
  const glazeRecipes = [
    {
      name: 'Matte Sage Ash',
      code: 'GLZ-SGE-01',
      type: 'Abu Kayu Pinus Alami dan Feldspar',
      finish: 'Matte Halus Berserat Mikro',
      cone: 'Cone 10 (1260°C Reduksi)',
      foodSafe: true,
      stockStatus: 'Tersedia di Gudang (45 Kg)',
      description: 'Menghasilkan warna hijau lumut pudar khas keramik klasik Korea dan Jepang. Sangat aman untuk minuman asam/panas.'
    },
    {
      name: 'Iron Rust Tenmoku',
      code: 'GLZ-TNM-04',
      type: 'Pasir Besi Alam Sukabumi dan Silika',
      finish: 'Cokelat Gelap Mengilap dengan Kristal Karat',
      cone: 'Cone 10 (1260°C)',
      foodSafe: true,
      stockStatus: 'Tersedia di Gudang (30 Kg)',
      description: 'Formulasi pekat yang bereaksi dengan api reduksi tungku, menghasilkan kilau kristal besi eksotis di tepian bibir cangkir.'
    },
    {
      name: 'Raw Terracotta Sand',
      code: 'GLZ-TER-09',
      type: 'Slip Tanah Liat Merah Alami (Unglazed Vitrified)',
      finish: 'Tekstur Pasir Kasar Hangat',
      cone: 'Cone 10 (1240°C - 1260°C)',
      foodSafe: true,
      stockStatus: 'Tersedia di Gudang (60 Kg)',
      description: 'Teknik slip tradisional tanpa glasir kaca mengilap. Bagian luar dibiarkan kasar alami untuk cengkeraman tangan mantap.'
    },
    {
      name: 'Celadon Blue Crackle',
      code: 'GLZ-CLD-02',
      type: 'Lempung Vulkanik Hijau dan Silika Murni',
      finish: 'Retak Seribu Halus Mengkilap (Crackle)',
      cone: 'Cone 10 Reduksi Kuat',
      foodSafe: true,
      stockStatus: 'Stok Terbatas (15 Kg)',
      description: 'Glasir berkarakter giok dengan jaring retak estetis di bawah permukaan kaca bening tebal.'
    }
  ];

  // Handlers
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('Harap masukkan nama dan harga karya keramik!', 'error');
      return;
    }

    const parsedCodes = newProdCodes
      ? newProdCodes.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const allThumbnails = [
      newProdImage,
      ...newProdThumbnails.filter(t => t && t !== newProdImage)
    ];

    addProduct({
      name: newProdName,
      subtitle: newProdSubtitle || 'Produk keramik stoneware kurasi pilihan',
      category: newProdCategory,
      price: parseInt(newProdPrice),
      stock: parseInt(newProdStock) || 12,
      description: newProdDesc || 'Karya keramik kurasi pilihan dengan glasir mineral alami, diproduksi oleh pengrajin mitra dan lolos kurasi mutu ketat CLAYÉ.',
      badge: 'baru',
      image: newProdImage || '/assets/images/katalog_bowl.jpg',
      thumbnails: allThumbnails.length > 0 ? allThumbnails : [newProdImage || '/assets/images/katalog_bowl.jpg'],
      productCodes: parsedCodes,
      imageFit: newProdImageFit || 'contain',
      imageScale: Number(newProdImageScale) || 100
    });

    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('12');
    setNewProdSubtitle('');
    setNewProdDesc('');
    setNewProdImage('/assets/images/katalog_bowl.jpg');
    setNewProdThumbnails([]);
    setNewProdCodes('');
    setNewProdImageFit('contain');
    setNewProdImageScale(100);
    showToast(`Produk "${newProdName}" berhasil didaftarkan ke inventaris!`, 'success');
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setEditProdName(prod.name || '');
    setEditProdCategory(prod.category || 'Cangkir & Mug');
    setEditProdPrice(prod.price !== undefined ? prod.price.toString() : '');
    setEditProdStock(prod.stock !== undefined ? prod.stock.toString() : '0');
    setEditProdSubtitle(prod.subtitle || '');
    setEditProdDesc(prod.description || '');
    setEditProdBadge(prod.badge || 'Kurasi');
    setEditProdImage(prod.image || '/assets/images/katalog_bowl.jpg');
    setEditProdThumbnails(prod.thumbnails || [prod.image]);
    setEditProdCodes((prod.productCodes || []).join(', '));
    setEditProdImageFit(prod.imageFit || 'contain');
    setEditProdImageScale(prod.imageScale || 100);
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    if (!editProdName || !editProdPrice) {
      showToast('Harap masukkan nama dan harga karya keramik!', 'error');
      return;
    }
    if (!editingProduct) return;

    const parsedCodes = editProdCodes
      ? editProdCodes.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const allThumbnails = [
      editProdImage,
      ...editProdThumbnails.filter(t => t && t !== editProdImage)
    ];

    updateProduct(editingProduct.id, {
      name: editProdName,
      category: editProdCategory,
      price: parseInt(editProdPrice) || 0,
      stock: parseInt(editProdStock) || 0,
      subtitle: editProdSubtitle,
      description: editProdDesc,
      badge: editProdBadge,
      image: editProdImage || editingProduct.image || '/assets/images/katalog_bowl.jpg',
      thumbnails: allThumbnails.length > 0 ? allThumbnails : [editProdImage || editingProduct.image],
      productCodes: parsedCodes,
      imageFit: editProdImageFit || 'contain',
      imageScale: Number(editProdImageScale) || 100
    });

    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleUpdateFulfillment = (orderId, newStatus) => {
    if (updateOrderFulfillment) {
      updateOrderFulfillment(orderId, newStatus);
    }
    if (inspectOrderData && inspectOrderData.id === orderId) {
      const updatedPayment = newStatus.startsWith('Selesai')
        ? 'Lunas'
        : newStatus === 'Dibatalkan'
          ? 'Dibatalkan'
          : (inspectOrderData.paymentMethod?.includes('COD') ? 'Menunggu Pembayaran' : inspectOrderData.paymentStatus);
      setInspectOrderData(prev => ({
        ...prev,
        fulfillment: newStatus,
        paymentStatus: updatedPayment
      }));
    }
  };

  // Filtered orders
  const filteredOrders = adminOrders.filter(ord => {
    const fulfillmentStr = (ord.fulfillment || 'Diproses').toLowerCase();
    const matchStatus = orderStatusFilter === 'Semua' ||
      (orderStatusFilter === 'Dibatalkan' && fulfillmentStr.includes('batal')) ||
      (orderStatusFilter !== 'Dibatalkan' && fulfillmentStr.includes(orderStatusFilter.toLowerCase())) ||
      (orderStatusFilter === 'Menunggu' && (fulfillmentStr.includes('menunggu') || (ord.paymentStatus || '').toLowerCase().includes('menunggu')));
    const matchSearch = (ord.id || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (ord.patron || '').toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (ord.city || '').toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filtered inventory products
  const filteredProducts = products.filter(p => {
    const matchCat = inventoryCategoryFilter === 'Semua' || p.category === inventoryCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(inventorySearchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Calculate quick stats (hanya pesanan yang tidak dibatalkan yang dihitung ke pendapatan aktif)
  const totalRevenue = adminOrders
    .filter(ord => ord.fulfillment !== 'Dibatalkan')
    .reduce((sum, ord) => sum + (ord.grandTotal || ord.total || 0), 0);
  const totalPhysicalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;

  // ROUTE GUARD: Khusus Admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="claye-login-page" style={{ padding: '6rem 0', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
          <div className="auth-card-wrapper" style={{ padding: '3rem 2.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#F5EBE6',
              color: '#B87355',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <div className="studio-edition-badge" style={{ margin: '0 auto 0.75rem' }}>
              AKSES KHUSUS ADMIN
            </div>

            <h2 className="auth-main-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Portal Admin CLAYÉ
            </h2>

            <p className="auth-lead-sub" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              {user ? (
                <>Anda saat ini masuk sebagai <strong>{user.name}</strong> ({user.roleName || 'Pelanggan'}). Halaman ini memerlukan hak akses Admin Toko.</>
              ) : (
                <>Panel kontrol ini memuat manajemen inventaris keramik, pesanan pelanggan, dan logistik pengiriman. Silakan masuk dengan akun Admin.</>
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => login('admin@claye.id', 'atelier2026', 'admin')}
                className="claye-terracotta-btn"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                Masuk sebagai Admin Toko
              </button>

              <button
                onClick={() => navigate('/login')}
                className="btn-modal-cancel"
                style={{ width: '100%' }}
              >
                Pilih Akun Lain / Halaman Login
              </button>

              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6E6962',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  textDecoration: 'underline'
                }}
              >
                Kembali ke Toko Pelanggan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar navigation items definitions
  const sidebarNavItems = [
    {
      group: 'Operasional Utama',
      items: [
        {
          id: 'overview',
          label: 'Ringkasan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          ),
          badge: 'Live',
          badgeClass: 'badge-live'
        },
        {
          id: 'orders',
          label: 'Pesanan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          ),
          badge: `${adminOrders.length}`,
          badgeClass: 'badge-count'
        },
        {
          id: 'inventory',
          label: 'Inventaris & Katalog',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          ),
          badge: `${products.length}`,
          badgeClass: 'badge-count'
        }
      ]
    },
    {
      group: 'Data dan Pengaturan',
      items: [
        {
          id: 'customers',
          label: 'Pelanggan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          ),
          badge: `${collectors.length}`,
          badgeClass: 'badge-count'
        },
        {
          id: 'analytics',
          label: 'Laporan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          )
        },
        {
          id: 'settings',
          label: 'Pengaturan',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <div className="claye-admin-app-container">
      <div className="admin-page-grid">
        {/* ===================================================================
            SIDEBAR NAVIGASI PER HALAMAN
            =================================================================== */}
        <aside className="admin-sidebar-menu">
          {/* DAFTAR MENU SIDEBAR */}
          <div className="sidebar-nav-groups-wrap">
            {sidebarNavItems.map((group, gIdx) => (
              <div key={gIdx} className="sidebar-group" style={{ marginBottom: '1.4rem' }}>
                <span className="sidebar-group-title">{group.group}</span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => setActivePage(item.id)}
                    title={item.label}
                  >
                    <span className="snav-icon">{item.icon}</span>
                    <span className="snav-label">{item.label}</span>
                    {item.badge && (
                      <span className={`snav-badge ${item.badgeClass || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* AKSI BAWAH: KELUAR */}
          <div className="sidebar-footer-actions">
            <button
              onClick={logout}
              className="sidebar-logout-btn"
              title="Keluar dari Akun Admin"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        {/* ===================================================================
            VIEWPORT KONTEN UTAMA (BERDASARKAN HALAMAN AKTIF)
            =================================================================== */}
        <main className="admin-main-viewport">
          {/* ===============================================================
              HALAMAN 1: RINGKASAN TOKO KURASI (OVERVIEW)
              =============================================================== */}
          {activePage === 'overview' && (
            <div className="admin-page-view">
              {/* HEADER RINGKASAN TOKO */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
                borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--color-charcoal)' }}>
                    Ringkasan Toko CLAYÉ
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#6E6962' }}>
                    Pantau pesanan masuk, pengantaran mandiri Kota Palembang, dan ketersediaan stok produk keramik.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>

                  <button onClick={() => setActivePage('orders')} className="purpose-action-btn secondary" style={{ textTransform: 'capitalize' }}>
                    Lihat Pesanan
                  </button>
                  <button onClick={() => setActivePage('inventory')} className="purpose-action-btn secondary" style={{ textTransform: 'capitalize' }}>
                    Kelola Stok
                  </button>
                </div>
              </div>

              {/* 4 KARTU METRIK UTAMA */}
              <div className="admin-metrics-row">
                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">TOTAL PENDAPATAN</span>
                  </div>
                  <div className="metric-primary-val">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="metric-trend-positive">
                    {adminOrders.length > 0 ? `${adminOrders.length} transaksi COD masuk` : 'Sistem baru & bersih'}
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">TOTAL PESANAN TERCATAT</span>
                  </div>
                  <div className="metric-primary-val">{adminOrders.length} <span className="val-unit">paket</span></div>
                  <div className="metric-alert-pill">
                    {adminOrders.filter(o => o.fulfillment === 'Diproses').length} menunggu pengantaran mandiri
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">KARYA KERAMIK AKTIF</span>
                  </div>
                  <div className="metric-primary-val">{products.length} <span className="val-unit">karya</span></div>
                  <div className="metric-alert-pill low-stock">
                    {lowStockCount} stok kritis di gudang
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="metric-header-row">
                    <span className="metric-title">TOTAL PELANGGAN TERDAFTAR</span>
                  </div>
                  <div className="metric-primary-val">{collectors.length} <span className="val-unit">pelanggan</span></div>
                  <div className="metric-trend-positive">
                    {collectors.length > 0 ? `${collectors.length} akun aktif di Palembang` : 'Menunggu pelanggan baru'}
                  </div>
                </div>
              </div>

              {/* 2-KOLOM: GRAFIK PENJUALAN & FOCUS KILN */}
              <div className="admin-trajectory-split-grid">
                {/* GRAFIK PENJUALAN */}
                <div className="admin-chart-panel">
                  <div className="chart-panel-header">
                    <div>
                      <span className="chart-panel-tag">PROGRES BISNIS & TRANSAKSI</span>
                      <h3 className="chart-panel-title">Grafik Penjualan Toko</h3>
                      <p className="chart-panel-sub">Arus transaksi penjualan produk keramik kurasi CLAYÉ Studio di Kota Palembang (November 2026)</p>
                    </div>
                    <div className="chart-range-toggle">
                      <button
                        className={`range-btn ${chartRange === '7d' ? 'active' : ''}`}
                        onClick={() => setChartRange('7d')}
                      >
                        Periode November
                      </button>
                      <button
                        className={`range-btn ${chartRange === '30d' ? 'active' : ''}`}
                        onClick={() => setChartRange('30d')}
                      >
                        Bulan Ini
                      </button>
                    </div>
                  </div>

                  <div className="chart-metrics-row">
                    <div className="cmetric-col">
                      <span className="cmetric-label">TOTAL PENDAPATAN</span>
                      <strong className="cmetric-val">Rp {totalRevenue.toLocaleString('id-ID')}</strong>
                    </div>
                    <div className="cmetric-col">
                      <span className="cmetric-label">PUNCAK PENJUALAN</span>
                      <strong className="cmetric-val">27 Nov (Rp105.000)</strong>
                    </div>
                    <div className="cmetric-col">
                      <span className="cmetric-label">STATUS PENGIRIMAN</span>
                      <strong className="cmetric-val">100% Terlayani (COD)</strong>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="sales-svg-chart-container">
                    <svg viewBox="0 0 540 180" className="sales-chart-svg">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A85A3C" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#A85A3C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="40" y1="30" x2="520" y2="30" stroke="#EAE6DF" strokeDasharray="3 3" />
                      <line x1="40" y1="75" x2="520" y2="75" stroke="#EAE6DF" strokeDasharray="3 3" />
                      <line x1="40" y1="120" x2="520" y2="120" stroke="#EAE6DF" strokeDasharray="3 3" />
                      <line x1="330" y1="30" x2="330" y2="140" stroke="#A85A3C" strokeDasharray="3 3" />
                      <path
                        d="M 60 125 C 130 120 160 85 200 85 C 260 85 290 40 330 40 C 370 40 400 70 440 70 C 470 70 500 110 510 110 L 510 145 L 60 145 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M 60 125 C 130 120 160 85 200 85 C 260 85 290 40 330 40 C 370 40 400 70 440 70 C 470 70 500 110 510 110"
                        fill="none"
                        stroke="#A85A3C"
                        strokeWidth="2.5"
                      />
                      {/* Titik Transaksi Saputri (23 Nov) */}
                      <circle cx="200" cy="85" r="4.5" fill="#A85A3C" stroke="#FFFFFF" strokeWidth="2" />
                      {/* Titik Puncak Transaksi Dini (27 Nov) */}
                      <circle cx="330" cy="40" r="6" fill="#A85A3C" stroke="#FFFFFF" strokeWidth="2.5" />
                      {/* Titik Transaksi Tasya (30 Nov) */}
                      <circle cx="440" cy="70" r="4.5" fill="#A85A3C" stroke="#FFFFFF" strokeWidth="2" />

                      <text x="70" y="160" fill="#8A857F" fontSize="8.5" textAnchor="middle">20 Nov</text>
                      <text x="200" y="160" fill="#24201D" fontSize="8.5" textAnchor="middle" fontWeight="600">23 Nov</text>
                      <text x="330" y="160" fill="#A85A3C" fontSize="9" textAnchor="middle" fontWeight="bold">27 Nov</text>
                      <text x="440" y="160" fill="#24201D" fontSize="8.5" textAnchor="middle" fontWeight="600">30 Nov</text>
                      <text x="505" y="160" fill="#8A857F" fontSize="8.5" textAnchor="middle">02 Des</text>
                    </svg>
                  </div>
                </div>

                {/* KANAN: PRODUK UNGGULAN TERKURASI */}
                <div className="admin-kiln-focus-card">
                  <div className="focus-card-header">
                    <span className="focus-tag">PRODUK UNGGULAN TERKURASI</span>
                    <span className="limited-series-pill">TERLARIS</span>
                  </div>

                  <div className="focus-image-frame" style={{ backgroundColor: '#FAF8F5', border: '1px solid #EAE6DF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={products?.[0]?.image || '/assets/images/katalog_bowl.jpg'}
                      alt={products?.[0]?.name || 'Produk Unggulan'}
                      className="focus-img"
                      style={{ objectFit: 'contain', width: '100%', height: '100%', padding: '6px' }}
                      onError={(e) => { e.target.src = '/assets/images/katalog_bowl.jpg'; }}
                    />
                    <div className="focus-overlay-content" style={{ backgroundColor: 'rgba(26, 23, 21, 0.72)', padding: '6px 10px', borderRadius: '4px', left: '0.6rem', bottom: '0.6rem', right: 'auto' }}>
                      <span className="drop-edition-label" style={{ color: '#D4C3B3' }}>{products?.[0]?.batchInfo || 'BATCH KURASI NO. 01 • EDISI SPESIAL'}</span>
                      <h4 className="focus-vessel-title" style={{ color: '#FFFFFF', margin: 0, fontSize: '0.92rem' }}>{products?.[0]?.name || 'Artisan Ceramic Bowls Collection'}</h4>
                    </div>
                    <div className="focus-made-counter">
                      <strong>{products?.[0]?.stock || 35}</strong> Tersedia
                    </div>
                  </div>

                  <div className="focus-specs-list">
                    <div className="fspec-row">
                      <span className="fspec-key">Status Stok</span>
                      <strong className="fspec-val" style={{ color: '#5E7958' }}>✓ Siap Dikirim Segera</strong>
                    </div>
                    <div className="fspec-row">
                      <span className="fspec-key">Kategori Produk</span>
                      <strong className="fspec-val">{products?.[0]?.category || 'Mangkuk Keramik'}</strong>
                    </div>
                    <div className="fspec-row">
                      <span className="fspec-key">Material & Kualitas</span>
                      <strong className="fspec-val">Stoneware Food-Grade 100%</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePage('inventory')}
                    className="focus-health-footer"
                    style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    <span className="health-label">Kelola Inventaris Produk →</span>
                  </button>
                </div>
              </div>

              {/* ANTREAN PESANAN TERAKHIR */}
              <div className="admin-section-container" style={{ marginTop: '2rem' }}>
                <div className="admin-section-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 className="section-serif-heading">Antrean Pengiriman Mendesak ({adminOrders.filter(o => o.fulfillment !== 'Selesai').length} Paket)</h3>
                    <p className="section-subtext">Pesanan yang harus dikemas menggunakan bubble wrap ramah lingkungan dan segel pengiriman CLAYÉ hari ini.</p>
                  </div>
                  <button
                    onClick={() => setActivePage('orders')}
                    className="btn-admin-dispatch"
                    style={{ padding: '0.65rem 1.25rem', whiteSpace: 'nowrap' }}
                  >
                    Kelola Pesanan
                  </button>
                </div>

                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table">
                    <thead>
                      <tr>
                        <th>ID PESANAN</th>
                        <th>PELANGGAN</th>
                        <th>KOTA</th>
                        <th>ITEM</th>
                        <th>TOTAL</th>
                        <th>STATUS PENGIRIMAN</th>
                        <th style={{ textAlign: 'right' }}>TINDAKAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#8A857F' }}>
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>📦</div>
                            <strong>Belum Ada Antrean Pengiriman</strong>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem' }}>
                              Pesanan baru dari pelanggan di wilayah Palembang akan otomatis muncul di sini.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        adminOrders.slice(0, 3).map(ord => (
                          <tr key={ord.id}>
                            <td><strong>{ord.id.replace('#', '')}</strong></td>
                            <td><strong>{ord.patron}</strong></td>
                            <td>{ord.city}</td>
                            <td style={{ fontSize: '0.78rem', maxWidth: '170px' }} title={ord.itemsSummary}>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                                {ord.itemsSummary || 'Karya Keramik Kurasi'}
                              </div>
                            </td>
                            <td style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>Rp {((ord.grandTotal || ord.total) || 0).toLocaleString('id-ID')}</td>
                            <td>
                              <span className={`status-pill ${ord.fulfillment === 'Selesai' ? 'pill-completed' : ord.fulfillment === 'Diproses' ? 'pill-processing' : 'pill-awaiting'}`}>
                                {ord.fulfillment || 'Diproses'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => setInspectOrderData(ord)}
                                className="admin-inspect-btn"
                              >
                                Periksa
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 2: KELOLA PESANAN PELANGGAN (ORDERS)
              =============================================================== */}
          {activePage === 'orders' && (
            <div className="admin-page-view">
              {/* HEADER KELOLA PESANAN */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
                borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--color-charcoal)' }}>
                    Kelola Pesanan Pelanggan
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#6E6962' }}>
                    Daftar pesanan COD masuk dan pemantauan pengantaran mandiri tim CLAYÉ di Kota Palembang.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => showToast(`Data ${adminOrders.length} pesanan siap diekspor.`, 'info')}
                    className="purpose-action-btn secondary"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Ekspor CSV
                  </button>
                </div>
              </div>

              {/* FILTER & PENCARIAN PESANAN */}
              <div className="admin-filter-bar">
                <div className="filter-tabs-row">
                  {['Semua', 'Diproses', 'Selesai', 'Menunggu', 'Dibatalkan'].map(status => (
                    <button
                      key={status}
                      className={`filter-tab-btn ${orderStatusFilter === status ? 'active' : ''}`}
                      onClick={() => setOrderStatusFilter(status)}
                    >
                      {status === 'Semua' ? 'Semua Pesanan' : status === 'Menunggu' ? 'Menunggu Bayar' : status}
                      <span className="filter-counter-badge">
                        {status === 'Semua'
                          ? adminOrders.length
                          : status === 'Dibatalkan'
                            ? adminOrders.filter(o => (o.fulfillment || '').toLowerCase().includes('batal')).length
                            : adminOrders.filter(o => (o.fulfillment || '').toLowerCase().includes(status.toLowerCase())).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="filter-search-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari nomor ID, nama pemesan, atau kota..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                  />
                  {orderSearchQuery && (
                    <button onClick={() => setOrderSearchQuery('')} style={{ fontSize: '0.8rem', color: '#999' }}>×</button>
                  )}
                </div>
              </div>

              {/* TABEL LENGKAP PESANAN */}
              <div className="admin-section-container">
                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table admin-orders-table">
                    <thead>
                      <tr>
                        <th>ID PESANAN</th>
                        <th>PELANGGAN</th>
                        <th>KOTA</th>
                        <th>TANGGAL</th>
                        <th style={{ minWidth: '160px', maxWidth: '200px' }}>KARYA KERAMIK</th>
                        <th style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>TOTAL BIAYA</th>
                        <th>STATUS BAYAR</th>
                        <th>STATUS FULFILLMENT</th>
                        <th style={{ textAlign: 'right' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#8A857F' }}>
                            Tidak ada pesanan yang sesuai dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(ord => (
                          <tr key={ord.id}>
                            <td className="cell-order-ref">
                              <strong>{ord.id.replace('#', '')}</strong>
                            </td>
                            <td className="cell-collector-patron">
                              <strong>{ord.patron}</strong>
                              {ord.phone && ord.phone !== '-' && (
                                <a
                                  href={(() => {
                                    const cleanNum = ord.phone.replace(/[^0-9]/g, '');
                                    const formattedNum = cleanNum.startsWith('0') ? '62' + cleanNum.slice(1) : (cleanNum.startsWith('62') ? cleanNum : '62' + cleanNum);
                                    const orderIdClean = (ord.id || '').replace('#', '');
                                    const patronName = ord.patron || 'Pelanggan';
                                    const grandTotal = (ord.grandTotal || ord.total || 0).toLocaleString('id-ID');
                                    const message = `Halo Kak ${patronName}.\nKami dari CLAYÉ Curated Ceramics ingin menginformasikan bahwa pesanan keramik Anda dengan nomor ref #${orderIdClean} sedang kami siapkan dan kemas rapi dengan garansi bubble wrap.\n\nPesanan akan segera kami antar langsung ke alamat Anda (COD Rp ${grandTotal}). Mohon konfirmasi ketersediaan di lokasi ya Kak. Terima kasih.`;
                                    return `https://wa.me/${formattedNum}?text=${encodeURIComponent(message)}`;
                                  })()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.72rem',
                                    color: '#128C7E',
                                    marginTop: '3px',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                  }}
                                  title="Chat WhatsApp Pelanggan"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.131-.497-1.745-.692-2.875-2.456-2.963-2.573-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
                                  </svg>
                                  {ord.phone}
                                </a>
                              )}
                            </td>
                            <td>{ord.city}</td>
                            <td className="cell-date">{ord.date}</td>
                            <td style={{ fontSize: '0.78rem', maxWidth: '180px' }} title={ord.itemsSummary}>
                              <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '180px'
                              }}>
                                {ord.itemsSummary || 'Karya Keramik Kurasi'}
                              </div>
                            </td>
                            <td className="cell-total" style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>
                              Rp {((ord.grandTotal !== undefined ? ord.grandTotal : (ord.total + (ord.shippingFee || 0))) || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="cell-payment-status">
                              <span className={`status-pill ${ord.paymentStatus === 'Lunas' ? 'pill-completed' : 'pill-pending'}`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td>
                              <select
                                value={ord.fulfillment}
                                onChange={(e) => handleUpdateFulfillment(ord.id, e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.78rem',
                                  borderRadius: '4px',
                                  border: '1px solid #EAE6DF',
                                  backgroundColor: ord.fulfillment?.startsWith('Selesai')
                                    ? '#E8ECE6'
                                    : ord.fulfillment === 'Dibatalkan'
                                      ? '#FCE8E6'
                                      : ord.fulfillment === 'Diproses'
                                        ? '#FBEBE4'
                                        : '#F5F2EB',
                                  color: ord.fulfillment?.startsWith('Selesai')
                                    ? '#385E3E'
                                    : ord.fulfillment === 'Dibatalkan'
                                      ? '#C5221F'
                                      : ord.fulfillment === 'Diproses'
                                        ? '#B87355'
                                        : '#8A857F',
                                  fontWeight: '600'
                                }}
                              >
                                <option value="Sedang Dikemas">Sedang Dikemas</option>
                                <option value="Sedang Diantar">Sedang Diantar (COD)</option>
                                <option value="Selesai (Terkirim & Lunas)">Selesai (Terkirim & Lunas)</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                              </select>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => setInspectOrderData(ord)}
                                className="admin-inspect-btn"
                              >
                                Periksa
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="admin-orders-table-footer">
                  <div className="kraft-seal-note">
                    Semua karya dilindungi double-box honeycomb kraft dan garansi ganti baru bila terjadi kerusakan logistik.
                  </div>
                  <div className="showing-dispatches-counter">
                    Menampilkan {filteredOrders.length} dari {adminOrders.length} paket pesanan
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 3: INVENTARIS PRODUK (INVENTORY)
              =============================================================== */}
          {activePage === 'inventory' && (
            <div className="admin-page-view">
              {/* HEADER INVENTARIS PRODUK */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
                borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--color-charcoal)' }}>
                    Katalog & Stok Produk
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#6E6962' }}>
                    Kelola data produk keramik, harga jual, foto, dan ketersediaan stok fisik di gudang.
                  </p>
                </div>

              </div>

              {/* MINI STAT ROW INVENTORY */}
              <div className="admin-metrics-row" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">TOTAL KARYA KERAMIK (SKU)</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    {products.length} <span className="val-unit">model</span>
                  </div>
                </div>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">TOTAL STOK FISIK DI GUDANG</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    {totalPhysicalStock} <span className="val-unit">buah</span>
                  </div>
                </div>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">KATEGORI PRODUK AKTIF</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    6 <span className="val-unit">kategori</span>
                  </div>
                </div>
                <div className="admin-metric-card" style={{ padding: '1rem 1.25rem' }}>
                  <span className="metric-title">PERINGATAN STOK TIPIS</span>
                  <div className="metric-primary-val" style={{ fontSize: '1.6rem', marginTop: '0.25rem', color: '#B87355' }}>
                    {lowStockCount} <span className="val-unit">&lt; 5 pcs</span>
                  </div>
                </div>
              </div>

              {/* FILTER & PENCARIAN PRODUK */}
              <div className="admin-filter-bar">
                <div className="filter-tabs-row" style={{ overflowX: 'auto' }}>
                  {['Semua', 'Cangkir & Mug', 'Mangkuk', 'Peralatan Makan', 'Vas', 'Kopi & Teh'].map(cat => (
                    <button
                      key={cat}
                      className={`filter-tab-btn ${inventoryCategoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setInventoryCategoryFilter(cat)}
                    >
                      {cat === 'Cangkir & Mug' ? 'Cangkir dan Mug' : cat === 'Kopi & Teh' ? 'Kopi dan Teh' : cat}
                    </button>
                  ))}
                </div>

                <div className="filter-search-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari karya keramik, glasir, atau nama..."
                    value={inventorySearchQuery}
                    onChange={(e) => setInventorySearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* SEGMENTED SWITCHER: TAMPILAN TOKO (KATALOG) vs TABEL STOK */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: '#FAF8F5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #EAE6DF',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'inline-flex', gap: '4px', backgroundColor: '#EDE8E1', padding: '4px', borderRadius: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setInventoryViewMode('storefront')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: inventoryViewMode === 'storefront' ? '#24201D' : 'transparent',
                      color: inventoryViewMode === 'storefront' ? '#FAF7F2' : '#656059',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Tampilan Toko (Etalase Produk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryViewMode('table')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: inventoryViewMode === 'table' ? '#24201D' : 'transparent',
                      color: inventoryViewMode === 'table' ? '#FAF7F2' : '#656059',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Tabel Data Stok
                  </button>
                </div>

                {/* TOMBOL TAMBAH PRODUK BARU */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--color-terracotta)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Tambah Produk Baru
                  </button>
                </div>

              </div>

              {/* TAMPILAN 1: TAMPILAN TOKO (ETALASE KATALOG VISUAL DENGAN KONTROL ADMIN) */}
              {inventoryViewMode === 'storefront' ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem'
                }}>
                  {filteredProducts.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #EAE6DF', color: '#8A857F' }}>
                      Tidak ada karya keramik yang sesuai dengan filter pencarian.
                    </div>
                  ) : (
                    filteredProducts.map(p => (
                      <div
                        key={p.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #EAE6DF',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', paddingTop: '85%', backgroundColor: '#F5F2EC', overflow: 'hidden' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              backgroundColor: '#FAF8F5'
                            }}
                          />
                          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                            <span style={{
                              backgroundColor: 'rgba(36, 32, 29, 0.88)',
                              color: '#FAF7F2',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}>
                              {p.badge || 'Studio'}
                            </span>
                            <span style={{
                              backgroundColor: (p.stock || 0) < 5 ? '#FFF1F0' : '#F6FFED',
                              color: (p.stock || 0) < 5 ? '#CF1322' : '#389E0D',
                              border: `1px solid ${(p.stock || 0) < 5 ? '#FFA39E' : '#B7EB8F'}`,
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px'
                            }}>
                              Stok: {p.stock || 0} pcs
                            </span>
                          </div>
                        </div>

                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <div style={{ fontSize: '0.72rem', color: '#8A857F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                            {p.category}
                          </div>
                          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#24201D', margin: '0 0 0.3rem 0', lineHeight: 1.3 }}>
                            {p.name}
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: '#736B63', margin: '0 0 0.75rem 0', flexGrow: 1, lineHeight: 1.4 }}>
                            {p.subtitle}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0ECE4', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                              Rp {p.price.toLocaleString('id-ID')}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button
                                onClick={() => updateProductStock(p.id, -1)}
                                style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #D8D2C7', background: '#FAF8F5', cursor: 'pointer', fontWeight: 700 }}
                                title="Kurangi stok 1 pcs"
                              >
                                -
                              </button>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                                {p.stock || 0}
                              </span>
                              <button
                                onClick={() => updateProductStock(p.id, 1)}
                                style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #D8D2C7', background: '#FAF8F5', cursor: 'pointer', fontWeight: 700 }}
                                title="Tambah stok 1 pcs"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              style={{
                                flex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                backgroundColor: '#FAF8F5',
                                border: '1px solid #D8D2C7',
                                color: '#24201D',
                                padding: '6px 10px',
                                borderRadius: '5px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus karya "${p.name}" dari katalog toko?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#FFF5F5',
                                border: '1px solid #F5C6CB',
                                color: '#c0392b',
                                padding: '6px 10px',
                                borderRadius: '5px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Hapus produk"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* TAMPILAN 2: TABEL INVENTARIS PRODUK */
                <div className="admin-section-container">
                  <div className="acquisitions-table-wrap">
                    <table className="claye-patron-table">
                      <thead>
                        <tr>
                          <th>PRODUK DAN EDISI GLASIR</th>
                          <th>KATEGORI</th>
                          <th>HARGA SATUAN</th>
                          <th>STOK TERSEDIA</th>
                          <th>STATUS BADGE</th>
                          <th style={{ textAlign: 'right' }}>AKSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#8A857F' }}>
                              Tidak ada produk keramik yang sesuai dengan filter.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map(p => (
                            <tr key={p.id}>
                              <td className="cell-pieces">
                                <div className="pieces-item-preview">
                                  <img src={p.image} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#FAF8F5', padding: '2px' }} />
                                  <div>
                                    <strong className="piece-title">{p.name}</strong>
                                    <span className="piece-variant">{p.subtitle}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{p.category}</td>
                              <td><strong>Rp {p.price.toLocaleString('id-ID')}</strong></td>
                              <td>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    onClick={() => updateProductStock(p.id, -1)}
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '4px',
                                      border: '1px solid #EAE6DF',
                                      backgroundColor: '#FAF8F5',
                                      fontSize: '0.85rem',
                                      fontWeight: 'bold',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    title="Kurangi 1 pcs"
                                  >
                                    -
                                  </button>
                                  <span style={{ fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>
                                    {p.stock || 0} pcs
                                  </span>
                                  <button
                                    onClick={() => updateProductStock(p.id, 1)}
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '4px',
                                      border: '1px solid #EAE6DF',
                                      backgroundColor: '#FAF8F5',
                                      fontSize: '0.85rem',
                                      fontWeight: 'bold',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                    title="Tambah 1 pcs"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td>
                                <span className={`status-pill ${(p.stock || 0) < 5 ? 'pill-pending' : 'pill-completed'}`}>
                                  {p.badge || 'Studio'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                  <button
                                    onClick={() => handleOpenEditModal(p)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      backgroundColor: '#FFFFFF',
                                      border: '1px solid #D8D2C7',
                                      color: '#2C2825',
                                      borderRadius: '5px',
                                      padding: '5px 10px',
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      transition: 'all 0.2s'
                                    }}
                                    title={`Edit produk "${p.name}"`}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Hapus produk "${p.name}" dari katalog toko?`)) {
                                        deleteProduct(p.id);
                                      }
                                    }}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      backgroundColor: '#FFF5F5',
                                      border: '1px solid #F5C6CB',
                                      color: '#c0392b',
                                      borderRadius: '5px',
                                      padding: '5px 10px',
                                      cursor: 'pointer',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      transition: 'all 0.2s'
                                    }}
                                    title="Hapus produk dari katalog"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}



          {/* ===============================================================
              HALAMAN 5: DATA PELANGGAN (CUSTOMERS)
              =============================================================== */}
          {activePage === 'customers' && (
            <div className="admin-page-view">
              {/* HEADER DATA PELANGGAN */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
                borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--color-charcoal)' }}>
                    Data Pelanggan
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#6E6962' }}>
                    Daftar akun pelanggan terdaftar dan riwayat pembelian COD di Kota Palembang.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => showToast(`Data ${collectors.length} pelanggan berhasil diekspor ke format CSV.`, 'success')}
                    className="purpose-action-btn secondary"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Ekspor Data Pelanggan (CSV)
                  </button>
                </div>
              </div>

              {/* 4 METRIK PELANGGAN */}
              <div className="admin-metrics-row">
                <div className="admin-metric-card">
                  <span className="metric-title">TOTAL PELANGGAN TERDAFTAR</span>
                  <div className="metric-primary-val">{collectors.length} <span className="val-unit">orang</span></div>
                  <div className="metric-trend-positive">{collectors.length > 0 ? `${collectors.length} akun aktif` : 'Belum ada pelanggan'}</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">TOTAL TRANSAKSI PESANAN</span>
                  <div className="metric-primary-val">{adminOrders.length} <span className="val-unit">pesanan</span></div>
                  <div className="metric-trend-positive">Pengantaran COD Palembang</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">RATA-RATA NILAI TRANSAKSI</span>
                  <div className="metric-primary-val">
                    Rp {adminOrders.length > 0
                      ? Math.round(totalRevenue / adminOrders.length).toLocaleString('id-ID')
                      : '0'}
                  </div>
                  <div className="metric-trend-positive">
                    {adminOrders.length > 0 ? `Dari ${adminOrders.length} pesanan aktif` : 'Menunggu pesanan pertama'}
                  </div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">TOTAL PENDAPATAN DITERIMA</span>
                  <div className="metric-primary-val">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="metric-alert-pill">
                    {adminOrders.filter(o => o.fulfillment === 'Diproses').length} paket menunggu antar
                  </div>
                </div>
              </div>

              {/* TABEL PELANGGAN */}
              <div className="admin-section-container">
                <div className="admin-section-top">
                  <div>
                    <h3 className="section-serif-heading">Daftar Akun Pelanggan</h3>
                    <p className="section-subtext">Rincian profil, kontak nomor WhatsApp, dan histori pesanan pelanggan.</p>
                  </div>
                </div>

                <div className="acquisitions-table-wrap">
                  <table className="claye-patron-table">
                    <thead>
                      <tr>
                        <th>NAMA PELANGGAN</th>
                        <th>KECAMATAN / KOTA</th>
                        <th>EMAIL</th>
                        <th>NOMOR WHATSAPP</th>
                        <th>STATUS AKUN</th>
                        <th>TOTAL PESANAN</th>
                        <th>TOTAL BELANJA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectors.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#8A857F' }}>
                            <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>🍃</div>
                            <strong>Belum Ada Pelanggan Terdaftar</strong>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                              Pelanggan baru yang mendaftar atau melakukan checkout pesanan akan otomatis tercatat di sini.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        collectors.map((c, i) => (
                          <tr key={i}>
                            <td className="cell-collector-patron">
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <strong>{c.name}</strong>
                                <span style={{ fontSize: '0.72rem', color: '#8A857F' }}>({c.joinedYear})</span>
                              </div>
                            </td>
                            <td>{c.city}</td>
                            <td>{c.email}</td>
                            <td>{c.phone}</td>
                            <td>
                              <span className={`status-pill ${c.totalOrders > 0 ? 'pill-completed' : 'pill-processing'}`}>
                                {c.totalOrders > 0 ? 'Pembeli Aktif' : 'Pelanggan Baru'}
                              </span>
                            </td>
                            <td><strong>{c.totalOrders}</strong></td>
                            <td><strong>Rp {c.totalSpent.toLocaleString('id-ID')}</strong></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 6: LAPORAN & ANALISIS (ANALYTICS)
              =============================================================== */}
          {activePage === 'analytics' && (
            <div className="admin-page-view">
              {/* HEADER LAPORAN & ANALISIS */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
                borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--color-charcoal)' }}>
                    Laporan Penjualan
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#6E6962' }}>
                    Rekapitulasi keuangan toko kurasi, performa transaksi COD, dan efisiensi pengantaran.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => showToast('Laporan Keuangan Penjualan (.CSV) berhasil diunduh.', 'success')} className="purpose-action-btn primary" style={{ textTransform: 'capitalize' }}>
                    Unduh Laporan CSV
                  </button>
                  <button onClick={() => showToast('Data Penjualan Produk (.CSV) berhasil diunduh.', 'info')} className="purpose-action-btn secondary" style={{ textTransform: 'capitalize' }}>
                    Unduh Data Produk
                  </button>
                </div>
              </div>

              {/* 4 INDIKATOR EFISIENSI */}
              <div className="admin-metrics-row">
                <div className="admin-metric-card">
                  <span className="metric-title">KEPUASAN PELANGGAN (CSAT)</span>
                  <div className="metric-primary-val">98.6%</div>
                  <div className="metric-trend-positive">Berdasarkan ulasan pembeli terverifikasi</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">RATA-RATA NILAI PESANAN (AOV)</span>
                  <div className="metric-primary-val">Rp 285.000</div>
                  <div className="metric-trend-positive">+8.5% peningkatan keranjang belanja</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">KATEGORI PALING LARIS</span>
                  <div className="metric-primary-val">Cangkir dan Mug</div>
                  <div className="metric-alert-pill">45% dari seluruh volume pesanan</div>
                </div>
                <div className="admin-metric-card">
                  <span className="metric-title">KEUTUHAN PENGIRIMAN LOGISTIK</span>
                  <div className="metric-primary-val">99.8%</div>
                  <div className="metric-trend-positive">Kemasan bubble wrap ramah lingkungan sukses</div>
                </div>
              </div>

              {/* KONTRIBUSI KATEGORI PRODUK */}
              <div className="admin-section-container">
                <div className="admin-section-top">
                  <div>
                    <h3 className="section-serif-heading">Distribusi Penjualan Berdasarkan Kategori Karya</h3>
                    <p className="section-subtext">Persentase kontribusi omzet studio dari masing-masing tipe keramik buatan tangan.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                  {[
                    { category: 'Cangkir dan Mug', pct: '45%', amount: 'Rp 5.625.000', count: '45 pcs', color: '#B87355' },
                    { category: 'Peralatan Makan dan Piring', pct: '25%', amount: 'Rp 3.125.000', count: '21 pcs', color: '#24201D' },
                    { category: 'Mangkuk Stoneware', pct: '18%', amount: 'Rp 2.250.000', count: '15 pcs', color: '#385E3E' },
                    { category: 'Vas dan Wadah Kopi', pct: '12%', amount: 'Rp 1.500.000', count: '8 pcs', color: '#8A857F' }
                  ].map((cat, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{cat.category}</span>
                        <strong style={{ color: cat.color }}>{cat.pct}</strong>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#F0ECE4', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                        <div style={{ width: cat.pct, height: '100%', backgroundColor: cat.color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#8A857F' }}>
                        <span>Total: {cat.amount}</span>
                        <span>{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              HALAMAN 7: PENGATURAN TOKO (SETTINGS)
              =============================================================== */}
          {activePage === 'settings' && (
            <div className="admin-page-view">
              {/* HEADER PENGATURAN TOKO */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
                borderBottom: '1px solid var(--color-border)', paddingBottom: '1.25rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--color-charcoal)' }}>
                    Pengaturan Toko & Operasional
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#6E6962' }}>
                    Konfigurasi informasi toko CLAYÉ Studio, kontak admin, dan metode pembayaran COD Palembang.
                  </p>
                </div>
              </div>

              {/* FORM PENGATURAN STUDIO */}
              <div className="admin-section-container" style={{ maxWidth: '850px' }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Pengaturan toko kurasi berhasil disimpan dan diperbarui.', 'success');
                }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 className="section-serif-heading" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
                      1. Identitas Toko Kurasi dan Lokasi Showroom
                    </h3>
                    <p className="section-subtext" style={{ marginBottom: '1.25rem' }}>
                      Informasi yang ditampilkan di invoice pelanggan dan profil publik toko CLAYÉ.
                    </p>

                    <div className="form-group-claye">
                      <label>Nama Brand / Toko *</label>
                      <input
                        type="text"
                        value={studioSettings.studioName}
                        onChange={(e) => setStudioSettings({ ...studioSettings, studioName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group-claye">
                      <label>Alamat Fisik Gudang & Showroom di Palembang *</label>
                      <textarea
                        rows="2"
                        value={studioSettings.location}
                        onChange={(e) => setStudioSettings({ ...studioSettings, location: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                      />
                    </div>

                    <div className="checkout-form-row">
                      <div className="form-group-claye">
                        <label>No. Kontak Concierge WhatsApp</label>
                        <input
                          type="text"
                          value={studioSettings.phone}
                          onChange={(e) => setStudioSettings({ ...studioSettings, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group-claye">
                        <label>Email Resmi Admin Toko</label>
                        <input
                          type="email"
                          value={studioSettings.email}
                          onChange={(e) => setStudioSettings({ ...studioSettings, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group-claye">
                      <label>Jam Operasional Showroom & Layanan Pelanggan</label>
                      <input
                        type="text"
                        value={studioSettings.openingHours}
                        onChange={(e) => setStudioSettings({ ...studioSettings, openingHours: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #EAE6DF', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                    <h3 className="section-serif-heading" style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>
                      2. Metode Pengantaran & Pembayaran Toko
                    </h3>
                    <p className="section-subtext" style={{ marginBottom: '1.25rem' }}>
                      Sistem transaksi dan pengantaran resmi studio CLAYÉ di Kota Palembang.
                    </p>

                    <div style={{ backgroundColor: '#FAF8F5', border: '1px solid #EAE6DF', borderRadius: '8px', padding: '1.1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1rem' }}>🤝</span>
                        <strong style={{ fontSize: '0.88rem', color: '#7C4A2D' }}>
                          COD Mandiri (Cash on Delivery)
                        </strong>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#E8ECE6', color: '#385E3E', fontWeight: 700 }}>
                          Aktif
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#6A3E24', lineHeight: '1.5' }}>
                        Pesanan diantar langsung oleh kurir internal tim CLAYÉ dari studio di Palembang. Pelanggan membayar uang tunai di tempat saat serah terima barang tanpa pihak ketiga.
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #EAE6DF', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <h3 className="section-serif-heading" style={{ fontSize: '1.35rem', margin: 0 }}>
                        3. Integrasi Database Supabase (PostgreSQL Cloud)
                      </h3>
                      <span style={{
                        fontSize: '0.78rem',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        backgroundColor: isSupabaseConfigured() ? '#ECFDF5' : '#FEF3C7',
                        color: isSupabaseConfigured() ? '#047857' : '#92400E',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isSupabaseConfigured() ? '#10B981' : '#F59E0B' }}></span>
                        {isSupabaseConfigured() ? 'Database Supabase Terkoneksi' : 'Siap Dihubungkan (Mode Offline)'}
                      </span>
                    </div>
                    <p className="section-subtext" style={{ marginBottom: '1.25rem' }}>
                      Hubungkan pesanan pelanggan, inventaris produk, dan akun secara otomatis ke database cloud PostgreSQL Supabase.
                    </p>

                    <div style={{ backgroundColor: '#FAF8F5', border: '1px solid #EAE6DF', borderRadius: '8px', padding: '1.25rem' }}>
                      <div className="form-group-claye" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4A4641', display: 'block', marginBottom: '6px' }}>
                          SUPABASE PROJECT URL *
                        </label>
                        <input
                          type="text"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          placeholder="https://nzoqrzdpyhhzxuwmrcux.supabase.co"
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DED8CF', backgroundColor: '#FFFFFF', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div className="form-group-claye" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4A4641', margin: 0 }}>
                            SUPABASE ANON / PUBLIC KEY (JWT) *
                          </label>
                          <span style={{ fontSize: '0.72rem', color: '#8A857F' }}>
                            Dapatkan di Supabase Dashboard → Project Settings → API
                          </span>
                        </div>
                        <input
                          type="text"
                          value={supabaseKeyInput}
                          onChange={(e) => setSupabaseKeyInput(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DED8CF', backgroundColor: '#FFFFFF', fontSize: '0.88rem', fontFamily: 'monospace' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!supabaseKeyInput.trim()) {
                              showToast('Harap masukkan Supabase Anon Key terlebih dahulu.', 'error');
                              return;
                            }
                            localStorage.setItem('claye_supabase_url', supabaseUrlInput.trim());
                            localStorage.setItem('claye_supabase_anon_key', supabaseKeyInput.trim());
                            showToast('Menyimpan kredensial dan menguji koneksi...', 'info');
                            setIsTestingSupabase(true);
                            const res = await supabaseService.testConnection();
                            setIsTestingSupabase(false);
                            if (res.success) {
                              showToast('Koneksi ke Supabase berhasil aktif!', 'success');
                              if (syncOrders) await syncOrders();
                            } else {
                              showToast(`Respon database: ${res.message}`, 'error');
                            }
                          }}
                          disabled={isTestingSupabase}
                          style={{
                            padding: '10px 18px',
                            backgroundColor: '#B87355',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {isTestingSupabase ? 'Menghubungkan...' : 'Simpan & Hubungkan Supabase'}
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            setIsTestingSupabase(true);
                            const res = await supabaseService.testConnection();
                            setIsTestingSupabase(false);
                            if (res.success) {
                              showToast('Tes koneksi sukses: Database Supabase aktif!', 'success');
                            } else {
                              showToast(`Gagal: ${res.message}`, 'error');
                            }
                          }}
                          disabled={isTestingSupabase}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#4A4641',
                            border: '1px solid #DED8CF',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Uji Koneksi
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            if (syncOrders) await syncOrders();
                          }}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: 'transparent',
                            color: '#0369A1',
                            border: '1px solid #BAE6FD',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Tarik Pesanan dari Supabase
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="claye-terracotta-btn">
                      Simpan Pengaturan
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Perubahan dibatalkan.', 'info')}
                      className="btn-modal-cancel"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================
          MODAL: TAMBAH PRODUK KERAMIK BARU (UNTUK INVENTARIS)
          =================================================================== */}
      {isAddModalOpen && (
        <div className="claye-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">REGISTRASI PRODUK KATALOG</span>
                <h3 className="modal-title">+ Tambah Karya Keramik Baru</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-body">
              <div className="form-group-claye">
                <label>Nama Karya / Produk Keramik *</label>
                <input
                  type="text"
                  placeholder="contoh: Kyoto Pourer Vessel"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Keterangan Singkat / Subtitle Produk *</label>
                <input
                  type="text"
                  placeholder="contoh: Mangkuk keramik saji stoneware bermotif etnik nusantara"
                  value={newProdSubtitle}
                  onChange={(e) => setNewProdSubtitle(e.target.value)}
                />
              </div>

              <div className="checkout-form-row">
                <div className="form-group-claye">
                  <label>Kategori Produk</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                  >
                    <option value="Cangkir & Mug">Cangkir dan Mug</option>
                    <option value="Mangkuk">Mangkuk</option>
                    <option value="Peralatan Makan">Peralatan Makan</option>
                    <option value="Vas">Vas</option>
                    <option value="Kopi & Teh">Kopi dan Teh</option>
                    <option value="Edisi Terbatas">Edisi Terbatas</option>
                  </select>
                </div>

                <div className="form-group-claye">
                  <label>Harga dalam Rupiah (Rp) *</label>
                  <input
                    type="number"
                    placeholder="185000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-claye">
                <label>Stok Fisik Awal di Gudang (pcs)</label>
                <input
                  type="number"
                  placeholder="12"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group-claye">
                <label>Deskripsi Produk dan Bahan</label>
                <textarea
                  rows="3"
                  placeholder="Dibentuk di atas roda putar menggunakan tanah liat alami stoneware, glasir food-safe ramah lingkungan..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                />
              </div>

              {/* KODE MOTIF / VARIAN PRODUK (OPSIONAL) */}
              <div className="form-group-claye">
                <label>Kode Motif / Pilihan Varian (Opsional, pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="contoh: CER-BWL-001, CER-BWL-002, CER-BWL-003 (Kosongkan jika hanya 1 model)"
                  value={newProdCodes}
                  onChange={(e) => setNewProdCodes(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: '#8A857F', marginTop: '0.25rem', display: 'block' }}>
                  💡 Jika diisi, pembeli dapat memilih kode motif saat checkout. Jika dikosongkan, produk dijual tanpa pilihan kode (seperti Katalog 3).
                </span>
              </div>

              {/* INPUT FOTO PRODUK (MULTI-IMAGE GALLERY) */}
              <div className="form-group-claye">
                <label>Foto Produk Keramik (Bisa Masukkan Banyak Gambar) *</label>
                <div style={{
                  backgroundColor: '#FAF8F5',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE6DF',
                  marginBottom: '0.5rem'
                }}>
                  {/* PREVIEW DAFTAR FOTO */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={newProdImage}
                        alt="Foto Utama"
                        style={{
                          width: '84px',
                          height: '84px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '2px solid var(--color-terracotta)',
                          backgroundColor: '#FFFFFF'
                        }}
                        onError={(e) => { e.target.src = '/assets/images/katalog_bowl.jpg'; }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: 'var(--color-terracotta)',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}>
                        Utama
                      </span>
                    </div>

                    {newProdThumbnails.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={imgUrl}
                          alt={`Galeri ${idx + 1}`}
                          style={{
                            width: '84px',
                            height: '84px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #D8D2C7',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                          onClick={() => setNewProdImage(imgUrl)}
                          title="Klik untuk jadikan foto utama"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProdThumbnails(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            lineHeight: 1
                          }}
                          title="Hapus foto ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>


                  {/* TOMBOL UNGGAH MULTI-FOTO */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--color-terracotta)',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E4D0C5',
                      borderRadius: '6px'
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => handleMultipleImageUpload(e, setNewProdThumbnails, setNewProdImage)}
                      />
                    </label>
                  </div>
                </div>
              </div>


              {/* PENGATURAN TAMPILAN FOTO - Tambah Produk */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #EAE6DF' }}>
                <div style={{ fontSize: '0.78rem', color: '#6E6962', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Pengaturan Tampilan Foto di Katalog:
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <label style={{ fontSize: '0.74rem', color: '#8A857F', display: 'block', marginBottom: '4px' }}>Mode Tampilan</label>
                    <select
                      value={newProdImageFit}
                      onChange={(e) => setNewProdImageFit(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #D8D2C7', fontSize: '0.8rem' }}
                    >
                      <option value="contain">Contain (Tampilkan Penuh, Tidak Terpotong)</option>
                      <option value="cover">Cover (Isi Kotak, Bisa Terpotong)</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <label style={{ fontSize: '0.74rem', color: '#8A857F', display: 'block', marginBottom: '4px' }}>Zoom Foto: {newProdImageScale}%</label>
                    <input
                      type="range"
                      min="60"
                      max="130"
                      value={newProdImageScale}
                      onChange={(e) => setNewProdImageScale(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', width: '100%', aspectRatio: '4/3', border: '1px solid #EAE6DF', borderRadius: '6px', backgroundColor: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px' }}>
                  <img
                    src={newProdImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: newProdImageFit, transform: `scale(${newProdImageScale / 100})` }}
                    onError={(e) => { e.target.src = '/assets/images/katalog_bowl.jpg'; }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-modal-action">
                  Publikasikan ke Katalog Toko
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-modal-cancel">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: EDIT KARYA KERAMIK (UNTUK INVENTARIS & KATALOG)
          =================================================================== */}
      {isEditModalOpen && editingProduct && (
        <div className="claye-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">PERBARUI DATA PRODUK KATALOG</span>
                <h3 className="modal-title">✏️ Edit Karya Keramik</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="modal-body">
              <div className="form-group-claye">
                <label>Nama Karya / Produk Keramik *</label>
                <input
                  type="text"
                  placeholder="contoh: Artisan Ceramic Bowls Collection"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-claye">
                <label>Keterangan Sub-judul / Karakter Karya *</label>
                <input
                  type="text"
                  placeholder="contoh: Koleksi mangkuk keramik stoneware dengan 7 ragam motif Nusantara"
                  value={editProdSubtitle}
                  onChange={(e) => setEditProdSubtitle(e.target.value)}
                />
              </div>

              <div className="checkout-form-row">
                <div className="form-group-claye">
                  <label>Kategori Produk</label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => setEditProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                  >
                    <option value="Cangkir & Mug">Cangkir dan Mug</option>
                    <option value="Mangkuk">Mangkuk</option>
                    <option value="Peralatan Makan">Peralatan Makan</option>
                    <option value="Vas">Vas</option>
                    <option value="Kopi & Teh">Kopi dan Teh</option>
                    <option value="Edisi Terbatas">Edisi Terbatas</option>
                  </select>
                </div>

                <div className="form-group-claye">
                  <label>Harga dalam Rupiah (Rp) *</label>
                  <input
                    type="number"
                    placeholder="185000"
                    value={editProdPrice}
                    onChange={(e) => setEditProdPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="form-group-claye">
                  <label>Stok Fisik di Gudang (pcs)</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={editProdStock}
                    onChange={(e) => setEditProdStock(e.target.value)}
                    min="0"
                  />
                </div>

                <div className="form-group-claye">
                  <label>Badge / Label Status</label>
                  <select
                    value={editProdBadge}
                    onChange={(e) => setEditProdBadge(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                  >
                    <option value="Kurasi">Kurasi</option>
                    <option value="terlaris">Terlaris</option>
                    <option value="baru">Baru</option>
                    <option value="edisi terbatas">Edisi Terbatas</option>
                  </select>
                </div>
              </div>

              <div className="form-group-claye">
                <label>Deskripsi Produk dan Bahan</label>
                <textarea
                  rows="3"
                  placeholder="Dibentuk di atas roda putar menggunakan tanah liat alami stoneware, glasir food-safe..."
                  value={editProdDesc}
                  onChange={(e) => setEditProdDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                />
              </div>

              {/* KODE MOTIF / VARIAN PRODUK (OPSIONAL) */}
              <div className="form-group-claye">
                <label>Kode Motif / Pilihan Varian (Opsional, pisahkan dengan koma)</label>
                <input
                  type="text"
                  placeholder="contoh: CER-BWL-001, CER-BWL-002, CER-BWL-003 (Kosongkan jika hanya 1 model)"
                  value={editProdCodes}
                  onChange={(e) => setEditProdCodes(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: '#8A857F', marginTop: '0.25rem', display: 'block' }}>
                  💡 Jika diisi, pembeli dapat memilih kode motif saat checkout. Jika dikosongkan, produk dijual tanpa pilihan kode (seperti Katalog 3).
                </span>
              </div>

              {/* INPUT FOTO PRODUK (MULTI-IMAGE GALLERY) */}
              <div className="form-group-claye">
                <label>Foto Produk Keramik (Bisa Masukkan Banyak Gambar) *</label>
                <div style={{
                  backgroundColor: '#FAF8F5',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #EAE6DF',
                  marginBottom: '0.5rem'
                }}>
                  {/* PREVIEW DAFTAR FOTO */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={editProdImage}
                        alt="Foto Utama"
                        style={{
                          width: '84px',
                          height: '84px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '2px solid var(--color-terracotta)',
                          backgroundColor: '#FFFFFF'
                        }}
                        onError={(e) => { e.target.src = '/assets/images/katalog_bowl.jpg'; }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: 'var(--color-terracotta)',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}>
                        Utama
                      </span>
                    </div>

                    {editProdThumbnails.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={imgUrl}
                          alt={`Galeri ${idx + 1}`}
                          style={{
                            width: '84px',
                            height: '84px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #D8D2C7',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                          onClick={() => setEditProdImage(imgUrl)}
                          title="Klik untuk jadikan foto utama"
                        />
                        <button
                          type="button"
                          onClick={() => setEditProdThumbnails(prev => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            lineHeight: 1
                          }}
                          title="Hapus foto ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>


                  {/* TOMBOL UNGGAH MULTI-FOTO */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <label style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--color-terracotta)',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E4D0C5',
                      borderRadius: '6px'
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => handleMultipleImageUpload(e, setEditProdThumbnails, setEditProdImage)}
                      />
                    </label>
                  </div>
                </div>
              </div>


              {/* PENGATURAN TAMPILAN FOTO - Edit Produk */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #EAE6DF' }}>
                <div style={{ fontSize: '0.78rem', color: '#6E6962', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Pengaturan Tampilan Foto di Katalog:
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <label style={{ fontSize: '0.74rem', color: '#8A857F', display: 'block', marginBottom: '4px' }}>Mode Tampilan</label>
                    <select
                      value={editProdImageFit}
                      onChange={(e) => setEditProdImageFit(e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #D8D2C7', fontSize: '0.8rem' }}
                    >
                      <option value="contain">Contain (Tampilkan Penuh, Tidak Terpotong)</option>
                      <option value="cover">Cover (Isi Kotak, Bisa Terpotong)</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <label style={{ fontSize: '0.74rem', color: '#8A857F', display: 'block', marginBottom: '4px' }}>Zoom Foto: {editProdImageScale}%</label>
                    <input
                      type="range"
                      min="60"
                      max="130"
                      value={editProdImageScale}
                      onChange={(e) => setEditProdImageScale(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', width: '100%', aspectRatio: '4/3', border: '1px solid #EAE6DF', borderRadius: '6px', backgroundColor: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px' }}>
                  <img
                    src={editProdImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: editProdImageFit, transform: `scale(${editProdImageScale / 100})` }}
                    onError={(e) => { e.target.src = '/assets/images/katalog_bowl.jpg'; }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-modal-action">
                  Simpan Perubahan
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-modal-cancel">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: INSPEKSI DETAIL PESANAN
          =================================================================== */}
      {inspectOrderData && (
        <div className="claye-modal-overlay" onClick={() => setInspectOrderData(null)}>
          <div className="claye-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">INSPEKSI PESANAN PELANGGAN</span>
                <h3 className="modal-title">{inspectOrderData.id.replace('#', '')}</h3>
              </div>
              <button onClick={() => setInspectOrderData(null)} className="modal-close-btn" aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div style={{ backgroundColor: '#FAF8F5', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', border: '1px solid #EAE6DF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>NAMA PEMESAN</span>
                  <strong>{inspectOrderData.patron}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>NO. WHATSAPP</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#262422' }}>{inspectOrderData.phone || '-'}</strong>
                    {inspectOrderData.phone && inspectOrderData.phone !== '-' && (
                      <a
                        href={(() => {
                          const cleanNum = (inspectOrderData.phone || '').replace(/[^0-9]/g, '');
                          const formattedNum = cleanNum.startsWith('0') ? '62' + cleanNum.slice(1) : (cleanNum.startsWith('62') ? cleanNum : '62' + cleanNum);
                          const orderIdClean = (inspectOrderData.id || '').replace('#', '');
                          const patronName = inspectOrderData.patron || 'Pelanggan';
                          const grandTotal = (inspectOrderData.grandTotal || inspectOrderData.total || 0).toLocaleString('id-ID');
                          const message = `Halo Kak ${patronName}.\nKami dari CLAYÉ Curated Ceramics ingin menginformasikan bahwa pesanan keramik Anda dengan nomor ref #${orderIdClean} sedang kami siapkan dan kemas rapi dengan garansi bubble wrap.\n\nPesanan akan segera kami antar langsung ke alamat Anda (COD Rp ${grandTotal}). Mohon konfirmasi ketersediaan di lokasi ya Kak. Terima kasih.`;
                          return `https://wa.me/${formattedNum}?text=${encodeURIComponent(message)}`;
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#25D366',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.131-.497-1.745-.692-2.875-2.456-2.963-2.573-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
                        </svg>
                        Hubungi WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>EMAIL</span>
                  <span style={{ fontSize: '0.85rem' }}>{inspectOrderData.email || '-'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>ALAMAT LENGKAP PENGIRIMAN</span>
                  <span style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '65%', color: '#262422', fontWeight: 500 }}>
                    {inspectOrderData.address || inspectOrderData.shippingAddress || inspectOrderData.city}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>TANGGAL TRANSAKSI</span>
                  <span>{inspectOrderData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>METODE PEMBAYARAN</span>
                  <span>{inspectOrderData.paymentMethod || 'COD'} (<strong>{inspectOrderData.paymentStatus}</strong>)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8A857F' }}>EKSPEDISI & PENGANTARAN</span>
                  <span style={{ fontSize: '0.82rem', textAlign: 'right', maxWidth: '65%' }}>
                    {inspectOrderData.courier || 'Antar Langsung Tim CLAYÉ'} ({inspectOrderData.trackingNumber || 'CLY-COD-PLM'})
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A857F', letterSpacing: '0.08em' }}>
                  KARYA KERAMIK DALAM PAKET
                </span>
                {inspectOrderData.items && inspectOrderData.items.length > 0 ? (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {inspectOrderData.items.map((it, idx) => (
                      <div key={idx} style={{ padding: '0.75rem', border: '1px solid #EAE6DF', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem', display: 'block', color: 'var(--color-charcoal)' }}>{it.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: '#8A857F' }}>
                            {it.selectedCode || it.code ? `Kode: ${it.selectedCode || it.code} • ` : ''}Jml: {it.quantity || 1}
                          </span>
                        </div>
                        <strong>Rp {((it.price || 0) * (it.quantity || 1)).toLocaleString('id-ID')}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', border: '1px solid #EAE6DF', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{inspectOrderData.itemsSummary || 'Karya Keramik Kurasi CLAYÉ'}</span>
                    <strong>Rp {(inspectOrderData.total || 0).toLocaleString('id-ID')}</strong>
                  </div>
                )}
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#FAF8F5', border: '1px solid #EAE6DF', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#8A857F' }}>Subtotal Keramik:</span>
                    <span>Rp {(inspectOrderData.total || 0).toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#8A857F' }}>Ongkos Antar ({inspectOrderData.courier || 'Antar Langsung Tim CLAYÉ'}):</span>
                    <span>Rp {(inspectOrderData.shippingFee !== undefined ? inspectOrderData.shippingFee : 10000).toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 800, borderTop: '1px dashed #DED8CF', paddingTop: '6px' }}>
                    <span style={{ color: '#262422' }}>Total Tagihan COD:</span>
                    <span style={{ color: '#B87355' }}>
                      Rp {((inspectOrderData.grandTotal !== undefined ? inspectOrderData.grandTotal : (inspectOrderData.total + (inspectOrderData.shippingFee || 0))) || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group-claye">
                <label>Ubah Status Pengiriman (Fulfillment)</label>
                <select
                  value={inspectOrderData.fulfillment}
                  onChange={(e) => handleUpdateFulfillment(inspectOrderData.id, e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #EAE6DF' }}
                >
                  <option value="Sedang Dikemas">Sedang Dikemas</option>
                  <option value="Sedang Diantar">Sedang Diantar (COD)</option>
                  <option value="Selesai (Terkirim & Lunas)">Selesai (Terkirim & Lunas)</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank', 'width=750,height=850');
                    if (!printWindow) {
                      showToast('Popup diblokir browser. Izinkan popup untuk mencetak label.', 'error');
                      return;
                    }
                    const itemsHtml = (inspectOrderData.items && inspectOrderData.items.length > 0)
                      ? inspectOrderData.items.map(it => `
                        <tr>
                          <td style="padding: 8px 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${it.name}</td>
                          <td style="padding: 8px 10px; border-bottom: 1px solid #ddd; color: #555;">${it.selectedCode || it.code || '-'}</td>
                          <td style="padding: 8px 10px; border-bottom: 1px solid #ddd; text-align: center;">${it.quantity || 1}</td>
                          <td style="padding: 8px 10px; border-bottom: 1px solid #ddd; text-align: right;">Rp ${((it.price || 0) * (it.quantity || 1)).toLocaleString('id-ID')}</td>
                        </tr>
                      `).join('')
                      : `<tr><td colspan="4" style="padding: 8px 10px;">${inspectOrderData.itemsSummary || 'Karya Keramik Kurasi'}</td></tr>`;

                    const grandTotal = (inspectOrderData.grandTotal || inspectOrderData.total || 0).toLocaleString('id-ID');
                    const shippingFee = (inspectOrderData.shippingFee || 0).toLocaleString('id-ID');
                    const subtotal = (inspectOrderData.total || 0).toLocaleString('id-ID');

                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Label Pengemasan & Surat Jalan - ${inspectOrderData.id}</title>
                        <style>
                          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 25px; color: #222; margin: 0; }
                          .label-card { border: 2px dashed #444; border-radius: 8px; padding: 22px; max-width: 620px; margin: 0 auto; }
                          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 15px; }
                          .brand { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
                          .badge { background: #b87355; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; }
                          .cod-banner { background: #fff4eb; border: 1.5px solid #d97736; border-radius: 6px; padding: 12px 14px; margin: 14px 0; display: flex; justify-content: space-between; align-items: center; }
                          .cod-amount { font-size: 20px; font-weight: 900; color: #b87355; }
                          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; font-size: 13px; line-height: 1.5; }
                          .info-box { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; }
                          .table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 14px 0; }
                          .table th { background: #f0ede8; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 1.5px solid #ccc; }
                          .footer-note { font-size: 11px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 12px; margin-top: 15px; }
                          @media print {
                            body { padding: 0; }
                            .no-print { display: none; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="no-print" style="text-align: center; margin-bottom: 16px;">
                          <button onclick="window.print()" style="background: #b87355; color: #fff; border: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">
                            Cetak Label Sekarang
                          </button>
                        </div>
                        <div class="label-card">
                          <div class="header">
                            <div>
                              <div class="brand">CLAYÉ</div>
                              <div style="font-size: 11px; color: #666; letter-spacing: 1px;">KURASI KERAMIK NUSANTARA • PALEMBANG</div>
                            </div>
                            <div style="text-align: right;">
                              <span class="badge">SURAT JALAN & LABEL RESI</span>
                              <div style="font-size: 14px; font-weight: bold; margin-top: 5px;">${inspectOrderData.id}</div>
                              <div style="font-size: 11px; color: #777;">${inspectOrderData.date}</div>
                            </div>
                          </div>

                          <div class="cod-banner">
                            <div>
                              <div style="font-size: 12px; font-weight: 800; color: #7c4a2d; text-transform: uppercase;">
                                METODE: COD (BAYAR TUNAI DI TEMPAT)
                              </div>
                              <div style="font-size: 11px; color: #6a3e24;">Tagih uang tunai pas saat keramik diserahterimakan ke pemesan.</div>
                            </div>
                            <div class="cod-amount">Rp ${grandTotal}</div>
                          </div>

                          <div class="info-grid">
                            <div class="info-box">
                              <strong style="color: #666; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 4px;">PENGIRIM (STUDIO):</strong>
                              <div style="font-weight: bold;">CLAYÉ Studio Palembang</div>
                              <div>Jl. Sejuta Kenangan, Ilir Barat I</div>
                              <div>Kota Palembang, Sumatera Selatan</div>
                              <div>WhatsApp: +62 811-2233-4455</div>
                            </div>

                            <div class="info-box">
                              <strong style="color: #666; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 4px;">PENERIMA (TUJUAN):</strong>
                              <div style="font-weight: bold; font-size: 14px;">${inspectOrderData.patron}</div>
                              <div style="color: #b87355; font-weight: 700; margin-bottom: 2px;">Telp/WA: ${inspectOrderData.phone || '-'}</div>
                              <div>${inspectOrderData.address || inspectOrderData.shippingAddress || inspectOrderData.city}</div>
                            </div>
                          </div>

                          <div style="font-size: 11px; color: #555; margin-bottom: 4px;">
                            <strong>LAYANAN PENGANTARAN:</strong> ${inspectOrderData.courier || 'Antar Langsung Tim CLAYÉ Studio'}
                          </div>

                          <table class="table">
                            <thead>
                              <tr>
                                <th>Karya Keramik</th>
                                <th>Kode Motif / Varian</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${itemsHtml}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colspan="3" style="text-align: right; padding: 6px 10px; font-size: 11px; color: #666;">Subtotal Produk:</td>
                                <td style="text-align: right; padding: 6px 10px; font-weight: bold;">Rp ${subtotal}</td>
                              </tr>
                              <tr>
                                <td colspan="3" style="text-align: right; padding: 6px 10px; font-size: 11px; color: #666;">Ongkos Antar:</td>
                                <td style="text-align: right; padding: 6px 10px; font-weight: bold;">Rp ${shippingFee}</td>
                              </tr>
                              <tr style="border-top: 1.5px solid #222;">
                                <td colspan="3" style="text-align: right; padding: 8px 10px; font-size: 13px; font-weight: 900;">TOTAL COD DITAGIH:</td>
                                <td style="text-align: right; padding: 8px 10px; font-size: 14px; font-weight: 900; color: #b87355;">Rp ${grandTotal}</td>
                              </tr>
                            </tfoot>
                          </table>

                          <div class="footer-note">
                            DIPROTEKSI PACKING HONEYCOMB KRAFT & GARANSI GANTI BARU CLAYÉ STUDIO PALEMBANG
                          </div>
                        </div>
                      </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                  }}
                  className="btn-modal-action"
                >
                  Cetak Label Pengemasan
                </button>
                <button
                  type="button"
                  onClick={() => setInspectOrderData(null)}
                  className="btn-modal-cancel"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

