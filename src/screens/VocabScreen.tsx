import { useState } from 'react';
import TopBar from '../components/TopBar';
import { vocabCategories } from '../data';
import { Search, ArrowLeft, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { SharedScreenProps } from '../types';

type Props = SharedScreenProps;

const themeColors = [
  { bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600', icon: 'text-white', badge: 'bg-emerald-700/30' },
  { bg: 'bg-gradient-to-br from-sky-400 to-sky-600', icon: 'text-white', badge: 'bg-sky-700/30' },
  { bg: 'bg-gradient-to-br from-amber-400 to-amber-600', icon: 'text-white', badge: 'bg-amber-700/30' },
  { bg: 'bg-gradient-to-br from-rose-400 to-rose-600', icon: 'text-white', badge: 'bg-rose-700/30' },
  { bg: 'bg-gradient-to-br from-violet-400 to-violet-600', icon: 'text-white', badge: 'bg-violet-700/30' },
  { bg: 'bg-gradient-to-br from-teal-400 to-teal-600', icon: 'text-white', badge: 'bg-teal-700/30' },
  { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', icon: 'text-white', badge: 'bg-orange-700/30' },
  { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', icon: 'text-white', badge: 'bg-pink-700/30' },
];

export default function VocabScreen({ onNavigate }: SharedScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // Detail page for a selected theme
  if (selectedThemeId) {
    const category = vocabCategories.find(c => c.themeId === selectedThemeId);
    if (!category) return null;

    const Icon = (Icons as any)[category.icon] || Icons.HelpCircle;
    const colorIdx = vocabCategories.indexOf(category) % themeColors.length;
    const color = themeColors[colorIdx];

    const filteredWords = category.words.filter(w =>
      w.romaji.toLowerCase().includes(search.toLowerCase()) ||
      w.indonesian.toLowerCase().includes(search.toLowerCase()) ||
      w.kanji.includes(search)
    );

    return (
      <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto">
        {/* Header with gradient */}
        <div className={`${color.bg} px-5 pt-8 pb-16 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute right-16 -bottom-10 w-20 h-20 bg-white/10 rounded-full" />

          <div className="flex items-center space-x-3 mb-8 relative z-10">
            <button
              onClick={() => { setSelectedThemeId(null); setSearch(''); }}
              className="p-2 -ml-2 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider opacity-80">Detail Tema</h1>
          </div>

          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">{category.themeName}</h2>
              <p className="text-white/80 text-sm font-medium">{category.count} Kosakata Tersedia</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-5 -mt-8 mb-6 relative z-10">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B7A]" />
            <input
              type="text"
              className="w-full bg-white border border-[#E6E2D3] rounded-2xl py-4 pl-11 pr-4 text-[#2D2D2A] text-sm focus:outline-none focus:border-[#7B8E61] focus:ring-4 focus:ring-[#7B8E61]/10 transition-all shadow-xl"
              placeholder="Cari kata (Contoh: Taberu, Makan)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Word list */}
        <div className="px-5 pb-8 space-y-3">
          {filteredWords.map((word, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-[#E6E2D3] hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-bold text-[#2D2D2A] text-lg leading-none mb-1">{word.romaji}</h3>
                <span className="text-xs text-[#8B8B7A] block">{word.kanji}</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-[#4A4A40] block">{word.indonesian}</span>
              </div>
            </div>
          ))}
          {filteredWords.length === 0 && (
            <div className="text-center py-10 text-[#8B8B7A]">
              Pencarian tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main card grid view
  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto">
      <TopBar title="Bank Kosakata" showBack={false} onNavigate={onNavigate} />

      <div className="px-5 pt-4 pb-2">
        <h2 className="text-2xl font-bold text-[#2D2D2A] mb-1">Kosakata JLPT N4</h2>
        <p className="text-[#8B8B7A] text-sm">Pilih tema untuk melihat daftar kosakata</p>
      </div>

      {/* Theme cards grid */}
      <div className="px-5 py-4 grid grid-cols-2 gap-4 pb-8">
        {vocabCategories.map((category, idx) => {
          const Icon = (Icons as any)[category.icon] || Icons.HelpCircle;
          const color = themeColors[idx % themeColors.length];

          return (
            <button
              key={category.themeId}
              onClick={() => setSelectedThemeId(category.themeId)}
              className={`${color.bg} rounded-3xl p-5 flex flex-col items-start text-left relative overflow-hidden shadow-md hover:shadow-lg transition-all active:scale-[0.96] min-h-[140px]`}
            >
              {/* Deco circles */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute right-6 -top-4 w-12 h-12 bg-white/10 rounded-full" />

              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Icon className={`w-6 h-6 ${color.icon}`} />
              </div>

              <h3 className="font-bold text-white text-base leading-tight mb-1 relative z-10">{category.themeName}</h3>
              <div className={`${color.badge} text-white/90 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-auto`}>
                {category.count} Kata
              </div>

              <ChevronRight className="w-5 h-5 text-white/50 absolute right-3 bottom-3" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
