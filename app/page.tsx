'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Package, LayoutGrid, BarChart3, Users, 
  Clock, Truck, ShoppingBag, Handshake, ArrowLeft, 
  Search, Plus, Trash2, X, Check, ArrowRight
} from 'lucide-react';

export default function KasgoPOS() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kasir' | 'produk'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products Data
  const [products, setProducts] = useState([
    { id: 1, name: 'ABC Kecap asin', category: 'Dapur', price: 12000, stock: 9, unit: 'botol' },
    { id: 2, name: 'ABC sambal Extra pedas', category: 'Dapur', price: 1500, stock: 12, unit: 'pcs' },
    { id: 3, name: 'Abc Sambal asli', category: 'Dapur', price: 1500, stock: 12, unit: 'pcs' },
    { id: 4, name: 'Abc kopi susu', category: 'Minuman', price: 2500, stock: 33, unit: 'pcs' },
  ]);

  // Cart & Modals State
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalQty, setModalQty] = useState<number>(1);
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [payAmount, setPayAmount] = useState<string>('2500');

  // New Product Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProd, setNewProd] = useState({ name: '', category: 'Dapur', price: '', stock: '', unit: 'pcs' });

  // Dashboard Stats
  const [salesTotal, setSalesTotal] = useState(486000);
  const [cashierCash, setCashierCash] = useState(61000);
  const [trxCount, setTrxCount] = useState(13);

  // Filter Categories
  const categories = [
    { name: 'Semua Kategori', count: 354 },
    { name: 'Anti Nyamuk', count: 2 },
    { name: 'Badan', count: 18 },
    { name: 'Bayi', count: 4 },
    { name: 'Beras', count: 3 },
    { name: 'Dapur', count: 73 },
    { name: 'Jajanan', count: 71 },
    { name: 'Mandi', count: 15 },
    { name: 'Minuman', count: 42 }
  ];

  // --- HANDLERS ---
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const existing = cart.find(item => item.id === selectedProduct.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === selectedProduct.id 
          ? { ...item, qty: item.qty + modalQty, subtotal: (item.qty + modalQty) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        ...selectedProduct,
        qty: modalQty,
        subtotal: modalQty * selectedProduct.price
      }]);
    }
    setSelectedProduct(null);
  };

  const handleProcessPayment = () => {
    const totalCart = cart.length > 0 ? cart.reduce((sum, item) => sum + item.subtotal, 0) : 2500;
    const paid = Number(payAmount);

    if (paid < totalCart) {
      alert("Uang pembayaran kurang!");
      return;
    }

    // Deduction
    setProducts(products.map(prod => {
      const cartItem = cart.find(c => c.id === prod.id);
      return cartItem ? { ...prod, stock: prod.stock - cartItem.qty } : prod;
    }));

    setSalesTotal(prev => prev + totalCart);
    setCashierCash(prev => prev + totalCart);
    setTrxCount(prev => prev + 1);

    setCart([]);
    setIsPayModalOpen(false);
    alert("Pembayaran Berhasil!");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    setProducts([...products, {
      id: Date.now(),
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      stock: Number(newProd.stock) || 0,
      unit: newProd.unit
    }]);
    setNewProd({ name: '', category: 'Dapur', price: '', stock: '', unit: 'pcs' });
    setIsAddModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'Semua Kategori' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 p-2 font-sans select-none">
      <div className="w-full max-w-md bg-slate-100 rounded-3xl shadow-2xl overflow-hidden h-[820px] flex flex-col border-4 border-slate-800 relative">
        
        {/* HEADER BAR */}
        <header className="bg-slate-700 text-white p-3.5 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            {activeTab !== 'dashboard' && (
              <button onClick={() => setActiveTab('dashboard')} className="hover:opacity-80">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-wide">Kasgo</h1>
              <p className="text-[11px] text-gray-300">
                {activeTab === 'dashboard' ? 'Ringkasan Hari Ini' : activeTab === 'kasir' ? 'Kasir' : 'Kelola Produk'}
              </p>
            </div>
          </div>
          <div className="text-right text-[11px]">
            <p className="font-semibold">15:08</p>
            <p className="text-gray-300">28 Agu 2026</p>
          </div>
        </header>

        {/* BODY CONTAINER */}
        <main className="flex-1 overflow-y-auto p-3.5 bg-slate-100 relative">

          {/* VIEW 1: DASHBOARD (FOTO 1) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Cash Box */}
              <div className="bg-[#608775] text-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-[11px] opacity-90">Uang di Kasir Sekarang</p>
                  <h2 className="text-2xl font-bold">Rp{cashierCash.toLocaleString('id-ID')}</h2>
                </div>
                <span className="text-[10px] bg-slate-700/30 px-2 py-1 rounded-md">1 kasir aktif</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#789d8c] text-white p-3 rounded-2xl">
                  <p className="text-[11px] opacity-90">Penjualan</p>
                  <p className="text-lg font-bold">Rp{salesTotal.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-[#6b8da5] text-white p-3 rounded-2xl">
                  <p className="text-[11px] opacity-90">Transaksi</p>
                  <p className="text-lg font-bold">{trxCount} <span className="text-xs font-normal">transaksi</span></p>
                </div>
                <div className="bg-[#c29653] text-white p-3 rounded-2xl">
                  <p className="text-[11px] opacity-90">Stok Menipis</p>
                  <p className="text-lg font-bold">32 <span className="text-xs font-normal">produk</span></p>
                </div>
                <div className="bg-[#bd6e53] text-white p-3 rounded-2xl">
                  <p className="text-[11px] opacity-90">Pengeluaran</p>
                  <p className="text-lg font-bold">Rp0</p>
                </div>
              </div>

              {/* Menu Grid */}
              <div>
                <h3 className="text-xs font-bold text-gray-700 mb-3">Menu Utama</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setActiveTab('kasir')} className="flex flex-col items-center gap-1 group">
                    <div className="w-14 h-14 bg-[#4ba375] text-white rounded-2xl flex items-center justify-center text-xl shadow-md group-active:scale-95 transition">
                      <ShoppingCart size={24} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700">Kasir</span>
                  </button>
                  <button onClick={() => setActiveTab('produk')} className="flex flex-col items-center gap-1 group">
                    <div className="w-14 h-14 bg-[#b56b27] text-white rounded-2xl flex items-center justify-center text-xl shadow-md group-active:scale-95 transition">
                      <Package size={24} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700">Produk</span>
                  </button>
                  <button onClick={() => setIsCategoryOpen(true)} className="flex flex-col items-center gap-1 group">
                    <div className="w-14 h-14 bg-[#b33b3b] text-white rounded-2xl flex items-center justify-center text-xl shadow-md group-active:scale-95 transition">
                      <LayoutGrid size={24} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700">Kategori</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: KASIR & CATALOG (FOTO 2) */}
          {activeTab === 'kasir' && (
            <div className="flex flex-col h-full space-y-2.5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari nama produk..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-emerald-600"
                />
              </div>

              {/* Category Dropdown Button */}
              <button 
                onClick={() => setIsCategoryOpen(true)}
                className="w-full bg-white p-2.5 border border-gray-200 rounded-xl flex justify-between items-center text-xs text-gray-700 font-medium"
              >
                <span>{selectedCategory}</span>
                <span className="text-gray-400">▼</span>
              </button>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full py-2 bg-white border border-dashed border-emerald-600 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Produk Baru
              </button>

              {/* Products Catalog Grid */}
              <div className="grid grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-0.5">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-2 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="bg-amber-100/70 h-20 rounded-xl flex items-center justify-center font-bold text-amber-900 text-[10px] text-center p-1 uppercase">
                        {p.name.substring(0, 12)}
                      </div>
                      <h4 className="font-bold text-xs mt-1.5 text-gray-800 truncate">{p.name}</h4>
                      <span className="text-[9px] bg-slate-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">{p.category}</span>
                      <p className="text-[10px] text-gray-500 mt-1">Stok: {p.stock} {p.unit}</p>
                      <p className="text-xs font-bold text-gray-900">Rp{p.price.toLocaleString('id-ID')}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(p); setModalQty(1); }}
                      className="mt-2 w-full py-1.5 bg-[#4ba375] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      + Tambah
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Payment Bar */}
              <div className="bg-white p-2.5 border rounded-2xl flex justify-between items-center shadow-md">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Total Keranjang</p>
                  <p className="text-xs font-bold text-emerald-700">
                    Rp{(cart.reduce((s, i) => s + i.subtotal, 0)).toLocaleString('id-ID')}
                  </p>
                </div>
                <button 
                  onClick={() => setIsPayModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Bayar ({cart.reduce((s, i) => s + i.qty, 0)})
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: MANAJEMEN PRODUK */}
          {activeTab === 'produk' && (
            <div className="space-y-3">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full py-2.5 bg-[#b56b27] text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Tambah Produk Baru
              </button>

              <div className="space-y-2">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-3 border rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <h5 className="font-bold text-xs text-gray-800">{p.name}</h5>
                      <p className="text-[10px] text-gray-500">{p.category} • Rp{p.price.toLocaleString('id-ID')} • Stok: {p.stock} {p.unit}</p>
                    </div>
                    <button 
                      onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                      className="p-1.5 text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* MODAL KATEGORI (FOTO 3) */}
        {isCategoryOpen && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col justify-end z-50">
            <div className="bg-white rounded-t-3xl p-4 max-h-[500px] flex flex-col space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-xs text-gray-700">Pilih Kategori</h4>
                <button onClick={() => setIsCategoryOpen(false)}><X size={16} className="text-gray-500" /></button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                <input type="text" placeholder="Cari kategori..." className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-100 rounded-lg border-none" />
              </div>

              <div className="overflow-y-auto flex-1 space-y-1">
                {categories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setSelectedCategory(cat.name); setIsCategoryOpen(false); }}
                    className={`w-full text-left py-2 px-3 text-xs flex justify-between items-center rounded-xl ${selectedCategory === cat.name ? 'bg-slate-200 font-bold' : 'hover:bg-gray-50'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-slate-300/60 px-1.5 py-0.5 rounded text-gray-600">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL QUANTITY (FOTO 4) */}
        {selectedProduct && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center gap-2 border-b pb-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold text-[9px] uppercase p-1">
                  PRODUK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-800">{selectedProduct.name}</h4>
                  <p className="text-[10px] text-gray-500">Rp{selectedProduct.price.toLocaleString('id-ID')} • Stok: {selectedProduct.stock} {selectedProduct.unit}</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
                <span className="text-xs font-semibold text-gray-600">Jumlah</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-7 h-7 bg-amber-500 text-white rounded-lg font-bold text-sm">-</button>
                  <span className="font-bold text-xs">{modalQty}</span>
                  <button onClick={() => setModalQty(Math.min(selectedProduct.stock, modalQty + 1))} className="w-7 h-7 bg-emerald-600 text-white rounded-lg font-bold text-sm">+</button>
                </div>
              </div>

              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-emerald-700">Rp{(modalQty * selectedProduct.price).toLocaleString('id-ID')}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t">
                <button onClick={() => setSelectedProduct(null)} className="py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600">Batal</button>
                <button onClick={handleAddToCart} className="py-2 bg-[#4ba375] text-white rounded-xl text-xs font-semibold shadow">Tambah</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PEMBAYARAN (FOTO 5) */}
        {isPayModalOpen && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-xl space-y-3">
              <h4 className="font-bold text-xs text-gray-800 border-b pb-2">Konfirmasi Pembayaran</h4>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500">Metode Pembayaran</label>
                  <div className="flex gap-2 mt-1">
                    <button className="px-3 py-1 bg-amber-800/10 text-amber-900 border border-amber-800/30 rounded-lg font-bold text-[11px]">Cash</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[11px]">Transfer Bank</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {['Pas', '10K', '20K', '50K', '100K', 'Lainnya'].map((opt, i) => (
                    <button key={i} className="py-1.5 bg-gray-100 text-[10px] font-semibold rounded-lg text-gray-700 hover:bg-gray-200">
                      {opt}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-500">Jumlah Bayar</label>
                  <input 
                    type="number" 
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-emerald-600 mt-1"
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-bold pt-1 border-t">
                  <span>TOTAL</span>
                  <span className="text-gray-800">Rp2.500</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Kembalian</span>
                  <span className="text-emerald-700">Rp0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <button onClick={() => setIsPayModalOpen(false)} className="py-2 border rounded-xl text-xs font-semibold text-gray-600">Batal</button>
                <button onClick={handleProcessPayment} className="py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold shadow">Proses Pembayaran</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL INPUT PRODUK BARU */}
        {isAddModalOpen && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <form onSubmit={handleAddProduct} className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-xl space-y-3">
              <h4 className="font-bold text-xs text-gray-800 border-b pb-2">Tambah Produk Baru</h4>
              <input type="text" placeholder="Nama Produk" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} className="w-full p-2 bg-gray-100 border rounded-xl text-xs" required />
              <input type="number" placeholder="Harga (Rp)" value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full p-2 bg-gray-100 border rounded-xl text-xs" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Stok" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} className="w-full p-2 bg-gray-100 border rounded-xl text-xs" required />
                <input type="text" placeholder="Satuan (botol/pcs)" value={newProd.unit} onChange={e => setNewProd({...newProd, unit: e.target.value})} className="w-full p-2 bg-gray-100 border rounded-xl text-xs" required />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="py-2 border rounded-xl text-xs font-semibold text-gray-600">Batal</button>
                <button type="submit" className="py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold shadow">Simpan</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}