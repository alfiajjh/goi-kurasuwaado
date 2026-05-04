import { Home, Grid, User, BookOpen } from 'lucide-react';

type BottomNavProps = {
  currentScreen: string;
  onNavigate: (screen: string) => void;
};

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const isNavVisible = ['home', 'levels', 'vocab', 'profile'].includes(currentScreen);
  
  if (!isNavVisible) return null;

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-[#E6E2D3] flex justify-around items-center pb-safe pt-2 px-4 pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-40">
      <NavItem 
        icon={<Home className="w-6 h-6" />} 
        label="Beranda" 
        isActive={currentScreen === 'home'} 
        onClick={() => onNavigate('home')} 
      />
      <NavItem 
        icon={<Grid className="w-6 h-6" />} 
        label="Level" 
        isActive={currentScreen === 'levels'} 
        onClick={() => onNavigate('levels')} 
      />
      <NavItem 
        icon={<BookOpen className="w-6 h-6" />} 
        label="Kosa Kata" 
        isActive={currentScreen === 'vocab'} 
        onClick={() => onNavigate('vocab')} 
      />
      <NavItem 
        icon={<User className="w-6 h-6" />} 
        label="Profil" 
        isActive={currentScreen === 'profile'} 
        onClick={() => onNavigate('profile')} 
      />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${isActive ? 'text-[#7B8E61]' : 'text-[#8B8B7A] hover:text-[#4A4A40]'}`}
    >
      <div className={`${isActive ? 'bg-[#FBF9F6] text-[#7B8E61]' : ''} p-1.5 rounded-xl transition-all duration-300`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
