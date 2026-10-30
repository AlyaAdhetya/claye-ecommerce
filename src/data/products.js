export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'The Sunday Mug',
    subtitle: 'Stoneware bintik halus dengan glasir gading',
    category: 'Cangkir & Mug',
    price: 125000,
    usdPrice: 48,
    oldPrice: null,
    image: '/assets/images/product_mug.jpg',
    thumbnails: [
      '/assets/images/product_mug.jpg',
      '/assets/images/product_bowl.jpg',
      '/assets/images/products_collection.jpg'
    ],
    badge: 'terlaris',
    batchInfo: 'BATCH STUDIO NO. 14 / 40 BUATAN TANGAN',
    editionInfo: 'STUDIO BALI • EDISI NO. 14',
    rating: 4.9,
    reviews: 148,
    stock: 14,
    description: 'Mug keramik buatan tangan yang dirancang untuk menyempurnakan ritual minum kopi dan teh sehari-hari. Dibentuk perlahan di atas roda putar menggunakan tanah liat stoneware kaya mineral, dengan sentuhan glasir matte alami yang lembut dan nyaman dalam genggaman.',
    glazeOptions: [
      { id: 'ivory', name: 'Gading (Ivory)', hex: '#EBE5D8', default: true },
      { id: 'sage', name: 'Hijau Sage', hex: '#BDC7B9' },
      { id: 'dustypink', name: 'Merah Muda Pucat', hex: '#E7C8C3' }
    ],
    specs: {
      height: '8.5 cm',
      dryWeight: 'Sekitar 340 gram',
      rimDiameter: '9.0 cm',
      technique: 'Roda Putar Tradisional',
      liquidCapacity: '320 ml',
      origin: 'Bali, Indonesia',
      firing: 'Pembakaran Suhu Tinggi 1240°C',
      clay: 'Stoneware Alami Sukabumi'
    },
    materialsCare: 'Dibuat dengan glasir mineral alami standar food-grade (aman untuk makanan & minuman). Aman untuk penggunaan microwave dan mesin cuci piring. Dianjurkan dicuci manual untuk merawat kilau glasir lebih lama.',
    shippingInfo: 'Dikemas rapi dengan pelindung sarang lebah (honeycomb) ramah lingkungan dan kardus ganda tahan guncangan. Bergaransi 100% penggantian jika pecah selama perjalanan.'
  },
  {
    id: 2,
    name: 'Solace Ceramic Bowl',
    subtitle: 'Glasir matte hijau sage lembut',
    category: 'Mangkuk',
    price: 185000,
    usdPrice: 64,
    oldPrice: 210000,
    image: '/assets/images/product_bowl.jpg',
    thumbnails: [
      '/assets/images/product_bowl.jpg',
      '/assets/images/product_plate.jpg',
      '/assets/images/products_collection.jpg'
    ],
    badge: 'pilihan',
    batchInfo: 'BATCH STUDIO NO. 12 / 30 BUATAN TANGAN',
    editionInfo: 'STUDIO BANDUNG • EDISI NO. 09',
    rating: 4.8,
    reviews: 92,
    stock: 9,
    description: 'Mangkuk saji serbaguna dengan lengkungan tepi organik yang tenang. Dibuat satu per satu oleh artisan untuk mempertahankan keaslian bentuk tanah liat alami.',
    glazeOptions: [
      { id: 'sage', name: 'Hijau Sage', hex: '#BDC7B9', default: true },
      { id: 'sand', name: 'Pasir Alami', hex: '#D6CEBE' },
      { id: 'ivory', name: 'Gading (Ivory)', hex: '#EBE5D8' }
    ],
    specs: {
      height: '6.8 cm',
      dryWeight: 'Sekitar 410 gram',
      rimDiameter: '17.2 cm',
      technique: 'Roda Putar & Sentuhan Tangan',
      liquidCapacity: '550 ml',
      origin: 'Bandung, Indonesia',
      firing: 'High-fire Stoneware 1240°C',
      clay: 'Stoneware Pasir Putih Alami'
    },
    materialsCare: 'Bebas timbal, aman untuk hidangan panas atau berkuah. Dasar mangkuk telah dihaluskan agar tidak menggores permukaan meja.',
    shippingInfo: 'Dilengkapi bantalan cetak unbleached pulp serta boks tebal untuk pengiriman aman.'
  },
  {
    id: 3,
    name: 'Alba Bud Vase',
    subtitle: 'Glasir satin merah muda lembut',
    category: 'Vas',
    price: 220000,
    usdPrice: 76,
    oldPrice: null,
    image: '/assets/images/product_vase.jpg',
    thumbnails: [
      '/assets/images/product_vase.jpg',
      '/assets/images/hero_bg.jpg',
      '/assets/images/products_collection.jpg'
    ],
    badge: 'pilihan',
    batchInfo: 'BATCH STUDIO NO. 08 / 25 BUATAN TANGAN',
    editionInfo: 'EDISI TERBATAS • NO. 04',
    rating: 4.9,
    reviews: 67,
    stock: 6,
    description: 'Vas bunga siluet ramping yang dirancang untuk setangkai bunga segar atau ranting kering dekoratif. Permukaan satin yang halus memberikan aksen anggun di ruang santai Anda.',
    glazeOptions: [
      { id: 'dustypink', name: 'Merah Muda Pucat', hex: '#E7C8C3', default: true },
      { id: 'ashwhite', name: 'Putih Abu', hex: '#EFECE6' },
      { id: 'terracotta', name: 'Terracotta Alami', hex: '#C28469' }
    ],
    specs: {
      height: '21.5 cm',
      dryWeight: 'Sekitar 520 gram',
      rimDiameter: '3.2 cm (leher)',
      technique: 'Bentuk Siluet Roda Putar',
      liquidCapacity: 'Kedap Air',
      origin: 'Bandung, Indonesia',
      firing: 'Pembakaran Listrik & Kayu 1240°C',
      clay: 'Stoneware Berkepadatan Tinggi'
    },
    materialsCare: 'Bagian dalam dilapisi glasir tahan air. Bersihkan bagian luar cukup dengan kain lembut dan air hangat suam.',
    shippingInfo: 'Pengemasan boks ganda dengan sekat busa alami tahan goncangan.'
  },
  {
    id: 4,
    name: 'Everyday Ceramic Plate',
    subtitle: 'Tepi terracotta mentah bertekstur',
    category: 'Peralatan Makan',
    price: 150000,
    usdPrice: 52,
    oldPrice: null,
    image: '/assets/images/product_plate.jpg',
    thumbnails: [
      '/assets/images/product_plate.jpg',
      '/assets/images/product_bowl.jpg',
      '/assets/images/products_collection.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'BATCH STUDIO NO. 18 / 50 BUATAN TANGAN',
    editionInfo: 'KOLEKSI UTAMA STUDIO',
    rating: 4.8,
    reviews: 184,
    stock: 22,
    description: 'Piring saji harian untuk sarapan hingga makan malam keluarga. Menampilkan tepi unglazed mentah yang memperlihatkan keaslian bintik mineral tanah liat saat dibakar.',
    glazeOptions: [
      { id: 'ivory', name: 'Gading (Ivory)', hex: '#EBE5D8', default: true },
      { id: 'terracotta', name: 'Terracotta Alami', hex: '#C28469' },
      { id: 'charcoal', name: 'Abu Arang', hex: '#4A4643' }
    ],
    specs: {
      height: '2.4 cm',
      dryWeight: 'Sekitar 490 gram',
      rimDiameter: '23.0 cm',
      technique: 'Slab Rolled & Hand Finished',
      liquidCapacity: 'Profil Rata Makanan',
      origin: 'Bali, Indonesia',
      firing: 'High-fire 1240°C',
      clay: 'Stoneware Terracotta Sukabumi'
    },
    materialsCare: '100% aman untuk makanan dan hidangan panas. Aman untuk microwave dan mesin cuci piring.',
    shippingInfo: 'Pemisah karton ganda tanpa limbah plastik.'
  },
  {
    id: 5,
    name: 'Sabbath Dripper V60',
    subtitle: 'Dripper kopi keramik presisi untuk 1-3 cangkir',
    category: 'Kopi & Teh',
    price: 180000,
    usdPrice: 58,
    oldPrice: null,
    image: '/assets/images/product_teapot.jpg',
    thumbnails: [
      '/assets/images/product_teapot.jpg',
      '/assets/images/product_mug.jpg'
    ],
    badge: 'ritual',
    batchInfo: 'BATCH KOPI NO. 06',
    editionInfo: 'KOLABORASI SPECIALTY COFFEE',
    rating: 5.0,
    reviews: 53,
    stock: 8,
    description: 'Dripper seduh manual keramik berbentuk kerucut dengan alur spiral internal yang menjaga kestabilan suhu dan kecepatan ekstraksi rasa kopi terbaik.',
    glazeOptions: [
      { id: 'ivory', name: 'Gading Matte', hex: '#EBE5D8', default: true },
      { id: 'charcoal', name: 'Abu Arang', hex: '#524F4B' }
    ],
    specs: {
      height: '9.8 cm',
      dryWeight: '310 gram',
      rimDiameter: '11.5 cm',
      technique: 'Roda Putar & Ukiran Alur Manual',
      liquidCapacity: 'Cocok untuk Kertas Saring V60 01/02',
      origin: 'Bandung, Indonesia',
      firing: 'Tahan Panas Suhu Tinggi 1250°C',
      clay: 'Thermal Shock Resistant Clay'
    },
    materialsCare: 'Bilas dengan air hangat setelah digunakan. Aman untuk mesin cuci piring.',
    shippingInfo: 'Kemasan pas boks protektif anti-benturan.'
  },
  {
    id: 6,
    name: 'Pebble Rest & Saucer',
    subtitle: 'Tatakan keramik organik untuk cangkir atau camilan',
    category: 'Peralatan Makan',
    price: 85000,
    usdPrice: 28,
    oldPrice: null,
    image: '/assets/images/product_plate.jpg',
    thumbnails: [
      '/assets/images/product_plate.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'BATCH STUDIO NO. 22',
    editionInfo: 'STUDIO SMALLS',
    rating: 4.7,
    reviews: 79,
    stock: 35,
    description: 'Tatakan kecil terinspirasi dari kelembutan batu kali sungai. Cocok menjadi alas The Sunday Mug atau wadah kue pagi Anda.',
    glazeOptions: [
      { id: 'ivory', name: 'Gading (Ivory)', hex: '#EBE5D8', default: true },
      { id: 'sage', name: 'Hijau Sage', hex: '#BDC7B9' }
    ],
    specs: {
      height: '1.5 cm',
      dryWeight: '160 gram',
      rimDiameter: '13.5 cm',
      technique: 'Teknik Bentuk Tangan',
      liquidCapacity: 'Profil Tatakan',
      origin: 'Bali, Indonesia',
      firing: 'Stoneware 1240°C',
      clay: 'Stoneware Pasir Alami'
    },
    materialsCare: 'Food-safe dan mudah dibilas bersih.',
    shippingInfo: 'Bungkus kertas tebal dan karton penyangga.'
  },
  {
    id: 7,
    name: 'Wabi Creamer & Pitcher',
    subtitle: 'Wadah susu 200ml dengan corong tuang presisi',
    category: 'Peralatan Makan',
    price: 145000,
    usdPrice: 46,
    oldPrice: null,
    image: '/assets/images/product_teapot.jpg',
    thumbnails: [
      '/assets/images/product_teapot.jpg',
      '/assets/images/product_mug.jpg'
    ],
    badge: 'ritual',
    batchInfo: 'BATCH STUDIO NO. 11',
    editionInfo: 'RITUAL VESSELS',
    rating: 4.9,
    reviews: 42,
    stock: 11,
    description: 'Pitcher keramik mini untuk susu nabati, madu hangat, atau sirup. Ujung corong dibentuk tangan untuk penuangan rapi tanpa tetesan.',
    glazeOptions: [
      { id: 'sage', name: 'Hijau Sage', hex: '#BDC7B9', default: true },
      { id: 'ivory', name: 'Gading (Ivory)', hex: '#EBE5D8' }
    ],
    specs: {
      height: '10.2 cm',
      dryWeight: '240 gram',
      rimDiameter: '6.5 cm',
      technique: 'Roda Putar & Bentuk Corong Tangan',
      liquidCapacity: '200 ml',
      origin: 'Bandung, Indonesia',
      firing: 'Cone 10 Reduction',
      clay: 'Stoneware Putih Halus'
    },
    materialsCare: 'Aman untuk menghangatkan susu di microwave.',
    shippingInfo: 'Perlindungan ganda honeycomb wrap.'
  },
  {
    id: 8,
    name: 'Wabi Matcha Chawan',
    subtitle: 'Pembakaran Reduksi Cone 10 • Glasir Abu Kayu & Besi',
    category: 'Edisi Terbatas',
    price: 250000,
    usdPrice: 88,
    oldPrice: null,
    image: '/assets/images/product_bowl.jpg',
    thumbnails: [
      '/assets/images/product_bowl.jpg'
    ],
    badge: 'terbatas',
    batchInfo: 'EDISI DROP 04 • 08/25 DIBUAT',
    editionInfo: 'SERI MASTER ATELIER',
    rating: 5.0,
    reviews: 18,
    stock: 3,
    description: 'Mangkuk upacara teh (chawan) yang dibuat dengan teknik kurinuki ukir tangan tradisional. Pas dalam dekapan kedua telapak tangan saat menyeduh matcha.',
    glazeOptions: [
      { id: 'woodash', name: 'Abu Kayu & Besi Matte', hex: '#9E9484', default: true }
    ],
    specs: {
      height: '8.0 cm',
      dryWeight: '380 gram',
      rimDiameter: '12.8 cm',
      technique: 'Ukiran Kurinuki & Roda Putar',
      liquidCapacity: '400 ml',
      origin: 'Studio Bandung',
      firing: 'Pembakaran Reduksi 1260°C',
      clay: 'Stoneware Putih Sukabumi'
    },
    materialsCare: 'Bilas dengan air hangat suam tanpa sabun keras, lap kering dengan handuk katun.',
    shippingInfo: 'Dikemas dalam boks kayu bernomor seri dan sertifikat keaslian studio.'
  },
  {
    id: 9,
    name: 'Kyoto Ceramic Teapot',
    subtitle: 'Teko seduh teh klasik dengan saringan keramik terintegrasi',
    category: 'Kopi & Teh',
    price: 380000,
    usdPrice: 120,
    oldPrice: null,
    image: '/assets/images/product_teapot.jpg',
    thumbnails: [
      '/assets/images/product_teapot.jpg'
    ],
    badge: 'ritual',
    batchInfo: 'SERI BUDAYA TEH BATCH 03',
    editionInfo: 'KERAJINAN RODA TRADISIONAL',
    rating: 4.9,
    reviews: 64,
    stock: 7,
    description: 'Teko seduh teh dengan pegangan lengkung ergonomis dan lubang saringan keramik internal, memudahkan penyeduhan daun teh utuh berkualitas.',
    glazeOptions: [
      { id: 'sandstone', name: 'Batu Pasir Matte', hex: '#D0C6B5', default: true }
    ],
    specs: {
      height: '14.5 cm',
      dryWeight: '810 gram',
      rimDiameter: '15.0 cm',
      technique: 'Perakitan Multi-bagian Roda Putar',
      liquidCapacity: '650 ml',
      origin: 'Studio Bandung',
      firing: 'High-fire 1250°C',
      clay: 'Stoneware Kaya Besi'
    },
    materialsCare: 'Cuci dengan tangan. Jangan ditaruh langsung di atas api kompor menyala.',
    shippingInfo: 'Kemasan busa cetak ganda terproteksi.'
  },
  {
    id: 10,
    name: 'Komorebi Planter Pot',
    subtitle: 'Pot tanaman indoor dengan tatakan air terpisah',
    category: 'Pot Tanaman',
    price: 165000,
    usdPrice: 55,
    oldPrice: null,
    image: '/assets/images/product_planter.jpg',
    thumbnails: [
      '/assets/images/product_planter.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'STUDIO BOTANIKA BATCH 09',
    editionInfo: 'BOTANICAL LIVING',
    rating: 4.6,
    reviews: 82,
    stock: 19,
    description: 'Pot tanaman stoneware berpori alami dilengkapi lubang drainase bawah dan tatakan terpisah untuk menjaga kebersihan meja atau credenza Anda.',
    glazeOptions: [
      { id: 'terracotta', name: 'Terracotta Alami', hex: '#C28469', default: true },
      { id: 'sage', name: 'Hijau Sage', hex: '#BDC7B9' }
    ],
    specs: {
      height: '13.5 cm',
      dryWeight: '580 gram',
      rimDiameter: '14.0 cm',
      technique: 'Roda Putar & Drainase Buatan Tangan',
      liquidCapacity: 'Ideal untuk Tanaman Hias 4-5 Inci',
      origin: 'Bali, Indonesia',
      firing: 'Cone 8 Stoneware',
      clay: 'Terracotta Berpori Pilihan'
    },
    materialsCare: 'Lapisan dalam tahan kelembaban, bersihkan dengan kuas berbulu halus.',
    shippingInfo: 'Kardus tebal berserat kraft daur ulang.'
  }
];

export const CATEGORIES = [
  'Semua',
  'Peralatan Makan',
  'Cangkir & Mug',
  'Mangkuk',
  'Vas',
  'Kopi & Teh',
  'Pot Tanaman',
  'Edisi Terbatas'
];
