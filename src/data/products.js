export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Artisan Ceramic Bowls Collection',
    subtitle: 'Mangkuk keramik stoneware bermotif etnik & bohemian dengan berbagai pilihan kode',
    category: 'Mangkuk',
    price: 45000,
    usdPrice: 15,
    oldPrice: 55000,
    image: '/assets/images/katalog_bowl.jpg',
    thumbnails: [
      '/assets/images/katalog_bowl.jpg'
    ],
    badge: 'terlaris',
    batchInfo: 'BATCH KURASI NO. 01 • EDISI SPESIAL MANGKUK ETNIK',
    editionInfo: 'KURASI ARTISAN NUSANTARA • 7 PILIHAN MOTIF',
    rating: 5.0,
    reviews: 142,
    stock: 35,
    description: 'Koleksi mangkuk keramik berkualitas tinggi dengan motif artistik bergaya etnik dan geometris nusantara. Tahan panas, aman untuk makanan (food-grade), dan cocok untuk mangkuk saji, sup, sereal, maupun hidangan penutup harian Anda. Tersedia dalam 7 pilihan varian kode produk.',
    productCodes: [
      'CER-BWL-001',
      'CER-BWL-002',
      'CER-BWL-003',
      'CER-BWL-004',
      'CER-BWL-005',
      'CER-BWL-006',
      'CER-BWL-007'
    ],
    specs: {
      height: '7.0 cm',
      dryWeight: 'Sekitar 320 gram',
      rimDiameter: '15.0 cm',
      technique: 'Cetakan Presisi & Hand-Glazed Motif',
      liquidCapacity: '550 ml',
      origin: 'Studio Keramik Mitra CLAYÉ',
      firing: 'Pembakaran Suhu Tinggi 1240°C',
      clay: 'Keramik Stoneware Berkualitas'
    },
    materialsCare: '100% Food-Safe bebas timbal dan kadmium. Aman untuk microwave dan mesin pencuci piring (dishwasher).',
    shippingInfo: 'Dikemas dari studio CLAYÉ Palembang menggunakan proteksi bubble wrap tebal dan kardus ganda bergaransi aman sampai di tempat.'
  },
  {
    id: 2,
    name: 'Cat Paw Graphic Mugs',
    subtitle: 'Cangkir keramik motif tapak kucing menggemaskan hitam-putih',
    category: 'Cangkir & Mug',
    price: 38000,
    usdPrice: 12,
    oldPrice: 45000,
    image: '/assets/images/katalog_cup.jpg',
    thumbnails: [
      '/assets/images/katalog_cup.jpg'
    ],
    badge: 'pilihan',
    batchInfo: 'BATCH KURASI NO. 02 • KOLEKSI KUCING LUCU',
    editionInfo: 'KURASI ARTISAN MUG • 2 PILIHAN MOTIF',
    rating: 4.9,
    reviews: 98,
    stock: 24,
    description: 'Cangkir keramik motif tapak kucing (cat paws) dengan gaya monokrom minimalis. Gagang kokoh dan nyaman digenggam, ideal untuk kopi, teh, susu, atau minuman favorit lainnya setiap hari.',
    productCodes: [
      'CER-CUP-001',
      'CER-CUP-002'
    ],
    specs: {
      height: '9.5 cm',
      dryWeight: 'Sekitar 310 gram',
      rimDiameter: '8.2 cm',
      technique: 'High-fire Stoneware Sublimasi Berkualitas',
      liquidCapacity: '350 ml',
      origin: 'Studio Keramik Mitra CLAYÉ',
      firing: 'Pembakaran Suhu Tinggi 1200°C',
      clay: 'Porcelain Stoneware Halus'
    },
    materialsCare: 'Aman untuk microwave dan mesin cuci piring. Mudah dibersihkan dan tidak meninggalkan noda teh/kopi.',
    shippingInfo: 'Dikemas menggunakan box tebal dan pelindung anti-benturan dengan garansi retur jika pecah saat pengantaran COD.'
  },
  {
    id: 3,
    name: 'Blue Plaid Ceramic Mug',
    subtitle: 'Cangkir keramik bermotif kotak-kotak biru klasik elegan',
    category: 'Cangkir & Mug',
    price: 35000,
    usdPrice: 11,
    oldPrice: null,
    image: '/assets/images/katalog_mug.jpg',
    thumbnails: [
      '/assets/images/katalog_mug.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'BATCH KURASI NO. 03 • EDISI KLASIK TARTAN',
    editionInfo: 'KOLEKSI ESENSIAL HARIAN • 1 MODEL',
    rating: 4.8,
    reviews: 64,
    stock: 15,
    description: 'Mug keramik bergaya klasik modern dengan pola garis kotak-kotak biru tua di atas permukaan putih gading yang bersih. Gagang ergonomis dengan kapasitas pas untuk menemani aktivitas bekerja atau bersantai Anda.',
    productCodes: [], // Tanpa pilihan kode produk karena produk tunggal
    specs: {
      height: '10.0 cm',
      dryWeight: 'Sekitar 330 gram',
      rimDiameter: '8.5 cm',
      technique: 'Glazed Stoneware Motif Tartan',
      liquidCapacity: '360 ml',
      origin: 'Studio Keramik Mitra CLAYÉ',
      firing: 'Pembakaran Suhu Tinggi 1240°C',
      clay: 'Stoneware Putih Halus'
    },
    materialsCare: 'Aman untuk minuman panas mendidih maupun dingin, food-grade 100%, microwave & dishwasher safe.',
    shippingInfo: 'Diantar langsung oleh kurir tim CLAYÉ di Kota Palembang dengan jaminan keamanan produk.'
  }
];

export const CATEGORIES = [
  'Semua',
  'Cangkir & Mug',
  'Mangkuk',
  'Peralatan Makan',
  'Vas',
  'Kopi & Teh',
  'Edisi Terbatas'
];

export const products = INITIAL_PRODUCTS;
export default INITIAL_PRODUCTS;
