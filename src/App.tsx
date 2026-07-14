import { useState, useEffect, useRef } from 'react';
import HomeScreen from './screens/HomeScreen';
import LevelsScreen from './screens/LevelsScreen';
import VocabScreen from './screens/VocabScreen';
import QuizScreen from './screens/QuizScreen';
import UsernameScreen from './screens/UsernameScreen';
import { themes as initialThemes, APP_DATA as initialAppData, vocabCategories } from './data';
import { AnimatePresence } from 'motion/react';

type ScreenState = 'username' | 'home' | 'levels' | 'vocab' | 'quiz';

export default function App() {
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(
    () => (localStorage.getItem('username') || '') ? 'home' as ScreenState : 'username' as ScreenState
  );
  const [activeThemeId, setActiveThemeId] = useState<string>('theme_0');
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);
  const [themes, setThemes] = useState(initialThemes);
  const [xp, setXp] = useState(initialAppData.xp);
  const [completedLevels, setCompletedLevels] = useState<Record<string, number[]>>({});
const historyRef = useRef<ScreenState[]>(['home']);
const currentScreenRef = useRef<ScreenState>('home');
const goBackRef = useRef<() => void>(() => {});
const [showExitConfirm, setShowExitConfirm] = useState(false);
const [pendingBackAction, setPendingBackAction] = useState<(() => void) | null>(null);
const isLoadedRef = useRef(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('user_progress');
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        if (data.themes) setThemes(data.themes);
        if (data.xp) setXp(data.xp);
        if (data.completedLevels) setCompletedLevels(data.completedLevels);
        if (data.lastPlayed) {
          setActiveThemeId(data.lastPlayed.themeId);
          setActiveLevelIndex(data.lastPlayed.levelIndex);
        }
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
    isLoadedRef.current = true;
  }, []);

useEffect(() => {
  const handlePopState = (e: PopStateEvent) => {
    if (currentScreenRef.current === 'home') {
      return;
    }

    e.preventDefault();
    window.history.pushState(null, '', window.location.href);

    if (currentScreenRef.current === 'quiz') {
      setPendingBackAction(() => goBackRef.current);
      setShowExitConfirm(true);
    } else {
      goBackRef.current();
    }
  };

  window.history.pushState(null, '', window.location.href);
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);

  // Save progress to localStorage
  useEffect(() => {
    if (!isLoadedRef.current) return;
    const progressData = JSON.stringify({ themes, xp, completedLevels, lastPlayed: { themeId: activeThemeId, levelIndex: activeLevelIndex } });
    localStorage.setItem('user_progress', progressData);
  }, [themes, xp, completedLevels, activeThemeId, activeLevelIndex]);

const navigateTo = (screen: string) => {
  const state = screen as ScreenState;
  setCurrentScreen(state);
  historyRef.current.push(state);
  currentScreenRef.current = state;
};

const goBack = () => {
  if (historyRef.current.length <= 1) return;
  historyRef.current.pop();
  const previousScreen = historyRef.current[historyRef.current.length - 1];
  setCurrentScreen(previousScreen);
  currentScreenRef.current = previousScreen;
};
goBackRef.current = goBack;

const handleUsernameSubmit = (name: string) => {
  localStorage.setItem('username', name);
  setUsername(name);
  navigateTo('home');
};

  const startLevel = (themeId: string, levelIndex: number) => {
    setActiveThemeId(themeId);
    setActiveLevelIndex(levelIndex);
    navigateTo('quiz');
  };

  const handleLevelComplete = (themeId: string, levelIndex: number, xpGain: number) => {
    const themeCompleted = completedLevels[themeId] || [];
    if (themeCompleted.includes(levelIndex)) return;
    
    setCompletedLevels(prev => ({
      ...prev,
      [themeId]: [...(prev[themeId] || []), levelIndex]
    }));

    const category = vocabCategories.find(c => c.themeId === themeId);
    let progressIncrement = 15;
    if (category) {
      const totalLevels = Math.ceil(category.count / 7);
      progressIncrement = Math.ceil(100 / totalLevels);
    }
    
    setThemes(prev => {
      const newThemes = [...prev];
      const tIdx = newThemes.findIndex(t => t.id === themeId);
      if (tIdx === -1) return prev;
      
      const newProgress = Math.min(100, newThemes[tIdx].progress + progressIncrement);
      newThemes[tIdx] = { ...newThemes[tIdx], progress: newProgress };
      
      if (newProgress === 100 && tIdx + 1 < newThemes.length) {
        newThemes[tIdx + 1] = { ...newThemes[tIdx + 1], isLocked: false };
      }
      
      return newThemes;
    });
    setXp(prev => prev + xpGain);
  };

  const handleExitRequest = () => {
    setPendingBackAction(() => goBack);
    setShowExitConfirm(true);
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    if (pendingBackAction) {
      pendingBackAction();
      setPendingBackAction(null);
    }
  };

  const handleExitCancel = () => {
    setShowExitConfirm(false);
    setPendingBackAction(null);
  };

  const overallProgress = Math.round(themes.reduce((sum: number, t: {progress: number}) => sum + t.progress, 0) / themes.length) || 0;

  return (
    <div className="w-full h-dvh bg-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md h-full mx-auto bg-white relative overflow-hidden shadow-2xl flex flex-col font-sans">
        <main className="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-[#F5F2ED]">
          <div key={currentScreen} className="w-full h-full screen-enter screen-active">
            {currentScreen === 'username' && (
              <UsernameScreen onSubmit={handleUsernameSubmit} />
            )}
            {currentScreen === 'home' && (
              <HomeScreen 
                overallProgress={overallProgress}
                onPlay={() => navigateTo('levels')} 
                onVocab={() => navigateTo('vocab')}
                onNavigate={navigateTo}
                username={username}
                themes={themes}
              />
            )}
            {currentScreen === 'levels' && (
              <LevelsScreen 
                themes={themes} 
                onLevelSelect={startLevel} 
                lastPlayedThemeId={activeThemeId}
                lastPlayedLevelIndex={activeLevelIndex}
                onNavigate={navigateTo}
                completedLevels={completedLevels}
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
                onBack={goBack}
                onExitRequest={handleExitRequest}
                onVocab={() => navigateTo('vocab')}
                onComplete={(xpGain) => handleLevelComplete(activeThemeId, activeLevelIndex, xpGain)}
                onNavigate={navigateTo}
                showExitConfirm={showExitConfirm}
                onExitConfirm={handleExitConfirm}
                onExitCancel={handleExitCancel}
              />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}