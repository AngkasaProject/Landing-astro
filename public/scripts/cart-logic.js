// src/scripts/cart-logic.js

// --- KONSTANTA & UTILITY ---
const MIN_DISCOUNT_AMOUNT = 300000;
const DISCOUNT_RATE = 0.05; // 5%

const formatRupiah = (number) => {
  // Memastikan format Rupiah Indonesia
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

// --- FUNGSI KERANJANG LOKAL ---

const getCartItems = () => {
  const cartJson = localStorage.getItem('cartItems');
  let items = [];
  try {
    items = cartJson ? JSON.parse(cartJson) : [];
  } catch (e) {
    console.error('Error parsing cartItems from localStorage:', e);
  }
  return Array.isArray(items) ? items : [];
};

const saveCartItems = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));

  // Update cartCount badge (agar badge di header juga ikut berubah)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cartCount', totalCount);
};

// Fungsi untuk menghitung total keranjang
const calculateTotals = (items) => {
  let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;

  if (subtotal >= MIN_DISCOUNT_AMOUNT) {
    discount = subtotal * DISCOUNT_RATE;
  }

  let total = subtotal - discount; // Total = Subtotal - Diskon

  return { subtotal, discount, shipping: 0, total };
};

// --- FUNGSI MANIPULASI ITEM ---

// Fungsi untuk menghapus item (didefinisikan di window agar dapat dipanggil dari onclick HTML)
window.deleteItem = (itemIndex) => {
  if (confirm('Apakah Anda yakin ingin menghapus item ini dari keranjang?')) {
    let cartItems = getCartItems();
    cartItems.splice(itemIndex, 1);
    saveCartItems(cartItems);
    renderCart();
  }
};

// Fungsi untuk mengubah kuantitas (didefinisikan di window agar dapat dipanggil dari onclick HTML)
window.updateQuantity = (itemIndex, change) => {
  let cartItems = getCartItems();
  if (cartItems[itemIndex]) {
    const newQuantity = cartItems[itemIndex].quantity + change;

    if (newQuantity > 0) {
      cartItems[itemIndex].quantity = newQuantity;
      saveCartItems(cartItems);
      renderCart();
    } else {
      // Jika kuantitas menjadi 0 atau kurang, panggil delete
      window.deleteItem(itemIndex);
    }
  }
};

// --- RENDER & DISPLAY ---

// Fungsi untuk membuat template item keranjang
const createCartItemTemplate = (item, index) => {
  const totalPrice = item.price * item.quantity;

  let options = `Ukuran: ${item.size}`;
  if (item.customName || item.customNumber) {
    const name = item.customName ? item.customName.toUpperCase() : 'N/A';
    const number = item.customNumber ? item.customNumber : 'N/A';
    options += ` | Kustom: ${name} / ${number}`;
  }

  // MODIFIKASI KRITIS: Menggunakan item.imageUrl yang disimpan dari header-logic.js
  // Fallback ke gambar placeholder umum jika imageUrl tidak ada
  const itemImageUrl = item.imageUrl || '/asset/images/item-placeholder-default.jpg';

  return `
        <div class="flex items-center bg-white p-4 rounded-xl shadow-lg border border-gray-200">
            <img src="${itemImageUrl}" 
                 alt="${item.name}" 
                 class="h-20 w-20 object-cover rounded-md mr-4 border p-1">
            <div class="flex-grow">
                <h3 class="text-lg font-semibold text-gray-900">${item.name}</h3>
                <p class="text-sm text-gray-600">${options}</p>
                <p class="text-gray-600">${formatRupiah(item.price)} x ${item.quantity}</p>
                <p class="text-sm font-bold text-gray-800 mt-1">Total Item: ${formatRupiah(
                  totalPrice,
                )}</p>
            </div>
            <div class="flex flex-col items-end space-y-2">
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity(${index}, -1)" class="text-gray-500 hover:text-red-600 p-1" aria-label="Kurangi Kuantitas"><i class="fa-solid fa-minus"></i></button>
                    <span class="text-sm font-medium w-4 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" class="text-gray-500 hover:text-red-600 p-1" aria-label="Tambah Kuantitas"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button onclick="deleteItem(${index})" class="text-red-500 hover:text-red-700 text-sm p-1">
                    <i class="fa-solid fa-trash-can mr-1"></i> Hapus
                </button>
            </div>
        </div>
    `;
};

// Fungsi utama untuk me-render keranjang dan ringkasan
const renderCart = () => {
  const cartItems = getCartItems();
  const container = document.getElementById('cart-items-container');
  const subtotalDisplay = document.getElementById('subtotal-display');
  const discountDisplay = document.getElementById('discount-display');
  const totalDisplay = document.getElementById('total-display');
  const checkoutButton = document.getElementById('checkout-button');
  const loadingMessage = document.getElementById('loading-message');
  const emptyCartText = document.getElementById('empty-cart-text');

  if (loadingMessage) {
    loadingMessage.style.display = 'none';
  }

  if (cartItems.length === 0) {
    container.innerHTML = `<p class="text-gray-500 text-center py-10">Keranjang Anda kosong.</p>`;
    subtotalDisplay.textContent = formatRupiah(0);
    discountDisplay.textContent = formatRupiah(0);
    totalDisplay.textContent = formatRupiah(0);
    checkoutButton.disabled = true;
    emptyCartText.classList.remove('hidden');
  } else {
    emptyCartText.classList.add('hidden');
    container.innerHTML = cartItems.map(createCartItemTemplate).join('');
    checkoutButton.disabled = false;

    const { subtotal, discount, total } = calculateTotals(cartItems);

    // Update Ringkasan Pesanan
    subtotalDisplay.textContent = formatRupiah(subtotal);
    discountDisplay.textContent =
      discount > 0 ? `-${formatRupiah(discount)}` : formatRupiah(discount);
    totalDisplay.textContent = formatRupiah(total);
  }
};

// --- FUNGSI CHECKOUT ---

// Fungsi untuk Checkout via WhatsApp
window.checkoutToWhatsapp = () => {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    alert('Keranjang Anda kosong!');
    return;
  }

  const { subtotal, discount, total } = calculateTotals(cartItems);

  let message = 'Halo JersyKita! Saya ingin memesan produk berikut:\n\n';

  cartItems.forEach((item, index) => {
    let options = `Ukuran: ${item.size}`;
    if (item.customName || item.customNumber) {
      const name = item.customName ? item.customName.toUpperCase() : 'Tanpa Nama';
      const number = item.customNumber ? item.customNumber : 'Tanpa Nomor';
      options += `, Kustom: ${name} / ${number}`;
    }

    message += `${index + 1}. ${item.name} (${options})\n`;
    message += `   - Qty: ${item.quantity}\n`;
    message += `   - Harga Item: ${formatRupiah(item.price * item.quantity)}\n`;
  });

  message += '\n--- Ringkasan Pesanan ---\n';
  message += `Subtotal: ${formatRupiah(subtotal)}\n`;
  message += `Diskon: ${discount > 0 ? `-${formatRupiah(discount)}` : 'Rp 0'}\n`;
  message += `Pengiriman: Akan dihitung dan dikonfirmasi oleh admin.\n`;
  message += `------------------------\n`;
  message += `*Perkiraan Total: ${formatRupiah(total)}* (Belum termasuk Ongkir)\n\n`;
  message += 'Mohon diproses segera. Terima kasih!';

  const whatsappNumber = '6285171140818'; // Ganti dengan nomor Anda
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
};

// Panggil fungsi renderCart saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderCart);
