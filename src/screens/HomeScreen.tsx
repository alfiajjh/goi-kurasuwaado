import { Play, BookOpen, Star } from 'lucide-react';
import TopBar from '../components/TopBar';
import { APP_DATA } from '../data';

type Props = {
  overallProgress: number;
  onPlay: () => void;
  onVocab: () => void;
  onNavigate?: (screen: string) => void;
};

export default function HomeScreen({ overallProgress, onPlay, onVocab, onNavigate }: Props) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#F5F2ED] relative">
      <TopBar title="Goi Kurosuwaado" showBack={false} onNavigate={onNavigate} />

      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-full h-64 bg-gradient-to-b from-[#7B8E61]/5 to-transparent pointer-events-none" />
      <div className="absolute top-28 right-0 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#7B8E61]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="px-6 pt-8 pb-6 flex flex-col items-center relative z-10">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-4 text-[#7B8E61] opacity-10"><BookOpen className="w-24 h-24" /></div>
        <div className="absolute top-32 right-4 text-[#D4A373] opacity-20">
           <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>

        {/* Hero Graphic */}
        <div className="w-48 h-48 bg-white p-2 rounded-3xl shadow-sm border border-[#E6E2D3] mb-8 relative z-10">
          <div className="w-full h-full bg-[#7B8E61] rounded-2xl overflow-hidden relative border-4 border-white flex flex-col items-center justify-center shadow-inner">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
            </svg>
          </div>
        </div>

        <div className="text-center mb-8 px-4 relative z-10">
          <div className="inline-block border-l-4 border-[#7B8E61] pl-3 text-left w-full mb-3">
             <h1 className="text-3xl font-bold text-[#2D2D2A] tracking-tight mb-0.5">Goi Kurosuwaado</h1>
             <p className="text-[#8B8B7A] font-medium text-sm">JLPT N4 Vocabulary Training</p>
          </div>
        </div>

        <button 
          onClick={onPlay}
          className="w-full max-w-sm bg-[#7B8E61] hover:bg-[#687951] text-white rounded-xl py-4 flex items-center justify-center space-x-3 shadow-md transition-all active:scale-[0.98]"
        >
          <Play className="w-6 h-6 fill-white" />
          <span className="text-lg font-bold tracking-wide">MULAI MAIN</span>
        </button>
      </div>

      <div className="px-6 mb-4 relative z-10">
        <button onClick={onVocab} className="w-full bg-white p-5 rounded-3xl text-left hover:bg-[#FBF9F6] transition-colors border border-[#E6E2D3] shadow-sm flex items-center space-x-4 active:scale-[0.98]">
          <div className="bg-[#F5F2ED] p-3 rounded-2xl">
            <BookOpen className="w-6 h-6 text-[#D4A373]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2D2D2A] mb-1 leading-tight">Bank Kosakata</h3>
            <p className="text-xs text-[#8B8B7A]">Tinjau seluruh kosakata JLPT N4</p>
          </div>
        </button>
      </div>

      <div className="px-6 mb-8 relative z-10">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#E6E2D3] flex flex-col space-y-3">
          <div className="flex justify-between items-end">
            <span className="font-semibold text-[#2D2D2A]">Progres N4</span>
            <span className="text-sm font-bold text-[#7B8E61]">{overallProgress}%</span>
          </div>
          <div className="w-full bg-[#F5F2ED] h-3.5 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-[#7B8E61] rounded-full relative" 
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 text-[#D4A373]">
                <Star className="w-full h-full fill-[#D4A373]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
