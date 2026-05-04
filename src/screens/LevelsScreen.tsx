import { useState } from 'react';
import { themes, vocabCategories } from '../data';
import * as Icons from 'lucide-react';
import TopBar from '../components/TopBar';

type Props = {
  onLevelSelect: (themeId: string, levelIndex: number) => void;
};

export default function LevelsScreen({ onLevelSelect }: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  if (selectedThemeId) {
    const theme = themes.find(t => t.id === selectedThemeId)!;
    const category = vocabCategories.find(c => c.themeId === selectedThemeId);
    
    // Divide words into chunks of 7
    const words = category ? category.words : [];
    const chunks: any[][] = [];
    for (let i = 0; i < words.length; i += 7) {
      chunks.push(words.slice(i, i + 7));
    }

    return (
      <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto pb-24">
        <TopBar title={theme.title} showBack={true} onBack={() => setSelectedThemeId(null)} />
        
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-[#2D2D2A] mb-2">{theme.title}</h2>
          <p className="text-[#8B8B7A] text-sm">Selesaikan level untuk menguasai kosakata tema ini.</p>
        </div>

        <div className="px-5 space-y-3">
          {chunks.map((chunk, idx) => {
            const difficultyLabel = idx < 2 ? 'Mudah' : idx < 4 ? 'Sedang' : 'Sulit';
            const difficultyColor = idx < 2 ? 'text-green-600 bg-green-50' : idx < 4 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';

            return (
              <button
                key={idx}
                onClick={() => onLevelSelect(theme.id, idx)}
                className="w-full bg-white p-4 rounded-2xl border border-[#E6E2D3] shadow-sm flex items-center justify-between hover:border-[#7B8E61] transition-colors active:scale-[0.98] text-left"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[#2D2D2A] text-lg">Level {idx + 1}</span>
                  <span className="text-xs text-[#8B8B7A] mt-1">{chunk.length} Kata</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor}`}>
                  {difficultyLabel}
                </div>
              </button>
            );
          })}
          {chunks.length === 0 && (
            <div className="py-10 text-center text-[#8B8B7A]">Belum ada kosakata untuk tema ini.</div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto pb-24">
      <TopBar title="Goi Kurosuwaado" showBack={false} />
      
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-[#2D2D2A] mb-2">Tema Kata Benda</h2>
        <p className="text-[#8B8B7A] text-sm">Pilih topik JLPT N4 untuk mulai mengisi teka-teki silang.</p>
      </div>

      <div className="px-5 space-y-4 mb-8">
        {themes.map((theme) => {
          const Icon = (Icons as any)[theme.icon] || Icons.HelpCircle;
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              className="w-full bg-white p-4 rounded-3xl border border-[#E6E2D3] shadow-sm flex items-center space-x-4 hover:border-[#7B8E61] transition-colors active:scale-[0.98] text-left relative overflow-hidden"
            >
              {/* Decorative background icon */}
              <div className={`absolute -right-4 -bottom-4 opacity-5 w-24 h-24 ${theme.color}`}>
                <Icon className="w-full h-full" />
              </div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.bgColor}`}>
                <Icon className={`w-7 h-7 ${theme.color}`} />
              </div>
              
              <div className="flex-1 z-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-[#2D2D2A] text-lg">{theme.title}</h3>
                  {theme.progress > 0 ? (
                    <span className="text-xs font-bold px-2 py-1 bg-[#FBF9F6] border border-[#7B8E61] text-[#7B8E61] rounded-lg">
                      {theme.progress}%
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 bg-[#F5F2ED] text-[#8B8B7A] rounded-lg">
                      Mulai
                    </span>
                  )}
                </div>
                
                {theme.progress > 0 && theme.progress < 100 ? (
                   <div className="w-full bg-[#F5F2ED] h-2 rounded-full overflow-hidden mb-2">
                     <div className="bg-[#7B8E61] h-full rounded-full" style={{ width: `${theme.progress}%` }} />
                   </div>
                ) : theme.progress === 100 ? (
                   <div className="w-full bg-[#F5F2ED] h-2 rounded-full overflow-hidden mb-2">
                     <div className="bg-[#7B8E61] h-full rounded-full w-full" />
                   </div>
                ) : (
                  <div className="w-full bg-[#F5F2ED] h-2 rounded-full mb-2" />
                )}
                
                <p className="text-xs text-[#8B8B7A]">{theme.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 mb-6">
        <div className="bg-[#D4A373] rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
          {/* Deco circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute right-10 -bottom-10 w-24 h-24 bg-white/10 rounded-full" />
          
          <h3 className="font-medium text-white/90 mb-2">Tantangan Mingguan</h3>
          <p className="text-lg font-semibold leading-tight mb-6 max-w-[200px]">
            Selesaikan puzzle spesial bertema 'Makanan Tradisional'
          </p>
          <button className="bg-[#F5F2ED] text-[#D4A373] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white active:scale-95 transition-all shadow-sm">
            MAIN SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
}
