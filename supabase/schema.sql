-- ==============================================================================
-- SKEMA BASIS DATA POSTGRESQL / SUPABASE: CLAYÉ E-COMMERCE
-- Toko & Reseller Resmi Kurasi Keramik Nusantara
-- Lokasi: Jl. Sejuta Kenangan, Palembang, Sumatera Selatan
-- Jam Operasional: Senin – Sabtu, 08.00 – 19.00 WIB
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL USERS (AKUN PELANGGAN & ADMINISTRATOR)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    auth_id UUID UNIQUE, -- Tautan opsional ke auth.users Supabase jika memakai Supabase Auth
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(25),
    address TEXT DEFAULT 'Jl. Sejuta Kenangan, Palembang',
    city VARCHAR(60) DEFAULT 'Palembang',
    province VARCHAR(60) DEFAULT 'Sumatera Selatan',
    postal_code VARCHAR(10) DEFAULT '30138',
    country VARCHAR(50) DEFAULT 'Indonesia',
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    patron_tier VARCHAR(40) DEFAULT 'Pelanggan Baru',
    patron_since INT DEFAULT 2026,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL MITRA PENGRAJIN LOKAL (ARTISAN PARTNERS)
CREATE TABLE IF NOT EXISTS public.artisan_partners (
    id BIGSERIAL PRIMARY KEY,
    studio_name VARCHAR(100) NOT NULL,
    artisan_lead VARCHAR(100),
    region_origin VARCHAR(80) NOT NULL, -- Bali, Kasongan, Sukabumi, Plered, dll.
    contact_phone VARCHAR(25),
    bio TEXT,
    joined_at DATE DEFAULT CURRENT_DATE
);

-- 4. TABEL KATEGORI PRODUK
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    slug VARCHAR(70) NOT NULL UNIQUE,
    description TEXT
);

-- 5. TABEL PRODUK KURASI
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES public.categories(id) ON DELETE RESTRICT,
    artisan_partner_id BIGINT REFERENCES public.artisan_partners(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    subtitle VARCHAR(150),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    badge VARCHAR(30), -- 'terlaris', 'baru', 'edisi terbatas'
    description TEXT NOT NULL,
    material VARCHAR(60) DEFAULT 'Stoneware Alami',
    firing_temp VARCHAR(50) DEFAULT '1240°C - 1260°C',
    dimensions VARCHAR(80),
    capacity VARCHAR(40),
    weight VARCHAR(40),
    is_food_safe BOOLEAN DEFAULT TRUE,
    is_microwave_safe BOOLEAN DEFAULT TRUE,
    is_dishwasher_safe BOOLEAN DEFAULT TRUE,
    rating_cache NUMERIC(3,2) DEFAULT 5.00,
    reviews_count_cache INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL VARIAN GLASIR PRODUK
CREATE TABLE IF NOT EXISTS public.product_glazes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    glaze_name VARCHAR(60) NOT NULL,
    glaze_code VARCHAR(30),
    finish_type VARCHAR(50),
    hex_preview VARCHAR(10),
    stock_qty INT DEFAULT 10 CHECK (stock_qty >= 0)
);

-- 7. TABEL GALERI GAMBAR PRODUK
CREATE TABLE IF NOT EXISTS public.product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

-- 8. TABEL KERANJANG BELANJA (CARTS & CART_ITEMS)
CREATE TABLE IF NOT EXISTS public.carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    glaze_name VARCHAR(60),
    custom_stamp VARCHAR(60),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL TRANSAKSI PESANAN (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    total_items_amount NUMERIC(12,2) NOT NULL,
    shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 15000,
    grand_total NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'MENUNGGU_PEMBAYARAN' CHECK (payment_status IN ('MENUNGGU_PEMBAYARAN', 'LUNAS', 'KADALUARSA', 'DIBATALKAN')),
    payment_method VARCHAR(60) NOT NULL,
    fulfillment_status VARCHAR(30) DEFAULT 'DIPROSES_KURASI' CHECK (fulfillment_status IN ('MENUNGGU_KONFIRMASI', 'DIPROSES_KURASI', 'DIKIRIM', 'SELESAI', 'DIBATALKAN')),
    courier_name VARCHAR(60) DEFAULT 'Pengiriman Reguler (Eco Shield)',
    tracking_number VARCHAR(60),
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(25) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(60) NOT NULL DEFAULT 'Palembang',
    shipping_postal_code VARCHAR(10) NOT NULL DEFAULT '30138',
    customer_notes TEXT,
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL RINCIAN PESANAN (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name_snapshot VARCHAR(120) NOT NULL,
    glaze_name_snapshot VARCHAR(60),
    custom_stamp_snapshot VARCHAR(60),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_snapshot NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL
);

-- 11. TABEL DAFTAR FAVORIT (WISHLISTS)
CREATE TABLE IF NOT EXISTS public.wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- 12. TABEL ULASAN PRODUK (PRODUCT_REVIEWS)
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES public.orders(id) ON DELETE SET NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABEL PENGATURAN TOKO (STORE_SETTINGS)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(100) DEFAULT 'CLAYÉ',
    address TEXT DEFAULT 'Jl. Sejuta Kenangan',
    city VARCHAR(60) DEFAULT 'Palembang',
    province VARCHAR(60) DEFAULT 'Sumatera Selatan',
    postal_code VARCHAR(10) DEFAULT '30138',
    phone VARCHAR(30) DEFAULT '+62 811-2233-4455',
    email VARCHAR(100) DEFAULT 'admin@claye.id',
    opening_hours VARCHAR(100) DEFAULT 'Senin – Sabtu: 08:00 – 19:00 WIB',
    qris_active BOOLEAN DEFAULT TRUE,
    bca_va_active BOOLEAN DEFAULT TRUE,
    shipping_protection BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- KEBIJAKAN ROW LEVEL SECURITY (RLS) SUPABASE
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_glazes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 1. Izin Baca Publik (Semua orang bisa melihat katalog, kategori, ulasan, & pengaturan toko)
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read artisan_partners" ON public.artisan_partners;
CREATE POLICY "Public read artisan_partners" ON public.artisan_partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read glazes" ON public.product_glazes;
CREATE POLICY "Public read glazes" ON public.product_glazes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read product_images" ON public.product_images;
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read reviews" ON public.product_reviews;
CREATE POLICY "Public read reviews" ON public.product_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read store_settings" ON public.store_settings;
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);

-- 2. Izin Akses Pengguna & Admin (Users, Carts, Orders, Wishlist, Admin Catalog)
DROP POLICY IF EXISTS "Allow all actions on users" ON public.users;
CREATE POLICY "Allow all actions on users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all actions on carts" ON public.carts;
CREATE POLICY "Allow all actions on carts" ON public.carts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all actions on cart_items" ON public.cart_items;
CREATE POLICY "Allow all actions on cart_items" ON public.cart_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all actions on orders" ON public.orders;
CREATE POLICY "Allow all actions on orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all actions on order_items" ON public.order_items;
CREATE POLICY "Allow all actions on order_items" ON public.order_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all actions on wishlists" ON public.wishlists;
CREATE POLICY "Allow all actions on wishlists" ON public.wishlists FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all actions on products for admin" ON public.products;
CREATE POLICY "Allow all actions on products for admin" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow update on store_settings" ON public.store_settings;
CREATE POLICY "Allow update on store_settings" ON public.store_settings FOR ALL USING (true);

