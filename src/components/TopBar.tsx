import React, { useState } from 'react';
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
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <>
      <div className={`flex items-center justify-between px-4 py-4 w-full ${transparent ? 'bg-transparent text-white' : 'bg-white border-b border-[#E6E2D3] shadow-sm text-[#2D2D2A]'} z-50 sticky top-0`}>
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
            <button 
              onClick={() => setShowResetModal(true)}
              className={`flex items-center space-x-1.5 border shadow-sm rounded-full px-3 py-1.5 transition-all active:scale-95 ${transparent ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-[#E6E2D3] hover:bg-red-50'}`}
            >
              <span className={`text-xs font-bold ${transparent ? 'text-white' : 'text-red-500'}`}>Reset Progres</span>
            </button>
          </>
        )}
      </div>

      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-xl flex flex-col items-center border border-[#E6E2D3]">
            <h3 className="text-xl font-bold text-[#2D2D2A] mb-2 text-center">Reset Progres</h3>
            <p className="text-sm text-[#8B8B7A] mb-6 text-center">Apakah yakin ingin direset?</p>
            <div className="flex w-full space-x-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#F5F2ED] text-[#4A4A40] font-bold hover:bg-[#E6E2D3] transition-colors"
              >
                Tidak
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('user_progress');
                  window.location.reload();
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-sm"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
