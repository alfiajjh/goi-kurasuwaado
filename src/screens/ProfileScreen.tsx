import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Settings, PenLine, Zap, Flame, Puzzle, Languages, Bell, HelpCircle, LogOut } from 'lucide-react';
import { APP_DATA } from '../data';

type Props = {
  onBack?: () => void;
};

export default function ProfileScreen({ onBack }: Props) {
  const [name, setName] = useState('Pengguna');
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const handleLogout = () => {
    setName('Pengguna');
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] overflow-y-auto pb-24 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-[#4A4A40] hover:bg-[#F5F2ED] rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-[#2D2D2A]">Profile</h1>
        <button className="p-2 -mr-2 text-[#0056A8] hover:bg-[#F5F2ED] rounded-full">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="px-5 pt-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-28 h-28 bg-[#1A1A17] rounded-full flex items-center justify-center overflow-hidden outline outline-4 outline-white outline-offset-[-2px] shadow-sm">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white/20 mt-4">
              <path fill="currentColor" d="M50,10 C38.95,10 30,18.95 30,30 C30,41.05 38.95,50 50,50 C61.05,50 70,41.05 70,30 C70,18.95 61.05,10 50,10 Z M50,55 C33.33,55 0,63.33 0,80 L0,90 L100,90 L100,80 C100,63.33 66.67,55 50,55 Z" />
            </svg>
          </div>
          <button 
             className="absolute bottom-0 right-0 w-8 h-8 bg-[#0056A8] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white"
             onClick={() => setIsEditingName(true)}
          >
            <PenLine className="w-4 h-4" />
          </button>
        </div>

        {/* Name */}
        <div className="flex flex-col items-center mb-8 w-full">
          {isEditingName ? (
            <input 
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
              className="text-2xl font-bold text-[#2D2D2A] bg-transparent border-b-2 border-[#0056A8] text-center w-full max-w-[200px] outline-none"
            />
          ) : (
            <h2 
               className="text-2xl font-bold text-[#2D2D2A] cursor-pointer relative"
               onClick={() => setIsEditingName(true)}
            >
              <span className="relative z-10">{name}</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-[#E1EDF8] -z-0 rounded-full translate-y-[-4px]"></span>
            </h2>
          )}
          <p className="text-[#4A4A40] text-sm mt-1">JLPT N4 Explorer</p>
        </div>

        {/* Top Stats */}
        <div className="flex w-full space-x-4 mb-4">
          <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="w-10 h-10 bg-[#E1EDF8] text-[#0056A8] rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="text-2xl font-bold text-[#0056A8]">1,250</div>
            <div className="text-[10px] font-bold text-[#8B8B7A] tracking-widest uppercase">TOTAL XP</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="w-10 h-10 bg-[#FCECD4] text-[#D4A373] rounded-xl flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div className="text-2xl font-bold text-[#8B6E3A]">14</div>
            <div className="text-[10px] font-bold text-[#8B8B7A] tracking-widest uppercase">DAY STREAK</div>
          </div>
        </div>

        {/* Completed Stats */}
        <div className="w-full bg-white rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm mb-4">
           <div className="w-10 h-10 bg-[#E2F5E9] text-[#29A354] rounded-xl flex items-center justify-center mb-2">
              <Puzzle className="w-5 h-5 fill-current" />
            </div>
            <div className="text-3xl font-bold text-[#1B7038]">42</div>
            <div className="text-[10px] font-bold text-[#8B8B7A] tracking-widest uppercase">COMPLETED</div>
        </div>

        {/* Daily Goal */}
        <div className="w-full bg-white rounded-2xl p-5 shadow-sm mb-8">
           <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-lg font-bold text-[#2D2D2A]">Daily Goal</h3>
                <p className="text-sm text-[#4A4A40]">Almost there! 3 more puzzles to go.</p>
              </div>
              <span className="text-lg font-bold text-[#0056A8]">70%</span>
           </div>
           <div className="w-full h-3 bg-[#F5F2ED] rounded-full overflow-hidden relative">
              <div className="h-full bg-[#0056A8] w-[70%] rounded-full absolute top-0 left-0"></div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
              </div>
           </div>
        </div>

        {/* Preferences */}
        <div className="w-full mb-4">
          <h4 className="text-xs font-bold text-[#8B8B7A] tracking-widest uppercase mb-3">PREFERENCES</h4>
          
          <div className="bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden mb-4">
             <button className="flex items-center px-4 py-4 w-full text-left active:bg-slate-50 transition-colors border-b border-[#F5F2ED]">
                <div className="w-10 h-10 bg-[#F5F2ED] text-[#4A4A40] flex items-center justify-center rounded-xl mr-4 shrink-0">
                  <Languages className="w-5 h-5" />
                </div>
                <span className="flex-1 text-[#2D2D2A] font-medium">Language Settings</span>
                <span className="text-[#8B8B7A]">›</span>
             </button>

             <button className="flex items-center px-4 py-4 w-full text-left active:bg-slate-50 transition-colors border-b border-[#F5F2ED]">
                <div className="w-10 h-10 bg-[#F5F2ED] text-[#4A4A40] flex items-center justify-center rounded-xl mr-4 shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="flex-1 text-[#2D2D2A] font-medium">Notification Preferences</span>
                <span className="text-[#8B8B7A]">›</span>
             </button>

             <button className="flex items-center px-4 py-4 w-full text-left active:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-[#F5F2ED] text-[#4A4A40] flex items-center justify-center rounded-xl mr-4 shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="flex-1 text-[#2D2D2A] font-medium">Help & Support</span>
                <span className="text-[#8B8B7A]">›</span>
             </button>
          </div>

          <button 
            onClick={handleLogout}
            className="bg-[#FFF5F5] rounded-2xl w-full flex items-center px-4 py-4 text-left active:bg-[#FFEBEB] transition-colors border border-[#FFEBEB]"
          >
             <div className="w-10 h-10 bg-[#FFEBEB] text-[#D32F2F] flex items-center justify-center rounded-xl mr-4 shrink-0">
               <LogOut className="w-5 h-5" />
             </div>
             <span className="flex-1 text-[#D32F2F] font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
