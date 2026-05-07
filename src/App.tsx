import { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import LevelsScreen from './screens/LevelsScreen';
import VocabScreen from './screens/VocabScreen';
import QuizScreen from './screens/QuizScreen';
import { themes as initialThemes, APP_DATA as initialAppData, vocabCategories } from './data';

type ScreenState = 'home' | 'levels' | 'vocab' | 'quiz';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [activeThemeId, setActiveThemeId] = useState<string>('theme_0');
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);
  const [themes, setThemes] = useState(initialThemes);
  const [xp, setXp] = useState(initialAppData.xp);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('user_progress');
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        if (data.themes) setThemes(data.themes);
        if (data.xp) setXp(data.xp);
        if (data.lastPlayed) {
          setActiveThemeId(data.lastPlayed.themeId);
          setActiveLevelIndex(data.lastPlayed.levelIndex);
        }
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Push state again to prevent back
      window.history.pushState(null, '', window.location.href);
      
      setCurrentScreen(prev => {
        if (prev === 'quiz') return 'levels';
        if (prev === 'levels' || prev === 'vocab') return 'home';
        return prev;
      });
    };
    
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    const progressData = JSON.stringify({ themes, xp, lastPlayed: { themeId: activeThemeId, levelIndex: activeLevelIndex } });
    localStorage.setItem('user_progress', progressData);
  }, [themes, xp, activeThemeId, activeLevelIndex]);

  const navigateTo = (screen: ScreenState) => {
    setCurrentScreen(screen);
  };

  const startLevel = (themeId: string, levelIndex: number) => {
    setActiveThemeId(themeId);
    setActiveLevelIndex(levelIndex);
    setCurrentScreen('quiz');
  };

  const handleLevelComplete = (themeId: string, xpGain: number) => {
    const category = vocabCategories.find(c => c.themeId === themeId);
    let progressIncrement = 15;
    if (category) {
      const totalLevels = Math.ceil(category.count / 7);
      progressIncrement = Math.ceil(100 / totalLevels);
    }
    
    setThemes(prev => prev.map(t => 
      t.id === themeId 
        ? { ...t, progress: Math.min(100, t.progress + progressIncrement) }
        : t
    ));
    setXp(prev => prev + xpGain);
  };

  const overallProgress = Math.round(themes.reduce((sum, t) => sum + t.progress, 0) / themes.length) || 0;

  return (
    <div className="w-full h-screen h-[100dvh] bg-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md h-full mx-auto bg-white relative overflow-hidden shadow-2xl flex flex-col font-sans">
        <main className="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-[#F5F2ED]">
          {currentScreen === 'home' && (
            <HomeScreen 
              overallProgress={overallProgress}
              onPlay={() => navigateTo('levels')} 
              onVocab={() => navigateTo('vocab')}
              onNavigate={navigateTo}
            />
          )}
          {currentScreen === 'levels' && (
            <LevelsScreen 
              themes={themes} 
              onLevelSelect={startLevel} 
              lastPlayedThemeId={activeThemeId}
              lastPlayedLevelIndex={activeLevelIndex}
              onNavigate={navigateTo}
            />
          )}
          {currentScreen === 'vocab' && (
            <VocabScreen 
              onNavigate={navigateTo}
            />
          )}
          {currentScreen === 'quiz' && (
            <QuizScreen 
              themeId={activeThemeId} 
              levelIndex={activeLevelIndex}
              themeProgress={themes.find(t => t.id === activeThemeId)?.progress || 0}
              onBack={() => navigateTo('levels')} 
              onVocab={() => navigateTo('vocab')}
              onComplete={(xpGain) => handleLevelComplete(activeThemeId, xpGain)}
              onNavigate={navigateTo}
            />
          )}
        </main>
      </div>
    </div>
  );
}
