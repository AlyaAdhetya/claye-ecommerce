import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Service Layer untuk interaksi React dengan PostgreSQL / Supabase
 * Jika kredensial Supabase belum diisi, service ini mengembalikan null
 * sehingga ShopContext otomatis menggunakan local state fallback.
 */

export const supabaseService = {
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

  // 4. Simpan Transaksi Pesanan Baru
  async createOrder(orderData, items) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      // Simpan master order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          order_number: orderData.id || `CLY-EXP-${Math.floor(10000 + Math.random() * 90000)}-PLM`,
          user_id: orderData.userId || 2,
          total_items_amount: orderData.total,
          shipping_fee: orderData.shippingFee || 15000,
          grand_total: orderData.grandTotal || (orderData.total + (orderData.shippingFee || 15000)),
          payment_status: orderData.paymentStatus || 'LUNAS',
          payment_method: orderData.paymentMethod || 'Virtual Account (BCA)',
          fulfillment_status: orderData.fulfillment || 'DIPROSES_KURASI',
          courier_name: orderData.courier || 'Pengiriman Reguler (Eco Shield)',
          tracking_number: orderData.trackingNumber,
          recipient_name: orderData.customerName || 'Pelanggan CLAYÉ',
          recipient_phone: orderData.customerPhone || '+62 812-3456-7890',
          shipping_address: orderData.shippingAddress || 'Jl. Sejuta Kenangan, Palembang',
          shipping_city: orderData.city || 'Palembang',
          shipping_postal_code: orderData.postalCode || '30138'
        }])
        .select()
        .single();

      if (orderErr) throw orderErr;

      // Simpan rincian order items
      if (items && items.length > 0) {
        const orderItemsPayload = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
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

  // 5. Ambil Riwayat Pesanan
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

