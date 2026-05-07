import React, { useState } from 'react';
import { ArrowLeft, Menu, X, Home, BookOpen, Star, RotateCcw } from 'lucide-react';
import { APP_DATA } from '../data';

type TopBarProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
  onNavigate?: (screen: string) => void;
};

export default function TopBar({ title, showBack, onBack, rightElement, transparent, onNavigate }: TopBarProps) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className={`flex items-center justify-between px-4 py-4 ${transparent ? 'bg-transparent text-white' : 'bg-white border-b border-[#E6E2D3] text-[#2D2D2A]'} z-20 sticky top-0`}>
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
          {rightElement}
          <button 
            onClick={() => setShowMenu(true)}
            className={`p-2 -mr-2 rounded-full transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-[#7B8E61] hover:bg-[#F5F2ED]'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-[9998] bg-black/60 transition-opacity" onClick={() => setShowMenu(false)}>
          <div 
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col transform transition-transform" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E6E2D3] bg-[#F5F2ED]">
              <h2 className="font-bold text-lg text-[#2D2D2A]">Menu</h2>
              <button onClick={() => setShowMenu(false)} className="p-2 -mr-2 rounded-full hover:bg-black/5 text-[#4A4A40]">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col py-4 px-3 space-y-2 overflow-y-auto">
              <button 
                onClick={() => { setShowMenu(false); onNavigate?.('home'); }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-[#FBF9F6] active:bg-[#F5F2ED] transition-colors text-left"
              >
                <div className="bg-[#E6E2D3] p-2 rounded-lg text-[#4A4A40]"><Home className="w-5 h-5" /></div>
                <span className="font-semibold text-[#2D2D2A]">Beranda / Progress</span>
              </button>
              
              <button 
                onClick={() => { setShowMenu(false); onNavigate?.('levels'); }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-[#FBF9F6] active:bg-[#F5F2ED] transition-colors text-left"
              >
                <div className="bg-[#E6E2D3] p-2 rounded-lg text-[#4A4A40]"><Star className="w-5 h-5" /></div>
                <span className="font-semibold text-[#2D2D2A]">Level</span>
              </button>
              
              <button 
                onClick={() => { setShowMenu(false); onNavigate?.('vocab'); }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-[#FBF9F6] active:bg-[#F5F2ED] transition-colors text-left"
              >
                <div className="bg-[#E6E2D3] p-2 rounded-lg text-[#4A4A40]"><BookOpen className="w-5 h-5" /></div>
                <span className="font-semibold text-[#2D2D2A]">Bank Kosakata</span>
              </button>
              
              <div className="my-4 border-t border-[#E6E2D3]"></div>
              
              <button 
                onClick={() => { setShowMenu(false); setShowResetModal(true); }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors text-left"
              >
                <div className="bg-red-100 p-2 rounded-lg text-red-600"><RotateCcw className="w-5 h-5" /></div>
                <span className="font-semibold text-red-600">Reset Progres</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
