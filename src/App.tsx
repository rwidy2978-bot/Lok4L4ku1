import { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Star,
  ChevronRight,
  ArrowRight,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Data ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kripik Singkong Gurih RW.04",
    price: 15000,
    description: "Kripik singkong renyah buatan warga RW.04 Tegal Parang dengan bumbu rahasia.",
    image: "https://images.unsplash.com/photo-1599490659223-915247301c20?auto=format&fit=crop&q=80&w=400",
    category: "Camilan"
  },
  {
    id: 2,
    name: "Sambal Bawang Mpok Lela",
    price: 25000,
    description: "Sambal bawang asli buatan Mpok Lela, pedasnya nendang dan tahan lama.",
    image: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?auto=format&fit=crop&q=80&w=400",
    category: "Bumbu"
  },
  {
    id: 3,
    name: "Teh Bunga Telang Segar",
    price: 12000,
    description: "Minuman kesehatan dari bunga telang organik yang ditanam di pekarangan warga.",
    image: "https://images.unsplash.com/photo-1594631252845-29fc45862080?auto=format&fit=crop&q=80&w=400",
    category: "Minuman"
  },
  {
    id: 4,
    name: "Tas Anyaman Pandan",
    price: 85000,
    description: "Tas anyaman elegan hasil kerajinan tangan ibu-ibu PKK Tegal Parang.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
    category: "Kerajinan"
  },
  {
    id: 5,
    name: "Madu Alami Tegal Parang",
    price: 120000,
    description: "Madu murni dari peternakan lebah lokal, tanpa bahan pengawet.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
    category: "Kesehatan"
  },
  {
    id: 6,
    name: "Kue Kering Home-made",
    price: 45000,
    description: "Kue kering lezat yang dibuat dengan bahan berkualitas oleh UMKM RW.04.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400",
    category: "Camilan"
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Ibu Rahayu",
    text: "Produk olahan warga RW.04 kualitasnya jempolan. Kripiknya sangat renyah dan harganya terjangkau!",
    role: "Warga Sekitar"
  },
  {
    id: 2,
    name: "Pak Budi",
    text: "Madu alaminya benar-benar murni. Sangat membantu menjaga kesehatan keluarga saya. Sukses terus Lok4L4ku!",
    role: "Pelanggan Tetap"
  },
  {
    id: 3,
    name: "Siska",
    text: "Tas anyamannya cantik sekali, pas buat dibawa kondangan. Bangga bisa pakai produk UMKM Tegal Parang.",
    role: "Pelanggan"
  }
];

// --- Main Component ---
export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lok4l4ku_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  useEffect(() => {
    localStorage.setItem('lok4l4ku_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cart]
  );

  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => 
    activeCategory === "Semua" 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === activeCategory),
    [activeCategory]
  );

  const handleWhatsAppCheckout = () => {
    if (!customerName || !customerAddress) {
      alert("Mohon isi nama dan alamat lengkap!");
      return;
    }

    const cartDetails = cart.map(item => 
      `- ${item.name} (${item.quantity}x): Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('%0A');

    const message = `*PESANAN BARU - LOK4L4KU*%0A%0A` +
      `*Nama:* ${customerName}%0A` +
      `*Alamat:* ${customerAddress}%0A%0A` +
      `*Detail Pesanan:*%0A${cartDetails}%0A%0A` +
      `*Total Bayar:* Rp ${cartTotal.toLocaleString('id-ID')}%0A%0A` +
      `Mohon segera diproses ya, Admin! Terima kasih.`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after redirect (optional)
    // setCart([]);
    // setIsCheckoutOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const categories = ["Semua", ...new Set(PRODUCTS.map(p => p.category))];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink font-sans">
      {/* --- Navbar --- */}
      <nav id="home" className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-serif font-bold text-brand-olive tracking-tight">Lok4L4ku</span>
              <span className="ml-2 text-[10px] font-bold text-stone-400 hidden sm:block uppercase tracking-widest">RW.04 TEGAL PARANG</span>
            </div>
            
            <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
              <a href="#home" className="hover:text-brand-olive transition-colors underline-offset-4 hover:underline">Beranda</a>
              <a href="#katalog" className="hover:text-brand-olive transition-colors underline-offset-4 hover:underline">Katalog</a>
              <a href="#testimoni" className="hover:text-brand-olive transition-colors underline-offset-4 hover:underline">Testimoni</a>
              <a href="#kontak" className="hover:text-brand-olive transition-colors underline-offset-4 hover:underline">Kontak</a>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-600 hover:text-brand-olive transition-colors"
                id="cart-btn-desktop"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-terracotta text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2"
                id="cart-btn-mobile"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 text-lg font-medium">
                <a href="#home" onClick={() => setIsMenuOpen(false)} className="block py-4 border-b border-stone-50">Beranda</a>
                <a href="#katalog" onClick={() => setIsMenuOpen(false)} className="block py-4 border-b border-stone-50">Katalog</a>
                <a href="#testimoni" onClick={() => setIsMenuOpen(false)} className="block py-4 border-b border-stone-50">Testimoni</a>
                <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="block py-4">Kontak</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative py-16 lg:py-28 overflow-hidden bg-brand-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block px-4 py-1.5 bg-brand-olive/10 rounded-full text-brand-olive text-xs font-bold uppercase tracking-widest mb-6">
                  Kebanggaan RW.04 Tegal Parang
                </div>
                <h1 className="text-5xl lg:text-7xl font-serif font-bold text-brand-ink leading-[1.1] mb-6">
                  Produk <span className="text-brand-olive italic">Lokal</span> Kualitas <span className="relative">
                    Unggul
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-brand-terracotta/20 -z-10"></span>
                  </span>
                </h1>
                <p className="text-lg text-stone-600 mb-10 max-w-lg leading-relaxed font-light">
                  Mendukung ekonomi warga melalui produk lokal berkualitas tinggi. Dari tangan terampil Tegal Parang, langsung ke rumah Anda.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#katalog" 
                    className="px-10 py-5 bg-brand-olive text-white rounded-xl font-bold flex items-center hover:opacity-90 transition-all shadow-xl hover:-translate-y-1"
                  >
                    Mulai Belanja <ArrowRight className="ml-2" size={20} />
                  </a>
                  <a 
                    href="#kontak" 
                    className="px-10 py-5 border-2 border-stone-300 rounded-xl font-bold flex items-center hover:bg-white transition-all text-brand-ink"
                  >
                    Hubungi Admin
                  </a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200" 
                    alt="Handicraft" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-10 flex flex-col justify-end">
                    <span className="text-white/80 text-xs font-bold mb-2 tracking-[0.2em] uppercase">Edisi Terbatas</span>
                    <h3 className="text-white text-3xl font-serif font-bold">Koleksi Anyaman PKK RW.04</h3>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/30 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-primary/20 rounded-full blur-3xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Product Catalog --- */}
        <section id="katalog" className="py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="text-brand-terracotta font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">Pilihan Terbaik</span>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-ink mb-6">Katalog Produk Unggulan</h2>
                <p className="text-stone-500 leading-relaxed font-light">
                  Mendukung usaha kecil di lingkungan kita. Setiap pembelian Anda sangat berarti bagi keberlangsungan ekonomi warga RW.04 Tegal Parang.
                </p>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                      activeCategory === cat 
                        ? "bg-brand-olive border-brand-olive text-white shadow-lg shadow-brand-olive/20" 
                        : "bg-white border-stone-200 text-stone-400 hover:border-stone-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-500"
                  >
                    <div className="relative aspect-square overflow-hidden bg-stone-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-lg text-[9px] font-black text-brand-terracotta uppercase tracking-widest shadow-sm">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-serif font-bold text-brand-ink mb-3 truncate">{product.name}</h3>
                      <p className="text-stone-500 text-sm mb-8 font-light line-clamp-2 leading-relaxed h-10">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Harga</span>
                          <span className="text-xl font-bold text-brand-terracotta">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-brand-olive text-white w-12 h-12 rounded-lg flex items-center justify-center hover:opacity-90 transition-all shadow-sm active:scale-90"
                          title="Tambah ke keranjang"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* --- Testimonials --- */}
        <section id="testimoni" className="py-28 bg-brand-cream overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-serif font-bold text-brand-ink mb-4">Suara Warga RW.04</h2>
              <p className="text-stone-500 font-light italic">Membangun kepercayaan melalui kualitas nyata.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {TESTIMONIALS.map((t, idx) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white p-10 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex text-brand-terracotta mb-6 gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-stone-600 font-light italic leading-relaxed mb-8">"{t.text}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-brand-olive text-white flex items-center justify-center font-serif text-xl font-bold shadow-lg shadow-brand-olive/20">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-ink">{t.name}</h4>
                      <p className="text-[10px] text-brand-terracotta uppercase tracking-widest font-bold">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Contact & Location --- */}
        <section id="kontak" className="py-28 bg-brand-olive text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-brand-terracotta font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Kontak Admin</span>
                <h2 className="text-5xl lg:text-6xl font-serif font-bold mb-10 leading-tight italic">Tegal Parang <br/>Berdaya.</h2>
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                      <MapPin size={28} className="text-brand-terracotta" />
                    </div>
                    <h4 className="text-lg font-bold">Lokasi</h4>
                    <p className="text-stone-300 text-sm leading-relaxed">Sekretariat RW.04,<br/>Tegal Parang Selatan,<br/>Jakarta Selatan.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                      <Phone size={28} className="text-brand-terracotta" />
                    </div>
                    <h4 className="text-lg font-bold">WhatsApp</h4>
                    <p className="text-stone-300 text-sm leading-relaxed">Aktif Setiap Hari<br/>+62 812-3456-7890</p>
                  </div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white text-stone-800 p-10 lg:p-14 rounded-3xl shadow-2xl"
              >
                <h3 className="text-3xl font-serif font-bold mb-8 text-brand-ink">Kirim Pesan</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2 text-brand-terracotta">
                    <label className="text-[10px] font-bold uppercase tracking-widest block pl-2">Nama</label>
                    <input type="text" className="w-full bg-stone-50 border-none rounded-xl px-6 py-4 focus:ring-4 focus:ring-brand-olive/10 transition-all outline-none" placeholder="Nama Anda" />
                  </div>
                  <div className="space-y-2 text-brand-terracotta">
                    <label className="text-[10px] font-bold uppercase tracking-widest block pl-2">Pesan</label>
                    <textarea rows={4} className="w-full bg-stone-50 border-none rounded-xl px-6 py-4 focus:ring-4 focus:ring-brand-olive/10 transition-all outline-none resize-none" placeholder="Apa yang ingin disampaikan?"></textarea>
                  </div>
                  <button className="w-full py-5 bg-brand-olive text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl">
                    Kirim Pesan <ArrowRight size={20} />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-stone-900 text-white py-16 border-t border-stone-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div>
              <span className="text-3xl font-serif font-bold text-brand-terracotta tracking-tight">Lok4L4ku</span>
              <p className="text-stone-500 text-xs mt-3 tracking-wide">Mendukung UMKM RW.04 Tegal Parang.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <a href="#home" className="hover:text-brand-terracotta transition-colors">Beranda</a>
              <a href="#katalog" className="hover:text-brand-terracotta transition-colors">Katalog</a>
              <a href="#testimoni" className="hover:text-brand-terracotta transition-colors">Testimoni</a>
              <a href="#kontak" className="hover:text-brand-terracotta transition-colors">Kontak</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Cart Sidebar --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-olive z-[70] shadow-2xl flex flex-col text-white"
              id="cart-drawer"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl text-brand-olive shadow-lg">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold">Keranjang Anda</h2>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{cartCount} Pilihan Warga</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-10">
                    <h3 className="text-xl font-serif font-bold mb-3">Belum ada produk</h3>
                    <p className="text-white/60 text-sm font-light">Dukung ekonomi RW.04 dengan memilih produk lokal kami.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group pb-6 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400"><Trash2 size={14}/></button>
                        </div>
                        <p className="text-brand-terracotta font-bold text-xs mt-1">{formatCurrency(item.price)}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-1 px-2 text-xs">
                            <button onClick={() => updateQuantity(item.id, -1)}><Minus size={12}/></button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={12}/></button>
                          </div>
                          <span className="text-[10px] text-white/40">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-black/10 border-t border-white/10 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest block mb-1">Total</span>
                      <span className="text-3xl font-serif font-bold">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-white text-brand-olive rounded-xl font-bold hover:opacity-90 transition-all shadow-xl"
                  >
                    Pesan Via WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Checkout Modal --- */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white"
            >
              <div className="p-10 border-b border-stone-50 bg-stone-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Checkout</h2>
                    <p className="text-stone-500 font-light text-sm italic">Hampir selesai! Selesaikan data pengiriman Anda.</p>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-stone-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block pl-3">Nama Lengkap Penerima</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-50 border-2 border-transparent rounded-[1.25rem] px-6 py-4 focus:bg-white focus:border-brand-primary/20 transition-all outline-none font-medium" 
                      placeholder="Nama Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block pl-3">Alamat Pengantaran (RW.04 Area)</label>
                    <textarea 
                      rows={3} 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-stone-50 border-2 border-transparent rounded-[1.25rem] px-6 py-4 focus:bg-white focus:border-brand-primary/20 transition-all outline-none resize-none font-medium" 
                      placeholder="Cth: RT.005/RW.04 No. 2..."
                    />
                  </div>
                </div>

                <div className="bg-brand-primary text-white p-8 rounded-[2rem] shadow-xl shadow-brand-primary/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Total Pesanan</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{cartCount} Item</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-4xl font-serif font-bold">{formatCurrency(cartTotal)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent italic">Tunai Saat Antar</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-5 bg-[#25D366] text-white rounded-[1.25rem] font-bold hover:brightness-105 transition-all shadow-xl flex items-center justify-center gap-4 text-xl"
                  >
                    <MessageCircle size={30} /> Kirim via WhatsApp
                  </button>
                  <p className="text-[9px] text-stone-400 text-center font-bold uppercase tracking-widest">
                    Pesan akan otomatis terkirim sebagai format teks ke Admin
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
