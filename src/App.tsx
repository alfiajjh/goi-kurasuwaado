import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LevelsScreen from './screens/LevelsScreen';
import VocabScreen from './screens/VocabScreen';
import QuizScreen from './screens/QuizScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';

type ScreenState = 'home' | 'levels' | 'vocab' | 'quiz' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [activeThemeId, setActiveThemeId] = useState<string>('theme_0');
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);

  const navigateTo = (screen: ScreenState) => {
    setCurrentScreen(screen);
  };

  const startLevel = (themeId: string, levelIndex: number) => {
    setActiveThemeId(themeId);
    setActiveLevelIndex(levelIndex);
    setCurrentScreen('quiz');
  };

  return (
    <div className="w-full h-screen h-[100dvh] bg-black">
      <div className="w-full max-w-md h-full mx-auto bg-white relative overflow-hidden shadow-2xl flex flex-col font-sans">
        <main className="flex-1 relative overflow-hidden">
          {currentScreen === 'home' && (
            <HomeScreen 
              onPlay={() => navigateTo('levels')} 
              onVocab={() => navigateTo('vocab')} 
            />
          )}
          {currentScreen === 'levels' && (
            <LevelsScreen onLevelSelect={startLevel} />
          )}
          {currentScreen === 'vocab' && (
            <VocabScreen />
          )}
          {currentScreen === 'quiz' && (
            <QuizScreen 
              themeId={activeThemeId} 
              levelIndex={activeLevelIndex}
              onBack={() => navigateTo('levels')} 
              onVocab={() => navigateTo('vocab')}
            />
          )}
          {currentScreen === 'profile' && (
            <ProfileScreen onBack={() => navigateTo('home')} />
          )}
        </main>
        
        <BottomNav currentScreen={currentScreen} onNavigate={(s) => navigateTo(s as ScreenState)} />
      </div>
    </div>
  );
}
