import React, { useState, useEffect, useMemo } from 'react';
import { Search, Copy, Moon, Sun, Star, Eye, Filter, Zap, Crown, X, Menu, ChevronRight } from 'lucide-react';

// --- DATA SAMPLE (Simulasi Gabungan JSON) ---
// Dalam implementasi nyata, Anda akan import file JSON yang sudah dibuat sebelumnya.
// Di sini saya masukkan beberapa sampel dari Standard dan Master untuk demo.

const RAW_DATA = [
  // --- SAMPLE STANDARD PROMPTS ---
  {
    id: 'std-1',
    category: "Content Marketing",
    title: "Kalender Konten 30 Hari",
    prompt: "Saya ingin membangun otoritas di niche [NICHE SPESIFIK]. Bertindaklah sebagai Head of Content. Buatkan saya rencana konten kalender untuk 30 hari penuh...",
    tier: "standard"
  },
  {
    id: 'std-2',
    category: "Penjualan & Closing",
    title": "Menangani Keberatan Harga",
    prompt": "Calon pembeli sering bilang 'Waduh, mahal banget ya'. Bertindaklah sebagai Pelatih Sales. Berikan saya 3 teknik/script...",
    tier: "standard"
  },
   {
    id: 'std-3',
    category: "Copywriting",
    title": "Headline Generator",
    prompt": "Headline adalah 80% kesuksesan iklan. Saya menjual [PRODUK/JASA]. Buatkan 10 opsi headline yang 'mematikan'...",
    tier: "standard"
  },
  {
    id: 'std-4',
    category: "Layanan Pelanggan",
    title": "SOP Komplain",
    prompt": "Buatkan SOP langkah demi langkah untuk tim CS saya dalam menangani pelanggan yang marah besar...",
    tier: "standard"
  },

  // --- SAMPLE MASTER PROMPTS (HIDDEN GEMS) ---
  {
    id: 'mst-1',
    category: "Strategic Planning",
    title: "The War Room: Simulasi Krisis",
    prompt: "## PERAN\nBertindaklah sebagai Chief Strategy Officer (CSO)...\n\n## KONTEKS\nBisnis saya menghadapi ketidakpastian...\n\n## TUGAS\nLakukan 'Scenario Planning' mendalam...",
    tier: "master"
  },
  {
    id: 'mst-2',
    category: "Marketing Psychology",
    title: "Neuromarketing Audit",
    prompt: "## PERAN\nAnda adalah Pakar Neuromarketing...\n\n## TUJUAN\nMengubah pengunjung website menjadi pembeli impulsif...",
    tier: "master"
  },
  {
    id: 'mst-3',
    category: "Leadership",
    title: "The Wartime CEO",
    prompt: "## PERAN\nAnda adalah CEO yang memimpin perusahaan melewati badai resesi...\n\n## TUGAS\nTuliskan Memo/Email Internal kepada seluruh karyawan...",
    tier: "master"
  }
];

// --- COMPONENTS ---

const Modal = ({ isOpen, onClose, title, content, tier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col ${tier === 'master' ? 'bg-slate-900 text-white border border-amber-500/30' : 'bg-white dark:bg-slate-800 dark:text-white'}`}>
        
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center border-b ${tier === 'master' ? 'border-amber-500/20 bg-gradient-to-r from-slate-900 to-slate-800' : 'border-gray-200 dark:border-gray-700'}`}>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${tier === 'master' ? 'text-amber-400' : 'text-gray-900 dark:text-white'}`}>
            {tier === 'master' && <Crown size={20} />}
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed opacity-90">
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${tier === 'master' ? 'border-amber-500/20' : 'border-gray-200 dark:border-gray-700'}`}>
           <button
            onClick={() => {
                navigator.clipboard.writeText(content);
                alert('Prompt disalin!');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                tier === 'master' 
                ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Copy size={16} /> Salin Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

const PromptCard = ({ data, onCopy, onPreview, isFavorite, onToggleFavorite }) => {
  const isMaster = data.tier === 'master';

  return (
    <div className={`group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 hover:shadow-lg ${
      isMaster 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/30 hover:border-amber-500/60 text-white' 
        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 text-gray-800 dark:text-gray-100'
    }`}>
      
      {/* Header Card */}
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-md tracking-wider uppercase ${
            isMaster 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' 
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}>
            {data.category}
          </span>
          <button 
            onClick={() => onToggleFavorite(data.id)}
            className={`transition-colors ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'}`}
          >
            <Star size={20} />
          </button>
        </div>
        <h3 className={`text-lg font-bold leading-tight mb-2 ${isMaster ? 'text-amber-50' : ''}`}>
          {data.title}
        </h3>
        <p className={`text-sm line-clamp-3 ${isMaster ? 'text-slate-300' : 'text-gray-500 dark:text-gray-400'}`}>
          {data.prompt}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-dashed border-opacity-30 border-gray-400">
        <button 
          onClick={() => onPreview(data)}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors ${
            isMaster
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
        >
          <Eye size={16} /> Preview
        </button>
        <button 
          onClick={() => onCopy(data.prompt)}
          className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors ${
            isMaster
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Copy size={16} /> Salin
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function BusinessPromptApp() {
  // State
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' or 'master'
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Initialize Data
  const prompts = useMemo(() => RAW_DATA, []);

  // Effects
  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    
    // Load favorites
    const savedFavs = localStorage.getItem('businessPromptsFavs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('businessPromptsFavs', JSON.stringify(favorites));
  }, [favorites]);

  // Handlers
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Bisa tambah toast notification disini
    alert("Prompt berhasil disalin ke clipboard!");
  };

  // Filter Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter(item => {
      // 1. Filter by Page/Tier
      if (item.tier !== activeTab) return false;

      // 2. Filter by Favorites
      if (showFavoritesOnly && !favorites.includes(item.id)) return false;

      // 3. Filter by Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // 4. Filter by Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) || 
          item.prompt.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [prompts, activeTab, favorites, showFavoritesOnly, selectedCategory, searchQuery]);

  // Extract Categories dynamically based on active tab
  const categories = useMemo(() => {
    const currentTierPrompts = prompts.filter(p => p.tier === activeTab);
    const cats = [...new Set(currentTierPrompts.map(p => p.category))];
    return ['All', ...cats.sort()];
  }, [prompts, activeTab]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-slate-800'}`}>
      
      {/* --- NAVBAR --- */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight hidden sm:block">BizPrompt <span className="text-blue-500">Pro</span></h1>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => { setActiveTab('standard'); setSelectedCategory('All'); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'standard' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
              >
                Koleksi Standar
              </button>
              <button 
                onClick={() => { setActiveTab('master'); setSelectedCategory('All'); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'master' ? 'bg-slate-900 text-amber-500 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
              >
                <Crown size={16} />
                CEO Mode
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2 rounded-full transition-colors ${showFavoritesOnly ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500'}`}
                title="Favorit Saya"
              >
                <Star size={20} className={showFavoritesOnly ? "fill-current" : ""} />
              </button>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                title="Mode Gelap/Terang"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Tab (Visible only on small screens) */}
        <div className="md:hidden px-4 pb-3 flex gap-2">
            <button 
                onClick={() => { setActiveTab('standard'); setSelectedCategory('All'); }}
                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'standard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            >
                Standar
            </button>
            <button 
                onClick={() => { setActiveTab('master'); setSelectedCategory('All'); }}
                className={`flex-1 py-2 text-sm font-medium border-b-2 flex justify-center items-center gap-2 transition-colors ${activeTab === 'master' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500'}`}
            >
                <Crown size={14} /> CEO Mode
            </button>
        </div>
      </nav>

      {/* --- HERO / HEADER AREA --- */}
      <div className={`py-10 px-4 text-center border-b ${activeTab === 'master' ? 'bg-slate-900 border-amber-900/30' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'}`}>
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${activeTab === 'master' ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
            {activeTab === 'master' ? 'Hidden Gems Strategy Lab' : 'Business Prompt Library'}
          </h2>
          <p className={`text-lg mb-8 ${activeTab === 'master' ? 'text-slate-400' : 'text-gray-600 dark:text-gray-300'}`}>
            {activeTab === 'master' 
              ? 'Koleksi prompt strategis tingkat tinggi untuk perencanaan mendalam dan penyelesaian masalah kompleks.' 
              : '750+ Prompt siap pakai untuk operasional, marketing, dan penjualan sehari-hari.'}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'master' ? "Cari strategi krisis, negosiasi..." : "Cari ide konten, caption, email..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 transition-shadow ${
                activeTab === 'master'
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-amber-500 focus:border-transparent'
                : 'bg-gray-100 dark:bg-slate-700 border-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          <Filter size={18} className="text-gray-400 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? (activeTab === 'master' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white')
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {filteredPrompts.length > 0 ? (
          <div className={`grid grid-cols-1 gap-6 ${activeTab === 'master' ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredPrompts.map((item) => (
              <PromptCard 
                key={item.id} 
                data={item} 
                onCopy={handleCopy}
                onPreview={setPreviewData}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada prompt ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400">Coba ubah kata kunci pencarian atau kategori.</p>
          </div>
        )}
      </main>

      {/* --- MODAL PREVIEW --- */}
      {previewData && (
        <Modal 
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
          title={previewData.title}
          content={previewData.prompt}
          tier={previewData.tier}
        />
      )}

      {/* CSS for custom scrollbar if needed */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}


