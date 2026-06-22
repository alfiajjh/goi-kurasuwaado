import { useState } from 'react';
import { vocabCategories } from '../data';
import * as Icons from 'lucide-react';
import TopBar from '../components/TopBar';
import { SharedScreenProps } from '../types';

type Props = SharedScreenProps & {
  themes: any[];
  onLevelSelect: (themeId: string, levelIndex: number) => void;
  lastPlayedThemeId: string;
  lastPlayedLevelIndex: number;
  completedLevels: Record<string, number[]>;
};

export default function LevelsScreen({
  themes,
  onLevelSelect,
  lastPlayedThemeId,
  lastPlayedLevelIndex,
  onNavigate,
  completedLevels
}: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  if (selectedThemeId) {
    const theme = themes.find(t => t.id === selectedThemeId)!;
    const category = vocabCategories.find(c => c.themeId === selectedThemeId);

    const words = category?.words || [];
    const chunks: any[][] = [];
    for (let i = 0; i < words.length; i += 7) {
      chunks.push(words.slice(i, i + 7));
    }

    return (
      <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto relative">
        <div className="absolute top-20 right-0 w-36 h-36 bg-[#7B8E61]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 left-0 w-44 h-44 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

        <TopBar title={theme.title} showBack={true} onBack={() => setSelectedThemeId(null)} onNavigate={onNavigate} />

        <div className="px-5 pt-6 pb-4 relative z-10">
          <h2 className="text-2xl font-bold text-[#2D2D2A] mb-2">{theme.title}</h2>
          <p className="text-[#8B8B7A] text-sm">Selesaikan level untuk menguasai kosakata tema ini.</p>
        </div>

        <div className="px-5 space-y-3 pb-8 relative z-10">
          {chunks.map((chunk, idx) => {
            const difficultyLabel = idx < 2 ? 'Mudah' : idx < 4 ? 'Sedang' : 'Sulit';
            const difficultyColor = idx < 2
              ? 'text-green-600 bg-green-50'
              : idx < 4
                ? 'text-amber-600 bg-amber-50'
                : 'text-red-600 bg-red-50';

            const isCompleted = completedLevels[selectedThemeId]?.includes(idx);

            return (
              <button
                key={idx}
                onClick={() => onLevelSelect(theme.id, idx)}
                className="w-full bg-white p-4 rounded-2xl border border-[#E6E2D3] shadow-sm flex items-center justify-between hover:border-[#7B8E61] transition-colors active:scale-[0.98] text-left relative overflow-hidden"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[#2D2D2A] text-lg flex items-center space-x-2">
                    <span>Level {idx + 1}</span>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-600 rounded-full p-0.5">
                        <Icons.Check className="w-3 h-3" />
                      </span>
                    )}
                  </span>
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

  let nextThemeId = themes[0].id;
  let nextLevelIdx = 0;

  const findNextInTheme = (themeId: string) => {
    const category = vocabCategories.find(c => c.themeId === themeId);
    if (!category) return null;
    const totalLevels = Math.ceil(category.words.length / 7);
    const comp = completedLevels[themeId] || [];
    for (let i = 0; i < totalLevels; i++) {
      if (!comp.includes(i)) return i;
    }
    return null;
  };

  const nextIdxInLastTheme = findNextInTheme(lastPlayedThemeId);
  if (nextIdxInLastTheme !== null) {
    nextThemeId = lastPlayedThemeId;
    nextLevelIdx = nextIdxInLastTheme;
  } else {
    for (const theme of themes) {
      if (theme.progress < 100 && !theme.isLocked) {
        const nextIdx = findNextInTheme(theme.id);
        if (nextIdx !== null) {
          nextThemeId = theme.id;
          nextLevelIdx = nextIdx;
          break;
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto relative">
      <div className="absolute top-32 left-0 w-48 h-48 bg-[#7B8E61]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

      <TopBar title="Goi Kurosuwaado" showBack={false} onNavigate={onNavigate} />

      <div className="px-5 pt-6 pb-4 relative z-10">
        <h2 className="text-2xl font-bold text-[#2D2D2A] mb-2">Tema Kata Benda</h2>
        <p className="text-[#8B8B7A] text-sm">Pilih topik JLPT N4 untuk mulai mengisi teka-teki silang.</p>
      </div>

      <div className="px-5 space-y-4 mb-8 relative z-10">
        {themes.map((theme) => {
          const Icon = (Icons as any)[theme.icon] || Icons.HelpCircle;
          return (
            <button
              key={theme.id}
              onClick={() => {
                if (!theme.isLocked) setSelectedThemeId(theme.id);
              }}
              className={`w-full p-4 rounded-3xl border shadow-sm flex items-center space-x-4 transition-colors text-left relative overflow-hidden ${
                theme.isLocked 
                  ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-75' 
                  : 'bg-white border-[#E6E2D3] hover:border-[#7B8E61] active:scale-[0.98]'
              }`}
            >
              <div className={`absolute -right-4 -bottom-4 opacity-5 w-24 h-24 ${theme.color}`}>
                <Icon className="w-full h-full" />
              </div>

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.isLocked ? 'bg-gray-200 text-gray-400' : theme.bgColor}`}>
                {theme.isLocked ? <Icons.Lock className="w-6 h-6" /> : <Icon className={`w-7 h-7 ${theme.color}`} />}
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

      <div className="px-5 mb-6 relative z-10">
        <div className="bg-[#D4A373] rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute right-10 -bottom-10 w-24 h-24 bg-white/10 rounded-full" />

          <h3 className="font-medium text-white/90 mb-2">Lanjutkan Belajar</h3>
          <p className="text-lg font-semibold leading-tight mb-6 max-w-[200px]">
            Lanjut ke level berikutnya
          </p>
          <button
            onClick={() => onLevelSelect(nextThemeId, nextLevelIdx)}
            className="bg-[#F5F2ED] text-[#D4A373] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            LANJUTKAN
          </button>
        </div>
      </div>
    </div>
  );
}