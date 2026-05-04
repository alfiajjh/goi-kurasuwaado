import React from 'react';
import { ArrowLeft, Flame, Settings } from 'lucide-react';
import { APP_DATA } from '../data';

type TopBarProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
};

export default function TopBar({ title, showBack, onBack, rightElement, transparent }: TopBarProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-4 ${transparent ? 'bg-transparent text-white' : 'bg-white border-b border-[#E6E2D3] text-[#2D2D2A]'} z-10 sticky top-0`}>
      <div className="flex items-center space-x-3">
        {showBack && (
          <button onClick={onBack} className={`p-2 -ml-2 rounded-full transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-[#7B8E61] hover:bg-[#F5F2ED]'}`}>
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        {!showBack && (
          <div className="w-8 h-8 rounded-full hidden" /> // Spacer for alignment if no back button
        )}
        <h1 className={`text-lg font-bold ${transparent ? 'text-white' : 'text-[#7B8E61]'}`}>{title}</h1>
      </div>
      <div className="flex items-center space-x-3">
        {rightElement ? (
          rightElement
        ) : (
          <>
            <div className={`flex items-center space-x-1.5 border shadow-sm rounded-full px-3 py-1.5 ${transparent ? 'bg-white/10 border-white/20' : 'bg-white border-[#E6E2D3]'}`}>
              <Flame className={`w-4 h-4 ${transparent ? 'text-orange-400 fill-orange-400' : 'text-[#D4A373] fill-[#D4A373]'}`} />
              <span className={`text-sm font-semibold ${transparent ? 'text-white' : 'text-[#4A4A40]'}`}>{APP_DATA.xp}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
