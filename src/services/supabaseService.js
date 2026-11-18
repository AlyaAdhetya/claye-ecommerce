import { supabase, isSupabaseConfigured, getSupabaseConfig } from '../lib/supabaseClient';

/**
 * Service Layer untuk interaksi React dengan PostgreSQL / Supabase
 * Jika kredensial Supabase belum diisi, service ini mengembalikan null
 * sehingga ShopContext otomatis menggunakan local state fallback.
 */

export const supabaseService = {
  // 0. Tes Koneksi Supabase
  async testConnection() {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, message: 'Supabase belum dikonfigurasi (URL / Anon Key kosong).' };
    }
    try {
      const { data, error } = await supabase.from('store_settings').select('id, store_name').limit(1);
      if (error) throw error;
      return { success: true, message: 'Koneksi ke Supabase berhasil!', data };
    } catch (err) {
      return { success: false, message: err.message || 'Gagal terhubung ke Supabase.' };
    }
  },

  // 1. Ambil Semua Produk Kurasi
  async getProducts() {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          artisan_partners (studio_name, region_origin),
          product_glazes (id, glaze_name, hex_preview, finish_type)
        `)
        .order('id', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase getProducts warning:', err.message);
      return null;
    }
  },

  // 2. Tambah Produk Baru ke Katalog (Admin)
  async addProduct(productData) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          subtitle: productData.subtitle,
          price: productData.price,
          stock: productData.stock || 12,
          category_id: productData.category_id || 1,
          description: productData.description,
          badge: productData.badge || 'baru',
          image_url: productData.image || '/assets/images/product_mug.jpg'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase addProduct warning:', err.message);
      return null;
    }
  },

  // 3. Update Stok Produk
  async updateStock(productId, newStock) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ stock: Math.max(0, newStock) })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase updateStock warning:', err.message);
      return null;
    }
  },

  // 4. Simpan Transaksi Pesanan Baru dari Pelanggan
  async createOrder(orderData, items) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      // Pemetaan status pembayaran sesuai CHECK constraint PostgreSQL Supabase
      let dbPaymentStatus = 'LUNAS';
      const pLower = (orderData.paymentStatus || '').toLowerCase();
      if (pLower.includes('menunggu')) {
        dbPaymentStatus = 'MENUNGGU_PEMBAYARAN';
      } else if (pLower.includes('batal')) {
        dbPaymentStatus = 'DIBATALKAN';
      }

      // Pemetaan status fulfillment sesuai CHECK constraint PostgreSQL Supabase
      let dbFulfillmentStatus = 'DIPROSES_KURASI';
      const fLower = (orderData.fulfillment || '').toLowerCase();
      if (fLower.includes('selesai')) {
        dbFulfillmentStatus = 'SELESAI';
      } else if (fLower.includes('kirim')) {
        dbFulfillmentStatus = 'DIKIRIM';
      } else if (fLower.includes('menunggu')) {
        dbFulfillmentStatus = 'MENUNGGU_KONFIRMASI';
      }

      const recipientName = orderData.patron || orderData.customerName || 'Pelanggan CLAYÉ';
      const recipientPhone = orderData.phone || orderData.customerPhone || '-';
      const shippingAddress = orderData.address || orderData.shippingAddress || 'Kota Palembang';
      const city = orderData.city || 'Palembang';

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          order_number: orderData.id || `CLY-COD-${Math.floor(10000 + Math.random() * 90000)}-PLM`,
          user_id: orderData.userId || 1, // Hubungkan ke relasi users(id) di Supabase
          total_items_amount: orderData.total,
          shipping_fee: orderData.shippingFee || 8000,
          grand_total: orderData.grandTotal || (orderData.total + (orderData.shippingFee || 8000)),
          payment_status: dbPaymentStatus,
          payment_method: orderData.paymentMethod || 'COD (Bayar Tunai di Tempat)',
          fulfillment_status: dbFulfillmentStatus,
          courier_name: orderData.courier || 'Antar Mandiri Tim CLAYÉ',
          tracking_number: orderData.trackingNumber || orderData.id,
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          shipping_address: shippingAddress,
          shipping_city: city,
          shipping_postal_code: orderData.postalCode || '30138'
        }])
        .select()
        .single();

      if (orderErr) {
        console.warn('Supabase insert orders gagal:', orderErr.message);
        throw orderErr;
      }

      if (items && items.length > 0 && order) {
        const orderItemsPayload = items.map(item => ({
          order_id: order.id,
          product_id: typeof item.id === 'number' ? item.id : null,
          product_name_snapshot: item.name,
          glaze_name_snapshot: item.selectedGlaze || 'Default',
          custom_stamp_snapshot: item.stamp || null,
          quantity: item.quantity,
          unit_price_snapshot: item.price,
          subtotal: item.price * item.quantity
        }));

        await supabase.from('order_items').insert(orderItemsPayload);
      }

      return order;
    } catch (err) {
      console.warn('Supabase createOrder warning:', err.message);
      return null;
    }
  },

  // 5. Ambil Semua Pesanan (Terintegrasi Admin & Pelanggan)
  async getOrders() {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('id', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase getOrders warning:', err.message);
      return null;
    }
  },

  // 6. Ambil Pengaturan Toko (CLAYÉ Palembang)
  async getStoreSettings() {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase getStoreSettings warning:', err.message);
      return null;
    }
  },

  // 7. Perbarui Pengaturan Toko
  async updateStoreSettings(settings) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .update(settings)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase updateStoreSettings warning:', err.message);
      return null;
    }
  }
};
