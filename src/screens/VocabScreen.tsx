import { useState } from 'react';
import TopBar from '../components/TopBar';
import { vocabCategories } from '../data';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function VocabScreen() {
  const [search, setSearch] = useState('');
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());

  const toggleTheme = (themeId: string) => {
    setExpandedThemes(prev => {
      const next = new Set(prev);
      if (next.has(themeId)) next.delete(themeId);
      else next.add(themeId);
      return next;
    });
  };

  const filteredCategories = vocabCategories.map(cat => {
    return {
      ...cat,
      words: cat.words.filter(w => 
        w.romaji.toLowerCase().includes(search.toLowerCase()) || 
        w.indonesian.toLowerCase().includes(search.toLowerCase())
      )
    };
  }).filter(cat => cat.words.length > 0);

  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto pb-24">
      <TopBar title="Kosa Kata N4" showBack={false} />

      <div className="px-5 pt-3 pb-5 bg-white shadow-sm border-b border-[#E6E2D3] z-40 sticky top-[68px]">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B7A]" />
          <input
            type="text"
            className="w-full bg-[#FBF9F6] border border-[#E6E2D3] rounded-2xl py-3.5 pl-11 pr-4 text-[#2D2D2A] text-sm focus:outline-none focus:border-[#7B8E61] transition-all"
            placeholder="Cari kata (Contoh: Taberu, Makan)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {filteredCategories.map(category => {
          const Icon = (Icons as any)[category.icon] || Icons.HelpCircle;
          const isExpanded = search !== '' || expandedThemes.has(category.themeId);
          
          return (
            <div key={category.themeId}>
              <div 
                className="flex items-center justify-between mb-4 px-1 cursor-pointer select-none transition-transform active:scale-[0.98]"
                onClick={() => toggleTheme(category.themeId)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#F5F2ED] text-[#7B8E61]`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#2D2D2A]">{category.themeName}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  {search === '' && (
                    <span className="text-xs font-bold px-3 py-1 bg-[#F5F2ED] text-[#4A4A40] rounded-full">
                      {category.count} Kata
                    </span>
                  )}
                  {search === '' && (
                    <div className="p-1.5 rounded-full bg-[#F5F2ED] text-[#8B8B7A]">
                      {!isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3">
                  {category.words.map((word, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl flex justify-between items-center border-b border-[#F5F2ED] shadow-sm border border-[#E6E2D3]">
                      <div>
                        <h3 className="font-bold text-[#2D2D2A] text-lg leading-none mb-1">{word.romaji}</h3>
                        <span className="text-xs text-[#8B8B7A] block">{word.kanji}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-[#4A4A40] block">{word.indonesian}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredCategories.length === 0 && (
          <div className="text-center py-10 text-[#8B8B7A]">
            Pencarian tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
