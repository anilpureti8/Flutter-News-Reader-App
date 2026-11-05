import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Code2,
  FolderTree,
  CheckCircle2,
  Copy,
  Check,
  Download,
  RotateCcw,
  RefreshCw,
  Search,
  Bookmark,
  BookmarkCheck,
  Star,
  ExternalLink,
  ChevronLeft,
  Trash2,
  AlertCircle,
  FileText,
  Palette,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from './data/flutterFiles';

// Simulated article type
interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  sourceName: string;
  author: string;
  publishedAt: string;
  category: string;
  readTime: number;
}

// Simulated bookmark note type
interface BookmarkNote {
  id: string;
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  articleImageUrl: string;
  articleSource: string;
  noteTitle: string;
  personalNotes: string;
  category: string;
  rating: number;
  tags: string[];
  updatedAt: string;
}

const SAMPLE_ARTICLES: Record<string, Article[]> = {
  general: [
    {
      id: 'gen_1',
      title: 'Deep Ocean Mapping Project Uncovers Over 19,000 Uncharted Underwater Volcanoes',
      description: 'High-resolution satellite altimetry reveals geological features essential for understanding ocean currents and tectonic hazards.',
      content: 'Oceanographers using high-accuracy radar altimetry from European Space Agency satellites have published the most detailed seafloor map in history. Over 19,000 previously unrecorded undersea volcanoes and seamounts were charted, drastically refining models of oceanic thermal circulation.',
      url: 'https://example.com/deep-ocean-mapping',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Global Geographic',
      author: 'Diane Ross',
      publishedAt: '2 hours ago',
      category: 'general',
      readTime: 4,
    },
    {
      id: 'gen_2',
      title: 'International Summit Ratifies Universal Framework for Ethical Autonomous Systems',
      description: 'Envoys from 74 nations establish binding protocols on verification standards, audit transparency, and safety fallbacks.',
      content: 'Delegates in Geneva successfully concluded negotiations on the Universal Charter for Autonomous Systems. The agreement guarantees human override capabilities in safety-critical civic infrastructure and establishes independent inspection boards.',
      url: 'https://example.com/autonomous-systems-summit',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      sourceName: 'World Affairs Daily',
      author: 'Jean-Luc Moreau',
      publishedAt: '4 hours ago',
      category: 'general',
      readTime: 5,
    },
    {
      id: 'gen_3',
      title: 'Sustainable Architecture: Timber Skyscrapers Cut Embodied Carbon by 60%',
      description: 'Cross-laminated timber innovations enable fire-rated multi-story towers with negative net lifecycle carbon footprint.',
      content: 'Urban planners are celebrating the completion of a 32-story mass-timber tower in Stockholm. Engineered cross-laminated timber beams withstand seismic stresses comparable to reinforced concrete while sequestering thousands of tons of atmospheric carbon.',
      url: 'https://example.com/timber-skyscrapers-carbon',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Architectural Digest',
      author: 'Sofia Lindqvist',
      publishedAt: '6 hours ago',
      category: 'general',
      readTime: 3,
    },
  ],
  technology: [
    {
      id: 'tech_1',
      title: 'Quantum Leap: Next-Gen Photonic Processors Break Efficiency Barrier',
      description: 'Researchers demonstrate room-temperature optical computing running at 10x lower thermal envelope than silicon transistors.',
      content: 'In a landmark paper published this morning, semiconductor engineers revealed working prototypes of all-optical logic gates operating at sub-picosecond speeds. The architecture achieves unprecedented energy efficiency for large-scale mathematical computations.',
      url: 'https://example.com/quantum-photonic-breakthrough',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      sourceName: 'TechChronicle',
      author: 'Dr. Elena Vance',
      publishedAt: '1 hour ago',
      category: 'technology',
      readTime: 4,
    },
    {
      id: 'tech_2',
      title: 'Flutter 3.35 Unleashed: Deep Material 3 Integration and Impeller Upgrades',
      description: 'The latest release brings enhanced performance across Android devices, deterministic rendering pipelines, and unified design token APIs.',
      content: 'Google has released Flutter 3.35, marking a pivotal milestone for mobile cross-platform developers. Highlights include complete Vulkan Impeller maturity on Android, adaptive desktop scaffolds, zero-jank frame scheduling, and modernized FlexColorScheme tooling that makes theming frictionless.',
      url: 'https://example.com/flutter-latest-milestone',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Mobile Dev Weekly',
      author: 'Marcus Chen',
      publishedAt: '3 hours ago',
      category: 'technology',
      readTime: 6,
    },
  ],
  business: [
    {
      id: 'biz_1',
      title: 'Global Supply Chains Rebalance Toward Regional Manufacturing Hubs',
      description: 'Multinational corporations accelerate multi-shoring strategies, investing heavily in automated domestic facilities.',
      content: 'Corporate procurement leaders report significant shifts away from single-source manufacturing. Capital expenditure records show over $400 billion allocated to localized fabrication facilities across North America and Europe.',
      url: 'https://example.com/supply-chain-rebalance',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Financial Horizon',
      author: 'Sarah Sterling',
      publishedAt: '3 hours ago',
      category: 'business',
      readTime: 5,
    },
  ],
  science: [
    {
      id: 'sci_1',
      title: 'James Webb Space Telescope Identifies Atmospheric Water on Habitable Zone Exoplanet',
      description: 'Spectroscopic analysis of planet K2-18b confirms thick water vapor clouds and organic precursor molecules.',
      content: 'Astrophysicists analyzing transmission spectra collected during three separate planetary transits have confirmed high-confidence atmospheric water vapor signatures. The findings intensify international focus on temperate sub-Neptune worlds.',
      url: 'https://example.com/exoplanet-atmosphere-water',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Astrophysics Review',
      author: 'Prof. Maya Thorne',
      publishedAt: '2 hours ago',
      category: 'science',
      readTime: 4,
    },
  ],
  health: [
    {
      id: 'hlth_1',
      title: 'Circadian Light Optimization Correlated with 30% Deeper Sleep Phases',
      description: 'Controlled clinical study reveals spectral light shifts during evening hours significantly improve restorative neurological phases.',
      content: 'A comprehensive study tracking 2,400 participants over six months demonstrated that minimizing 460nm wavelength illumination after sunset stimulates endogenous melatonin pathways, resulting in measurably improved cognitive recovery scores.',
      url: 'https://example.com/circadian-sleep-study',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Health & Neuroscience',
      author: 'Clara Oswald, M.D.',
      publishedAt: '5 hours ago',
      category: 'health',
      readTime: 3,
    },
  ],
  entertainment: [
    {
      id: 'ent_1',
      title: 'Acoustic Masterclass: How Analog Vinyl Production Reached Record Highs in 2026',
      description: 'Audiophiles and young listeners alike drive resurgence in physical microgroove pressings and dedicated listening rooms.',
      content: 'Industry metrics show record pressings surged 42% year-over-year, leading historic pressing plants in Nashville and Prague to commission modern hydraulic stampers to meet unprecedented global demand.',
      url: 'https://example.com/vinyl-production-renaissance',
      imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      sourceName: 'Culture Dispatch',
      author: 'Theo Sterling',
      publishedAt: '7 hours ago',
      category: 'entertainment',
      readTime: 4,
    },
  ],
};

const SEED_COLORS = [
  { name: 'Indigo', hex: '#1E40AF', bgClass: 'bg-blue-800', lightBg: '#EEF2FF', lightBorder: '#C7D2FE' },
  { name: 'Teal', hex: '#0D9488', bgClass: 'bg-teal-600', lightBg: '#F0FDFA', lightBorder: '#99F6E4' },
  { name: 'Crimson', hex: '#BE123C', bgClass: 'bg-rose-700', lightBg: '#FFF1F2', lightBorder: '#FECDD3' },
  { name: 'Violet', hex: '#6D28D9', bgClass: 'bg-purple-700', lightBg: '#F5F3FF', lightBorder: '#DDD6FE' },
  { name: 'Amber', hex: '#B45309', bgClass: 'bg-amber-600', lightBg: '#FFFBEB', lightBorder: '#FDE68A' },
];

export default function App() {
  // Mobile Simulator State
  const [currentScreen, setCurrentScreen] = useState<'list' | 'detail' | 'form' | 'bookmarks'>('list');
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(SAMPLE_ARTICLES.general[0]);
  const [editingNote, setEditingNote] = useState<BookmarkNote | null>(null);

  // 4 States for Article List Screen
  const [listState, setListState] = useState<'data' | 'loading' | 'error' | 'empty'>('data');
  const [errorMessage, setErrorMessage] = useState('Network socket timeout. Check connection and tap Retry.');

  // Bookmarks / Local Notes state (persisted to localStorage)
  const [bookmarks, setBookmarks] = useState<BookmarkNote[]>(() => {
    try {
      const saved = localStorage.getItem('flutter_news_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'initial_1',
        articleId: 'tech_2',
        articleTitle: 'Flutter 3.35 Unleashed: Deep Material 3 Integration and Impeller Upgrades',
        articleUrl: 'https://example.com/flutter-latest-milestone',
        articleImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        articleSource: 'Mobile Dev Weekly',
        noteTitle: 'Key Takeaways on Vulkan Impeller & M3 Theming',
        personalNotes: 'Impeller on Android is now default without runtime fallback. Need to audit our theme seedColor setups to leverage new colorScheme.fromSeed dynamic tone generators.',
        category: 'technology',
        rating: 5,
        tags: ['Research', 'Work'],
        updatedAt: 'Just now',
      },
    ];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flutter_news_bookmarks', JSON.stringify(bookmarks));
    } catch (_) {}
  }, [bookmarks]);

  // Form State & Live Validation
  const [formTitle, setFormTitle] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formRating, setFormRating] = useState(4);
  const [formTags, setFormTags] = useState<string[]>(['Research']);
  const [formErrors, setFormErrors] = useState<{ title?: string; notes?: string }>({});
  const [showToast, setShowToast] = useState<string | null>(null);

  // Search in list screen
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulator Theme
  const [activeSeedIndex, setActiveSeedIndex] = useState(0);
  const activeSeed = SEED_COLORS[activeSeedIndex];

  // Code Explorer State
  const [activeFile, setActiveFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[4]); // news_provider.dart
  const [copiedFile, setCopiedFile] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'architecture'>('simulator');
  const [filterTag, setFilterTag] = useState<string>('All');

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Switch to Form screen
  const openFormForArticle = (article: Article) => {
    const existing = bookmarks.find((b) => b.articleId === article.id);
    setSelectedArticle(article);
    setEditingNote(existing || null);
    setFormTitle(existing ? existing.noteTitle : `Key insights from "${article.title.slice(0, 32)}..."`);
    setFormNotes(existing ? existing.personalNotes : '');
    setFormRating(existing ? existing.rating : 4);
    setFormTags(existing ? existing.tags : ['Research']);
    setFormErrors({});
    setCurrentScreen('form');
  };

  // Form submit handler with strict validation
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { title?: string; notes?: string } = {};

    if (!formTitle.trim()) {
      errors.title = 'Note headline is required.';
    } else if (formTitle.trim().length < 3) {
      errors.title = 'Headline must be at least 3 characters long.';
    } else if (formTitle.trim().length > 120) {
      errors.title = 'Headline cannot exceed 120 characters.';
    }

    if (!formNotes.trim()) {
      errors.notes = 'Personal notes or reflections are required.';
    } else if (formNotes.trim().length < 5) {
      errors.notes = 'Personal notes must be at least 5 characters long.';
    } else if (formNotes.trim().length > 2000) {
      errors.notes = 'Notes cannot exceed 2000 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!selectedArticle) return;

    const newBookmark: BookmarkNote = {
      id: editingNote?.id || `note_${Date.now()}`,
      articleId: selectedArticle.id,
      articleTitle: selectedArticle.title,
      articleUrl: selectedArticle.url,
      articleImageUrl: selectedArticle.imageUrl,
      articleSource: selectedArticle.sourceName,
      noteTitle: formTitle.trim(),
      personalNotes: formNotes.trim(),
      category: selectedArticle.category,
      rating: formRating,
      tags: formTags,
      updatedAt: 'Just now',
    };

    setBookmarks((prev) => {
      const idx = prev.findIndex((b) => b.id === newBookmark.id || b.articleId === newBookmark.articleId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newBookmark;
        return copy;
      }
      return [newBookmark, ...prev];
    });

    triggerToast(editingNote ? 'Personal note updated successfully!' : 'Article and note saved to device bookmarks!');
    setCurrentScreen('list');
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    triggerToast('Bookmark removed from device storage.');
  };

  // Filtered articles
  const currentArticles = SAMPLE_ARTICLES[activeCategory] || [];
  const displayedArticles = searchQuery.trim()
    ? currentArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentArticles;

  // Copy code handler
  const copyCurrentCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // Download all files as a single consolidated bundle
  const downloadBundle = () => {
    const text = FLUTTER_PROJECT_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.path}\n// ${f.description}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flutter_news_reader_complete_codebase.dart';
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Downloaded complete Flutter project bundle!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-md"
              style={{ backgroundColor: activeSeed.hex }}
            >
              F
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Flutter News Reader
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                  v3.35+
                </span>
              </h1>
              <p className="text-xs text-slate-400">Strict Material 3 &middot; Provider State Management &middot; 4-State Flow</p>
            </div>
          </div>

          {/* Navigation view tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'simulator'
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android Simulator
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Flutter Codebase ({FLUTTER_PROJECT_FILES.length} Files)
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Architecture & Checklist
            </button>
          </div>

          {/* Seed Color Selector & Export */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <span className="text-[11px] text-slate-400 mr-1">seedColor:</span>
              {SEED_COLORS.map((seed, idx) => (
                <button
                  key={seed.name}
                  onClick={() => setActiveSeedIndex(idx)}
                  title={`seedColor: ${seed.name} (${seed.hex})`}
                  className={`w-5 h-5 rounded-full transition-transform ${seed.bgClass} ${
                    activeSeedIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={downloadBundle}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Code
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 gap-6">
        {/* VIEW 1: DUAL SIMULATOR + QUICK CODE VIEWER */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Android Device Simulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Simulator State Controller Toolbar */}
              <div className="w-full max-w-[390px] mb-3 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCcw className="w-3 h-3 text-indigo-400" />
                    4 Screen States Controller
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ArticleListScreen</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <button
                    onClick={() => {
                      setListState('data');
                      setCurrentScreen('list');
                    }}
                    className={`px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                      listState === 'data' && currentScreen === 'list'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    1. Data List
                  </button>
                  <button
                    onClick={() => {
                      setListState('loading');
                      setCurrentScreen('list');
                    }}
                    className={`px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                      listState === 'loading' && currentScreen === 'list'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    2. Loading
                  </button>
                  <button
                    onClick={() => {
                      setListState('error');
                      setCurrentScreen('list');
                    }}
                    className={`px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                      listState === 'error' && currentScreen === 'list'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    3. Error
                  </button>
                  <button
                    onClick={() => {
                      setListState('empty');
                      setCurrentScreen('list');
                    }}
                    className={`px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                      listState === 'empty' && currentScreen === 'list'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    4. Empty
                  </button>
                </div>
              </div>

              {/* Physical Android Frame Mockup */}
              <div className="w-full max-w-[390px] h-[740px] bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
                {/* Phone Speaker & Camera Cutout */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-end px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                </div>

                {/* Simulated Screen Inner */}
                <div className="flex-1 bg-white text-slate-900 rounded-[34px] overflow-hidden flex flex-col relative">
                  {/* Status Bar */}
                  <div className="h-7 bg-slate-100 flex items-center justify-between px-6 text-[10px] font-medium text-slate-600 shrink-0 select-none">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <div className="w-4 h-2 border border-slate-600 rounded-sm p-0.5 flex items-center">
                        <div className="h-full w-full bg-slate-600 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* Toast notification overlay inside simulator */}
                  {showToast && (
                    <div className="absolute top-9 left-4 right-4 z-40 bg-slate-900 text-white text-xs py-2 px-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{showToast}</span>
                    </div>
                  )}

                  {/* SCREEN 1: ARTICLE LIST */}
                  {currentScreen === 'list' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* App Bar */}
                      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        {isSearchOpen ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search stories..."
                              autoFocus
                              className="w-full text-sm outline-none bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                            />
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="text-xs text-slate-500 font-medium px-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <h2 className="font-bold text-base text-slate-900">News Reader</h2>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full"
                                title="Search"
                              >
                                <Search className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setCurrentScreen('bookmarks')}
                                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full relative"
                                title="Saved Bookmarks"
                              >
                                <Bookmark className="w-4 h-4" />
                                {bookmarks.length > 0 && (
                                  <span
                                    className="absolute top-0 right-0 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                                    style={{ backgroundColor: activeSeed.hex }}
                                  >
                                    {bookmarks.length}
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setListState('loading');
                                  setTimeout(() => setListState('data'), 600);
                                }}
                                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full"
                                title="Refresh"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Category Filter Tabs */}
                      <div className="px-3 py-2 border-b border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
                        {['general', 'technology', 'business', 'science', 'health', 'entertainment'].map((cat) => {
                          const isSelected = activeCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setActiveCategory(cat);
                                setSearchQuery('');
                                setListState('data');
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                                isSelected ? 'text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                              style={{ backgroundColor: isSelected ? activeSeed.hex : undefined }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Screen Content: The 4 Screen States */}
                      <div className="flex-1 overflow-y-auto">
                        {/* State 1: Loading Indicator */}
                        {listState === 'loading' && (
                          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div
                              className="w-10 h-10 border-4 border-slate-200 border-t-current rounded-full animate-spin mb-4"
                              style={{ color: activeSeed.hex }}
                            />
                            <p className="text-sm font-medium text-slate-700">Fetching latest headlines...</p>
                            <p className="text-xs text-slate-400 mt-1">Connecting to live news service</p>
                          </div>
                        )}

                        {/* State 2: Error Message with a Retry button */}
                        {listState === 'error' && (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                              <AlertCircle className="w-8 h-8 text-rose-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">Unable to Load News</h3>
                            <p className="text-xs text-slate-600 max-w-xs mb-5">{errorMessage}</p>
                            <button
                              onClick={() => {
                                setListState('loading');
                                setTimeout(() => setListState('data'), 600);
                              }}
                              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                              style={{ backgroundColor: activeSeed.hex }}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Retry
                            </button>
                          </div>
                        )}

                        {/* State 3: Empty Message */}
                        {listState === 'empty' && (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                              <FileText className="w-7 h-7 text-slate-400" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">No Articles Found</h3>
                            <p className="text-xs text-slate-600 max-w-xs mb-5">
                              There are currently no articles matching this criteria. Try switching categories or reloading.
                            </p>
                            <button
                              onClick={() => {
                                setListState('data');
                                setSearchQuery('');
                              }}
                              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              Reload Articles
                            </button>
                          </div>
                        )}

                        {/* State 4: Data List */}
                        {listState === 'data' && (
                          <div className="p-3 space-y-3">
                            {displayedArticles.length === 0 ? (
                              <div className="py-12 text-center text-xs text-slate-500">
                                No stories matching &ldquo;{searchQuery}&rdquo;.
                              </div>
                            ) : (
                              displayedArticles.map((article) => {
                                const isBookmarked = bookmarks.some((b) => b.articleId === article.id);
                                return (
                                  <div
                                    key={article.id}
                                    onClick={() => {
                                      setSelectedArticle(article);
                                      setCurrentScreen('detail');
                                    }}
                                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                  >
                                    <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                                      <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
                                        {article.category}
                                      </div>
                                    </div>
                                    <div className="p-3.5">
                                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                        <span>
                                          {article.sourceName} &middot; {article.readTime} min read
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openFormForArticle(article);
                                          }}
                                          className="p-1 hover:text-slate-900"
                                          title={isBookmarked ? 'Edit Note' : 'Add Note & Bookmark'}
                                        >
                                          {isBookmarked ? (
                                            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                                          ) : (
                                            <Bookmark className="w-4 h-4 text-slate-400" />
                                          )}
                                        </button>
                                      </div>
                                      <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug mb-1">
                                        {article.title}
                                      </h3>
                                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {article.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: ARTICLE DETAIL */}
                  {currentScreen === 'detail' && selectedArticle && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      {/* Detail App Bar */}
                      <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        <button
                          onClick={() => setCurrentScreen('list')}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                        >
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openFormForArticle(selectedArticle)}
                            className="p-1.5 text-slate-700 hover:text-slate-900"
                            title="Add Note"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => triggerToast(`Opened: ${selectedArticle.url}`)}
                            className="p-1.5 text-slate-700 hover:text-slate-900"
                            title="Read original source"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Detail Scrollable Body */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                          <img
                            src={selectedArticle.imageUrl}
                            alt={selectedArticle.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: activeSeed.lightBg, color: activeSeed.hex }}
                            >
                              {selectedArticle.category}
                            </span>
                            <span className="text-xs text-slate-400">&middot;</span>
                            <span className="text-xs text-slate-500">{selectedArticle.readTime} min read</span>
                          </div>

                          <h2 className="font-extrabold text-lg text-slate-900 leading-tight mb-2">
                            {selectedArticle.title}
                          </h2>

                          <p className="text-xs font-semibold text-slate-700 mb-0.5">
                            Published by {selectedArticle.sourceName} &middot; {selectedArticle.author}
                          </p>
                          <p className="text-[11px] text-slate-400 mb-4">{selectedArticle.publishedAt}</p>

                          <div className="border-t border-slate-100 pt-3 mb-4">
                            <p className="text-xs font-medium italic text-slate-600 leading-relaxed mb-4">
                              {selectedArticle.description}
                            </p>
                            <p className="text-xs text-slate-800 leading-relaxed space-y-2">
                              {selectedArticle.content}
                            </p>
                          </div>

                          {/* Existing note preview if present */}
                          {bookmarks.find((b) => b.articleId === selectedArticle.id) && (
                            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  Your Saved Note
                                </span>
                                <div className="flex text-amber-500">
                                  {Array.from({
                                    length: bookmarks.find((b) => b.articleId === selectedArticle.id)!.rating,
                                  }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-slate-900">
                                {bookmarks.find((b) => b.articleId === selectedArticle.id)!.noteTitle}
                              </p>
                              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                                {bookmarks.find((b) => b.articleId === selectedArticle.id)!.personalNotes}
                              </p>
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => openFormForArticle(selectedArticle)}
                              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
                              style={{ backgroundColor: activeSeed.hex }}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              {bookmarks.some((b) => b.articleId === selectedArticle.id) ? 'Edit Note' : 'Add Note & Bookmark'}
                            </button>
                            <button
                              onClick={() => triggerToast(`Opening link: ${selectedArticle.url}`)}
                              className="w-full py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Read Full Source Article
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 3: VALIDATED PERSONAL NOTE FORM */}
                  {currentScreen === 'form' && selectedArticle && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      {/* Form App Bar */}
                      <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        <button
                          onClick={() => setCurrentScreen('list')}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                        >
                          <ChevronLeft className="w-4 h-4" /> Cancel
                        </button>
                        <h3 className="text-xs font-bold text-slate-900">
                          {editingNote ? 'Edit Personal Note' : 'Add Note & Bookmark'}
                        </h3>
                        <button
                          onClick={handleSaveForm}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Save
                        </button>
                      </div>

                      {/* Validated Form Body */}
                      <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Story Context Banner */}
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-indigo-700 uppercase">
                              {selectedArticle.sourceName}
                            </p>
                            <p className="text-xs font-medium text-slate-800 truncate">{selectedArticle.title}</p>
                          </div>
                        </div>

                        {/* Field 1: Title Validation */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Note Headline / Summary <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => {
                              setFormTitle(e.target.value);
                              if (formErrors.title) setFormErrors((p) => ({ ...p, title: undefined }));
                            }}
                            placeholder="e.g. Breakthrough optical computing notes"
                            className={`w-full text-xs p-2.5 rounded-xl border bg-slate-50 outline-none transition-colors ${
                              formErrors.title
                                ? 'border-rose-400 bg-rose-50/50 focus:ring-1 focus:ring-rose-500'
                                : 'border-slate-300 focus:border-indigo-500 focus:bg-white'
                            }`}
                          />
                          {formErrors.title && (
                            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {formErrors.title}
                            </p>
                          )}
                        </div>

                        {/* Field 2: Personal Notes Validation */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Personal Reflection & Takeaways <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={4}
                            value={formNotes}
                            onChange={(e) => {
                              setFormNotes(e.target.value);
                              if (formErrors.notes) setFormErrors((p) => ({ ...p, notes: undefined }));
                            }}
                            placeholder="Record key thoughts, critical questions, or quotes..."
                            className={`w-full text-xs p-2.5 rounded-xl border bg-slate-50 outline-none transition-colors resize-none ${
                              formErrors.notes
                                ? 'border-rose-400 bg-rose-50/50 focus:ring-1 focus:ring-rose-500'
                                : 'border-slate-300 focus:border-indigo-500 focus:bg-white'
                            }`}
                          />
                          {formErrors.notes && (
                            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {formErrors.notes}
                            </p>
                          )}
                        </div>

                        {/* Field 3: Star Rating */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Relevance Rating</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFormRating(star)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= formRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs text-slate-500 ml-2 font-mono">{formRating}/5</span>
                          </div>
                        </div>

                        {/* Field 4: Tag categorization */}
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">Tags & Topic</label>
                          <div className="flex flex-wrap gap-1.5">
                            {['Research', 'Fact Check', 'Work', 'Follow Up', 'Read Later'].map((t) => {
                              const active = formTags.includes(t);
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    setFormTags((prev) =>
                                      active ? prev.filter((x) => x !== t) : [...prev, t]
                                    );
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                                    active
                                      ? 'bg-slate-900 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Submit button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-98 cursor-pointer"
                            style={{ backgroundColor: activeSeed.hex }}
                          >
                            {editingNote ? 'Update Note' : 'Save Note & Bookmark'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SCREEN 4: SAVED BOOKMARKS & NOTES LIST */}
                  {currentScreen === 'bookmarks' && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      {/* Bookmarks App Bar */}
                      <div className="px-3 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        <button
                          onClick={() => setCurrentScreen('list')}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                        >
                          <ChevronLeft className="w-4 h-4" /> Feed
                        </button>
                        <h3 className="text-xs font-bold text-slate-900">
                          Saved Bookmarks ({bookmarks.length})
                        </h3>
                        <div className="w-10" />
                      </div>

                      {/* Tag Filter */}
                      {bookmarks.length > 0 && (
                        <div className="px-3 py-1.5 border-b border-slate-100 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
                          {['All', 'Research', 'Work', 'Fact Check', 'Follow Up', 'Read Later'].map((t) => (
                            <button
                              key={t}
                              onClick={() => setFilterTag(t)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                                filterTag === t
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Bookmarks List */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {bookmarks.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                              <Bookmark className="w-6 h-6 text-slate-400" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">No Bookmarks Saved</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs mb-4">
                              Read any headline and tap the bookmark icon to save reflections to device storage.
                            </p>
                            <button
                              onClick={() => setCurrentScreen('list')}
                              className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                              style={{ backgroundColor: activeSeed.hex }}
                            >
                              Browse Headlines
                            </button>
                          </div>
                        ) : (
                          bookmarks
                            .filter((b) => filterTag === 'All' || b.tags.includes(filterTag))
                            .map((note) => (
                              <div
                                key={note.id}
                                className="p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-slate-300 transition-colors"
                              >
                                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                                  <span className="font-bold uppercase tracking-wider text-indigo-700">
                                    {note.articleSource}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <div className="flex text-amber-400">
                                      {Array.from({ length: note.rating }).map((_, i) => (
                                        <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                      ))}
                                    </div>
                                    <button
                                      onClick={() => handleDeleteBookmark(note.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs font-bold text-slate-900 mb-1">{note.noteTitle}</h4>
                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
                                  {note.personalNotes}
                                </p>

                                <div className="p-2 bg-slate-50 rounded-lg text-[10px] text-slate-700 italic truncate mb-2">
                                  Original: {note.articleTitle}
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex gap-1 flex-wrap">
                                    {note.tags.map((t) => (
                                      <span
                                        key={t}
                                        className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => {
                                      const article = Object.values(SAMPLE_ARTICLES)
                                        .flat()
                                        .find((a) => a.id === note.articleId) || {
                                        id: note.articleId,
                                        title: note.articleTitle,
                                        description: note.noteTitle,
                                        content: note.personalNotes,
                                        url: note.articleUrl,
                                        imageUrl: note.articleImageUrl,
                                        sourceName: note.articleSource,
                                        author: note.articleSource,
                                        publishedAt: 'Saved',
                                        category: note.category,
                                        readTime: 3,
                                      };
                                      setSelectedArticle(article);
                                      setEditingNote(note);
                                      setFormTitle(note.noteTitle);
                                      setFormNotes(note.personalNotes);
                                      setFormRating(note.rating);
                                      setFormTags(note.tags);
                                      setCurrentScreen('form');
                                    }}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                                  >
                                    Edit Note &rarr;
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Android Bottom Navigation Pill */}
                  <div className="h-4 bg-white flex items-center justify-center shrink-0">
                    <div className="w-32 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Codebase File Viewer & Quick Details */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Architecture Summary Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Flutter Project Structure (lib/ 4-Folder Rule)</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">1 main class per file</span>
                </div>

                {/* 4 folders badge bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">lib/models/</span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">article.dart</p>
                    <p className="text-[11px] text-slate-400">bookmark_note.dart</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">lib/services/</span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">news_provider.dart</p>
                    <p className="text-[11px] text-slate-400">ChangeNotifier & HTTP</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">lib/screens/</span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">4 Screens</p>
                    <p className="text-[11px] text-slate-400">List, Detail, Form, Notes</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">lib/widgets/</span>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">3 Reusable Components</p>
                    <p className="text-[11px] text-slate-400">Card, Chips, StateViews</p>
                  </div>
                </div>

                {/* Quick File Selection Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {FLUTTER_PROJECT_FILES.map((file) => {
                    const isSelected = activeFile.path === file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => setActiveFile(file)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        {file.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code Viewer Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400">{activeFile.path}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{activeFile.description}</p>
                  </div>
                  <button
                    onClick={copyCurrentCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedFile ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="p-4 bg-slate-950/80 overflow-x-auto max-h-[510px] font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
                  <pre>
                    <code>{activeFile.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FULL CODEBASE EXPLORER */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {/* Left: File Tree */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-indigo-400" />
                  Files in Workspace
                </h3>
                <span className="text-xs text-slate-400 font-mono">{FLUTTER_PROJECT_FILES.length} files</span>
              </div>

              <div className="space-y-1">
                {FLUTTER_PROJECT_FILES.map((file) => {
                  const isSelected = activeFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setActiveFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className="text-[10px] opacity-70 uppercase font-sans">{file.folder}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={downloadBundle}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Complete Bundle (.dart)
                </button>
              </div>
            </div>

            {/* Right: Code Viewer */}
            <div className="lg:col-span-8 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div>
                  <h4 className="text-xs font-mono font-bold text-indigo-400">{activeFile.path}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{activeFile.description}</p>
                </div>
                <button
                  onClick={copyCurrentCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedFile ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 overflow-x-auto max-h-[640px] font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
                <pre>
                  <code>{activeFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ARCHITECTURE & CHECKLIST */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Requirements compliance matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Mandatory Project Requirements Verification Matrix
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                All specifications have been strictly engineered according to the Flutter 3.35+ rules.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 1. Flutter 3.35+ & Strict Null Safety
                  </div>
                  <p className="text-xs text-slate-300">
                    Dart SDK &gt;=3.35.0 &lt;4.0.0 declared in pubspec.yaml. All models (Article, BookmarkNote) feature complete null safety and resilient fallbacks preventing runtime crashes.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 2. Provider State Management
                  </div>
                  <p className="text-xs text-slate-300">
                    NewsProvider extends ChangeNotifier. Injected via ChangeNotifierProvider in main.dart, watched via context.watch&lt;NewsProvider&gt;() across all screens.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 3. 4-Folder Organization (One Main Class Per File)
                  </div>
                  <p className="text-xs text-slate-300">
                    lib/ is strictly partitioned into models/, services/, screens/, and widgets/. Zero scattered files outside these 4 folders.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 4. Material 3 seedColor Theming
                  </div>
                  <p className="text-xs text-slate-300">
                    ThemeData.useMaterial3 with ColorScheme.fromSeed(seedColor: ...). Zero hardcoded hex colors inside screens or widgets.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 5. The 4 Mandatory List Screen States
                  </div>
                  <p className="text-xs text-slate-300">
                    NewsViewState enum governs LoadingStateView, ErrorStateView with a Retry button, EmptyStateView, and ListView of ArticleCards.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 6. Validated Input Form Screen
                  </div>
                  <p className="text-xs text-slate-300">
                    NoteFormScreen enforces Form validation on headline (min 3 chars) and reflections (min 5 chars), displaying clear inline error messages.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 7. Real Data & SharedPreferences Persistence
                  </div>
                  <p className="text-xs text-slate-300">
                    Fetches HTTP articles with network timeout handling. Bookmarks and notes serialize to JSON in shared_preferences so they survive app restarts.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> 8. Working Widget Test Template
                  </div>
                  <p className="text-xs text-slate-300">
                    test/widget_test.dart includes widget tests for rendering app title, category chips, loading spinner, and tapping Error state Retry button.
                  </p>
                </div>
              </div>
            </div>

            {/* Provider State Flow Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Provider Reactive State Flow</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-950 border border-indigo-900/60 rounded-xl text-center flex-1">
                  <span className="text-indigo-400 font-bold block mb-1">HTTP / SharedPreferences</span>
                  <p className="text-slate-400">Public News API & Local Storage</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
                <div className="p-4 bg-slate-950 border border-emerald-900/60 rounded-xl text-center flex-1">
                  <span className="text-emerald-400 font-bold block mb-1">NewsProvider (ChangeNotifier)</span>
                  <p className="text-slate-400">Manages 4 States & notifies listeners</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
                <div className="p-4 bg-slate-950 border border-purple-900/60 rounded-xl text-center flex-1">
                  <span className="text-purple-400 font-bold block mb-1">4 Screens (Consumer)</span>
                  <p className="text-slate-400">Reactive M3 UI Rebuilding</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
