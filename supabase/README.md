# Panduan Setup PostgreSQL & Supabase untuk CLAYÉ E-Commerce

Dokumen ini menjelaskan langkah-langkah praktis menghubungkan database PostgreSQL di cloud menggunakan **Supabase** dengan aplikasi React **CLAYÉ**.

---

## Langkah 1: Buat Proyek di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan login (bisa menggunakan akun GitHub atau Google).
2. Klik tombol **"New Project"**.
3. Isi informasi proyek:
   * **Name:** `claye-ecommerce`
   * **Database Password:** *(Buat password yang aman dan catat)*
   * **Region:** Pilih `Singapore (ap-southeast-1)` (terdekat dengan Indonesia untuk latensi paling cepat).
4. Klik **"Create new project"** dan tunggu sekitar 1-2 menit hingga database selesai disiapkan.

---

## Langkah 2: Jalankan Skrip Skema & Data Seeding
1. Di dashboard Supabase, buka menu **SQL Editor** (ikon terminal/query di bilah sisi kiri).
2. Klik **"New Query"**.
3. Buka file [supabase/schema.sql](file:///d:/E-COMMERCE/PRAKTIKUM%20E-COMMERCE/claye-ecommerce/supabase/schema.sql), salin seluruh isinya, tempel ke SQL Editor, lalu klik tombol **"Run"**.
   * *Skrip ini akan otomatis membuat 13 tabel (users, artisan_partners, categories, products, glazes, orders, dll.) serta konfigurasi Row Level Security (RLS).*
4. Buat query baru lagi, buka file [supabase/seed.sql](file:///d:/E-COMMERCE/PRAKTIKUM E-COMMERCE/claye-ecommerce/supabase/seed.sql), salin seluruh isinya, tempel ke SQL Editor, lalu klik **"Run"**.
   * *Skrip ini akan mengisi 10 produk kurasi keramik awal, varian warna glasir, akun demo, pengaturan toko di Palembang, dan contoh pesanan.*

---

## Langkah 3: Ambil Kredensial API Supabase
1. Di bilah sisi kiri dashboard Supabase, klik **Project Settings** (ikon gerigi).
2. Pilih submenu **API**.
3. Salin dua nilai penting berikut:
   * **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   * **anon / public key** (kunci panjang yang diawali `eyJhbGciOi...`)

---

## Langkah 4: Hubungkan ke Proyek React
1. Buka file `.env` di direktori utama proyek `claye-ecommerce`.
2. Tempelkan kredensial Anda:
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. Restart server Vite Anda (`npm run dev`).
4. Selesai! Aplikasi React CLAYÉ kini terhubung langsung secara real-time ke database PostgreSQL di Supabase.

