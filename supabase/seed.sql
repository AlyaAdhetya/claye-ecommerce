-- ==============================================================================
-- SEED DATA SUPABASE / POSTGRESQL: CLAYÉ E-COMMERCE (VERSI FOTO & VARIAN LENGKAP)
-- Memuat data default toko, akun, mitra pengrajin, kategori, dan 10 produk kurasi
-- ==============================================================================

-- 1. PENGATURAN TOKO (CLAYÉ PALEMBANG)
INSERT INTO public.store_settings (id, store_name, address, city, province, postal_code, phone, email, opening_hours, qris_active, bca_va_active, shipping_protection)
VALUES (
    1,
    'CLAYÉ',
    'Jl. Sejuta Kenangan',
    'Palembang',
    'Sumatera Selatan',
    '30138',
    '+62 811-2233-4455',
    'admin@claye.id',
    'Senin – Sabtu: 08:00 – 19:00 WIB',
    true,
    true,
    true
)
ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    postal_code = EXCLUDED.postal_code,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    opening_hours = EXCLUDED.opening_hours;

-- 2. AKUN PENGGUNA DEMO
-- Admin CLAYÉ
INSERT INTO public.users (id, email, password_hash, full_name, phone, address, city, province, postal_code, role, patron_tier, patron_since)
VALUES (
    1,
    'admin@claye.id',
    'atelier2026',
    'Admin CLAYÉ',
    '+62 811-2233-4455',
    'Jl. Sejuta Kenangan, Palembang, Sumatera Selatan',
    'Palembang',
    'Sumatera Selatan',
    '30138',
    'admin',
    'Head Curator & Store Administrator',
    2021
)
ON CONFLICT (email) DO NOTHING;

-- Pelanggan Arumi
INSERT INTO public.users (id, email, password_hash, full_name, phone, address, city, province, postal_code, role, patron_tier, patron_since)
VALUES (
    2,
    'arumi@example.com',
    'claye2026',
    'Arumi',
    '+62 812-3456-7890',
    'Jl. Sejuta Kenangan No. 12',
    'Palembang',
    'Sumatera Selatan',
    '30138',
    'customer',
    'Pelanggan Tetap',
    2024
)
ON CONFLICT (email) DO NOTHING;

-- 3. MITRA PENGRAJIN (ARTISAN PARTNERS)
INSERT INTO public.artisan_partners (id, studio_name, artisan_lead, region_origin, contact_phone, bio)
VALUES
    (1, 'Studio Keramik Tanah Dewata', 'I Wayan Sudiarta', 'Bali', '+62 813-1122-3344', 'Sentra keramik artisan spesialis stoneware tanah liat vulkanik bakar tinggi.'),
    (2, 'Tembikar Parahyangan Atelier', 'Asep Suhendar', 'Bandung', '+62 812-4455-6677', 'Studio tembikar kontemporer dengan glasir mineral abu kayu pinus.'),
    (3, 'Bengkel Gerabah Kasongan Klasik', 'Bambang Triyono', 'Kasongan, Yogyakarta', '+62 818-7788-9900', 'Sentra tembikar legendaris penghasil piring, cangkir, dan mangkuk tradisional.'),
    (4, 'Stoneware Pesisir Sukabumi', 'Hendra Wijaya', 'Sukabumi', '+62 815-2233-4455', 'Spesialis botol, vas, dan teko keramik berbobot seimbang dan kedap air.')
ON CONFLICT (id) DO NOTHING;

-- 4. KATEGORI PRODUK
INSERT INTO public.categories (id, name, slug, description)
VALUES
    (1, 'Cangkir & Mug', 'cangkir-mug', 'Koleksi mug, cangkir teh, dan cangkir kopi buatan tangan perajin lokal.'),
    (2, 'Mangkuk', 'mangkuk', 'Mangkuk saji, mangkuk sup, dan mangkuk salad organik multifungsi.'),
    (3, 'Peralatan Makan', 'peralatan-makan', 'Piring makan dan piring saji stoneware aman saji (food-grade).'),
    (4, 'Vas', 'vas', 'Vas bunga dan siluet dekoratif penghias ruang tinggal.'),
    (5, 'Kopi & Teh', 'kopi-teh', 'Teko seduh, dripper, dan perlengkapan meja minum.'),
    (6, 'Pot Tanaman', 'pot-tanaman', 'Pot tanaman berpori untuk tanaman hias indoor.')
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUK KURASI (10 PRODUK DENGAN FOTO EKSKLUSIF MASING-MASING)
INSERT INTO public.products (id, category_id, artisan_partner_id, name, subtitle, price, stock, badge, description, material, firing_temp, dimensions, capacity, weight, image_url, rating_cache, reviews_count_cache)
VALUES
    (
        1, 1, 1,
        'The Sunday Mug (Neko Wave Edition)',
        'Edisi resmi CLAYÉ: Keramik stoneware motif ombak kucing & glasir kobalt',
        135000, 18, 'terlaris',
        'Cangkir keramik edisi spesial CLAYÉ dengan motif ombak Seigaiha tradisional Jepang berpadu karakter kucing menggemaskan. Dibuat manual di atas roda putar menggunakan tanah liat stoneware berkualitas kaya mineral, dengan lapisan glasir biru kobalt dan krem lembut.',
        'Stoneware Alami Tahan Panas', '1240°C', 'Tinggi 9.0 cm, Diameter 8.8 cm', '340 ml', '350 gram',
        '/assets/images/product_neko_mug.jpg', 5.00, 168
    ),
    (
        2, 2, 2,
        'Neko Seigaiha Dining Bowl',
        'Mangkuk saji keramik dengan lukisan ombak tradisional & kucing peeking',
        185000, 12, 'pilihan',
        'Mangkuk saji serbaguna dengan lukisan tangan motif ombak laut Seigaiha dan wajah kucing ceria. Sempurna untuk hidangan mi ramen hangat, donburi, sup, maupun salad.',
        'Stoneware Putih Alami', '1240°C', 'Tinggi 7.5 cm, Diameter 16.5 cm', '600 ml', '420 gram',
        '/assets/images/product_neko_bowl.jpg', 4.90, 114
    ),
    (
        3, 4, 1,
        'Alba Neko Bud Vase',
        'Vas keramik siluet ramping dengan motif ombak kucing dekoratif',
        220000, 8, 'pilihan',
        'Vas bunga keramik dengan lengkung leher anggun, dihiasi motif ombak biru dan ekspresi kucing yang manis. Dirancang ideal untuk menampung setangkai bunga segar, baby’s breath kering, atau ranting estetis.',
        'Stoneware Padat Tahan Bocor', '1250°C', 'Tinggi 16.5 cm, Diameter 4.5 cm (leher)', '280 ml', '460 gram',
        '/assets/images/product_neko_vase.jpg', 4.90, 78
    ),
    (
        4, 3, 3,
        'Everyday Ceramic Plate',
        'Piring makan stoneware tepi raw terracotta alami',
        150000, 22, 'esensial',
        'Piring saji harian berdiameter 23 cm untuk sarapan hingga makan malam keluarga, dipasok dari sentra tembikar Bali. Menampilkan aksen tepi unglazed mentah yang memperlihatkan keaslian bintik mineral tanah liat alami.',
        'Stoneware Terracotta Sukabumi', '1240°C', 'Diameter 23.0 cm, Tinggi 2.4 cm', 'Profil Rata Makanan', '490 gram',
        '/assets/images/product_plate.jpg', 4.80, 184
    ),
    (
        5, 5, 4,
        'Stillness Ceramic Teapot & Dripper',
        'Teko teh keramik estetik dengan pegangan bambu rotan',
        340000, 7, 'ritual',
        'Teko keramik berkapasitas 650 ml hasil kurasi pengrajin tembikar berpengalaman, dilengkapi pegangan anyaman bambu rotan yang tahan panas dan saringan keramik internal untuk seduhan teh daun lepas berkualitas.',
        'Stoneware Pesisir Tahan Panas', '1260°C', 'Tinggi 14.0 cm, Diameter 13.5 cm', '650 ml', '680 gram',
        '/assets/images/product_teapot.jpg', 4.95, 95
    ),
    (
        6, 1, 2,
        'Dusk Horizon Stoneware Mug',
        'Cangkir stoneware modern perpaduan biru kobalt pekat & krem pasir',
        130000, 15, 'baru',
        'Cangkir keramik minimalis bergaya Skandinavia-Jepang (Japandi) dengan teknik pencelupan dua warna (two-tone dip). Bagian atas berbalut glasir biru malam (deep cobalt) yang elegan dengan bagian dasar berwarna krem pasir halus.',
        'Stoneware Mineral Padat', '1250°C', 'Tinggi 9.2 cm, Diameter 8.4 cm', '320 ml', '330 gram',
        '/assets/images/product_dusk_mug.jpg', 4.88, 62
    ),
    (
        7, 1, 1,
        'The Sunday Mug (Edisi Klasik Bintik Batu)',
        'Stoneware bintik mineral alami karya pengrajin tembikar Bali',
        125000, 20, 'esensial',
        'Varian klasik legendaris The Sunday Mug dengan permukaan bertekstur bintik mineral alami bumi. Memberikan rasa tenang dan otentik di setiap tegukan kopi pagi Anda.',
        'Stoneware Pasir Kasar Alami', '1240°C', 'Tinggi 8.5 cm, Diameter 9.0 cm', '320 ml', '340 gram',
        '/assets/images/product_mug.jpg', 4.85, 142
    ),
    (
        8, 2, 2,
        'Neko Ramen & Donburi Studio Bowl',
        'Mangkuk ramen keramik berdiameter 18 cm motif kucing & gelombang laut',
        195000, 14, 'terlaris',
        'Mangkuk ramen keramik berukuran besar dengan siluet mangkuk mie khas Jepang. Dinding tebal menjaga kuah kaldu tetap hangat lebih lama. Dihiasi motif kucing yang mengintip di antara deburan ombak biru.',
        'Stoneware Porselen Padat', '1250°C', 'Tinggi 8.8 cm, Diameter 18.2 cm', '850 ml', '510 gram',
        '/assets/images/product_neko_bowl_studio.jpg', 4.92, 86
    ),
    (
        9, 4, 3,
        'Wabi Sculptural Terracotta Vase',
        'Vas bunga artistik siluet organik tekstur pasir terakota mentah',
        260000, 5, 'terbatas',
        'Vas seni organik berpori mikro yang mengeksplorasi keindahan tanah liat alami tanpa glasir mengilap. Menghadirkan ketenangan visual yang dalam di sudut credenza atau meja ruang tamu Anda.',
        'Tanah Liat Merah Alami Kasongan', '1220°C', 'Tinggi 22.0 cm, Diameter 8.0 cm', 'Kedap Bunga Kering', '720 gram',
        '/assets/images/product_vase.jpg', 4.88, 44
    ),
    (
        10, 6, 1,
        'Komorebi Planter Pot & Saucer',
        'Pot tanaman indoor berpori dengan tatakan air terpisah',
        165000, 19, 'esensial',
        'Pot tanaman stoneware berpori alami karya pengrajin tembikar Bali, dilengkapi lubang drainase bawah dan tatakan terpisah untuk menjaga kebersihan meja atau credenza ruang Anda.',
        'Terracotta Berpori Pilihan', '1200°C', 'Tinggi 13.5 cm, Diameter 14.0 cm', 'Ideal Tanaman 4-5 Inci', '580 gram',
        '/assets/images/product_planter.jpg', 4.75, 82
    ),
    (
        11, 5, 2,
        'Harvest Sandstone Teapot',
        'Teko seduh teh klasik stoneware dua warna dengan glasir bintik batu pasir & krem',
        265000, 14, 'pilihan',
        'Teko keramik stoneware kurasi pengrajin tembikar dengan kombinasi dua warna alami—bagian atas berglasir krem bintik pasir halus dan bagian dasar tanah liat mentah bervitrifikasi. Dilengkapi moncong presisi anti-tetes dan saringan internal tanah liat.',
        'Stoneware Bintik Mineral', '1250°C', 'Tinggi 14.5 cm, Diameter 8.5 cm', '750 ml (3-4 Cangkir)', '580 gram',
        '/assets/images/product_harvest_teapot.jpg', 4.95, 67
    ),
    (
        12, 6, 4,
        'Fluted Wave Ceramic Planter',
        'Pot tanaman keramik sculptural beralur gelombang organik warna pasir alami',
        175000, 16, 'baru',
        'Pot tanaman indoor bernilai seni sculptural tinggi dengan alur gelombang meliuk vertikal yang dibentuk dengan teliti oleh pengrajin mitra. Finishing glasir matte berpori mikro warna pasir alami.',
        'Tanah Liat Berpasir Mineral', '1230°C', 'Tinggi 15.0 cm, Diameter 14.5 cm', 'Pot Tanaman 5 Inci', '620 gram',
        '/assets/images/product_wave_planter.jpg', 4.88, 39
    ),
    (
        13, 2, 3,
        'Tropical Monstera Porcelain Bowl',
        'Mangkuk porselen putih dengan lukisan tangan daun monstera & aksen bibir terakota',
        145000, 20, 'baru',
        'Mangkuk saji porselen kurasi CLAYÉ dengan lukisan underglaze daun monstera tropis rimbun berpadu aksen garis halus terakota di tepian bibir mangkuk. Sangat higienis dan mudah dibersihkan.',
        'Porselen Putih Kaolin', '1280°C', 'Tinggi 7.0 cm, Diameter 15.5 cm', '520 ml', '320 gram',
        '/assets/images/product_monstera_bowl.jpg', 4.92, 53
    ),
    (
        14, 2, 1,
        'Nebula Blue Yohen Chawan',
        'Mangkuk teh matcha tradisional dengan glasir kristal biru kosmik & tepian besi bakar',
        295000, 8, 'edisi terbatas',
        'Karya mahakarya keramik dengan teknik glasir reduksi tungku Yohen Tenmoku yang langka. Menghasilkan pola kristal biru kobalt berkilau bak galaksi nebula di dalam mangkuk, dibingkai tepian cokelat karat besi alami.',
        'Stoneware Vulkanik Halus', '1280°C', 'Tinggi 7.8 cm, Diameter 12.5 cm', '450 ml (Matcha & Teh Tubruk)', '390 gram',
        '/assets/images/product_nebula_chawan.jpg', 5.0, 74
    ),
    (
        15, 5, 3,
        'Royal Silver Luster Tea Set',
        'Set teko porselen klasik & cangkir teh dengan lapisan glasir kilau perak (Silver Luster)',
        420000, 6, 'edisi terbatas',
        'Set perangkat minum teh mewah berdesain eropa klasik era Victoria hasil kurasi atelier CLAYÉ. Terdiri dari satu teko teh bermahkota kubah dan satu cangkir cawan berlekuk anggun dengan lapisan silver luster.',
        'Porselen Putih Fine Bone Quality', 'Glaze 1260°C & Luster 800°C', 'Teko 17 cm, Cangkir 6.5 cm', 'Teko 680 ml, Cangkir 180 ml', 'Set total 850 gram',
        '/assets/images/product_silver_teaset.jpg', 4.98, 42
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    subtitle = EXCLUDED.subtitle,
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    badge = EXCLUDED.badge,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 6. VARIAN GLASIR PRODUK DIPERBANYAK
INSERT INTO public.product_glazes (id, product_id, glaze_name, hex_preview, finish_type)
VALUES
    -- Varian Product 1 (Neko Wave Mug)
    (1, 1, 'Biru Kobalt Ombak (Neko Wave)', '#2A4B7C', 'Glossy Biru Kobalt'),
    (2, 1, 'Gading Klasik (Ivory Speckle)', '#EBE5D8', 'Matte Lembut'),
    (3, 1, 'Hijau Sage Alami', '#BDC7B9', 'Matte'),
    (4, 1, 'Terracotta Merah Hangat', '#C28469', 'Unglazed Terakota'),

    -- Varian Product 2 (Neko Dining Bowl)
    (5, 2, 'Biru Neko Seigaiha (Indigo)', '#1B3B6F', 'Underglaze Biru'),
    (6, 2, 'Hijau Sage Matte', '#BDC7B9', 'Matte Lembut'),
    (7, 2, 'Pasir Alami', '#D6CEBE', 'Tekstur Mikro'),
    (8, 2, 'Gading (Ivory)', '#EBE5D8', 'Satin'),

    -- Varian Product 3 (Neko Bud Vase)
    (9, 3, 'Biru Ombak Kucing (Neko Wave)', '#2A4B7C', 'Satin Biru'),
    (10, 3, 'Merah Muda Pucat', '#E7C8C3', 'Satin Halus'),
    (11, 3, 'Putih Abu Mineral', '#EFECE6', 'Matte'),
    (12, 3, 'Terracotta Bakar', '#C28469', 'Bakar Tungku'),

    -- Varian Product 4 (Everyday Plate)
    (13, 4, 'Gading Raw Edge', '#EBE5D8', 'Semi-Matte'),
    (14, 4, 'Terracotta Alami', '#C28469', 'Unglazed Edge'),
    (15, 4, 'Abu Arang Tenmoku', '#4A4643', 'Kristal Besi'),
    (16, 4, 'Hijau Sage Celadon', '#BDC7B9', 'Crackle Halus'),

    -- Varian Product 5 (Teapot)
    (17, 5, 'Batu Pasir & Gading', '#D6CEBE', 'Matte'),
    (18, 5, 'Hitam Besi Tenmoku', '#2C2A29', 'Kristal Besi Tenmoku'),
    (19, 5, 'Putih Tulang Alami', '#FAF6F0', 'Matte'),

    -- Varian Product 6 (Dusk Horizon Mug)
    (20, 6, 'Biru Senja & Pasir (Cobalt Horizon)', '#1D3557', 'Dual Dip Glaze'),
    (21, 6, 'Hijau Hutan & Gading', '#4A5D4E', 'Dual Dip Glaze'),
    (22, 6, 'Karamel & Pasir Mentah', '#8B5A2B', 'Dual Dip Glaze'),

    -- Varian Product 7 (Classic Sunday Mug)
    (23, 7, 'Gading (Ivory Speckle)', '#EBE5D8', 'Matte Lembut Bintik'),
    (24, 7, 'Hijau Sage', '#BDC7B9', 'Matte Alami'),
    (25, 7, 'Merah Muda Pucat', '#E7C8C3', 'Satin Halus'),

    -- Varian Product 8 (Neko Ramen Studio Bowl)
    (26, 8, 'Biru Neko Klasik (Cobalt Blue)', '#1F3C88', 'Underglaze Biru'),
    (27, 8, 'Hitam Tinta Arang (Sumi Waves)', '#2B2B2B', 'Hitam Tinta'),
    (28, 8, 'Cokelat Karamel (Sepia Waves)', '#8C6239', 'Sepia Vintage'),

    -- Varian Product 9 (Sculptural Vase)
    (29, 9, 'Terracotta Kasar Alami', '#B85D3B', 'Tekstur Pasir Kasar'),
    (30, 9, 'Batu Pasir Putih', '#D6CEBE', 'Vitrified Sand'),
    (31, 9, 'Abu Vulkanik Kasongan', '#635D55', 'Abu Mineral'),

    -- Varian Product 10 (Planter Pot)
    (32, 10, 'Terracotta Alami', '#C28469', 'Tanah Liat Berpori'),
    (33, 10, 'Hijau Sage Lumut', '#BDC7B9', 'Matte'),
    (34, 10, 'Putih Kapur Matte', '#EAE6DF', 'Chalk Matte'),

    -- Varian Product 11 (Harvest Sandstone Teapot)
    (35, 11, 'Batu Pasir Krem (Harvest Cream)', '#DDCFB9', 'Dual Tone Glaze'),
    (36, 11, 'Cokelat Terracotta Hangat', '#A96F52', 'Matte Lembut'),
    (37, 11, 'Hijau Sage Matte', '#BAC4B6', 'Matte'),

    -- Varian Product 12 (Fluted Wave Planter)
    (38, 12, 'Pasir Bergelombang (Sand Wave)', '#DFD5C6', 'Alur Pori Mikro'),
    (39, 12, 'Abu-Abu Mineral', '#8F8A83', 'Matte'),
    (40, 12, 'Terracotta Bata Alami', '#B86B52', 'Tanah Liat Bakar'),

    -- Varian Product 13 (Tropical Monstera Bowl)
    (41, 13, 'Monstera Tropis (Green Botanical)', '#4C7C54', 'Underglaze Botanical'),
    (42, 13, 'Putih Porselen Murni', '#F5F5F3', 'Glossy Kaca Bening'),
    (43, 13, 'Sage Minimalis', '#9DB09D', 'Satin'),

    -- Varian Product 14 (Nebula Blue Yohen Chawan)
    (44, 14, 'Biru Nebula Kosmik (Yohen Blue)', '#194B8C', 'Kristal Reduksi Tungku'),
    (45, 14, 'Besi Karat Tenmoku (Iron Rust)', '#5A3726', 'Kristal Karat Tenmoku'),
    (46, 14, 'Biru Kobalt Tengah Malam', '#0F2447', 'Satin Deep Blue'),

    -- Varian Product 15 (Royal Silver Luster Tea Set)
    (47, 15, 'Putih & Kilau Perak (Silver Luster)', '#D4D8DD', 'Overglaze Silver Luster'),
    (48, 15, 'Porselen Gading Mengilap', '#F8F6F0', 'Glossy Fine Porcelain'),
    (49, 15, 'Platinum Klasik', '#B8BFC7', 'Platinum Luster')
ON CONFLICT (id) DO UPDATE SET
    glaze_name = EXCLUDED.glaze_name,
    hex_preview = EXCLUDED.hex_preview,
    finish_type = EXCLUDED.finish_type;

-- 7. CONTOH PESANAN AWAL
INSERT INTO public.orders (
    id, order_number, user_id, total_items_amount, shipping_fee, grand_total,
    payment_status, payment_method, fulfillment_status, courier_name, tracking_number,
    recipient_name, recipient_phone, shipping_address, shipping_city, shipping_postal_code, customer_notes
)
VALUES (
    1,
    'CLY-EXP-86104-PLM',
    2,
    135000,
    15000,
    150000,
    'LUNAS',
    'Virtual Account (BCA)',
    'SELESAI',
    'Pengiriman Reguler (Eco Shield)',
    'CLY-EXP-86104-PLM',
    'Arumi',
    '+62 812-3456-7890',
    'Jl. Sejuta Kenangan No. 12',
    'Palembang',
    '30138',
    'Titipkan di resepsionis jika tidak di tempat.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (id, order_id, product_id, product_name_snapshot, glaze_name_snapshot, quantity, unit_price_snapshot, subtotal)
VALUES (
    1, 1, 1, 'The Sunday Mug (Neko Wave Edition)', 'Biru Kobalt Ombak (Neko Wave)', 1, 135000, 135000
)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence IDs agar auto-increment berlanjut secara benar
SELECT setval('public.users_id_seq', COALESCE((SELECT MAX(id) FROM public.users), 1));
SELECT setval('public.artisan_partners_id_seq', COALESCE((SELECT MAX(id) FROM public.artisan_partners), 1));
SELECT setval('public.categories_id_seq', COALESCE((SELECT MAX(id) FROM public.categories), 1));
SELECT setval('public.products_id_seq', COALESCE((SELECT MAX(id) FROM public.products), 1));
SELECT setval('public.product_glazes_id_seq', COALESCE((SELECT MAX(id) FROM public.product_glazes), 1));
SELECT setval('public.orders_id_seq', COALESCE((SELECT MAX(id) FROM public.orders), 1));
SELECT setval('public.order_items_id_seq', COALESCE((SELECT MAX(id) FROM public.order_items), 1));
