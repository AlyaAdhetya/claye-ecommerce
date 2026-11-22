#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate Laporan UAS CLAYÉ - v4
Sesuai template: BAB I s/d BAB VI + Daftar Pustaka + Lampiran
Dosen: Iin Seprina, M.Kom | Prodi: Manajemen Informatika | UNSRI
"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import shutil

OUT  = r"d:\E-COMMERCE\PRAKTIKUM E-COMMERCE\claye-ecommerce\LAPORAN_UAS_CLAYE_ECOMMERCE_TERBARU.docx"
BCK  = r"C:\Users\User\.gemini\antigravity\brain\86f350c1-0f9c-4ffe-82cd-4a3cb42365c7\LAPORAN_UAS_CLAYE_ECOMMERCE_TERBARU.docx"

doc = Document()

# ══════════════════════════════════════════════════════════
# PAGE SETUP  (A4, margin kiri 4cm, kanan/atas/bawah 3cm)
# ══════════════════════════════════════════════════════════
sec = doc.sections[0]
sec.page_width    = Cm(21.0)
sec.page_height   = Cm(29.7)
sec.left_margin   = Cm(4.0)
sec.right_margin  = Cm(3.0)
sec.top_margin    = Cm(3.0)
sec.bottom_margin = Cm(3.0)

# ══════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════
def _set_font(run, name='Times New Roman', size=12, bold=False, italic=False, color=None):
    run.font.name  = name
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = RGBColor(*color)
    rPr = run._r.get_or_add_rPr()
    rf  = OxmlElement('w:rFonts')
    rf.set(qn('w:ascii'), name)
    rf.set(qn('w:hAnsi'), name)
    rf.set(qn('w:cs'),    name)
    rPr.insert(0, rf)

def _spacing(para, line_rule='auto', line=360, before=0, after=6):
    """line=360 → 1.5; line=480 → double"""
    pPr  = para._p.get_or_add_pPr()
    # remove old spacing
    for old in pPr.findall(qn('w:spacing')):
        pPr.remove(old)
    sp = OxmlElement('w:spacing')
    sp.set(qn('w:line'),     str(line))
    sp.set(qn('w:lineRule'), line_rule)
    sp.set(qn('w:before'),   str(int(before * 20)))  # pt→twips
    sp.set(qn('w:after'),    str(int(after  * 20)))
    pPr.append(sp)

def heading_bab(text):
    """BAB heading: kapital, bold, 14pt, center"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _spacing(p, line=360, before=0, after=6)
    r = p.add_run(text.upper())
    _set_font(r, size=14, bold=True)
    return p

def heading_sub(text, indent_cm=0):
    """Sub-heading: bold 12pt, left"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.left_indent = Cm(indent_cm)
    _spacing(p, line=360, before=10, after=4)
    r = p.add_run(text)
    _set_font(r, size=12, bold=True)
    return p

def body(text, indent=True, justify=True, italic=False, bold=False, size=12, before=0, after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY if justify else WD_ALIGN_PARAGRAPH.LEFT
    if indent:
        p.paragraph_format.first_line_indent = Cm(1.25)
    _spacing(p, line=360, before=before, after=after)
    r = p.add_run(text)
    _set_font(r, size=size, italic=italic, bold=bold)
    return p

def bullet(text, level=0):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent   = Cm(1.0 + level*0.5)
    p.paragraph_format.first_line_indent = Cm(-0.5)
    _spacing(p, line=360, before=0, after=3)
    r = p.add_run(f'• {text}')
    _set_font(r, size=12)
    return p

def numbered_item(num, text, indent_cm=1.0):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent   = Cm(indent_cm + 0.5)
    p.paragraph_format.first_line_indent = Cm(-0.5)
    _spacing(p, line=360, before=0, after=3)
    r = p.add_run(f'{num}. {text}')
    _set_font(r, size=12)
    return p

def placeholder(text='[Masukkan Gambar/Screenshot di sini]'):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _spacing(p, line=360, before=6, after=6)
    r = p.add_run(text)
    _set_font(r, size=11, italic=True, color=(0x88, 0x88, 0x88))
    return p

def caption(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _spacing(p, line=360, before=2, after=10)
    r = p.add_run(text)
    _set_font(r, size=11, italic=True)
    return p

def simple_table(headers, rows, widths):
    n = len(headers)
    t = doc.add_table(rows=1, cols=n)
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    # header
    hrow = t.rows[0]
    for i, h in enumerate(headers):
        c = hrow.cells[i]
        c.width = Cm(widths[i])
        c.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        for para in c.paragraphs:
            para.clear()
            para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _spacing(para, line=360, before=2, after=2)
        r = c.paragraphs[0].add_run(h)
        _set_font(r, size=11, bold=True)
    # data
    for row_data in rows:
        row = t.add_row()
        for i, val in enumerate(row_data):
            c = row.cells[i]
            c.width = Cm(widths[i])
            for para in c.paragraphs:
                para.clear()
                para.alignment = WD_ALIGN_PARAGRAPH.LEFT
                _spacing(para, line=360, before=2, after=2)
            r = c.paragraphs[0].add_run(str(val))
            _set_font(r, size=11)
    doc.add_paragraph()
    return t

def page_break():
    doc.add_page_break()

def spacer(n=1):
    for _ in range(n):
        p = doc.add_paragraph()
        _spacing(p, line=240, before=0, after=0)

# ══════════════════════════════════════════════════════════
# HALAMAN COVER
# ══════════════════════════════════════════════════════════
def cline(text, size=12, bold=False, italic=False, after=4, align=WD_ALIGN_PARAGRAPH.CENTER):
    p = doc.add_paragraph()
    p.alignment = align
    _spacing(p, line=360, before=0, after=after)
    r = p.add_run(text)
    _set_font(r, size=size, bold=bold, italic=italic)
    return p

cline('LAPORAN PROJECT UJIAN AKHIR SEMESTER (UAS)', size=14, bold=True, after=2)
cline('PRAKTIKUM E-COMMERCE', size=14, bold=True, after=12)
cline('JUDUL PROJECT:', size=12, bold=True, after=2)
cline('CLAYÉ E-COMMERCE', size=16, bold=True, after=4)
cline('Platform Keramik & Tembikar Artisan Berbasis Web', size=12, italic=True, after=16)

cline('Disusun untuk memenuhi tugas Ujian Akhir Semester (UAS)', size=12, after=2)
cline('Mata Kuliah Praktikum E-Commerce', size=12, after=16)

cline('Disusun Oleh:', size=12, bold=True, after=4)
for nm in [
    '1. Nama: [Nama Mahasiswa 1]  –  NIM: [NIM]',
    '2. Nama: [Nama Mahasiswa 2]  –  NIM: [NIM]',
    '3. Nama: [Nama Mahasiswa 3]  –  NIM: [NIM]',
    '4. Nama: Atina Isyfi          –  NIM: [NIM]',
]:
    cline(nm, size=12, after=2)

spacer()
cline('Dosen Pengampu:', size=12, bold=True, after=2)
cline('Iin Seprina, M.Kom', size=12, after=16)

cline('PROGRAM STUDI MANAJEMEN INFORMATIKA', size=12, bold=True, after=2)
cline('FAKULTAS ILMU KOMPUTER', size=12, bold=True, after=2)
cline('UNIVERSITAS SRIWIJAYA', size=12, bold=True, after=2)
cline('TAHUN AKADEMIK 2026/2027', size=12, bold=True, after=0)

page_break()

# ══════════════════════════════════════════════════════════
# KATA PENGANTAR
# ══════════════════════════════════════════════════════════
heading_bab('KATA PENGANTAR')
spacer()

body('Puji syukur ke hadirat Tuhan Yang Maha Esa karena atas rahmat dan karunia-Nya, laporan Project Ujian Akhir Semester (UAS) Praktikum E-Commerce yang berjudul "CLAYÉ E-Commerce – Platform Keramik & Tembikar Artisan Berbasis Web" dapat diselesaikan dengan baik.')

body('Laporan ini disusun sebagai salah satu bentuk pemenuhan tugas akhir pada mata kuliah Praktikum E-Commerce. Project ini bertujuan untuk menerapkan konsep perdagangan elektronik (Electronic Commerce) melalui pengembangan sebuah website yang dapat mendukung proses transaksi jual beli produk keramik artisan secara online khusus untuk wilayah Kota Palembang.')

body('Dalam proses pengembangan sistem ini, kami menggunakan teknologi React.js sebagai framework utama, Vite sebagai build tool, serta Supabase sebagai opsional cloud database. Sistem ini mencakup fitur katalog produk dengan variasi glasir, keranjang belanja, checkout COD (Cash on Delivery), dashboard pelanggan, dan dashboard administrator.')

body('Penulis menyadari bahwa laporan ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan untuk penyempurnaan laporan ini. Terima kasih kepada Ibu Iin Seprina, M.Kom selaku dosen pengampu, seluruh anggota kelompok, dan semua pihak yang telah memberikan dukungan dalam penyelesaian project ini.')

spacer()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
_spacing(p, line=360, before=0, after=4)
r = p.add_run('Palembang, November 2026')
_set_font(r, size=12)

p2 = doc.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
_spacing(p2, line=360, before=0, after=4)
r2 = p2.add_run('Penyusun')
_set_font(r2, size=12)

page_break()

# ══════════════════════════════════════════════════════════
# DAFTAR ISI
# ══════════════════════════════════════════════════════════
heading_bab('DAFTAR ISI')
spacer()

toc = [
    ('Kata Pengantar', 'ii'),
    ('Daftar Isi', 'iii'),
    ('Daftar Gambar', 'iv'),
    ('Daftar Tabel', 'v'),
    ('BAB I   PENDAHULUAN', '1'),
    ('   1.1 Latar Belakang', '1'),
    ('   1.2 Rumusan Masalah', '2'),
    ('   1.3 Tujuan Project', '2'),
    ('   1.4 Manfaat Project', '3'),
    ('   1.5 Batasan Masalah', '3'),
    ('BAB II  LANDASAN TEORI', '4'),
    ('   2.1 Pengertian E-Commerce', '4'),
    ('   2.2 Jenis-Jenis E-Commerce', '4'),
    ('   2.3 Website', '5'),
    ('   2.4 Bahasa Pemrograman dan Teknologi yang Digunakan', '5'),
    ('   2.5 Database', '7'),
    ('BAB III ANALISIS DAN PERANCANGAN SISTEM', '8'),
    ('   3.1 Analisis Kebutuhan Sistem', '8'),
    ('       3.1.1 Kebutuhan Fungsional', '8'),
    ('       3.1.2 Kebutuhan Nonfungsional', '9'),
    ('   3.2 Perancangan Sistem', '9'),
    ('       3.2.1 Use Case Diagram', '9'),
    ('       3.2.2 Activity Diagram', '10'),
    ('       3.2.3 Flowchart Sistem', '10'),
    ('       3.2.4 Entity Relationship Diagram (ERD)', '11'),
    ('   3.3 Perancangan Database', '11'),
    ('   3.4 Perancangan Antarmuka (UI/UX)', '13'),
    ('BAB IV  IMPLEMENTASI DAN PEMBAHASAN', '14'),
    ('   4.1 Implementasi Sistem', '14'),
    ('   4.2 Implementasi Teknologi', '14'),
    ('   4.3 Implementasi Antarmuka Sistem', '15'),
    ('       4.3.1 Halaman Beranda', '15'),
    ('       4.3.2 Halaman Login dan Registrasi', '16'),
    ('       4.3.3 Halaman Katalog Produk', '16'),
    ('       4.3.4 Halaman Detail Produk', '17'),
    ('       4.3.5 Halaman Keranjang Belanja', '17'),
    ('       4.3.6 Halaman Checkout', '18'),
    ('       4.3.7 Halaman Dashboard Pelanggan', '19'),
    ('       4.3.8 Halaman Dashboard Admin', '19'),
    ('   4.4 Alur Transaksi E-Commerce', '20'),
    ('   4.5 Hasil Implementasi', '21'),
    ('BAB V   PENGUJIAN SISTEM', '22'),
    ('   5.1 Metode Pengujian', '22'),
    ('   5.2 Hasil Pengujian', '22'),
    ('   5.3 Analisis Hasil Pengujian', '24'),
    ('BAB VI  PENUTUP', '25'),
    ('   6.1 Kesimpulan', '25'),
    ('   6.2 Saran', '25'),
    ('Daftar Pustaka', '26'),
    ('Lampiran', '27'),
]
for item, pg in toc:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    _spacing(p, line=360, before=0, after=2)
    r1 = p.add_run(item)
    _set_font(r1, size=12)
    r2 = p.add_run(f'\t{pg}')
    _set_font(r2, size=12)

page_break()

# ══════════════════════════════════════════════════════════
# BAB I – PENDAHULUAN
# ══════════════════════════════════════════════════════════
heading_bab('BAB I')
heading_bab('PENDAHULUAN')

heading_sub('1.1 Latar Belakang')
body('Perkembangan teknologi informasi dan internet yang pesat telah membawa perubahan besar dalam berbagai aspek kehidupan, termasuk dunia perdagangan. Electronic Commerce (e-commerce) atau perdagangan elektronik menjadi salah satu solusi bisnis yang semakin diminati karena kemampuannya dalam menghubungkan penjual dan pembeli secara digital tanpa batas geografis dan waktu. Melalui e-commerce, transaksi jual beli dapat dilakukan kapan saja dan di mana saja hanya dengan menggunakan perangkat yang terhubung ke internet.')

body('Di sisi lain, produk kerajinan tangan lokal, khususnya keramik dan tembikar artisan, memiliki nilai seni dan budaya yang tinggi namun masih menghadapi tantangan dalam hal jangkauan pemasaran. Para pengrajin keramik lokal, terutama di wilayah Kota Palembang, Sumatera Selatan, seringkali kesulitan menjangkau pasar yang lebih luas karena keterbatasan sarana promosi dan distribusi. Potensi pasar yang besar belum dimanfaatkan secara maksimal karena tidak tersedianya platform digital yang khusus menampilkan dan memasarkan produk keramik artisan.')

body('Berdasarkan permasalahan tersebut, tim pengembang membangun platform e-commerce bernama CLAYÉ — sebuah website toko online yang dirancang khusus untuk mempertemukan para pecinta keramik artisan dengan koleksi keramik berkualitas buatan tangan pengrajin lokal. Nama CLAYÉ terinspirasi dari kata "clay" (tanah liat dalam bahasa Inggris) dengan sentuhan estetika, mencerminkan perpaduan nilai lokal dengan tampilan modern.')

body('Platform CLAYÉ dibangun menggunakan React.js sebagai framework utama dengan sistem pengiriman COD (Cash on Delivery) yang dioperasikan langsung oleh tim CLAYÉ Studio untuk wilayah Kota Palembang. Sistem ini dirancang untuk memberikan pengalaman belanja keramik artisan yang nyaman, aman, dan terpercaya bagi pelanggan, sekaligus memudahkan pengelolaan produk dan transaksi oleh administrator.')

heading_sub('1.2 Rumusan Masalah')
body('Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam project ini adalah sebagai berikut:', indent=True)
numbered_item(1, 'Bagaimana merancang dan membangun sistem e-commerce berbasis website untuk produk keramik artisan CLAYÉ?')
numbered_item(2, 'Bagaimana menerapkan proses transaksi jual beli produk keramik secara online dengan metode pembayaran COD (Cash on Delivery)?')
numbered_item(3, 'Bagaimana sistem dapat membantu pengguna dalam melakukan pemilihan produk berdasarkan varian glasir, pemesanan, dan pelacakan riwayat pesanan?')
numbered_item(4, 'Bagaimana mengelola data produk, pelanggan, dan transaksi melalui dashboard administrator yang terintegrasi dalam satu sistem?')

heading_sub('1.3 Tujuan Project')
body('Tujuan dari pengembangan project e-commerce CLAYÉ ini adalah:', indent=True)
numbered_item(1, 'Mengembangkan aplikasi website e-commerce berbasis React.js yang fungsional untuk memasarkan produk keramik artisan CLAYÉ secara online.')
numbered_item(2, 'Menerapkan konsep perdagangan elektronik melalui fitur katalog produk, keranjang belanja, checkout COD, dan manajemen pesanan.')
numbered_item(3, 'Mempermudah proses pembelian produk keramik bagi pelanggan dan pengelolaan penjualan bagi administrator CLAYÉ.')
numbered_item(4, 'Mengimplementasikan teknologi web modern (React.js, Vite, Supabase) dalam sistem transaksi online khusus wilayah Kota Palembang.')

heading_sub('1.4 Manfaat Project')
body('Manfaat yang diharapkan dari pengembangan platform CLAYÉ:')
bullet('Bagi Mahasiswa: Meningkatkan kemampuan dan pengalaman nyata dalam membangun sistem e-commerce menggunakan teknologi modern berbasis React.js.')
bullet('Bagi Pengguna/Pelanggan: Mempermudah proses pencarian, pemilihan varian glasir, dan pembelian produk keramik artisan secara online dari rumah.')
bullet('Bagi Penjual/Tim CLAYÉ: Membantu pengelolaan produk, pemantauan pesanan, dan pengelolaan data pelanggan melalui dashboard administrator yang terintegrasi.')

heading_sub('1.5 Batasan Masalah')
body('Untuk menjaga fokus dan kelayakan pengembangan, project ini memiliki batasan masalah sebagai berikut:')
bullet('Sistem berbasis website yang dapat diakses melalui browser modern (Google Chrome, Firefox, Edge).')
bullet('Pengguna dapat melihat katalog produk keramik beserta variasi glasir yang tersedia.')
bullet('Pengguna dapat memasukkan produk ke keranjang belanja, memilih item yang akan dibeli menggunakan checkbox, serta mengubah varian glasir dari keranjang.')
bullet('Sistem menyediakan fitur checkout dengan metode pembayaran COD (Cash on Delivery) — pelanggan membayar tunai langsung kepada tim CLAYÉ yang mengantar.')
bullet('Pengiriman hanya melayani wilayah Kota Palembang dengan sistem zona pengiriman (3 zona dengan ongkir berbeda).')
bullet('Sistem menyediakan pengelolaan produk dan transaksi oleh admin melalui dashboard administrator.')
bullet('Tidak terdapat integrasi payment gateway pihak ketiga; fitur kupon belanja telah dihapus pada versi terbaru.')

page_break()

# ══════════════════════════════════════════════════════════
# BAB II – LANDASAN TEORI
# ══════════════════════════════════════════════════════════
heading_bab('BAB II')
heading_bab('LANDASAN TEORI')

heading_sub('2.1 Pengertian E-Commerce')
body('Electronic Commerce (e-commerce) adalah proses pembelian, penjualan, transfer, atau pertukaran produk, jasa, dan/atau informasi melalui jaringan komputer, termasuk internet (Turban et al., 2018). E-commerce memungkinkan terjadinya transaksi bisnis secara elektronik antara konsumen, perusahaan, dan organisasi tanpa harus bertatap muka secara langsung.')

body('Dalam perkembangannya, e-commerce tidak hanya mencakup transaksi jual beli produk fisik, tetapi juga meliputi layanan digital, pemasaran online, pengelolaan rantai pasok, dan interaksi bisnis lainnya yang didukung oleh teknologi internet. Platform CLAYÉ menerapkan konsep e-commerce untuk mempermudah transaksi jual beli produk keramik artisan antara CLAYÉ Studio sebagai penjual dengan konsumen akhir di wilayah Kota Palembang.')

heading_sub('2.2 Jenis-Jenis E-Commerce')
body('E-commerce dapat diklasifikasikan berdasarkan pihak yang terlibat dalam transaksi, antara lain:')

heading_sub('2.2.1 Business to Business (B2B)', indent_cm=0)
body('B2B adalah model e-commerce di mana transaksi terjadi antara dua entitas bisnis, misalnya antara produsen dengan distributor atau antara grosir dengan pengecer. Dalam B2B, produk atau layanan yang diperjualbelikan biasanya dalam jumlah besar dan melibatkan negosiasi harga khusus.', indent=False)

heading_sub('2.2.2 Business to Consumer (B2C)', indent_cm=0)
body('B2C adalah model e-commerce di mana bisnis menjual produk atau layanan langsung kepada konsumen akhir. Ini adalah model yang paling umum dikenal masyarakat, seperti toko online pada umumnya. Platform CLAYÉ menerapkan model B2C, di mana CLAYÉ Studio menjual produk keramik artisan langsung kepada pelanggan individu.', indent=False)

heading_sub('2.2.3 Consumer to Consumer (C2C)', indent_cm=0)
body('C2C adalah model e-commerce di mana transaksi terjadi langsung antara konsumen satu dengan konsumen lainnya, biasanya difasilitasi oleh platform perantara. Contoh platform C2C adalah marketplace seperti Tokopedia atau OLX.', indent=False)

heading_sub('2.2.4 Consumer to Business (C2B)', indent_cm=0)
body('C2B adalah model e-commerce di mana individu (konsumen) menawarkan produk atau jasanya kepada bisnis. Contohnya adalah seorang freelancer yang menawarkan jasa desain kepada perusahaan melalui platform online.', indent=False)

heading_sub('2.3 Website')
body('Website adalah kumpulan halaman web yang saling terhubung dan dapat diakses melalui internet menggunakan browser. Website terdiri dari file-file HTML, CSS, JavaScript, gambar, dan aset lainnya yang disimpan di server dan diakses melalui alamat URL (Uniform Resource Locator).')

body('Dalam konteks e-commerce, website berfungsi sebagai toko virtual yang menampilkan produk, memproses pesanan, dan mengelola transaksi secara digital. Website CLAYÉ dibangun sebagai Single Page Application (SPA) — sebuah jenis website modern di mana seluruh konten dimuat dalam satu halaman HTML dan navigasi dilakukan secara dinamis menggunakan JavaScript, tanpa perlu memuat ulang halaman (page reload) setiap berpindah menu.')

heading_sub('2.4 Bahasa Pemrograman dan Teknologi yang Digunakan')
body('Berikut adalah teknologi yang digunakan dalam pengembangan platform CLAYÉ:')

heading_sub('2.4.1 HTML5 (HyperText Markup Language)', indent_cm=0)
body('HTML adalah bahasa markup standar yang digunakan untuk menyusun struktur konten halaman web. HTML5 adalah versi terbaru yang mendukung elemen semantik, multimedia, dan API modern. Dalam proyek CLAYÉ, HTML digunakan sebagai kerangka dasar halaman (index.html) yang menjadi titik masuk aplikasi React.', indent=False)

heading_sub('2.4.2 CSS3 (Cascading Style Sheets)', indent_cm=0)
body('CSS adalah bahasa yang digunakan untuk mengatur tampilan dan tata letak (layout) elemen HTML. CSS3 mendukung animasi, transisi, flexbox, dan grid layout yang memungkinkan desain antarmuka yang responsif dan estetis. CLAYÉ menggunakan CSS3 secara ekstensif untuk memberikan tampilan artisanal yang khas.', indent=False)

heading_sub('2.4.3 JavaScript (ES6+)', indent_cm=0)
body('JavaScript adalah bahasa pemrograman utama untuk pembuatan website interaktif. ES6+ (ECMAScript 2015 dan seterusnya) menghadirkan fitur modern seperti arrow functions, destructuring, async/await, dan modules. Seluruh logika bisnis, state management, routing, dan interaksi UI pada platform CLAYÉ ditulis menggunakan JavaScript ES6+.', indent=False)

heading_sub('2.4.4 React.js', indent_cm=0)
body('React.js adalah library JavaScript open-source yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (User Interface) berbasis komponen. React menggunakan paradigma component-based architecture sehingga setiap bagian UI dapat dibangun sebagai komponen yang reusable. Fitur utama React meliputi Virtual DOM untuk performa rendering optimal, JSX sebagai sintaks deklaratif, dan sistem state management berbasis hooks.', indent=False)

heading_sub('2.4.5 Vite', indent_cm=0)
body('Vite adalah build tool generasi berikutnya untuk aplikasi web modern. Vite memanfaatkan ES modules native di browser untuk proses development yang sangat cepat dengan fitur Hot Module Replacement (HMR). CLAYÉ menggunakan Vite 5.4 sebagai development server dan bundler untuk menghasilkan file produksi yang dioptimasi.', indent=False)

heading_sub('2.4.6 Supabase (Opsional)', indent_cm=0)
body('Supabase adalah platform Backend-as-a-Service (BaaS) open-source yang menyediakan database PostgreSQL, autentikasi, dan REST API secara otomatis. Dalam sistem CLAYÉ, Supabase digunakan sebagai opsional cloud database — jika tidak dikonfigurasi, sistem akan berjalan sepenuhnya menggunakan localStorage browser.', indent=False)

heading_sub('2.5 Database')
body('Database (basis data) adalah kumpulan data yang terorganisir dan tersimpan secara sistematis sehingga dapat diakses, dikelola, dan diperbarui dengan mudah. Dalam sistem e-commerce, database berperan penting untuk menyimpan data pengguna, produk, keranjang belanja, pesanan, dan alamat pengiriman.')

body('Platform CLAYÉ menggunakan dua lapisan penyimpanan data:')
bullet('localStorage (Browser Web Storage API): Penyimpanan data utama di sisi klien (client-side). Data produk, pengguna terdaftar, sesi aktif, keranjang, pesanan, wishlist, dan buku alamat disimpan secara persisten di localStorage browser. Data ini terpisah per akun email (key-based isolation) sehingga data setiap pengguna tidak tercampur.')
bullet('Supabase (PostgreSQL): Database cloud opsional yang dapat disinkronkan dengan sistem. Jika kredensial Supabase dikonfigurasi, sistem akan mengambil data produk dan pesanan dari database PostgreSQL. Struktur database mencakup tabel: users, products, categories, orders, order_items, product_glazes, dan artisan_partners.')

page_break()

# ══════════════════════════════════════════════════════════
# BAB III – ANALISIS DAN PERANCANGAN SISTEM
# ══════════════════════════════════════════════════════════
heading_bab('BAB III')
heading_bab('ANALISIS DAN PERANCANGAN SISTEM')

heading_sub('3.1 Analisis Kebutuhan Sistem')

heading_sub('3.1.1 Kebutuhan Fungsional')
body('Kebutuhan fungsional menggambarkan fitur-fitur yang harus tersedia dan dapat dijalankan oleh sistem CLAYÉ. Berikut adalah kebutuhan fungsional sistem:')
bullet('Registrasi dan Login Pengguna: Sistem menyediakan formulir pendaftaran akun baru dengan validasi email dan password minimal 6 karakter. Login tersedia untuk pelanggan dan administrator dengan verifikasi berbasis data tersimpan. Proteksi rute memastikan halaman utama hanya dapat diakses setelah login.')
bullet('Menampilkan Katalog Produk: Sistem menampilkan 15 produk keramik artisan dalam tampilan grid beserta informasi nama, harga, kategori, dan pilihan varian glasir (glaze options) yang berbeda-beda untuk setiap produk.')
bullet('Pencarian dan Filtrasi Produk: Pengguna dapat mencari produk berdasarkan nama dan memfilter berdasarkan kategori produk.')
bullet('Keranjang Belanja: Pengguna dapat menambah produk ke keranjang, mengubah jumlah, menyeleksi item dengan checkbox, mengubah varian glasir langsung dari keranjang, dan menghapus produk.')
bullet('Checkout COD: Sistem menyediakan formulir data penerima dan alamat pengiriman di Kota Palembang, deteksi kecamatan otomatis, pemilihan zona pengiriman dengan ongkir otomatis, dan konfirmasi pesanan COD (Cash on Delivery).')
bullet('Pengelolaan Pesanan: Pelanggan dapat melihat riwayat pesanan di dashboard. Administrator dapat melihat seluruh pesanan dari semua pelanggan dan memperbarui status fulfillment.')
bullet('Dashboard Admin: Panel administrasi mencakup manajemen produk (inventori), manajemen pesanan, daftar pelanggan, analitik penjualan, dan pengaturan sistem.')
bullet('Buku Alamat: Pelanggan dapat menyimpan, mengedit, menghapus, dan menetapkan alamat utama yang otomatis digunakan saat checkout.')
bullet('Wishlist/Favorit: Pelanggan dapat menyimpan produk ke daftar favorit (wishlist) dan mengaksesnya kembali dari dashboard.')
bullet('Panduan Perawatan: Sistem menyediakan halaman panduan perawatan produk keramik CLAYÉ.')

heading_sub('3.1.2 Kebutuhan Nonfungsional')
body('Kebutuhan nonfungsional menggambarkan standar kualitas yang harus dipenuhi sistem:')
bullet('Kemudahan Penggunaan (Usability): Sistem mudah digunakan dengan antarmuka yang intuitif, navigasi yang jelas, dan notifikasi (toast) untuk setiap aksi pengguna.')
bullet('Tampilan Responsif: Antarmuka sistem dirancang responsif sehingga dapat diakses dengan baik melalui perangkat desktop maupun mobile.')
bullet('Ketahanan Data (Reliability): Data tersimpan dengan baik menggunakan localStorage sehingga tidak hilang saat halaman di-refresh, dengan isolasi data per akun email.')
bullet('Aksesibilitas Browser: Sistem dapat diakses melalui browser modern (Chrome, Firefox, Edge) tanpa memerlukan instalasi tambahan.')
bullet('Keamanan Dasar: Proteksi rute memastikan halaman sensitif hanya dapat diakses oleh pengguna yang telah terautentikasi.')

heading_sub('3.2 Perancangan Sistem')

heading_sub('3.2.1 Use Case Diagram')
body('Use Case Diagram menggambarkan interaksi antara aktor (Pelanggan dan Administrator) dengan sistem CLAYÉ. Aktor Pelanggan dapat melakukan: registrasi, login, melihat katalog, menambah ke keranjang, checkout COD, mengelola buku alamat, melihat riwayat pesanan, dan mengelola wishlist. Aktor Administrator dapat melakukan: login admin, mengelola produk (inventori), mengelola pesanan, melihat daftar pelanggan, dan melihat analitik penjualan.')
spacer()
placeholder('[Masukkan Gambar Use Case Diagram di sini]')
caption('Gambar 3.1 Use Case Diagram Sistem CLAYÉ')

heading_sub('3.2.2 Activity Diagram')
body('Activity Diagram menggambarkan alur aktivitas pengguna dalam sistem CLAYÉ. Diagram di bawah ini menunjukkan alur proses pembelian produk keramik, mulai dari pengguna membuka website, login, memilih produk, menambah ke keranjang, mengisi data checkout, hingga pesanan COD dikonfirmasi dan dikirim oleh tim CLAYÉ.')
spacer()
placeholder('[Masukkan Gambar Activity Diagram – Proses Pembelian Produk]')
caption('Gambar 3.2 Activity Diagram Proses Pembelian Produk')
spacer()
placeholder('[Masukkan Gambar Activity Diagram – Proses Login dan Registrasi]')
caption('Gambar 3.3 Activity Diagram Proses Login dan Registrasi')

heading_sub('3.2.3 Flowchart Sistem')
body('Flowchart sistem menggambarkan alur kerja keseluruhan aplikasi CLAYÉ, mulai dari pengguna mengakses website, proses autentikasi, navigasi katalog produk, proses keranjang dan checkout COD, hingga konfirmasi pesanan dan pengantaran oleh tim CLAYÉ.')
spacer()
placeholder('[Masukkan Gambar Flowchart Sistem CLAYÉ]')
caption('Gambar 3.4 Flowchart Sistem CLAYÉ E-Commerce')

heading_sub('3.2.4 Entity Relationship Diagram (ERD)')
body('ERD menggambarkan hubungan antar entitas (tabel) dalam database sistem CLAYÉ. Entitas utama yang saling berelasi antara lain: Users, Products, Categories, Glazes, Cart, Orders, Order_Items, dan Addresses.')
spacer()
placeholder('[Masukkan Gambar Entity Relationship Diagram (ERD)]')
caption('Gambar 3.5 Entity Relationship Diagram (ERD) Sistem CLAYÉ')

heading_sub('3.3 Perancangan Database')
body('Berikut adalah struktur tabel database yang digunakan dalam sistem CLAYÉ:')
spacer()

# Tabel Users
body('Tabel 3.1 Struktur Tabel Users (Pengguna)', bold=True, indent=False)
simple_table(
    ['No', 'Nama Field', 'Tipe Data', 'Keterangan'],
    [
        ['1', 'email', 'VARCHAR', 'Primary Key – Email pengguna (unik)'],
        ['2', 'role', 'VARCHAR', 'Role: customer / admin'],
        ['3', 'name', 'VARCHAR', 'Nama pendek pengguna'],
        ['4', 'fullName', 'VARCHAR', 'Nama lengkap pengguna'],
        ['5', 'password', 'VARCHAR', 'Kata sandi pengguna'],
        ['6', 'phone', 'VARCHAR', 'Nomor HP/WhatsApp'],
        ['7', 'address', 'TEXT', 'Alamat lengkap pengguna'],
        ['8', 'kecamatan', 'VARCHAR', 'Kecamatan di Kota Palembang'],
        ['9', 'postalCode', 'VARCHAR', 'Kode pos'],
        ['10', 'patronSince', 'VARCHAR', 'Tahun mendaftar sebagai pelanggan'],
    ],
    [0.6, 2.8, 2.5, 7.0]
)

body('Tabel 3.2 Struktur Tabel Products (Produk)', bold=True, indent=False)
simple_table(
    ['No', 'Nama Field', 'Tipe Data', 'Keterangan'],
    [
        ['1', 'id', 'INTEGER', 'Primary Key – ID produk'],
        ['2', 'name', 'VARCHAR', 'Nama produk keramik'],
        ['3', 'price', 'INTEGER', 'Harga produk (Rupiah)'],
        ['4', 'category', 'VARCHAR', 'Kategori produk'],
        ['5', 'description', 'TEXT', 'Deskripsi produk'],
        ['6', 'image', 'VARCHAR', 'URL gambar produk'],
        ['7', 'glazeOptions', 'JSON', 'Array pilihan varian glasir produk'],
        ['8', 'artisanOrigin', 'VARCHAR', 'Asal pengrajin produk'],
        ['9', 'specs', 'JSON', 'Spesifikasi teknis produk'],
    ],
    [0.6, 2.8, 2.5, 7.0]
)

body('Tabel 3.3 Struktur Tabel Orders (Pesanan)', bold=True, indent=False)
simple_table(
    ['No', 'Nama Field', 'Tipe Data', 'Keterangan'],
    [
        ['1', 'id', 'VARCHAR', 'Primary Key – Nomor referensi pesanan'],
        ['2', 'patron', 'VARCHAR', 'Nama penerima pesanan'],
        ['3', 'email', 'VARCHAR', 'Email pelanggan'],
        ['4', 'phone', 'VARCHAR', 'Nomor HP untuk konfirmasi pengantaran'],
        ['5', 'items', 'JSON', 'Array produk yang dipesan'],
        ['6', 'total', 'INTEGER', 'Subtotal produk (Rupiah)'],
        ['7', 'shippingFee', 'INTEGER', 'Ongkos antar sesuai zona Palembang'],
        ['8', 'grandTotal', 'INTEGER', 'Total keseluruhan (Rupiah)'],
        ['9', 'paymentMethod', 'VARCHAR', 'COD (Bayar Tunai di Tempat)'],
        ['10', 'paymentStatus', 'VARCHAR', 'Status pembayaran: Lunas / Menunggu'],
        ['11', 'fulfillment', 'VARCHAR', 'Status pengiriman: Menunggu/Diproses/Selesai'],
        ['12', 'shippingAddress', 'TEXT', 'Alamat pengiriman lengkap'],
        ['13', 'courier', 'VARCHAR', 'Info zona antar langsung tim CLAYÉ'],
        ['14', 'date', 'VARCHAR', 'Tanggal pesanan dibuat'],
    ],
    [0.6, 2.8, 2.5, 7.0]
)

body('Tabel 3.4 Struktur Tabel Addresses (Buku Alamat)', bold=True, indent=False)
simple_table(
    ['No', 'Nama Field', 'Tipe Data', 'Keterangan'],
    [
        ['1', 'id', 'VARCHAR', 'Primary Key – ID alamat'],
        ['2', 'label', 'VARCHAR', 'Label alamat (cth: Rumah, Kantor)'],
        ['3', 'recipientName', 'VARCHAR', 'Nama penerima di alamat ini'],
        ['4', 'phone', 'VARCHAR', 'Nomor HP penerima'],
        ['5', 'address', 'TEXT', 'Alamat lengkap'],
        ['6', 'kecamatan', 'VARCHAR', 'Kecamatan di Kota Palembang'],
        ['7', 'postalCode', 'VARCHAR', 'Kode pos'],
        ['8', 'patokan', 'VARCHAR', 'Patokan lokasi (opsional)'],
        ['9', 'isPrimary', 'BOOLEAN', 'Apakah alamat utama yang digunakan checkout'],
    ],
    [0.6, 2.8, 2.5, 7.0]
)

heading_sub('3.4 Perancangan Antarmuka (UI/UX)')
body('Perancangan antarmuka sistem CLAYÉ mengacu pada prinsip estetika artisanal yang bersih dan elegan, sesuai dengan karakter produk keramik yang dipasarkan. Berikut adalah rancangan halaman-halaman utama:')
bullet('Halaman Beranda: Hero section dengan tagline brand, galeri koleksi unggulan, nilai-nilai brand, dan tombol CTA menuju katalog produk.')
bullet('Halaman Login dan Registrasi: Form autentikasi dengan dua tab (Masuk / Daftar Akun Baru), validasi input, dan notifikasi hasil autentikasi.')
bullet('Halaman Katalog Produk: Grid produk yang dapat difilter berdasarkan kategori, dengan ProductCard yang menampilkan gambar, nama, harga, dan pilihan glasir.')
bullet('Halaman Detail Produk: Informasi lengkap produk, pemilihan glasir interaktif dengan preview warna, tombol tambah ke keranjang, dan informasi pengrajin.')
bullet('Halaman Keranjang Belanja: Daftar produk dengan checkbox seleksi, kontrol jumlah, ubah glasir, ringkasan harga berdasarkan item terpilih.')
bullet('Halaman Checkout: Formulir data penerima dan alamat Palembang, dropdown kecamatan dengan ongkir otomatis, buku alamat tersimpan, ringkasan pesanan, dan tombol konfirmasi COD.')
bullet('Halaman Dashboard Admin: Panel multi-menu untuk manajemen produk, pesanan, pelanggan, dan analitik penjualan.')
spacer()
placeholder('[Masukkan Wireframe/Mockup Desain Antarmuka Halaman Beranda]')
caption('Gambar 3.6 Rancangan Antarmuka Halaman Beranda CLAYÉ')

page_break()

# ══════════════════════════════════════════════════════════
# BAB IV – IMPLEMENTASI DAN PEMBAHASAN
# ══════════════════════════════════════════════════════════
heading_bab('BAB IV')
heading_bab('IMPLEMENTASI DAN PEMBAHASAN')

heading_sub('4.1 Implementasi Sistem')
body('Implementasi sistem CLAYÉ dilakukan berdasarkan rancangan yang telah dibuat pada BAB III. Proses pengembangan dilakukan secara bertahap (iteratif) menggunakan pendekatan Agile dengan beberapa sprint pengerjaan:')
numbered_item(1, 'Sprint 1: Setup proyek menggunakan Vite + React, konfigurasi struktur folder, dan pengembangan komponen dasar (Navbar, Footer, halaman login/registrasi) beserta sistem autentikasi berbasis localStorage.')
numbered_item(2, 'Sprint 2: Pengembangan ShopContext (state management global), katalog produk dengan data 15 produk keramik, halaman detail produk dengan pemilihan glasir, dan keranjang belanja.')
numbered_item(3, 'Sprint 3: Implementasi sistem zona pengiriman Palembang (3 zona dengan ongkir berbeda), halaman checkout COD, fitur deteksi kecamatan otomatis dari teks alamat, dan halaman sukses pesanan.')
numbered_item(4, 'Sprint 4: Pengembangan dashboard pelanggan (6 menu) dan dashboard administrator (6 menu) termasuk manajemen inventori, pesanan, dan analitik.')
numbered_item(5, 'Sprint 5: Refactor oleh Atina Isyfi — penghapusan fitur kupon belanja, efisiensi zona pengantaran, dan optimasi alur checkout.')
numbered_item(6, 'Sprint 6: Deployment ke Vercel, konfigurasi environment, dan pengujian sistem pada URL produksi.')

heading_sub('4.2 Implementasi Teknologi')
body('Berikut adalah perangkat lunak, bahasa pemrograman, framework, database, dan tools yang digunakan dalam implementasi sistem CLAYÉ:')
spacer()

simple_table(
    ['No', 'Teknologi / Tools', 'Versi', 'Fungsi dalam Sistem'],
    [
        ['1',  'React.js',          '18.x',    'Framework utama untuk membangun antarmuka berbasis komponen'],
        ['2',  'Vite',              '5.4.x',   'Build tool dan development server dengan HMR (Hot Module Replacement)'],
        ['3',  'JavaScript ES6+',   'ES2022+', 'Bahasa pemrograman utama untuk logika bisnis dan interaksi UI'],
        ['4',  'HTML5',             'Modern',  'Struktur dasar halaman web (index.html sebagai entry point)'],
        ['5',  'CSS3',              'Modern',  'Styling antarmuka: layout, animasi, responsivitas'],
        ['6',  'React Context API', 'Built-in','State management global (ShopContext.jsx): produk, cart, user, orders'],
        ['7',  'React Router DOM',  '6.x',     'Hash-based routing (#/) untuk navigasi antar halaman dalam SPA'],
        ['8',  'localStorage API',  'Web API', 'Penyimpanan data persisten di browser: cart, user, pesanan, alamat'],
        ['9',  'Supabase',          '2.x',     'Opsional cloud database PostgreSQL; fallback ke local jika tidak dikonfigurasi'],
        ['10', 'Vercel',            'Latest',  'Platform hosting dan continuous deployment dari repository GitHub'],
        ['11', 'Git & GitHub',      'Latest',  'Version control dan kolaborasi pengembangan tim'],
        ['12', 'VS Code',           'Latest',  'Code editor utama yang digunakan selama pengembangan'],
    ],
    [0.6, 3.5, 2.0, 7.4]
)

heading_sub('4.3 Implementasi Antarmuka Sistem')
body('Berikut adalah implementasi antarmuka setiap halaman utama dalam sistem CLAYÉ beserta penjelasannya:')

heading_sub('4.3.1 Halaman Beranda')
body('Halaman beranda (HomePage.jsx) adalah halaman pertama yang dilihat pengguna setelah berhasil login. Halaman ini menampilkan identitas brand CLAYÉ melalui beberapa elemen utama: hero section dengan tagline "Keramik Artisan yang Dibuat dengan Hati", galeri koleksi produk unggulan, penjelasan nilai-nilai brand (keunikan buatan tangan, kualitas glasir pilihan), informasi layanan antar langsung tim CLAYÉ, serta testimoni pelanggan. Desain menggunakan palet warna hangat (krem, cokelat, terrakota) yang mencerminkan karakter produk keramik artisan.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Halaman Beranda CLAYÉ]')
caption('Gambar 4.1 Halaman Beranda CLAYÉ')

heading_sub('4.3.2 Halaman Login dan Registrasi')
body('Halaman Login (LoginPage.jsx) menampilkan formulir autentikasi dengan dua tab: "Masuk" untuk pengguna yang sudah terdaftar dan "Daftar Akun Baru" untuk pendaftaran. Fitur utama: validasi format email, validasi password minimal 6 karakter, verifikasi akun admin khusus (admin@claye.id), isolasi data per akun (keranjang dan pesanan masing-masing akun tidak tercampur), serta proteksi rute yang mengarahkan pengguna belum login ke halaman ini secara otomatis.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Halaman Login]')
caption('Gambar 4.2 Halaman Login CLAYÉ')
spacer()
placeholder('[Masukkan Screenshot Halaman Registrasi Akun Baru]')
caption('Gambar 4.3 Halaman Registrasi CLAYÉ')

heading_sub('4.3.3 Halaman Katalog Produk')
body('Halaman katalog (ShopPage.jsx) menampilkan seluruh koleksi 15 produk keramik artisan CLAYÉ dalam tampilan grid. Setiap produk ditampilkan dalam kartu produk (ProductCard.jsx) yang memuat gambar produk, nama, harga, pilihan glasir (glaze chips berwarna), tombol tambah ke keranjang, dan ikon wishlist. Pengguna dapat memfilter produk berdasarkan kategori (Mug & Cangkir, Bowl & Mangkuk, Piring & Nampan, Vas & Dekorasi, Set & Koleksi) serta melakukan pencarian produk berdasarkan nama.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Halaman Katalog Produk]')
caption('Gambar 4.4 Halaman Katalog Produk CLAYÉ')

heading_sub('4.3.4 Halaman Detail Produk')
body('Halaman detail produk (ProductDetailPage.jsx) menampilkan informasi lengkap produk yang dipilih, meliputi: gambar produk berukuran besar, nama dan harga, deskripsi produk, pemilihan varian glasir secara interaktif (chip warna yang dapat diklik dengan preview nama glasir yang terpilih), spesifikasi teknis (dimensi, volume, bahan, teknik pembakaran), informasi pengrajin, dan tombol "Tambahkan ke Keranjang".', indent=True)
spacer()
placeholder('[Masukkan Screenshot Halaman Detail Produk]')
caption('Gambar 4.5 Halaman Detail Produk dengan Pilihan Glasir')

heading_sub('4.3.5 Halaman Keranjang Belanja')
body('Halaman keranjang (CartPage.jsx) menampilkan semua produk yang telah ditambahkan pengguna ke keranjang. Fitur-fitur yang tersedia: checkbox seleksi item (pengguna dapat memilih produk mana yang akan di-checkout), tombol "Pilih Semua" untuk mencentang semua produk sekaligus, ubah varian glasir langsung dari keranjang (fungsi updateCartItemGlaze), kontrol kuantitas (+/-), hapus item, dan ringkasan harga yang dihitung hanya berdasarkan item yang dicentang. Tombol "Lanjut ke Checkout" akan memproses item yang terpilih.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Halaman Keranjang Belanja]')
caption('Gambar 4.6 Halaman Keranjang Belanja dengan Fitur Checkbox Seleksi')

heading_sub('4.3.6 Halaman Checkout')
body('Halaman checkout (CheckoutPage.jsx) menangani seluruh proses pemesanan dengan metode COD (Cash on Delivery). Halaman ini terdiri dari: pilihan dari Buku Alamat tersimpan (jika ada), formulir data penerima (nama, HP/WhatsApp, email opsional), pemilihan kecamatan Kota Palembang dengan ongkir otomatis per zona, field alamat lengkap dengan fitur deteksi kecamatan otomatis dari teks yang diketikkan, dan ringkasan pesanan (produk terpilih, subtotal, ongkir, total). Setelah mengklik "Buat Pesanan COD", sistem menyimpan pesanan dengan paymentMethod: "COD (Bayar Tunai di Tempat ke Tim CLAYÉ)" dan menampilkan halaman sukses.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Halaman Checkout COD]')
caption('Gambar 4.7 Halaman Checkout COD dengan Zona Pengiriman Palembang')
spacer()
placeholder('[Masukkan Screenshot Halaman Konfirmasi Sukses Pesanan COD]')
caption('Gambar 4.8 Halaman Sukses Pesanan COD')

heading_sub('4.3.7 Halaman Dashboard Pelanggan')
body('Dashboard pelanggan (DashboardPage.jsx) dapat diakses melalui menu akun setelah login sebagai pelanggan. Dashboard terdiri dari 6 menu: (1) Overview — ringkasan akun dan statistik, (2) Pesanan Saya — riwayat semua pesanan yang pernah dibuat beserta status, (3) Tersimpan — daftar produk yang disimpan ke wishlist, (4) Profil — informasi dan edit data akun, (5) Buku Alamat — manajemen alamat pengiriman (tambah, edit, hapus, atur alamat utama), dan (6) Panduan Perawatan — tips merawat keramik CLAYÉ.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Dashboard Pelanggan]')
caption('Gambar 4.9 Dashboard Pelanggan CLAYÉ')

heading_sub('4.3.8 Halaman Dashboard Admin')
body('Dashboard administrator (AdminPage.jsx) dapat diakses menggunakan akun admin (admin@claye.id). Panel admin terdiri dari 6 menu: (1) Overview — statistik pendapatan, jumlah pesanan, dan pelanggan aktif, (2) Manajemen Pesanan — daftar seluruh pesanan dari semua pelanggan dengan fitur ubah status fulfillment, (3) Inventori — manajemen katalog produk dalam tampilan storefront atau tabel (admin dapat menambah/mengedit produk), (4) Pelanggan — daftar pengguna terdaftar beserta informasi kontak, (5) Analitik — data penjualan dan tren pemesanan, dan (6) Pengaturan — konfigurasi sistem.', indent=True)
spacer()
placeholder('[Masukkan Screenshot Dashboard Administrator]')
caption('Gambar 4.10 Dashboard Administrator CLAYÉ')

heading_sub('4.4 Alur Transaksi E-Commerce')
body('Berikut adalah tahapan transaksi lengkap dalam sistem CLAYÉ dari awal hingga pesanan selesai:')
numbered_item(1,  'Pengguna membuka website CLAYÉ (https://claye-ecommerce.vercel.app) dan sistem secara otomatis mengarahkan ke halaman Login.')
numbered_item(2,  'Pengguna melakukan login menggunakan email dan password yang telah terdaftar (atau mendaftar akun baru melalui tab "Daftar Akun Baru").')
numbered_item(3,  'Setelah login berhasil, pengguna diarahkan ke Halaman Beranda dan dapat menjelajahi Katalog Produk untuk memilih produk keramik yang diinginkan.')
numbered_item(4,  'Pengguna memilih produk pada halaman detail, memilih varian glasir yang diinginkan, kemudian mengklik "Tambahkan ke Keranjang".')
numbered_item(5,  'Di Halaman Keranjang, pengguna mencentang produk yang ingin dibeli, dapat mengubah jumlah atau varian glasir, lalu mengklik "Lanjut ke Checkout".')
numbered_item(6,  'Pada Halaman Checkout, pengguna mengisi formulir data penerima dan alamat pengiriman di Kota Palembang. Sistem otomatis menentukan zona dan ongkos kirim berdasarkan kecamatan yang dipilih.')
numbered_item(7,  'Pengguna memeriksa ringkasan pesanan (produk, subtotal, ongkir, total) lalu mengklik tombol "Buat Pesanan COD" sebagai konfirmasi pesanan.')
numbered_item(8,  'Sistem menyimpan pesanan dengan metode pembayaran COD dan menampilkan halaman sukses berisi nomor referensi pesanan dan instruksi persiapan uang tunai.')
numbered_item(9,  'Tim CLAYÉ menerima notifikasi pesanan baru melalui dashboard admin dan menghubungi pelanggan via WhatsApp untuk konfirmasi waktu pengantaran.')
numbered_item(10, 'Tim CLAYÉ mengantarkan keramik langsung ke alamat pelanggan; pelanggan membayar tunai saat barang diterima (COD). Admin memperbarui status pesanan menjadi "Selesai".')
numbered_item(11, 'Pelanggan dapat melihat riwayat dan status pesanan di Dashboard Pelanggan pada menu "Pesanan Saya".')

heading_sub('4.5 Hasil Implementasi')
body('Berdasarkan proses pengembangan yang telah dilakukan, sistem CLAYÉ berhasil diimplementasikan dengan fitur-fitur berikut yang berfungsi sesuai rancangan:')
bullet('Sistem autentikasi lengkap (login pelanggan, login admin, registrasi, proteksi rute) dengan isolasi data per akun email.')
bullet('Katalog produk dengan 15 produk keramik artisan, masing-masing dilengkapi dengan varian glasir yang dapat dipilih secara interaktif.')
bullet('Keranjang belanja dengan fitur checkbox seleksi item, ubah glasir dari keranjang, kontrol kuantitas, dan persistensi data per akun.')
bullet('Sistem checkout COD dengan 3 zona pengiriman Kota Palembang (ongkir Rp 8.000 – Rp 15.000), deteksi kecamatan otomatis, dan integrasi buku alamat.')
bullet('Dashboard pelanggan dengan 6 menu: overview, pesanan, wishlist, profil, buku alamat, dan panduan perawatan.')
bullet('Dashboard administrator dengan 6 menu: overview, manajemen pesanan, inventori produk, daftar pelanggan, analitik, dan pengaturan.')
bullet('Halaman informasi statis: Beranda, Tentang CLAYÉ (memuat profil tim: Azwina Clayora, Alsywila Adhira, Altaz R.), dan Panduan Perawatan.')
bullet('Deployment berhasil di Vercel dan dapat diakses publik di https://claye-ecommerce.vercel.app.')

page_break()

# ══════════════════════════════════════════════════════════
# BAB V – PENGUJIAN SISTEM
# ══════════════════════════════════════════════════════════
heading_bab('BAB V')
heading_bab('PENGUJIAN SISTEM')

heading_sub('5.1 Metode Pengujian')
body('Pengujian sistem CLAYÉ dilakukan menggunakan metode Black Box Testing. Black Box Testing adalah metode pengujian perangkat lunak yang berfokus pada pengujian fungsionalitas sistem dari sudut pandang pengguna, tanpa memperhatikan struktur kode internal. Pengujian dilakukan dengan memberikan input tertentu dan memverifikasi apakah output yang dihasilkan sesuai dengan hasil yang diharapkan.')

body('Lingkungan pengujian yang digunakan:')
bullet('Browser: Google Chrome (terbaru), Mozilla Firefox, Microsoft Edge')
bullet('Perangkat: Desktop (Windows 10/11) dan Mobile (Android)')
bullet('URL Lokal: http://localhost:5173 (Vite development server)')
bullet('URL Produksi: https://claye-ecommerce.vercel.app (Vercel hosting)')

heading_sub('5.2 Hasil Pengujian')
body('Berikut adalah hasil pengujian Black Box Testing terhadap fitur-fitur utama sistem CLAYÉ:')
spacer()

simple_table(
    ['No.', 'Fitur yang Diuji', 'Skenario Pengujian', 'Hasil yang Diharapkan', 'Status'],
    [
        ['1',  'Login Pelanggan',              'Memasukkan email dan password akun yang terdaftar',               'Berhasil masuk, diarahkan ke Beranda',                        'Berhasil'],
        ['2',  'Login Admin',                  'Memasukkan email admin@claye.id dan password atelier2026',        'Berhasil masuk sebagai admin, diarahkan ke Dashboard Admin',  'Berhasil'],
        ['3',  'Login – Data Salah',           'Memasukkan password yang salah',                                 'Muncul pesan error "Kata sandi salah"',                       'Berhasil'],
        ['4',  'Login – Akun Belum Daftar',    'Memasukkan email yang belum terdaftar',                          'Muncul pesan "Akun belum terdaftar"',                         'Berhasil'],
        ['5',  'Registrasi Akun Baru',         'Mengisi formulir registrasi dengan data valid',                  'Akun berhasil dibuat, diarahkan ke tab login',                'Berhasil'],
        ['6',  'Proteksi Rute',                'Mengakses URL utama tanpa login',                                'Otomatis diarahkan ke halaman login',                         'Berhasil'],
        ['7',  'Katalog Produk',               'Membuka halaman katalog setelah login',                          'Semua 15 produk keramik ditampilkan',                         'Berhasil'],
        ['8',  'Filter Kategori',              'Memilih kategori "Mug & Cangkir"',                               'Hanya produk kategori tersebut yang ditampilkan',             'Berhasil'],
        ['9',  'Tambah ke Keranjang',          'Memilih glasir dan klik "Tambahkan ke Keranjang"',               'Produk masuk keranjang, notifikasi sukses muncul',            'Berhasil'],
        ['10', 'Checkbox Seleksi Keranjang',   'Mencentang/menghilangkan centang item di keranjang',             'Subtotal berubah sesuai item yang dicentang',                 'Berhasil'],
        ['11', 'Pilih Semua Keranjang',        'Klik tombol "Pilih Semua" di keranjang',                         'Semua item tercentang sekaligus',                             'Berhasil'],
        ['12', 'Ubah Glasir dari Keranjang',   'Mengubah pilihan glasir produk di halaman keranjang',            'Varian glasir berubah, notifikasi muncul',                    'Berhasil'],
        ['13', 'Auto-Detect Kecamatan',        'Mengetik "jakabaring" di field alamat pada checkout',            'Kecamatan "Jakabaring" terdeteksi, Zona 3 aktif (Rp 15.000)', 'Berhasil'],
        ['14', 'Pilih Kecamatan Manual',       'Memilih "Sukarami" di dropdown kecamatan',                      'Ongkir berubah ke Rp 12.000 (Zona 2)',                        'Berhasil'],
        ['15', 'Validasi Checkout',            'Klik "Buat Pesanan COD" tanpa mengisi nama/telepon',             'Muncul pesan error validasi data wajib',                      'Berhasil'],
        ['16', 'Checkout COD Berhasil',        'Mengisi semua data checkout dan klik konfirmasi',                'Halaman sukses COD ditampilkan dengan nomor pesanan',         'Berhasil'],
        ['17', 'Pilih dari Buku Alamat',       'Klik alamat tersimpan pada halaman checkout',                    'Formulir terisi otomatis dari alamat tersimpan',              'Berhasil'],
        ['18', 'Tambah Alamat Baru',           'Mengisi formulir alamat baru di menu Buku Alamat',               'Alamat berhasil tersimpan dan muncul di daftar',              'Berhasil'],
        ['19', 'Tambah ke Wishlist',           'Klik icon hati pada produk di katalog',                          'Produk masuk wishlist, notifikasi muncul',                    'Berhasil'],
        ['20', 'Admin – Kelola Pesanan',       'Admin mengubah status pesanan menjadi "Selesai"',                'Status pesanan berhasil diperbarui di panel admin',           'Berhasil'],
        ['21', 'Admin – Kelola Produk',        'Admin mengedit harga produk di menu Inventori',                  'Harga produk berhasil diperbarui di katalog',                 'Berhasil'],
        ['22', 'Riwayat Pesanan Pelanggan',    'Membuka menu "Pesanan Saya" di dashboard pelanggan',             'Daftar pesanan yang pernah dibuat tampil lengkap',            'Berhasil'],
        ['23', 'Logout',                       'Klik tombol Logout',                                             'Sesi berakhir, diarahkan ke halaman login, cart dikosongkan', 'Berhasil'],
    ],
    [0.5, 3.0, 3.8, 3.8, 1.9]
)

heading_sub('5.3 Analisis Hasil Pengujian')
body('Berdasarkan hasil pengujian Black Box Testing yang dilakukan terhadap 23 skenario pengujian, seluruh fitur utama sistem CLAYÉ berjalan sesuai dengan kebutuhan fungsional yang telah ditetapkan. Semua skenario pengujian memberikan status "Berhasil".')

body('Beberapa catatan dari hasil pengujian:')
bullet('Fitur auto-detect kecamatan dari teks alamat berfungsi baik untuk kata kunci yang telah didefinisikan dalam KEYWORDS_MAP, namun tidak dapat mendeteksi kecamatan jika pengguna menggunakan singkatan atau ejaan yang berbeda jauh dari kata kunci yang terdefinisi.')
bullet('Isolasi data per akun (keranjang, wishlist, pesanan, dan buku alamat yang tersimpan terpisah per email) berjalan dengan baik pada semua skenario perpindahan akun.')
bullet('Sistem berjalan lancar pada browser Google Chrome, Mozilla Firefox, dan Microsoft Edge baik di desktop maupun di perangkat mobile.')
bullet('Deployment di Vercel berhasil dan sistem dapat diakses melalui URL publik https://claye-ecommerce.vercel.app.')

page_break()

# ══════════════════════════════════════════════════════════
# BAB VI – PENUTUP
# ══════════════════════════════════════════════════════════
heading_bab('BAB VI')
heading_bab('PENUTUP')

heading_sub('6.1 Kesimpulan')
body('Berdasarkan hasil pengembangan dan pengujian sistem e-commerce CLAYÉ yang telah dilakukan, dapat ditarik kesimpulan sebagai berikut:')
numbered_item(1, 'Platform e-commerce CLAYÉ berhasil dirancang dan dibangun sebagai website berbasis React.js 18 dan Vite 5.4 yang berjalan sebagai Single Page Application (SPA) dan dapat diakses melalui browser modern di desktop maupun mobile.')
numbered_item(2, 'Konsep perdagangan elektronik berhasil diterapkan melalui fitur-fitur lengkap yang mencakup katalog produk, keranjang belanja, proses checkout, manajemen pesanan, dan dashboard pengguna maupun administrator.')
numbered_item(3, 'Proses pembelian produk keramik bagi pelanggan berhasil dipermudah melalui implementasi katalog produk interaktif dengan 15 produk dan variasi glasir, sistem checkout COD dengan zona pengiriman otomatis, serta fitur buku alamat dan deteksi kecamatan dari teks alamat.')
numbered_item(4, 'Teknologi web modern berhasil diimplementasikan secara efektif: React.js untuk komponen UI, React Context API untuk state management, localStorage untuk persistensi data per akun, Supabase sebagai opsional cloud database, dan Vercel untuk deployment produksi.')
numbered_item(5, 'Semua 23 skenario Black Box Testing yang dijalankan menghasilkan status "Berhasil", menunjukkan bahwa seluruh fitur sistem berjalan sesuai dengan kebutuhan fungsional yang telah ditetapkan.')
numbered_item(6, 'Aplikasi berhasil di-deploy ke Vercel dan dapat diakses secara publik di https://claye-ecommerce.vercel.app.')

heading_sub('6.2 Saran')
body('Untuk pengembangan sistem CLAYÉ selanjutnya, berikut beberapa saran yang dapat dipertimbangkan:')
numbered_item(1, 'Menambahkan integrasi payment gateway (seperti Xendit, Doku, atau Midtrans) untuk mendukung metode pembayaran digital seperti transfer bank, e-wallet (GoPay, OVO, Dana), dan QRIS sebagai pelengkap metode COD yang sudah tersedia.')
numbered_item(2, 'Mengembangkan fitur pelacakan pesanan (order tracking) secara real-time agar pelanggan dapat memantau status pengantaran dari studio CLAYÉ hingga ke alamat tujuan.')
numbered_item(3, 'Meningkatkan keamanan sistem dengan mengimplementasikan autentikasi berbasis Supabase Auth atau JWT (JSON Web Token) untuk menggantikan penyimpanan password di localStorage.')
numbered_item(4, 'Mengembangkan aplikasi ke versi mobile native menggunakan React Native untuk pengalaman pengguna mobile yang lebih optimal di platform Android dan iOS.')
numbered_item(5, 'Menambahkan fitur laporan penjualan yang lebih lengkap di dashboard admin, termasuk ekspor data dalam format Excel/PDF, grafik tren penjualan per bulan, dan laporan produk terlaris.')
numbered_item(6, 'Memperluas jangkauan pengiriman ke luar Kota Palembang dengan mengintegrasikan API jasa ekspedisi (JNE, J&T, SiCepat) agar produk CLAYÉ dapat menjangkau pelanggan di seluruh Indonesia.')

page_break()

# ══════════════════════════════════════════════════════════
# DAFTAR PUSTAKA
# ══════════════════════════════════════════════════════════
heading_bab('DAFTAR PUSTAKA')
spacer()

refs = [
    'Turban, E., Outland, J., King, D., Lee, J. K., Liang, T. P., & Turban, D. C. (2018). Electronic Commerce 2018: A Managerial and Social Networks Perspective (9th ed.). Springer International Publishing.',
    'React Team. (2024). React – The Library for Web and Native User Interfaces. Meta Open Source. https://react.dev',
    'Vite Team. (2024). Vite: Next Generation Frontend Tooling. https://vitejs.dev',
    'Supabase, Inc. (2024). Supabase Documentation – The Open Source Firebase Alternative. https://supabase.com/docs',
    'Vercel, Inc. (2024). Vercel Documentation – Build, Deploy, and Scale Your Web Apps. https://vercel.com/docs',
    'MDN Web Docs. (2024). Web Storage API – Window.localStorage. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
    'Remix Software. (2024). React Router v6 – Declarative Routing for React Applications. https://reactrouter.com',
    'GitHub, Inc. (2024). GitHub Documentation – Getting Started with Version Control. https://docs.github.com',
    'Flanagan, D. (2020). JavaScript: The Definitive Guide (7th ed.). O\'Reilly Media.',
]
for ref in refs:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent       = Cm(1.0)
    p.paragraph_format.first_line_indent = Cm(-1.0)
    _spacing(p, line=360, before=0, after=6)
    r = p.add_run(ref)
    _set_font(r, size=12)

page_break()

# ══════════════════════════════════════════════════════════
# LAMPIRAN
# ══════════════════════════════════════════════════════════
heading_bab('LAMPIRAN')
spacer()

heading_sub('Lampiran 1. Screenshot Seluruh Halaman Website')
pages_list = [
    'Halaman Login dan Registrasi',
    'Halaman Beranda (Homepage)',
    'Halaman Katalog Produk',
    'Halaman Detail Produk dengan Pilihan Glasir',
    'Halaman Keranjang Belanja dengan Fitur Checkbox Seleksi',
    'Halaman Checkout COD – Formulir Data Penerima',
    'Halaman Checkout COD – Ringkasan Pesanan dan Zona Pengiriman',
    'Halaman Sukses Pesanan COD',
    'Halaman Dashboard Pelanggan – Overview',
    'Halaman Dashboard Pelanggan – Riwayat Pesanan',
    'Halaman Dashboard Pelanggan – Buku Alamat',
    'Halaman Dashboard Administrator – Overview',
    'Halaman Dashboard Administrator – Manajemen Pesanan',
    'Halaman Dashboard Administrator – Inventori Produk',
    'Halaman Tentang CLAYÉ (About)',
    'Halaman Panduan Perawatan (Care Guide)',
]
for i, pg in enumerate(pages_list, 1):
    placeholder(f'[Screenshot {i}: {pg}]')

heading_sub('Lampiran 2. Source Code Program')
bullet('Repository GitHub: https://github.com/[username]/claye-ecommerce')
bullet('File utama: src/context/ShopContext.jsx (state management), src/pages/CheckoutPage.jsx (checkout COD), src/pages/AdminPage.jsx (dashboard admin)')

heading_sub('Lampiran 3. Struktur Database')
bullet('File schema database: supabase/schema.sql')
bullet('File data awal: supabase/seed.sql')
bullet('Tabel utama: users, products, categories, orders, order_items, product_glazes, artisan_partners, addresses')

heading_sub('Lampiran 4. Dokumentasi Proses Pengerjaan Project')
placeholder('[Masukkan dokumentasi foto/screenshot proses pengerjaan project]')

heading_sub('Lampiran 5. Pembagian Tugas Anggota Kelompok')
simple_table(
    ['No', 'Nama Anggota', 'NIM', 'Tugas / Peran'],
    [
        ['1', '[Nama Mahasiswa 1]', '[NIM]', '[Deskripsi tugas anggota 1]'],
        ['2', '[Nama Mahasiswa 2]', '[NIM]', '[Deskripsi tugas anggota 2]'],
        ['3', '[Nama Mahasiswa 3]', '[NIM]', '[Deskripsi tugas anggota 3]'],
        ['4', 'Atina Isyfi',        '[NIM]', 'Refactor checkout COD, efisiensi zona pengantaran, optimasi kode'],
    ],
    [0.5, 3.5, 2.5, 7.5]
)

heading_sub('Lampiran 6. Link Website dan Repository')
bullet('URL Aplikasi (Produksi): https://claye-ecommerce.vercel.app')
bullet('Repository GitHub: https://github.com/[username]/claye-ecommerce')
bullet('Akun Demo Admin: admin@claye.id | Password: atelier2026')

heading_sub('Lampiran 7. Dokumentasi Pembeli Menerima Produk dan Bukti Pembayaran COD')
placeholder('[Masukkan foto dokumentasi serah terima produk dan pembayaran COD]')
placeholder('[Masukkan foto/screenshot bukti pesanan dari sistem]')

# ══════════════════════════════════════════════════════════
# SAVE
# ══════════════════════════════════════════════════════════
doc.save(OUT)
print(f'[OK] Tersimpan di: {OUT}')
try:
    shutil.copy2(OUT, BCK)
    print(f'[OK] Backup di:   {BCK}')
except Exception as e:
    print(f'[WARN] Backup gagal: {e}')
print('Selesai!')
