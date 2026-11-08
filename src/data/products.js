export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'The Sunday Mug (Neko Wave Edition)',
    subtitle: 'Edisi resmi CLAYÉ: Keramik stoneware motif ombak kucing & glasir kobalt',
    category: 'Cangkir & Mug',
    price: 135000,
    usdPrice: 50,
    oldPrice: null,
    image: '/assets/images/product_neko_mug.jpg',
    thumbnails: [
      '/assets/images/product_neko_mug.jpg',
      '/assets/images/product_dusk_mug.jpg',
      '/assets/images/product_mug.jpg'
    ],
    badge: 'terlaris',
    batchInfo: 'BATCH KURASI NO. 15 • EDISI SPESIAL CLAYÉ',
    editionInfo: 'KURASI ARTISAN NUSANTARA • KODE NEKO-01',
    rating: 5.0,
    reviews: 168,
    stock: 18,
    description: 'Cangkir keramik edisi spesial CLAYÉ dengan motif ombak Seigaiha tradisional Jepang berpadu karakter kucing menggemaskan. Dibuat manual di atas roda putar menggunakan tanah liat stoneware berkualitas kaya mineral, dengan lapisan glasir biru kobalt dan krem lembut yang nyaman dalam genggaman untuk ritual minum kopi atau teh harian Anda.',
    glazeOptions: [
      { id: 'neko-blue', name: 'Biru Kobalt Ombak (Neko Wave)', hex: '#2A4B7C', default: true },
      { id: 'ivory', name: 'Gading Klasik (Ivory Speckle)', hex: '#EBE5D8' },
      { id: 'sage', name: 'Hijau Sage Alami', hex: '#BDC7B9' },
      { id: 'terracotta', name: 'Terracotta Merah Hangat', hex: '#C28469' }
    ],
    specs: {
      height: '9.0 cm',
      dryWeight: 'Sekitar 350 gram',
      rimDiameter: '8.8 cm',
      technique: 'Roda Putar & Hand-painted Underglaze Mitra',
      liquidCapacity: '340 ml',
      origin: 'Sentra Pengrajin Mitra CLAYÉ',
      firing: 'Pembakaran Suhu Tinggi 1240°C',
      clay: 'Stoneware Alami Tahan Panas'
    },
    materialsCare: 'Lolos uji kontrol kualitas ketat CLAYÉ dengan glasir mineral alami 100% food-safe. Aman untuk microwave dan mesin cuci piring. Dilengkapi tatakan gabus alami.',
    shippingInfo: 'Dikemas dari gudang pusat CLAYÉ Palembang menggunakan pelindung sarang lebah (honeycomb) ramah lingkungan dan boks anti-benturan dengan garansi pecah 100% ganti baru.'
  },
  {
    id: 2,
    name: 'Neko Seigaiha Dining Bowl',
    subtitle: 'Mangkuk saji keramik dengan lukisan ombak tradisional & kucing peeking',
    category: 'Mangkuk',
    price: 185000,
    usdPrice: 64,
    oldPrice: 210000,
    image: '/assets/images/product_neko_bowl.jpg',
    thumbnails: [
      '/assets/images/product_neko_bowl.jpg',
      '/assets/images/product_neko_bowl_studio.jpg',
      '/assets/images/product_bowl.jpg'
    ],
    badge: 'pilihan',
    batchInfo: 'BATCH KURASI NO. 14 • MOTIF TRADISIONAL',
    editionInfo: 'KURASI PERALATAN MAKAN ARTISAN',
    rating: 4.9,
    reviews: 114,
    stock: 12,
    description: 'Mangkuk saji serbaguna dengan lukisan tangan motif ombak laut Seigaiha dan wajah kucing ceria. Sempurna untuk hidangan mi ramen hangat, donburi, sup, maupun salad. Bobot seimbang dengan dasar mangkuk yang kokoh.',
    glazeOptions: [
      { id: 'neko-indigo', name: 'Biru Neko Seigaiha (Indigo)', hex: '#1B3B6F', default: true },
      { id: 'sage', name: 'Hijau Sage Matte', hex: '#BDC7B9' },
      { id: 'sand', name: 'Pasir Alami', hex: '#D6CEBE' },
      { id: 'ivory', name: 'Gading (Ivory)', hex: '#EBE5D8' }
    ],
    specs: {
      height: '7.5 cm',
      dryWeight: 'Sekitar 420 gram',
      rimDiameter: '16.5 cm',
      technique: 'Cetakan Putar & Lukis Underglaze Biru',
      liquidCapacity: '600 ml',
      origin: 'Mitra Pengrajin Keramik Pesisir',
      firing: 'High-fire Stoneware 1240°C',
      clay: 'Stoneware Putih Alami'
    },
    materialsCare: 'Glasir food-safe bebas timbal dan kadmium, sangat aman untuk kuah panas mendidih. Dasar mangkuk halus tidak menggores permukaan meja.',
    shippingInfo: 'Dilengkapi bantalan pulp daur ulang dan honeycomb wrap tebal dari gudang CLAYÉ Palembang.'
  },
  {
    id: 3,
    name: 'Alba Neko Bud Vase',
    subtitle: 'Vas keramik siluet ramping dengan motif ombak kucing dekoratif',
    category: 'Vas',
    price: 220000,
    usdPrice: 76,
    oldPrice: null,
    image: '/assets/images/product_neko_vase.jpg',
    thumbnails: [
      '/assets/images/product_neko_vase.jpg',
      '/assets/images/product_vase.jpg',
      '/assets/images/products_collection.jpg'
    ],
    badge: 'pilihan',
    batchInfo: 'BATCH KURASI NO. 09 • DEKORASI MEJA',
    editionInfo: 'KURASI ELEGAN MINIMALIS',
    rating: 4.9,
    reviews: 78,
    stock: 8,
    description: 'Vas bunga keramik dengan lengkung leher anggun, dihiasi motif ombak biru dan ekspresi kucing yang manis. Dirancang ideal untuk menampung setangkai bunga segar, baby’s breath kering, atau ranting estetis di meja kerja maupun ruang tamu Anda.',
    glazeOptions: [
      { id: 'neko-blue', name: 'Biru Ombak Kucing (Neko Wave)', hex: '#2A4B7C', default: true },
      { id: 'dustypink', name: 'Merah Muda Pucat', hex: '#E7C8C3' },
      { id: 'ashwhite', name: 'Putih Abu Mineral', hex: '#EFECE6' },
      { id: 'terracotta', name: 'Terracotta Bakar', hex: '#C28469' }
    ],
    specs: {
      height: '16.5 cm',
      dryWeight: 'Sekitar 460 gram',
      rimDiameter: '4.5 cm (leher)',
      technique: 'Bentuk Siluet Roda Putar & Finishing Manual',
      liquidCapacity: 'Kedap Air Sempurna (280 ml)',
      origin: 'Mitra Studio Keramik Nusantara',
      firing: 'Pembakaran Tungku 1250°C',
      clay: 'Stoneware Padat Tahan Bocor'
    },
    materialsCare: 'Bagian dalam dilapisi glasir kedap air. Bersihkan bagian luar dengan kain microfiber lembap.',
    shippingInfo: 'Pengemasan boks ganda dengan partisi penahan guncangan dari fasilitas gudang CLAYÉ.'
  },
  {
    id: 4,
    name: 'Everyday Ceramic Plate',
    subtitle: 'Piring makan stoneware tepi raw terracotta alami',
    category: 'Peralatan Makan',
    price: 150000,
    usdPrice: 52,
    oldPrice: null,
    image: '/assets/images/product_plate.jpg',
    thumbnails: [
      '/assets/images/product_plate.jpg',
      '/assets/images/products_collection.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'BATCH KURASI NO. 18 • MITRA BALI',
    editionInfo: 'KOLEKSI ESENSIAL HARIAN',
    rating: 4.8,
    reviews: 184,
    stock: 22,
    description: 'Piring saji harian berdiameter 23 cm untuk sarapan hingga makan malam keluarga, dipasok dari sentra tembikar Bali. Menampilkan aksen tepi unglazed mentah yang memperlihatkan keaslian bintik mineral tanah liat alami dengan bagian tengah berglasir gading halus.',
    glazeOptions: [
      { id: 'ivory', name: 'Gading Raw Edge', hex: '#EBE5D8', default: true },
      { id: 'terracotta', name: 'Terracotta Alami', hex: '#C28469' },
      { id: 'charcoal', name: 'Abu Arang Tenmoku', hex: '#4A4643' },
      { id: 'sage', name: 'Hijau Sage Celadon', hex: '#BDC7B9' }
    ],
    specs: {
      height: '2.4 cm',
      dryWeight: 'Sekitar 490 gram',
      rimDiameter: '23.0 cm',
      technique: 'Slab Rolled & Hand Finished Mitra',
      liquidCapacity: 'Profil Rata Makanan',
      origin: 'Mitra Pengrajin Bali, Indonesia',
      firing: 'High-fire 1240°C',
      clay: 'Stoneware Terracotta Sukabumi'
    },
    materialsCare: '100% aman untuk makanan dan hidangan panas. Lolos inspeksi keamanan CLAYÉ, aman untuk microwave dan dishwasher.',
    shippingInfo: 'Pemisah karton ganda dan perlindungan anti-pecah tanpa limbah plastik berlebih.'
  },
  {
    id: 5,
    name: 'Stillness Ceramic Teapot & Dripper',
    subtitle: 'Teko teh keramik estetik dengan pegangan bambu rotan',
    category: 'Kopi & Teh',
    price: 340000,
    usdPrice: 110,
    oldPrice: null,
    image: '/assets/images/product_teapot.jpg',
    thumbnails: [
      '/assets/images/product_teapot.jpg',
      '/assets/images/product_dusk_mug.jpg'
    ],
    badge: 'ritual',
    batchInfo: 'SERI SEDUH RITUAL BATCH 07',
    editionInfo: 'KURASI TEKO TEMBIKAR ARTISAN',
    rating: 4.95,
    reviews: 95,
    stock: 7,
    description: 'Teko keramik berkapasitas 650 ml hasil kurasi pengrajin tembikar berpengalaman, dilengkapi pegangan anyaman bambu rotan yang tahan panas dan saringan keramik internal untuk seduhan teh daun lepas berkualitas.',
    glazeOptions: [
      { id: 'sandstone', name: 'Batu Pasir & Gading', hex: '#D0C6B5', default: true },
      { id: 'tenmoku', name: 'Hitam Besi Tenmoku', hex: '#2C2A29' },
      { id: 'ashwhite', name: 'Putih Tulang Alami', hex: '#FAF6F0' }
    ],
    specs: {
      height: '14.0 cm',
      dryWeight: 'Sekitar 680 gram',
      rimDiameter: '13.5 cm',
      technique: 'Perakitan Multi-bagian oleh Mitra Pengrajin',
      liquidCapacity: '650 ml',
      origin: 'Mitra Pengrajin Sukabumi, Indonesia',
      firing: 'Tahan Panas Suhu Tinggi 1260°C',
      clay: 'Stoneware Pesisir Tahan Thermal Shock'
    },
    materialsCare: 'Cuci dengan tangan spons lembut. Lepaskan gagang bambu rotan saat mencuci.',
    shippingInfo: 'Kemasan busa cetak ganda terproteksi anti-benturan dari gudang pusat CLAYÉ.'
  },
  {
    id: 6,
    name: 'Dusk Horizon Stoneware Mug',
    subtitle: 'Cangkir stoneware modern perpaduan biru kobalt pekat & krem pasir',
    category: 'Cangkir & Mug',
    price: 130000,
    usdPrice: 45,
    oldPrice: null,
    image: '/assets/images/product_dusk_mug.jpg',
    thumbnails: [
      '/assets/images/product_dusk_mug.jpg',
      '/assets/images/product_neko_mug.jpg'
    ],
    badge: 'baru',
    batchInfo: 'BATCH KURASI NO. 16 • EDISI KONTEMPORER',
    editionInfo: 'KURASI DUA NADA WARNA GLASIR',
    rating: 4.88,
    reviews: 62,
    stock: 15,
    description: 'Cangkir keramik minimalis bergaya Skandinavia-Jepang (Japandi) dengan teknik pencelupan dua warna (two-tone dip). Bagian atas berbalut glasir biru malam (deep cobalt) yang elegan dengan bagian dasar berwarna krem pasir halus yang kokoh dan mantap digenggam.',
    glazeOptions: [
      { id: 'dusk-blue', name: 'Biru Senja & Pasir (Cobalt Horizon)', hex: '#1D3557', default: true },
      { id: 'sage-ivory', name: 'Hijau Hutan & Gading', hex: '#4A5D4E' },
      { id: 'rust-sand', name: 'Karamel & Pasir Mentah', hex: '#8B5A2B' }
    ],
    specs: {
      height: '9.2 cm',
      dryWeight: '330 gram',
      rimDiameter: '8.4 cm',
      technique: 'Roda Putar & Dual-dip Glaze',
      liquidCapacity: '320 ml',
      origin: 'Mitra Studio Pengrajin Bandung',
      firing: 'Cone 10 High Fire 1250°C',
      clay: 'Stoneware Mineral Padat'
    },
    materialsCare: '100% Food-safe, aman untuk microwave dan mesin pencuci piring harian.',
    shippingInfo: 'Boks protektif berlapis sarang lebah ramah lingkungan bergaransi aman.'
  },
  {
    id: 7,
    name: 'The Sunday Mug (Edisi Klasik Bintik Batu)',
    subtitle: 'Stoneware bintik mineral alami karya pengrajin tembikar Bali',
    category: 'Cangkir & Mug',
    price: 125000,
    usdPrice: 48,
    oldPrice: null,
    image: '/assets/images/product_mug.jpg',
    thumbnails: [
      '/assets/images/product_mug.jpg',
      '/assets/images/product_dusk_mug.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'BATCH KURASI NO. 11 • SENTRA BALI',
    editionInfo: 'KURASI KLASIK NATURAL',
    rating: 4.85,
    reviews: 142,
    stock: 20,
    description: 'Varian klasik legendaris The Sunday Mug dengan permukaan bertekstur bintik mineral alami bumi. Memberikan rasa tenang dan otentik di setiap tegukan kopi pagi Anda.',
    glazeOptions: [
      { id: 'ivory', name: 'Gading (Ivory Speckle)', hex: '#EBE5D8', default: true },
      { id: 'sage', name: 'Hijau Sage Alami', hex: '#BDC7B9' },
      { id: 'dustypink', name: 'Merah Muda Pucat', hex: '#E7C8C3' }
    ],
    specs: {
      height: '8.5 cm',
      dryWeight: '340 gram',
      rimDiameter: '9.0 cm',
      technique: 'Roda Putar Tradisional',
      liquidCapacity: '320 ml',
      origin: 'Mitra Pengrajin Bali, Indonesia',
      firing: '1240°C High-fire',
      clay: 'Stoneware Pasir Kasar Alami'
    },
    materialsCare: 'Aman untuk makanan, microwave, dan dishwasher.',
    shippingInfo: 'Kardus kokoh berserat tebal dengan bantalan pulp pelindung.'
  },
  {
    id: 8,
    name: 'Neko Ramen & Donburi Studio Bowl',
    subtitle: 'Mangkuk ramen keramik berdiameter 18 cm motif kucing & gelombang laut',
    category: 'Mangkuk',
    price: 195000,
    usdPrice: 68,
    oldPrice: null,
    image: '/assets/images/product_neko_bowl_studio.jpg',
    thumbnails: [
      '/assets/images/product_neko_bowl_studio.jpg',
      '/assets/images/product_neko_bowl.jpg'
    ],
    badge: 'terlaris',
    batchInfo: 'BATCH KURASI NO. 17 • PERLENGKAPAN MEJA',
    editionInfo: 'MANGKUK BESAR JEPANG MODERN',
    rating: 4.92,
    reviews: 86,
    stock: 14,
    description: 'Mangkuk ramen keramik berukuran besar dengan siluet mangkuk mie khas Jepang. Dinding tebal menjaga kuah kaldu tetap hangat lebih lama. Dihiasi motif kucing yang mengintip di antara deburan ombak biru.',
    glazeOptions: [
      { id: 'classic-blue', name: 'Biru Neko Klasik (Cobalt Blue)', hex: '#1F3C88', default: true },
      { id: 'sumi-black', name: 'Hitam Tinta Arang (Sumi Waves)', hex: '#2B2B2B' },
      { id: 'sepia-brown', name: 'Cokelat Karamel (Sepia Waves)', hex: '#8C6239' }
    ],
    specs: {
      height: '8.8 cm',
      dryWeight: '510 gram',
      rimDiameter: '18.2 cm',
      technique: 'Cetak Tekan & Lukis Tangan Detail',
      liquidCapacity: '850 ml',
      origin: 'Mitra Pengrajin Keramik Pesisir',
      firing: 'Pembakaran Tungku 1250°C',
      clay: 'Stoneware Porselen Padat'
    },
    materialsCare: 'Aman untuk mesin cuci piring, microwave, dan sterilisasi air mendidih.',
    shippingInfo: 'Kemasan protektif boks tebal dengan garansi pengiriman aman se-Indonesia.'
  },
  {
    id: 9,
    name: 'Wabi Sculptural Terracotta Vase',
    subtitle: 'Vas bunga artistik siluet organik tekstur pasir terakota mentah',
    category: 'Vas',
    price: 260000,
    usdPrice: 85,
    oldPrice: null,
    image: '/assets/images/product_vase.jpg',
    thumbnails: [
      '/assets/images/product_vase.jpg',
      '/assets/images/product_neko_vase.jpg'
    ],
    badge: 'terbatas',
    batchInfo: 'BATCH KURASI ARTISAN NO. 05',
    editionInfo: 'SERI WABI-SABI ORGANIK',
    rating: 4.88,
    reviews: 44,
    stock: 5,
    description: 'Vas seni organik berpori mikro yang mengeksplorasi keindahan tanah liat alami tanpa glasir mengilap. Menghadirkan ketenangan visual yang dalam di sudut credenza atau meja ruang tamu Anda.',
    glazeOptions: [
      { id: 'raw-terracotta', name: 'Terracotta Kasar Alami', hex: '#B85D3B', default: true },
      { id: 'sand-stone', name: 'Batu Pasir Putih', hex: '#D6CEBE' },
      { id: 'volcanic-ash', name: 'Abu Vulkanik Kasongan', hex: '#635D55' }
    ],
    specs: {
      height: '22.0 cm',
      dryWeight: '720 gram',
      rimDiameter: '8.0 cm',
      technique: 'Bentuk Siluet Manual & Finishing Tekstur Pasir',
      liquidCapacity: 'Ideal Bunga Kering & Ranting',
      origin: 'Sentra Kasongan, Yogyakarta',
      firing: 'High-fire Vitrified 1220°C',
      clay: 'Tanah Liat Merah Alami Kasongan'
    },
    materialsCare: 'Bersihkan debu dengan kuas halus. Hindari benturan keras pada permukaan unglazed.',
    shippingInfo: 'Boks kayu/karton ekstra tebal dengan perlindungan maksimal dari CLAYÉ.'
  },
  {
    id: 10,
    name: 'Komorebi Planter Pot & Saucer',
    subtitle: 'Pot tanaman indoor berpori dengan tatakan air terpisah',
    category: 'Pot Tanaman',
    price: 165000,
    usdPrice: 55,
    oldPrice: null,
    image: '/assets/images/product_planter.jpg',
    thumbnails: [
      '/assets/images/product_planter.jpg',
      '/assets/images/product_plate.jpg'
    ],
    badge: 'esensial',
    batchInfo: 'BATCH KURASI BOTANIKA NO. 09',
    editionInfo: 'KURASI POT TANAMAN INTERIOR',
    rating: 4.75,
    reviews: 82,
    stock: 19,
    description: 'Pot tanaman stoneware berpori alami karya pengrajin tembikar Bali, dilengkapi lubang drainase bawah dan tatakan terpisah untuk menjaga kebersihan meja atau credenza ruang Anda.',
    glazeOptions: [
      { id: 'terracotta', name: 'Terracotta Alami', hex: '#C28469', default: true },
      { id: 'sage', name: 'Hijau Sage Lumut', hex: '#BDC7B9' },
      { id: 'chalk-white', name: 'Putih Kapur Matte', hex: '#EAE6DF' }
    ],
    specs: {
      height: '13.5 cm',
      dryWeight: '580 gram',
      rimDiameter: '14.0 cm',
      technique: 'Roda Putar & Lubang Drainase Mitra',
      liquidCapacity: 'Ideal untuk Tanaman Hias 4-5 Inci',
      origin: 'Mitra Pengrajin Bali, Indonesia',
      firing: 'Cone 8 Stoneware',
      clay: 'Terracotta Berpori Pilihan'
    },
    materialsCare: 'Lapisan dalam tahan kelembaban, bersihkan dengan kuas berbulu halus.',
    shippingInfo: 'Kardus tebal berserat kraft daur ulang dengan proteksi maksimal.'
  },
  {
    id: 11,
    name: 'Harvest Sandstone Teapot',
    subtitle: 'Teko seduh teh klasik stoneware dua warna dengan glasir bintik batu pasir & krem',
    category: 'Kopi & Teh',
    price: 265000,
    usdPrice: 88,
    oldPrice: null,
    image: '/assets/images/product_harvest_teapot.jpg',
    thumbnails: [
      '/assets/images/product_harvest_teapot.jpg',
      '/assets/images/product_teapot.jpg'
    ],
    badge: 'pilihan',
    batchInfo: 'BATCH KURASI TEKO NO. 06 • DUA TONE ALAMI',
    editionInfo: 'KURASI SEDUH TEH ARTISAN',
    rating: 4.95,
    reviews: 67,
    stock: 14,
    description: 'Teko keramik stoneware kurasi pengrajin tembikar dengan kombinasi dua warna alami—bagian atas berglasir krem bintik pasir halus dan bagian dasar tanah liat mentah bervitrifikasi. Dilengkapi moncong presisi anti-tetes dan saringan internal tanah liat untuk menyeduh teh daun tubruk atau tisane herbal keluarga.',
    glazeOptions: [
      { id: 'harvest-cream', name: 'Batu Pasir Krem (Harvest Cream)', hex: '#DDCFB9', default: true },
      { id: 'warm-terracotta', name: 'Cokelat Terracotta Hangat', hex: '#A96F52' },
      { id: 'sage-matte', name: 'Hijau Sage Matte', hex: '#BAC4B6' }
    ],
    specs: {
      height: '14.5 cm',
      dryWeight: '580 gram',
      rimDiameter: '8.5 cm',
      technique: 'Roda Putar & Sambungan Gagang Manual',
      liquidCapacity: '750 ml (3-4 Cangkir)',
      origin: 'Mitra Pengrajin Kasongan, Yogyakarta',
      firing: 'High-Fire 1250°C Cone 9',
      clay: 'Stoneware Bintik Mineral Tahan Panas'
    },
    materialsCare: 'Bilas dengan air hangat setelah digunakan. Saringan internal dapat dibersihkan dengan sikat kecil lembut.',
    shippingInfo: 'Dikemas dengan bantalan sarang lebah dan double boks ekstra tebal garansi ganti baru 100%.'
  },
  {
    id: 12,
    name: 'Fluted Wave Ceramic Planter',
    subtitle: 'Pot tanaman keramik sculptural beralur gelombang organik warna pasir alami',
    category: 'Pot Tanaman',
    price: 175000,
    usdPrice: 58,
    oldPrice: null,
    image: '/assets/images/product_wave_planter.jpg',
    thumbnails: [
      '/assets/images/product_wave_planter.jpg',
      '/assets/images/product_planter.jpg'
    ],
    badge: 'baru',
    batchInfo: 'BATCH KURASI BOTANIKA NO. 10',
    editionInfo: 'KURASI POT TANAMAN INTERIOR ARTISAN',
    rating: 4.88,
    reviews: 39,
    stock: 16,
    description: 'Pot tanaman indoor bernilai seni sculptural tinggi dengan alur gelombang meliuk vertikal yang dibentuk dengan teliti oleh pengrajin mitra. Finishing glasir matte berpori mikro warna pasir alami memberikan kelembaban ideal untuk tanaman hias seperti sirih gading, monstera mini, atau sukulen.',
    glazeOptions: [
      { id: 'sand-wave', name: 'Pasir Bergelombang (Sand Wave)', hex: '#DFD5C6', default: true },
      { id: 'mineral-grey', name: 'Abu-Abu Mineral', hex: '#8F8A83' },
      { id: 'brick-terra', name: 'Terracotta Bata Alami', hex: '#B86B52' }
    ],
    specs: {
      height: '15.0 cm',
      dryWeight: '620 gram',
      rimDiameter: '14.5 cm',
      technique: 'Cetakan Alur Tangan & Finishing Spons Halus',
      liquidCapacity: 'Ideal untuk Pot Tanaman Hias 5 Inci',
      origin: 'Mitra Studio Sukabumi, Jawa Barat',
      firing: '1230°C Stoneware Tahan Cuaca',
      clay: 'Tanah Liat Berpasir Mineral Alami'
    },
    materialsCare: 'Dapat dibilas air bersih secara berkala. Cocok untuk diletakkan di meja kerja maupun ambang jendela.',
    shippingInfo: 'Kemasan protektif sarang lebah kraft ramah lingkungan dengan garansi pecah CLAYÉ.'
  },
  {
    id: 13,
    name: 'Tropical Monstera Porcelain Bowl',
    subtitle: 'Mangkuk porselen putih dengan lukisan tangan daun monstera & aksen bibir terakota',
    category: 'Mangkuk',
    price: 145000,
    usdPrice: 48,
    oldPrice: null,
    image: '/assets/images/product_monstera_bowl.jpg',
    thumbnails: [
      '/assets/images/product_monstera_bowl.jpg',
      '/assets/images/product_neko_bowl.jpg'
    ],
    badge: 'baru',
    batchInfo: 'BATCH KURASI BOTANIKA NO. 08',
    editionInfo: 'KURASI PERALATAN MAKAN PORSELEN',
    rating: 4.92,
    reviews: 53,
    stock: 20,
    description: 'Mangkuk saji porselen kurasi CLAYÉ dengan lukisan underglaze daun monstera tropis rimbun berpadu aksen garis halus terakota di tepian bibir mangkuk. Permukaan glasir kaca bening halus menjadikannya sangat higienis, mudah dibersihkan, dan cocok untuk sereal, buah segar, atau hidangan sup harian.',
    glazeOptions: [
      { id: 'monstera-green', name: 'Monstera Tropis (Green Botanical)', hex: '#4C7C54', default: true },
      { id: 'pure-white', name: 'Putih Porselen Murni', hex: '#F5F5F3' },
      { id: 'soft-sage', name: 'Sage Minimalis', hex: '#9DB09D' }
    ],
    specs: {
      height: '7.0 cm',
      dryWeight: '320 gram',
      rimDiameter: '15.5 cm',
      technique: 'Roda Putar & Hand-painted Underglaze Botanical',
      liquidCapacity: '520 ml',
      origin: 'Sentra Pengrajin Keramik Bandung, Jawa Barat',
      firing: 'Porcelain High-Fire 1280°C',
      clay: 'Porselen Putih Murni Kaolin Pilihan'
    },
    materialsCare: '100% Food-safe, aman untuk microwave dan mesin pencuci piring (dishwasher).',
    shippingInfo: 'Boks honeycomb tebal anti-pecah dengan garansi pengiriman aman ke seluruh Nusantara.'
  },
  {
    id: 14,
    name: 'Nebula Blue Yohen Chawan',
    subtitle: 'Mangkuk teh matcha tradisional dengan glasir kristal biru kosmik & tepian besi bakar',
    category: 'Mangkuk',
    price: 295000,
    usdPrice: 98,
    oldPrice: 320000,
    image: '/assets/images/product_nebula_chawan.jpg',
    thumbnails: [
      '/assets/images/product_nebula_chawan.jpg',
      '/assets/images/product_dusk_mug.jpg'
    ],
    badge: 'edisi terbatas',
    batchInfo: 'BATCH KURASI MASTER KILN NO. 03 • EDISI KOLEKSI',
    editionInfo: 'KURASI WABI-SABI MATCHA VESSEL',
    rating: 5.0,
    reviews: 74,
    stock: 8,
    description: 'Karya mahakarya keramik dengan teknik glasir reduksi tungku Yohen Tenmoku yang langka. Menghasilkan pola kristal biru kobalt berkilau bak galaksi nebula di dalam mangkuk, dibingkai tepian cokelat karat besi alami. Bentuk cekungan lapang sangat sempurna untuk mengaduk busa teh matcha autentik.',
    glazeOptions: [
      { id: 'yohen-blue', name: 'Biru Nebula Kosmik (Yohen Blue)', hex: '#194B8C', default: true },
      { id: 'iron-rust', name: 'Besi Karat Tenmoku (Iron Rust)', hex: '#5A3726' },
      { id: 'midnight-blue', name: 'Biru Kobalt Tengah Malam', hex: '#0F2447' }
    ],
    specs: {
      height: '7.8 cm',
      dryWeight: '390 gram',
      rimDiameter: '12.5 cm',
      technique: 'Pijat Tangan Tradisional & Reduksi Api Tungku',
      liquidCapacity: '450 ml (Ideal Matcha & Teh Tubruk)',
      origin: 'Mitra Pengrajin Khusus Tungku Reduksi, Bali',
      firing: 'Cone 10 Reduksi Kuat 1280°C',
      clay: 'Stoneware Vulkanik Berbutir Halus'
    },
    materialsCare: 'Cuci dengan tangan menggunakan spons lembut tanpa sabun beraroma tajam. Keringkan di udara terbuka.',
    shippingInfo: 'Kotak kayu eksklusif berpenutup geser dengan segel keaslian kurasi CLAYÉ.'
  },
  {
    id: 15,
    name: 'Royal Silver Luster Tea Set',
    subtitle: 'Set teko porselen klasik & cangkir teh dengan lapisan glasir kilau perak (Silver Luster)',
    category: 'Kopi & Teh',
    price: 420000,
    usdPrice: 140,
    oldPrice: null,
    image: '/assets/images/product_silver_teaset.jpg',
    thumbnails: [
      '/assets/images/product_silver_teaset.jpg',
      '/assets/images/product_harvest_teapot.jpg'
    ],
    badge: 'edisi terbatas',
    batchInfo: 'BATCH KURASI ROYAL NO. 02 • SET TEKO & CANGKIR',
    editionInfo: 'KURASI PORSELEN MEWAH ATELIER',
    rating: 4.98,
    reviews: 42,
    stock: 6,
    description: 'Set perangkat minum teh mewah berdesain eropa klasik era Victoria hasil kurasi atelier CLAYÉ. Terdiri dari satu teko teh bermahkota kubah dan satu cangkir cawan berlekuk anggun, dilapisi aksen perak mengilap (silver luster overglaze) yang memantulkan cahaya dengan elegan. Pilihan istimewa untuk jamuan teh sore hari.',
    glazeOptions: [
      { id: 'silver-luster', name: 'Putih & Kilau Perak (Silver Luster)', hex: '#D4D8DD', default: true },
      { id: 'ivory-luster', name: 'Porselen Gading Mengilap', hex: '#F8F6F0' },
      { id: 'platinum-classic', name: 'Platinum Klasik', hex: '#B8BFC7' }
    ],
    specs: {
      height: 'Teko 17.0 cm, Cangkir 6.5 cm',
      dryWeight: 'Set total 850 gram',
      rimDiameter: 'Teko 9.0 cm, Cangkir 8.5 cm',
      technique: 'Tuang Presisi & Overglaze Silver Luster Kiln',
      liquidCapacity: 'Teko 680 ml, Cangkir 180 ml',
      origin: 'Mitra Atelier Keramik Hias Nusantara',
      firing: 'Dua Kali Pembakaran (Glaze 1260°C & Luster 800°C)',
      clay: 'Porselen Putih Murni Fine Bone Quality'
    },
    materialsCare: 'Cuci dengan tangan menggunakan spons lembut. Jangan dimasukkan ke dalam microwave karena mengandung partikel kilau logam.',
    shippingInfo: 'Boks berlapis busa presisi ekstra protektif dengan garansi penggantian utuh bila terjadi kendala kurir.'
  }
];

export const CATEGORIES = [
  'Semua',
  'Peralatan Makan',
  'Cangkir & Mug',
  'Mangkuk',
  'Vas',
  'Kopi & Teh',
  'Pot Tanaman'
];
