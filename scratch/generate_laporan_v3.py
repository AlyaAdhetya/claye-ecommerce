#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate Laporan UAS CLAYÉ E-Commerce - Versi 3 (COD Only, No Midtrans)
"""
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy, os

OUTPUT_PATH = r"d:\E-COMMERCE\PRAKTIKUM E-COMMERCE\claye-ecommerce\LAPORAN_UAS_CLAYE_ECOMMERCE_TERBARU.docx"
BACKUP_PATH = r"C:\Users\User\.gemini\antigravity\brain\86f350c1-0f9c-4ffe-82cd-4a3cb42365c7\LAPORAN_UAS_CLAYE_ECOMMERCE_TERBARU.docx"

doc = Document()

# ─── PAGE SETUP ────────────────────────────────────────────────────────────────
section = doc.sections[0]
section.page_width  = Cm(21.0)   # A4
section.page_height = Cm(29.7)   # A4
section.left_margin   = Cm(4.0)
section.right_margin  = Cm(3.0)
section.top_margin    = Cm(3.0)
section.bottom_margin = Cm(3.0)

# ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
def set_para_format(para, size=12, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
                    space_after=0, space_before=0, line_spacing=1.5, color=None):
    para.alignment = align
    pf = para.paragraph_format
    pf.space_after  = Pt(space_after)
    pf.space_before = Pt(space_before)
    from docx.shared import Pt as Pt2
    from docx.oxml.ns import qn as qn2
    from docx.oxml import OxmlElement as OXE
    # line spacing 1.5 = 240 twips per line
    pPr = para._p.get_or_add_pPr()
    spEl = OXE('w:spacing')
    spEl.set(qn2('w:line'), str(int(240 * line_spacing)))
    spEl.set(qn2('w:lineRule'), 'auto')
    pPr.append(spEl)
    for run in para.runs:
        run.font.size  = Pt(size)
        run.font.bold  = bold
        run.font.italic = italic
        if color:
            run.font.color.rgb = RGBColor(*color)

def add_heading(doc, text, level=1, size=14, space_before=18, space_after=6):
    """Add BAB heading in KAPITAL BOLD Times New Roman"""
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pf = para.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after  = Pt(space_after)
    run = para.add_run(text.upper() if level == 1 else text)
    run.font.name   = 'Times New Roman'
    run.font.size   = Pt(size)
    run.font.bold   = True
    # Apply font to XML element
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), 'Times New Roman')
    rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    rPr.insert(0, rFonts)
    return para

def add_subheading(doc, text, level=2, size=12, bold=True, space_before=12, space_after=4):
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.LEFT
    pf = para.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after  = Pt(space_after)
    run = para.add_run(text)
    run.font.name   = 'Times New Roman'
    run.font.size   = Pt(size)
    run.font.bold   = bold
    return para

def add_body(doc, text, justify=True, size=12, bold=False, italic=False, space_after=6, first_indent=True):
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY if justify else WD_ALIGN_PARAGRAPH.LEFT
    pf = para.paragraph_format
    pf.space_after  = Pt(space_after)
    pf.space_before = Pt(0)
    if first_indent:
        pf.first_line_indent = Cm(1.25)
    # line spacing
    pPr = para._p.get_or_add_pPr()
    spEl = OxmlElement('w:spacing')
    spEl.set(qn('w:line'), '360')   # 1.5 spacing = 360 twips
    spEl.set(qn('w:lineRule'), 'auto')
    pPr.append(spEl)
    run = para.add_run(text)
    run.font.name   = 'Times New Roman'
    run.font.size   = Pt(size)
    run.font.bold   = bold
    run.font.italic = italic
    return para

def add_bullet(doc, text, size=12):
    para = doc.add_paragraph(style='List Bullet')
    para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = para.paragraph_format
    pf.space_after  = Pt(3)
    pf.space_before = Pt(0)
    run = para.add_run(text)
    run.font.name   = 'Times New Roman'
    run.font.size   = Pt(size)
    return para

def add_numbered(doc, text, size=12):
    para = doc.add_paragraph(style='List Number')
    para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = para.paragraph_format
    pf.space_after  = Pt(3)
    pf.space_before = Pt(0)
    run = para.add_run(text)
    run.font.name   = 'Times New Roman'
    run.font.size   = Pt(size)
    return para

def add_placeholder(doc, text):
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pf = para.paragraph_format
    pf.space_after  = Pt(6)
    pf.space_before = Pt(6)
    run = para.add_run(text)
    run.font.name   = 'Times New Roman'
    run.font.size   = Pt(11)
    run.font.italic = True
    run.font.color.rgb = RGBColor(0x88, 0x88, 0x88)
    return para

def add_table_row(table, cells_data, header=False):
    row = table.add_row()
    for i, (cell_text, width) in enumerate(cells_data):
        cell = row.cells[i]
        cell.text = cell_text
        for para in cell.paragraphs:
            para.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in para.runs:
                run.font.name   = 'Times New Roman'
                run.font.size   = Pt(11)
                run.font.bold   = header
        cell.width = Cm(width)
    return row

def add_simple_table(doc, headers, rows, col_widths):
    n = len(headers)
    table = doc.add_table(rows=1, cols=n)
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hdr_row = table.rows[0]
    for i, h in enumerate(headers):
        cell = hdr_row.cells[i]
        cell.text = h
        for para in cell.paragraphs:
            para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in para.runs:
                run.font.name   = 'Times New Roman'
                run.font.size   = Pt(11)
                run.font.bold   = True
        cell.width = Cm(col_widths[i])
    # Data rows
    for row_data in rows:
        row = table.add_row()
        for i, val in enumerate(row_data):
            cell = row.cells[i]
            cell.text = str(val)
            for para in cell.paragraphs:
                para.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in para.runs:
                    run.font.name   = 'Times New Roman'
                    run.font.size   = Pt(11)
            cell.width = Cm(col_widths[i])
    return table

def add_page_break(doc):
    para = doc.add_paragraph()
    run = para.add_run()
    run.add_break(docx.oxml.ns.qn('w:lastRenderedPageBreak'))
    para.clear()
    doc.add_page_break()

import docx

# ─── COVER PAGE ────────────────────────────────────────────────────────────────
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(0)
run = p.add_run('LAPORAN AKHIR PROJECT')
run.font.name = 'Times New Roman'
run.font.size = Pt(14)
run.font.bold = True

p2 = doc.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
p2.paragraph_format.space_after = Pt(4)
run2 = p2.add_run('PRAKTIKUM E-COMMERCE')
run2.font.name = 'Times New Roman'
run2.font.size = Pt(14)
run2.font.bold = True

doc.add_paragraph()

p3 = doc.add_paragraph()
p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
run3 = p3.add_run('CLAYÉ E-COMMERCE')
run3.font.name = 'Times New Roman'
run3.font.size = Pt(16)
run3.font.bold = True

p4 = doc.add_paragraph()
p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
run4 = p4.add_run('Platform Keramik & Tembikar Artisan Berbasis Web')
run4.font.name = 'Times New Roman'
run4.font.size = Pt(12)
run4.font.italic = True

doc.add_paragraph()
add_placeholder(doc, '[Masukkan Logo Universitas]')
doc.add_paragraph()

for label, value in [
    ('Nama Kelompok', 'Kelompok [Nomor Kelompok]'),
    ('Anggota', '[Nama Mahasiswa 1] – [NIM]'),
    ('', '[Nama Mahasiswa 2] – [NIM]'),
    ('', '[Nama Mahasiswa 3] – [NIM]'),
    ('', 'Atina Isyfi – [NIM]'),
    ('Dosen Pengampu', '[Nama Dosen]'),
    ('Program Studi', 'Teknik Informatika / Sistem Informasi'),
    ('Semester', 'Ganjil 2024/2025'),
    ('Tahun', '2026'),
]:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    if label:
        run_l = p.add_run(f'{label}: ')
        run_l.font.name = 'Times New Roman'
        run_l.font.size = Pt(12)
        run_l.font.bold = True
    run_v = p.add_run(value)
    run_v.font.name = 'Times New Roman'
    run_v.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)

doc.add_page_break()

# ─── KATA PENGANTAR ────────────────────────────────────────────────────────────
add_heading(doc, 'KATA PENGANTAR', level=1, size=14)
doc.add_paragraph()

add_body(doc, 'Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat dan karunia-Nya sehingga kami dapat menyelesaikan laporan akhir project Praktikum E-Commerce ini dengan baik. Laporan ini merupakan hasil dari proses perancangan, pengembangan, dan pengujian sistem e-commerce berbasis web yang kami beri nama CLAYÉ.')

add_body(doc, 'CLAYÉ adalah platform e-commerce yang kami rancang khusus sebagai toko online untuk produk keramik dan tembikar artisan buatan tangan. Platform ini dibangun menggunakan teknologi modern berbasis React.js, dengan fitur-fitur utama meliputi katalog produk, keranjang belanja, sistem checkout dengan pengiriman COD (Cash on Delivery) khusus wilayah Kota Palembang, dashboard pelanggan, serta dashboard administrator.')

add_body(doc, 'Laporan ini disusun untuk memenuhi tugas akhir mata kuliah Praktikum E-Commerce dan sebagai dokumentasi teknis dari seluruh proses pengembangan sistem yang telah kami lakukan. Kami berharap laporan ini dapat memberikan gambaran yang jelas dan lengkap mengenai sistem yang telah dibangun.')

add_body(doc, 'Kami menyadari bahwa laporan ini masih jauh dari sempurna. Oleh karena itu, kritik dan saran yang membangun sangat kami harapkan untuk perbaikan di masa yang akan datang. Terima kasih kepada dosen pengampu, rekan-rekan kelompok, dan semua pihak yang telah memberikan dukungan dalam penyelesaian proyek ini.')

doc.add_paragraph()
p_sign = doc.add_paragraph()
p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
run_s = p_sign.add_run('Palembang, November 2026\n\nTim Pengembang CLAYÉ')
run_s.font.name = 'Times New Roman'
run_s.font.size = Pt(12)

doc.add_page_break()

# ─── DAFTAR ISI ────────────────────────────────────────────────────────────────
add_heading(doc, 'DAFTAR ISI', level=1, size=14)
doc.add_paragraph()

toc_items = [
    ('Kata Pengantar', 'ii'),
    ('Daftar Isi', 'iii'),
    ('Daftar Gambar', 'iv'),
    ('Daftar Tabel', 'v'),
    ('BAB I PENDAHULUAN', '1'),
    ('   1.1 Latar Belakang', '1'),
    ('   1.2 Rumusan Masalah', '2'),
    ('   1.3 Tujuan Penelitian', '2'),
    ('   1.4 Manfaat Penelitian', '3'),
    ('   1.5 Batasan Masalah', '3'),
    ('BAB II TINJAUAN PUSTAKA', '4'),
    ('   2.1 E-Commerce', '4'),
    ('   2.2 Keramik dan Tembikar Artisan', '4'),
    ('   2.3 Teknologi Pengembangan Web', '5'),
    ('   2.4 Bahasa Pemrograman dan Teknologi yang Digunakan', '6'),
    ('BAB III METODOLOGI', '8'),
    ('   3.1 Metode Pengembangan', '8'),
    ('   3.2 Analisis Kebutuhan', '8'),
    ('   3.3 Desain Sistem', '9'),
    ('BAB IV IMPLEMENTASI', '11'),
    ('   4.1 Struktur Proyek', '11'),
    ('   4.2 Teknologi dan Tools', '12'),
    ('   4.3 Fitur-Fitur Utama', '13'),
    ('   4.4 Alur Transaksi', '20'),
    ('BAB V PENGUJIAN', '22'),
    ('   5.1 Lingkungan Pengujian', '22'),
    ('   5.2 Black Box Testing', '22'),
    ('BAB VI PENUTUP', '26'),
    ('   6.1 Kesimpulan', '26'),
    ('   6.2 Saran', '26'),
    ('Daftar Pustaka', '27'),
]

for item, page in toc_items:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(2)
    tab_stops = p.paragraph_format.tab_stops
    from docx.shared import Cm as Cm2
    from docx.oxml import OxmlElement as OXE2
    run_toc = p.add_run(item)
    run_toc.font.name = 'Times New Roman'
    run_toc.font.size = Pt(12)
    run_toc2 = p.add_run('\t' + page)
    run_toc2.font.name = 'Times New Roman'
    run_toc2.font.size = Pt(12)

doc.add_page_break()

# ─── BAB I: PENDAHULUAN ───────────────────────────────────────────────────────
add_heading(doc, 'BAB I', level=1, size=14)
add_heading(doc, 'PENDAHULUAN', level=1, size=14)

add_subheading(doc, '1.1 Latar Belakang')
add_body(doc, 'Perkembangan teknologi informasi dan komunikasi yang pesat telah membawa perubahan signifikan dalam dunia perdagangan. E-commerce atau perdagangan elektronik menjadi salah satu solusi bisnis yang semakin diminati karena kemampuannya dalam menghubungkan penjual dan pembeli secara digital tanpa batas geografis.')
add_body(doc, 'Di sisi lain, produk kerajinan tangan lokal, khususnya keramik dan tembikar artisan, memiliki nilai seni dan budaya yang tinggi namun masih menghadapi tantangan dalam hal jangkauan pemasaran. Para pengrajin keramik lokal, terutama di wilayah Palembang, Sumatera Selatan, seringkali kesulitan menjangkau pasar yang lebih luas karena keterbatasan sarana promosi dan distribusi.')
add_body(doc, 'Berdasarkan permasalahan tersebut, tim pengembang berinisiatif untuk membangun platform e-commerce bernama CLAYÉ — sebuah toko online yang dirancang khusus untuk mempertemukan para pecinta keramik artisan dengan koleksi keramik berkualitas buatan tangan pengrajin lokal. Nama CLAYÉ terinspirasi dari kata "clay" (tanah liat dalam bahasa Inggris) dengan sentuhan estetika Prancis, mencerminkan perpaduan nilai lokal dan gaya internasional.')
add_body(doc, 'Platform CLAYÉ dibangun menggunakan React.js sebagai framework utama, dengan sistem pengiriman COD (Cash on Delivery) yang dioperasikan langsung oleh tim CLAYÉ Studio untuk wilayah Kota Palembang. Sistem ini dirancang untuk memberikan pengalaman belanja keramik artisan yang nyaman, aman, dan terpercaya bagi para pelanggan.')

add_subheading(doc, '1.2 Rumusan Masalah')
add_body(doc, 'Berdasarkan latar belakang yang telah diuraikan, rumusan masalah dalam proyek ini adalah sebagai berikut:', first_indent=True)
add_bullet(doc, 'Bagaimana merancang dan mengimplementasikan platform e-commerce yang dapat mempermudah proses jual beli produk keramik artisan secara online?')
add_bullet(doc, 'Bagaimana mengelola katalog produk keramik dengan variasi glasir (glaze) yang berbeda-beda secara efektif dalam sistem?')
add_bullet(doc, 'Bagaimana mengimplementasikan sistem pengiriman COD (Cash on Delivery) berbasis zona wilayah Kota Palembang?')
add_bullet(doc, 'Bagaimana menyediakan fitur manajemen pesanan bagi pelanggan dan administrator dalam satu sistem yang terintegrasi?')

add_subheading(doc, '1.3 Tujuan Penelitian')
add_body(doc, 'Tujuan dari pengembangan sistem e-commerce CLAYÉ ini adalah:', first_indent=True)
add_bullet(doc, 'Membangun platform e-commerce berbasis web yang fungsional untuk produk keramik artisan menggunakan teknologi React.js dan Vite.')
add_bullet(doc, 'Mengimplementasikan katalog produk interaktif dengan fitur pemilihan varian glasir, detail produk, dan sistem favorit (wishlist).')
add_bullet(doc, 'Menyediakan sistem checkout dengan metode pembayaran COD (Cash on Delivery) dan pengiriman langsung oleh tim CLAYÉ untuk wilayah Kota Palembang.')
add_bullet(doc, 'Mengembangkan dashboard pelanggan untuk manajemen pesanan, profil, buku alamat, dan daftar simpan.')
add_bullet(doc, 'Menyediakan dashboard administrator untuk manajemen produk, pesanan, pelanggan, dan analitik penjualan.')
add_bullet(doc, 'Men-deploy aplikasi ke platform hosting Vercel agar dapat diakses secara publik.')

add_subheading(doc, '1.4 Manfaat Penelitian')
add_body(doc, 'Manfaat dari pengembangan platform CLAYÉ ini antara lain:', first_indent=True)
add_bullet(doc, 'Bagi Pengrajin: Memperluas jangkauan pemasaran produk keramik artisan ke pasar yang lebih luas melalui platform digital.')
add_bullet(doc, 'Bagi Pelanggan: Memudahkan proses pencarian, pemilihan, dan pemesanan produk keramik artisan berkualitas secara online.')
add_bullet(doc, 'Bagi Tim Pengembang: Memberikan pengalaman nyata dalam mengembangkan aplikasi e-commerce lengkap menggunakan teknologi modern.')
add_bullet(doc, 'Bagi Akademik: Menjadi referensi pengembangan sistem e-commerce berbasis React.js dengan fitur manajemen produk bervariant dan zona pengiriman regional.')

add_subheading(doc, '1.5 Batasan Masalah')
add_body(doc, 'Untuk menjaga fokus dan kelayakan pengembangan, proyek ini memiliki batasan sebagai berikut:', first_indent=True)
add_bullet(doc, 'Sistem hanya melayani pengiriman fisik untuk wilayah Kota Palembang dengan metode antar langsung oleh tim CLAYÉ (COD - Cash on Delivery).')
add_bullet(doc, 'Metode pembayaran yang tersedia hanya COD (bayar tunai di tempat saat barang diterima); tidak terdapat integrasi payment gateway pihak ketiga.')
add_bullet(doc, 'Data pengguna disimpan menggunakan localStorage browser dan Supabase (opsional) sebagai backend database.')
add_bullet(doc, 'Fitur kupon belanja telah dihapus dari sistem pada versi terbaru (refactor oleh Atina Isyfi, November 2026).')
add_bullet(doc, 'Sistem tidak mencakup fitur pengiriman ekspedisi pihak ketiga (JNE, J&T, Shopee Express, dll.).')
add_bullet(doc, 'Produk yang dijual terbatas pada 15 produk keramik artisan yang terdapat dalam katalog.')

doc.add_page_break()

# ─── BAB II: TINJAUAN PUSTAKA ─────────────────────────────────────────────────
add_heading(doc, 'BAB II', level=1, size=14)
add_heading(doc, 'TINJAUAN PUSTAKA', level=1, size=14)

add_subheading(doc, '2.1 E-Commerce')
add_body(doc, 'E-commerce (Electronic Commerce) adalah proses pembelian, penjualan, atau pertukaran produk dan layanan melalui jaringan komputer, khususnya internet. Menurut Turban et al. (2018), e-commerce mencakup semua transaksi bisnis yang dilakukan secara elektronik antara organisasi dan individu. E-commerce telah mengubah cara manusia berbisnis dengan menghilangkan batasan geografis dan waktu dalam bertransaksi.')
add_body(doc, 'Dalam perkembangannya, e-commerce terbagi menjadi beberapa model bisnis, di antaranya B2C (Business to Consumer), B2B (Business to Business), dan C2C (Consumer to Consumer). Platform CLAYÉ mengadopsi model B2C di mana CLAYÉ Studio sebagai penjual langsung berhubungan dengan konsumen akhir yang tertarik membeli produk keramik artisan.')

add_subheading(doc, '2.2 Keramik dan Tembikar Artisan')
add_body(doc, 'Keramik adalah produk yang terbuat dari bahan tanah liat (clay) yang dibentuk dan kemudian dibakar pada suhu tinggi. Tembikar artisan (artisan ceramics) merujuk pada produk keramik yang dibuat secara handmade dengan keahlian khusus, mengutamakan nilai estetika dan keunikan setiap produk dibandingkan produksi massal.')
add_body(doc, 'Salah satu karakteristik khas produk keramik artisan adalah adanya pilihan glasir (glaze) — lapisan kaca dekoratif yang diaplikasikan pada permukaan keramik sebelum dibakar. Setiap varian glasir menghasilkan tampilan warna dan tekstur yang berbeda-beda, menjadikan setiap karya keramik unik dan bernilai seni tinggi. Dalam sistem CLAYÉ, fitur pemilihan glasir ini diakomodasi melalui atribut glazeOptions pada setiap produk.')

add_subheading(doc, '2.3 Teknologi Pengembangan Web')
add_body(doc, 'Pengembangan aplikasi web modern telah mengalami evolusi signifikan dengan hadirnya berbagai framework dan library JavaScript. Beberapa teknologi utama yang relevan dengan proyek CLAYÉ antara lain:')

add_subheading(doc, '2.3.1 React.js', level=3, size=12, bold=False)
add_body(doc, 'React.js adalah library JavaScript open-source yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (UI) berbasis komponen. React menggunakan paradigma component-based architecture di mana setiap bagian UI dibangun sebagai komponen yang dapat digunakan kembali. Fitur utama React meliputi Virtual DOM yang meningkatkan performa rendering, JSX sebagai sintaks deklaratif, dan sistem state management yang fleksibel.')

add_subheading(doc, '2.3.2 Vite', level=3, size=12, bold=False)
add_body(doc, 'Vite adalah build tool generasi berikutnya untuk aplikasi web modern. Berbeda dengan bundler tradisional seperti Webpack, Vite memanfaatkan ES modules native di browser untuk proses development yang sangat cepat. Vite menyediakan Hot Module Replacement (HMR) yang memungkinkan perubahan kode langsung terlihat di browser tanpa reload penuh.')

add_subheading(doc, '2.3.3 Supabase', level=3, size=12, bold=False)
add_body(doc, 'Supabase adalah platform Backend-as-a-Service (BaaS) open-source yang menyediakan database PostgreSQL, autentikasi, storage, dan API secara otomatis. Supabase digunakan dalam proyek CLAYÉ sebagai opsional backend database — sistem akan berjalan menggunakan localStorage jika Supabase tidak dikonfigurasi.')

add_subheading(doc, '2.3.4 Vercel', level=3, size=12, bold=False)
add_body(doc, 'Vercel adalah platform cloud untuk deployment aplikasi web frontend, khususnya dioptimalkan untuk framework React, Next.js, dan Vue.js. Vercel menyediakan continuous deployment dari repository GitHub, CDN global, dan preview deployments untuk setiap pull request.')

add_subheading(doc, '2.4 Bahasa Pemrograman dan Teknologi yang Digunakan')
add_body(doc, 'Berikut adalah daftar teknologi yang secara aktual digunakan dalam pengembangan platform CLAYÉ:')
doc.add_paragraph()

tech_headers = ['No', 'Teknologi', 'Versi', 'Fungsi']
tech_rows = [
    ['1', 'React.js', '18.x', 'Library utama untuk membangun antarmuka pengguna (UI) berbasis komponen'],
    ['2', 'Vite', '5.4.x', 'Build tool dan development server yang cepat untuk proyek React'],
    ['3', 'JavaScript (ES6+)', 'ES2022+', 'Bahasa pemrograman utama untuk logika aplikasi'],
    ['4', 'React Router DOM', '6.x', 'Manajemen routing hash-based (#/) dalam aplikasi single-page'],
    ['5', 'React Context API', 'Built-in', 'State management global untuk cart, user, orders, dan produk'],
    ['6', 'HTML5 & CSS3', 'Modern', 'Struktur halaman dan styling antarmuka pengguna'],
    ['7', 'Browser localStorage', 'Web API', 'Penyimpanan data sesi, keranjang, pesanan, dan preferensi user'],
    ['8', 'Supabase (opsional)', '2.x', 'Backend PostgreSQL opsional untuk sinkronisasi data ke cloud'],
    ['9', 'Vercel', 'Latest', 'Platform hosting dan deployment aplikasi web'],
    ['10', 'Git & GitHub', 'Latest', 'Version control dan kolaborasi pengembangan tim'],
]
tech_widths = [1.0, 3.5, 2.0, 7.5]
add_simple_table(doc, tech_headers, tech_rows, tech_widths)

doc.add_paragraph()
doc.add_page_break()

# ─── BAB III: METODOLOGI ──────────────────────────────────────────────────────
add_heading(doc, 'BAB III', level=1, size=14)
add_heading(doc, 'METODOLOGI', level=1, size=14)

add_subheading(doc, '3.1 Metode Pengembangan')
add_body(doc, 'Proyek CLAYÉ dikembangkan menggunakan pendekatan Agile Development dengan siklus iterasi yang fleksibel. Metode ini dipilih karena memungkinkan pengembangan bertahap, perubahan yang mudah diakomodasi, dan kolaborasi antar anggota tim yang efektif. Proses pengembangan dibagi menjadi beberapa sprint/iterasi:')
add_bullet(doc, 'Sprint 1: Perancangan arsitektur, setup proyek, dan pengembangan komponen dasar (Navbar, Footer, halaman login/register).')
add_bullet(doc, 'Sprint 2: Pengembangan katalog produk, halaman detail produk, dan keranjang belanja.')
add_bullet(doc, 'Sprint 3: Implementasi checkout COD, sistem zona pengiriman Palembang, dan halaman sukses pesanan.')
add_bullet(doc, 'Sprint 4: Pengembangan dashboard pelanggan dan dashboard administrator.')
add_bullet(doc, 'Sprint 5: Refactor — penghapusan fitur kupon belanja, efisiensi zona pengantaran, dan optimasi checkout (Atina Isyfi, November 2026).')
add_bullet(doc, 'Sprint 6: Deployment ke Vercel dan pengujian sistem.')

add_subheading(doc, '3.2 Analisis Kebutuhan')

add_subheading(doc, '3.2.1 Kebutuhan Fungsional', level=3, size=12, bold=False)
add_body(doc, 'Kebutuhan fungsional sistem CLAYÉ meliputi:', first_indent=True)
add_bullet(doc, 'Sistem autentikasi: pendaftaran akun baru, login (pelanggan dan admin), dan logout.')
add_bullet(doc, 'Katalog produk: tampilan grid produk, filter kategori, pencarian produk, dan halaman detail dengan pemilihan glasir.')
add_bullet(doc, 'Keranjang belanja: tambah produk, ubah jumlah, seleksi item dengan checkbox, ubah glasir dari keranjang, dan hapus produk.')
add_bullet(doc, 'Checkout COD: formulir data penerima, deteksi kecamatan otomatis, pemilihan kecamatan Palembang, buku alamat tersimpan, ringkasan pesanan, dan konfirmasi COD.')
add_bullet(doc, 'Dashboard pelanggan: riwayat pesanan, daftar simpan (wishlist), profil akun, buku alamat, dan panduan perawatan keramik.')
add_bullet(doc, 'Dashboard administrator: manajemen produk (inventori), manajemen pesanan, daftar pelanggan, analitik penjualan, dan pengaturan sistem.')
add_bullet(doc, 'Halaman statis: Beranda, Tentang CLAYÉ (About), dan Panduan Perawatan (Care Guide).')

add_subheading(doc, '3.2.2 Kebutuhan Non-Fungsional', level=3, size=12, bold=False)
add_body(doc, 'Kebutuhan non-fungsional sistem meliputi:', first_indent=True)
add_bullet(doc, 'Performa: Halaman dapat dimuat dalam waktu kurang dari 3 detik pada koneksi internet standar.')
add_bullet(doc, 'Keamanan: Proteksi rute — pengguna yang belum login tidak dapat mengakses halaman utama dan diarahkan ke halaman login.')
add_bullet(doc, 'Usability: Antarmuka yang intuitif, responsif, dan estetis sesuai karakter brand CLAYÉ yang artisanal.')
add_bullet(doc, 'Reliability: Data persisten menggunakan localStorage sehingga tidak hilang saat halaman di-refresh.')
add_bullet(doc, 'Portability: Aplikasi dapat diakses melalui browser modern di desktop maupun mobile.')

add_subheading(doc, '3.3 Desain Sistem')

add_subheading(doc, '3.3.1 Arsitektur Sistem', level=3, size=12, bold=False)
add_body(doc, 'Sistem CLAYÉ dibangun sebagai Single Page Application (SPA) berbasis React.js dengan arsitektur client-side rendering. Sistem ini terdiri dari beberapa lapisan:')
add_bullet(doc, 'Presentation Layer: Komponen React (halaman dan komponen UI) yang menangani tampilan antarmuka.')
add_bullet(doc, 'State Management Layer: React Context API (ShopContext) yang mengelola state global seluruh aplikasi, termasuk produk, keranjang, pengguna, pesanan, zona pengiriman, dan buku alamat.')
add_bullet(doc, 'Data Layer: Browser localStorage sebagai penyimpanan data primer, dengan Supabase PostgreSQL sebagai opsional cloud backup.')
add_bullet(doc, 'Routing Layer: Hash-based routing (#/) dengan React Router DOM untuk navigasi antar halaman.')

add_subheading(doc, '3.3.2 Desain Database', level=3, size=12, bold=False)
add_body(doc, 'Struktur data utama yang digunakan dalam sistem CLAYÉ:')
add_bullet(doc, 'Products: id, name, price, category, description, image, glazeOptions[], artisanOrigin, specs.')
add_bullet(doc, 'Users: role, name, email, password, phone, address, kecamatan, postalCode, patronSince.')
add_bullet(doc, 'Cart Items: productId, name, price, quantity, selectedGlaze, stamp, selected.')
add_bullet(doc, 'Orders: id, patron, email, phone, items[], total, shippingFee, grandTotal, paymentMethod (COD), paymentStatus, fulfillment, shippingAddress, courier, date.')
add_bullet(doc, 'Addresses: id, label, recipientName, phone, address, kecamatan, city, postalCode, patokan, isPrimary.')
add_bullet(doc, 'Wishlist: array of productId.')

doc.add_page_break()

# ─── BAB IV: IMPLEMENTASI ─────────────────────────────────────────────────────
add_heading(doc, 'BAB IV', level=1, size=14)
add_heading(doc, 'IMPLEMENTASI', level=1, size=14)

add_subheading(doc, '4.1 Struktur Proyek')
add_body(doc, 'Proyek CLAYÉ diorganisir dalam struktur direktori sebagai berikut:')
doc.add_paragraph()

p_code = doc.add_paragraph()
p_code.alignment = WD_ALIGN_PARAGRAPH.LEFT
p_code.paragraph_format.left_indent = Cm(1.0)
run_code = p_code.add_run(
    'claye-ecommerce/\n'
    '├── src/\n'
    '│   ├── components/        # Komponen UI reusable\n'
    '│   │   ├── Navbar.jsx\n'
    '│   │   ├── Footer.jsx\n'
    '│   │   ├── ProductCard.jsx\n'
    '│   │   ├── CartDrawer.jsx\n'
    '│   │   └── ChatAssistant.jsx\n'
    '│   ├── pages/             # Halaman utama\n'
    '│   │   ├── LoginPage.jsx\n'
    '│   │   ├── HomePage.jsx\n'
    '│   │   ├── ShopPage.jsx\n'
    '│   │   ├── ProductDetailPage.jsx\n'
    '│   │   ├── CartPage.jsx\n'
    '│   │   ├── CheckoutPage.jsx\n'
    '│   │   ├── DashboardPage.jsx\n'
    '│   │   ├── AdminPage.jsx\n'
    '│   │   ├── AboutPage.jsx\n'
    '│   │   └── CarePage.jsx\n'
    '│   ├── context/\n'
    '│   │   └── ShopContext.jsx # State management global\n'
    '│   ├── data/\n'
    '│   │   └── products.js    # Data 15 produk keramik\n'
    '│   ├── lib/\n'
    '│   │   └── supabaseClient.js\n'
    '│   └── services/\n'
    '│       └── supabaseService.js\n'
    '├── supabase/\n'
    '│   ├── schema.sql\n'
    '│   └── seed.sql\n'
    '├── public/\n'
    '├── index.html\n'
    '├── package.json\n'
    '└── vite.config.js'
)
run_code.font.name = 'Courier New'
run_code.font.size = Pt(9)

doc.add_paragraph()

add_subheading(doc, '4.2 Teknologi dan Tools')
tech_impl_rows = [
    ['React.js 18', 'Framework utama SPA berbasis komponen'],
    ['Vite 5.4', 'Build tool, dev server HMR, dan bundler produksi'],
    ['React Context API', 'State management global (ShopContext.jsx)'],
    ['React Router DOM', 'Hash-based client-side routing (#/)'],
    ['JavaScript ES6+', 'Bahasa utama (arrow functions, async/await, destructuring)'],
    ['localStorage API', 'Persistensi data sesi, keranjang, pesanan, alamat per akun'],
    ['Supabase (opsional)', 'PostgreSQL cloud database — fallback ke local jika tidak dikonfigurasi'],
    ['Vercel', 'Hosting dan continuous deployment dari GitHub'],
    ['Git & GitHub', 'Version control dan kolaborasi tim'],
]
add_simple_table(doc, ['Teknologi', 'Fungsi dalam Sistem'], tech_impl_rows, [4.5, 9.5])

doc.add_paragraph()

add_subheading(doc, '4.3 Fitur-Fitur Utama')

add_subheading(doc, '4.3.1 Sistem Autentikasi', level=3, size=12, bold=False)
add_body(doc, 'Platform CLAYÉ mengimplementasikan sistem autentikasi berbasis JavaScript murni tanpa library pihak ketiga. Sistem ini dikelola sepenuhnya oleh ShopContext.jsx dan mencakup fitur-fitur berikut:')
add_bullet(doc, 'Login Pelanggan: Verifikasi email dan password terhadap data yang tersimpan di localStorage (registry pengguna terdaftar).')
add_bullet(doc, 'Login Admin: Autentikasi khusus untuk email admin@claye.id dengan password yang telah dikonfigurasi (admin123, claye2026, atelier2026).')
add_bullet(doc, 'Registrasi Akun: Formulir pendaftaran dengan validasi format email, pengecekan duplikasi, dan syarat minimal password 6 karakter.')
add_bullet(doc, 'Proteksi Rute: Pengguna yang belum login secara otomatis diarahkan ke halaman login saat mencoba mengakses halaman manapun.')
add_bullet(doc, 'Logout: Menghapus sesi aktif dari localStorage dan mengarahkan ke halaman login.')
add_bullet(doc, 'Isolasi Data per Akun: Keranjang belanja, wishlist, pesanan, dan buku alamat tersimpan secara terpisah per akun email, sehingga data tidak tercampur antar pengguna.')

add_placeholder(doc, '[Masukkan Screenshot Halaman Login CLAYÉ]')

add_subheading(doc, '4.3.2 Halaman Beranda (HomePage)', level=3, size=12, bold=False)
add_body(doc, 'Halaman beranda menampilkan identitas brand CLAYÉ dengan elemen-elemen utama:')
add_bullet(doc, 'Hero section dengan tagline "Keramik Artisan yang Dibuat dengan Hati" beserta tombol CTA (Call-to-Action) menuju katalog produk.')
add_bullet(doc, 'Galeri koleksi unggulan yang menampilkan beberapa produk keramik pilihan.')
add_bullet(doc, 'Bagian nilai brand yang menceritakan filosofi CLAYÉ: keunikan buatan tangan, kualitas glasir pilihan, dan keterikatan dengan pengrajin lokal.')
add_bullet(doc, 'Testimoni pelanggan dan informasi layanan antar langsung tim CLAYÉ.')

add_placeholder(doc, '[Masukkan Screenshot Halaman Beranda CLAYÉ]')

add_subheading(doc, '4.3.3 Katalog Produk (ShopPage)', level=3, size=12, bold=False)
add_body(doc, 'Halaman katalog menampilkan seluruh koleksi produk keramik CLAYÉ. Sistem menyediakan 15 produk keramik artisan dengan berbagai kategori, antara lain:')
add_bullet(doc, 'Mug & Cangkir: produk-produk cangkir keramik dengan berbagai bentuk dan ukuran.')
add_bullet(doc, 'Bowl & Mangkuk: mangkuk saji dalam berbagai ukuran.')
add_bullet(doc, 'Piring & Nampan: piring makan artisan.')
add_bullet(doc, 'Vas & Dekorasi: vas bunga dan objek dekorasi interior.')
add_bullet(doc, 'Set & Koleksi: paket bundling produk keramik.')

add_body(doc, 'Setiap produk ditampilkan dalam kartu produk (ProductCard) yang memuat gambar, nama, harga, pilihan glasir, dan tombol tambah ke keranjang. Pengguna dapat langsung memilih varian glasir dari halaman katalog maupun halaman detail produk.')

add_placeholder(doc, '[Masukkan Screenshot Halaman Katalog Produk]')

add_subheading(doc, '4.3.4 Keranjang Belanja (CartPage)', level=3, size=12, bold=False)
add_body(doc, 'Halaman keranjang belanja menampilkan semua produk yang telah ditambahkan oleh pengguna. Fitur-fitur yang tersedia:')
add_bullet(doc, 'Seleksi Item dengan Checkbox: Pengguna dapat memilih produk mana yang akan di-checkout menggunakan checkbox. Tersedia tombol "Pilih Semua" untuk mencentang semua produk sekaligus.')
add_bullet(doc, 'Ubah Glasir dari Keranjang: Pengguna dapat mengubah varian glasir produk langsung dari halaman keranjang tanpa harus kembali ke halaman detail produk (fungsi updateCartItemGlaze).')
add_bullet(doc, 'Update Kuantitas: Tombol + dan - untuk mengubah jumlah item.')
add_bullet(doc, 'Hapus Item: Tombol hapus untuk menghapus produk dari keranjang.')
add_bullet(doc, 'Ringkasan Harga: Subtotal dihitung hanya berdasarkan item yang dicentang/dipilih.')
add_bullet(doc, 'Persistensi per Akun: Data keranjang disimpan terpisah di localStorage berdasarkan email akun aktif.')

add_placeholder(doc, '[Masukkan Screenshot Halaman Keranjang Belanja]')

add_subheading(doc, '4.3.5 Sistem Zona Pengiriman Palembang', level=3, size=12, bold=False)
add_body(doc, 'CLAYÉ mengoperasikan pengiriman mandiri (antar langsung oleh tim CLAYÉ Studio) khusus untuk wilayah Kota Palembang. Sistem dibagi menjadi 3 zona pengiriman berdasarkan jarak dari studio:')
doc.add_paragraph()

zone_rows = [
    ['Zona 1\n(plb_pusat)', 'Palembang Pusat\n(Ilir Barat & Ilir Timur I)', 'Ilir Barat I, Ilir Barat II,\nBukit Kecil, Ilir Timur I', 'Rp 8.000', '1–2 Jam'],
    ['Zona 2\n(plb_utara_timur)', 'Palembang Utara & Timur\n(Kemuning, Sukarami, Sako, Kalidoni)', 'Kemuning, Sukarami,\nAlang-Alang Lebar, Sako,\nKalidoni, Gandus, dll.', 'Rp 12.000', '2–3 Jam'],
    ['Zona 3\n(plb_seberang_ulu)', 'Palembang Seberang Ulu & Jakabaring', 'Seberang Ulu I, SU II,\nJakabaring, Plaju, Kertapati', 'Rp 15.000', 'Hari yang Sama'],
]
add_simple_table(doc, ['Zona ID', 'Label Zona', 'Kecamatan', 'Ongkir', 'Estimasi'], zone_rows, [2.5, 4.0, 4.0, 2.0, 3.0])

doc.add_paragraph()
add_body(doc, 'Sistem secara otomatis menentukan zona dan ongkos kirim berdasarkan kecamatan yang dipilih pengguna. Terdapat pula fitur deteksi kecamatan otomatis dari teks alamat yang diketikkan — sistem akan membandingkan teks alamat dengan daftar kata kunci (KEYWORDS_MAP) dan langsung menyesuaikan zona dan ongkir.')

add_subheading(doc, '4.3.6 Halaman Checkout & Pembayaran COD', level=3, size=12, bold=False)
add_body(doc, 'Halaman checkout menangani seluruh proses pemesanan dari pengisian data hingga konfirmasi pesanan. Sistem CLAYÉ saat ini menggunakan metode pembayaran COD (Cash on Delivery) — pelanggan membayar secara tunai langsung kepada tim CLAYÉ yang mengantar.')

add_body(doc, 'Fitur-fitur halaman checkout:')
add_bullet(doc, 'Buku Alamat: Pengguna yang telah menyimpan alamat dapat langsung memilihnya dari daftar alamat tersimpan (Buku Alamat) untuk mengisi formulir secara otomatis.')
add_bullet(doc, 'Formulir Data Penerima: Nama lengkap, nomor HP/WhatsApp (wajib untuk konfirmasi pengantaran), email (opsional), kecamatan Palembang, alamat lengkap, kode pos, dan patokan lokasi.')
add_bullet(doc, 'Auto-Detect Kecamatan: Saat pengguna mengetik alamat, sistem otomatis mendeteksi nama kecamatan dari teks dan menyesuaikan zona serta ongkos kirim.')
add_bullet(doc, 'Ringkasan Pesanan: Daftar produk yang dicentang di keranjang, subtotal, ongkos kirim sesuai zona, dan total keseluruhan.')
add_bullet(doc, 'Konfirmasi COD: Setelah formulir terisi lengkap, pengguna mengklik tombol "Buat Pesanan COD" (handlePlaceOrder). Sistem mencatat pesanan dengan paymentMethod: "COD (Bayar Tunai di Tempat ke Tim CLAYÉ)".')
add_bullet(doc, 'Halaman Sukses COD: Setelah pesanan berhasil dibuat, tampil halaman konfirmasi yang menginformasikan nomor referensi pesanan, instruksi persiapan uang tunai, dan informasi bahwa tim CLAYÉ akan menghubungi via WhatsApp untuk konfirmasi pengantaran.')

add_placeholder(doc, '[Masukkan Screenshot Halaman Checkout CLAYÉ]')
add_placeholder(doc, '[Masukkan Screenshot Halaman Sukses Pesanan COD]')

add_subheading(doc, '4.3.7 Dashboard Pelanggan (DashboardPage)', level=3, size=12, bold=False)
add_body(doc, 'Setelah berhasil login sebagai pelanggan, pengguna dapat mengakses Dashboard Pelanggan (/akun) yang terdiri dari 6 menu utama:')
add_bullet(doc, 'Overview: Ringkasan akun — jumlah pesanan, item favorit, buku alamat, dan status keanggotaan.')
add_bullet(doc, 'Pesanan Saya (Orders): Riwayat seluruh pesanan yang telah dibuat, termasuk status fulfillment dan detail pesanan.')
add_bullet(doc, 'Tersimpan (Saved/Wishlist): Daftar produk yang disimpan ke wishlist oleh pelanggan.')
add_bullet(doc, 'Profil: Informasi akun, foto profil, nama, email, nomor telepon, dan tombol edit profil.')
add_bullet(doc, 'Buku Alamat (Addresses): Manajemen alamat pengiriman — tambah alamat baru, edit, hapus, dan atur alamat utama yang digunakan untuk auto-fill formulir checkout.')
add_bullet(doc, 'Panduan Perawatan (Care): Panduan merawat produk keramik CLAYÉ agar tetap awet dan terawat.')

add_placeholder(doc, '[Masukkan Screenshot Dashboard Pelanggan]')

add_subheading(doc, '4.3.8 Dashboard Administrator (AdminPage)', level=3, size=12, bold=False)
add_body(doc, 'Administrator dapat mengakses panel administrasi (/admin) setelah login menggunakan akun admin@claye.id. Dashboard admin terdiri dari 6 menu:')
add_bullet(doc, 'Overview: Statistik ringkasan — total pendapatan, jumlah pesanan, pelanggan aktif, dan performa produk.')
add_bullet(doc, 'Manajemen Pesanan (Orders): Daftar seluruh pesanan dari semua pelanggan, dengan kemampuan mengubah status fulfillment dan melihat detail pesanan.')
add_bullet(doc, 'Inventori (Inventory): Manajemen katalog produk dalam 2 tampilan (storefront view dan table view) — admin dapat menambah, mengedit harga, stok, dan detail produk.')
add_bullet(doc, 'Pelanggan (Customers): Daftar seluruh pelanggan terdaftar beserta informasi kontak dan riwayat pesanan.')
add_bullet(doc, 'Analitik (Analytics): Grafik dan data analitik penjualan, produk terlaris, dan tren pemesanan.')
add_bullet(doc, 'Pengaturan (Settings): Konfigurasi sistem dan preferensi toko.')

add_placeholder(doc, '[Masukkan Screenshot Dashboard Administrator]')

add_subheading(doc, '4.3.9 Halaman Tentang CLAYÉ (AboutPage)', level=3, size=12, bold=False)
add_body(doc, 'Halaman About menampilkan profil brand CLAYÉ beserta informasi tim/kurator yang terlibat:')
add_bullet(doc, 'Azwina Clayora — Pendiri & Lead Curator CLAYÉ')
add_bullet(doc, 'Alsywila Adhira — Quality Control')
add_bullet(doc, 'Altaz R. — Logistik & Pengiriman')
add_body(doc, 'Halaman ini juga menceritakan filosofi brand, proses kurasi keramik artisan, dan komitmen CLAYÉ terhadap kualitas produk buatan tangan lokal.')

add_placeholder(doc, '[Masukkan Screenshot Halaman Tentang CLAYÉ]')

add_subheading(doc, '4.4 Alur Transaksi')
add_body(doc, 'Berikut adalah alur transaksi lengkap dalam sistem CLAYÉ dari awal hingga pesanan selesai:')
add_numbered(doc, 'Pengguna membuka aplikasi CLAYÉ dan diarahkan ke halaman Login (/login).')
add_numbered(doc, 'Pengguna melakukan login dengan email dan password yang telah terdaftar (atau mendaftar akun baru melalui tab Register).')
add_numbered(doc, 'Setelah login berhasil, pengguna diarahkan ke Halaman Beranda (/) dan dapat menjelajahi Katalog Produk (/katalog).')
add_numbered(doc, 'Pengguna memilih produk, memilih varian glasir, dan menambahkannya ke Keranjang Belanja.')
add_numbered(doc, 'Di Halaman Keranjang (/keranjang), pengguna dapat mencentang item yang ingin dibeli, mengubah jumlah, mengubah glasir, atau menghapus item.')
add_numbered(doc, 'Pengguna mengklik tombol "Lanjut ke Checkout" untuk melanjutkan ke Halaman Checkout (/checkout).')
add_numbered(doc, 'Di halaman checkout, pengguna mengisi formulir data penerima dan alamat pengiriman di Kota Palembang. Sistem otomatis menentukan zona dan ongkos kirim berdasarkan kecamatan.')
add_numbered(doc, 'Pengguna mengklik tombol "Buat Pesanan COD" untuk mengkonfirmasi pesanan. Sistem mencatat pesanan dengan metode pembayaran COD dan status "Menunggu Pengantaran".')
add_numbered(doc, 'Halaman sukses ditampilkan dengan nomor referensi pesanan dan instruksi COD — siapkan uang tunai, tim CLAYÉ akan menghubungi via WhatsApp untuk konfirmasi waktu pengantaran.')
add_numbered(doc, 'Tim CLAYÉ menghubungi pelanggan, mengantarkan keramik langsung ke alamat, dan pelanggan membayar tunai saat barang diterima.')
add_numbered(doc, 'Admin memperbarui status pesanan di Dashboard Administrator menjadi "Selesai".')
add_numbered(doc, 'Pelanggan dapat melihat riwayat pesanan di Dashboard Pelanggan (/akun) pada menu "Pesanan Saya".')

doc.add_page_break()

# ─── BAB V: PENGUJIAN ─────────────────────────────────────────────────────────
add_heading(doc, 'BAB V', level=1, size=14)
add_heading(doc, 'PENGUJIAN', level=1, size=14)

add_subheading(doc, '5.1 Lingkungan Pengujian')
add_body(doc, 'Pengujian sistem CLAYÉ dilakukan dalam lingkungan berikut:')
add_bullet(doc, 'Browser: Google Chrome (terbaru), Mozilla Firefox, Microsoft Edge')
add_bullet(doc, 'Perangkat: Desktop (Windows 10/11) dan Mobile (Android)')
add_bullet(doc, 'URL Lokal: http://localhost:5173 (Vite development server)')
add_bullet(doc, 'URL Produksi: https://claye-ecommerce.vercel.app')

add_subheading(doc, '5.2 Black Box Testing')
add_body(doc, 'Pengujian dilakukan menggunakan metode Black Box Testing untuk memverifikasi bahwa setiap fitur berjalan sesuai dengan kebutuhan fungsional yang telah ditetapkan.')
doc.add_paragraph()

bb_headers = ['No', 'Skenario Pengujian', 'Input', 'Hasil yang Diharapkan', 'Status']
bb_rows = [
    ['1', 'Login dengan akun belum terdaftar', 'Email: test@test.com, Password: 123456', 'Muncul pesan error "Akun belum terdaftar"', 'LULUS'],
    ['2', 'Login dengan password salah', 'Email: admin@claye.id, Password: salah123', 'Muncul pesan error "Kata sandi salah"', 'LULUS'],
    ['3', 'Login admin berhasil', 'Email: admin@claye.id, Password: atelier2026', 'Diarahkan ke halaman Admin Dashboard', 'LULUS'],
    ['4', 'Registrasi akun baru', 'Isi formulir registrasi dengan data valid', 'Akun terdaftar, diarahkan ke tab login', 'LULUS'],
    ['5', 'Login pelanggan berhasil', 'Email & password yang sudah terdaftar', 'Diarahkan ke Halaman Beranda', 'LULUS'],
    ['6', 'Proteksi rute tanpa login', 'Akses URL /#/ tanpa login', 'Otomatis diarahkan ke halaman login', 'LULUS'],
    ['7', 'Tambah produk ke keranjang', 'Klik "Tambah ke Keranjang" pada produk', 'Produk masuk keranjang, muncul notifikasi sukses', 'LULUS'],
    ['8', 'Seleksi item dengan checkbox', 'Centang/uncentang item di keranjang', 'Subtotal berubah sesuai item yang dicentang', 'LULUS'],
    ['9', 'Ubah glasir dari keranjang', 'Pilih varian glasir lain di halaman keranjang', 'Glasir item berubah, notifikasi muncul', 'LULUS'],
    ['10', 'Tombol Pilih Semua keranjang', 'Klik "Pilih Semua" di keranjang', 'Semua item tercentang sekaligus', 'LULUS'],
    ['11', 'Auto-detect kecamatan dari alamat', 'Ketik "Jl. Jakabaring No 5" di field alamat', 'Kecamatan "Jakabaring" terdeteksi otomatis, zona 3 aktif', 'LULUS'],
    ['12', 'Pilih kecamatan manual & ongkir otomatis', 'Pilih "Sukarami" di dropdown kecamatan', 'Ongkir berubah ke Rp 12.000 (Zona 2)', 'LULUS'],
    ['13', 'Checkout COD dengan data tidak lengkap', 'Klik "Buat Pesanan COD" tanpa isi nama/telepon', 'Muncul pesan error validasi', 'LULUS'],
    ['14', 'Checkout COD berhasil', 'Isi semua data checkout, klik konfirmasi', 'Halaman sukses COD ditampilkan dengan nomor pesanan', 'LULUS'],
    ['15', 'Pilih dari Buku Alamat di checkout', 'Klik alamat tersimpan di halaman checkout', 'Formulir terisi otomatis dari alamat tersimpan', 'LULUS'],
    ['16', 'Tambah alamat baru di dashboard', 'Isi formulir alamat baru di menu "Buku Alamat"', 'Alamat tersimpan dan muncul di daftar', 'LULUS'],
    ['17', 'Tambah produk ke wishlist', 'Klik icon hati pada produk', 'Produk masuk daftar tersimpan, notifikasi muncul', 'LULUS'],
    ['18', 'Admin ubah status pesanan', 'Admin klik ubah status pesanan ke "Selesai"', 'Status pesanan berubah di panel admin', 'LULUS'],
    ['19', 'Admin kelola produk (edit harga)', 'Admin ubah harga produk di menu Inventori', 'Harga produk berhasil diperbarui di katalog', 'LULUS'],
    ['20', 'Logout dari akun', 'Klik tombol Logout', 'Sesi berakhir, diarahkan ke halaman login, keranjang dikosongkan', 'LULUS'],
]
add_simple_table(doc, bb_headers, bb_rows, [0.6, 3.5, 3.5, 4.0, 1.4])

doc.add_paragraph()
doc.add_page_break()

# ─── BAB VI: PENUTUP ──────────────────────────────────────────────────────────
add_heading(doc, 'BAB VI', level=1, size=14)
add_heading(doc, 'PENUTUP', level=1, size=14)

add_subheading(doc, '6.1 Kesimpulan')
add_body(doc, 'Berdasarkan hasil pengembangan dan pengujian sistem e-commerce CLAYÉ, dapat ditarik beberapa kesimpulan:')
add_numbered(doc, 'Platform e-commerce CLAYÉ berhasil dibangun menggunakan React.js 18 dan Vite 5.4 sebagai Single Page Application (SPA) yang dapat diakses melalui browser modern.')
add_numbered(doc, 'Sistem katalog produk dengan 15 jenis keramik artisan berhasil diimplementasikan dengan fitur pemilihan varian glasir per produk, detail produk lengkap, dan kartu produk interaktif.')
add_numbered(doc, 'Keranjang belanja dengan fitur seleksi item menggunakan checkbox, perubahan glasir langsung dari keranjang, dan persistensi data per akun berhasil berfungsi sesuai kebutuhan.')
add_numbered(doc, 'Sistem checkout COD (Cash on Delivery) dengan zona pengiriman berbasis wilayah Kota Palembang (3 zona) berhasil diimplementasikan, termasuk fitur deteksi kecamatan otomatis dari teks alamat dan integrasi Buku Alamat.')
add_numbered(doc, 'Dashboard pelanggan dengan 6 menu (overview, pesanan, tersimpan, profil, buku alamat, perawatan) dan dashboard administrator dengan 6 menu (overview, pesanan, inventori, pelanggan, analitik, pengaturan) berhasil dibangun.')
add_numbered(doc, 'Aplikasi berhasil di-deploy ke Vercel dan dapat diakses secara publik di https://claye-ecommerce.vercel.app.')

add_subheading(doc, '6.2 Saran')
add_body(doc, 'Untuk pengembangan platform CLAYÉ ke depannya, beberapa saran yang dapat dipertimbangkan:')
add_numbered(doc, 'Integrasi payment gateway seperti Xendit atau Doku untuk mendukung metode pembayaran digital (transfer bank, e-wallet, QRIS) sebagai pelengkap COD yang sudah ada.')
add_numbered(doc, 'Implementasi autentikasi berbasis Supabase Auth atau JWT untuk keamanan yang lebih baik dibandingkan penyimpanan password di localStorage.')
add_numbered(doc, 'Pengembangan fitur pelacakan pesanan (order tracking) secara real-time agar pelanggan dapat memantau status pengantaran.')
add_numbered(doc, 'Perluasan cakupan pengiriman ke luar Kota Palembang dengan integrasi API jasa ekspedisi (JNE, J&T, SiCepat) untuk menjangkau pasar yang lebih luas.')
add_numbered(doc, 'Penambahan fitur ulasan dan rating produk oleh pelanggan yang telah melakukan pembelian.')
add_numbered(doc, 'Optimasi performa dengan implementasi lazy loading gambar dan code splitting untuk mempercepat waktu muat halaman.')
add_numbered(doc, 'Pengembangan aplikasi mobile native (Android/iOS) menggunakan React Native untuk pengalaman pengguna mobile yang lebih optimal.')

doc.add_page_break()

# ─── DAFTAR PUSTAKA ───────────────────────────────────────────────────────────
add_heading(doc, 'DAFTAR PUSTAKA', level=1, size=14)
doc.add_paragraph()

refs = [
    'React Team. (2024). React – The library for web and native user interfaces. Meta Open Source. https://react.dev',
    'Vite Team. (2024). Vite: Next Generation Frontend Tooling. https://vitejs.dev',
    'Supabase, Inc. (2024). Supabase Documentation – The Open Source Firebase Alternative. https://supabase.com/docs',
    'Vercel, Inc. (2024). Vercel Documentation – Deploy, Manage, and Monitor your Applications. https://vercel.com/docs',
    'MDN Web Docs. (2024). Window.localStorage. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
    'Turban, E., Outland, J., King, D., Lee, J. K., Liang, T. P., & Turban, D. C. (2018). Electronic Commerce 2018: A Managerial and Social Networks Perspective (9th ed.). Springer.',
    'Remix Software. (2024). React Router – Declarative Routing for React. https://reactrouter.com',
    'GitHub, Inc. (2024). GitHub Documentation – Getting started with GitHub. https://docs.github.com',
]

for i, ref in enumerate(refs, 1):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Cm(1.0)
    p.paragraph_format.first_line_indent = Cm(-1.0)
    run_r = p.add_run(ref)
    run_r.font.name = 'Times New Roman'
    run_r.font.size = Pt(12)

doc.add_page_break()

# ─── LAMPIRAN ─────────────────────────────────────────────────────────────────
add_heading(doc, 'LAMPIRAN', level=1, size=14)
doc.add_paragraph()

add_subheading(doc, 'Lampiran 1: Link Aplikasi dan Repositori')
add_bullet(doc, 'URL Aplikasi (Produksi): https://claye-ecommerce.vercel.app')
add_bullet(doc, 'Repositori GitHub: https://github.com/[username]/claye-ecommerce')
add_bullet(doc, 'Akun Demo Admin: admin@claye.id / atelier2026')

add_subheading(doc, 'Lampiran 2: Screenshot Aplikasi')
add_placeholder(doc, '[Masukkan screenshot halaman Login]')
add_placeholder(doc, '[Masukkan screenshot halaman Beranda]')
add_placeholder(doc, '[Masukkan screenshot Katalog Produk]')
add_placeholder(doc, '[Masukkan screenshot Detail Produk dengan Pilihan Glasir]')
add_placeholder(doc, '[Masukkan screenshot Keranjang Belanja dengan Checkbox Seleksi]')
add_placeholder(doc, '[Masukkan screenshot Halaman Checkout COD]')
add_placeholder(doc, '[Masukkan screenshot Halaman Sukses Pesanan COD]')
add_placeholder(doc, '[Masukkan screenshot Dashboard Pelanggan]')
add_placeholder(doc, '[Masukkan screenshot Dashboard Administrator]')
add_placeholder(doc, '[Masukkan screenshot Halaman Tentang CLAYÉ]')

# ─── SAVE ──────────────────────────────────────────────────────────────────────
doc.save(OUTPUT_PATH)
print(f"[OK] Laporan berhasil disimpan ke: {OUTPUT_PATH}")

try:
    import shutil
    shutil.copy2(OUTPUT_PATH, BACKUP_PATH)
    print(f"[OK] Backup disimpan ke: {BACKUP_PATH}")
except Exception as e:
    print(f"[WARN] Backup gagal: {e}")

print("Selesai!")
