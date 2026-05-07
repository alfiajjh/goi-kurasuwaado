import { useState, useEffect, useMemo, useRef } from 'react';
import TopBar from '../components/TopBar';
import { vocabCategories, themes } from '../data';
import { generateCrossword } from '../utils/crossword';
import { Timer, Star, CheckCircle2, X, Brain } from 'lucide-react';

type Props = {
  themeId: string;
  levelIndex: number;
  themeProgress?: number;
  onBack: () => void;
  onVocab?: () => void;
  onComplete?: (xpGain: number) => void;
  onNavigate?: (screen: string) => void;
};

export default function QuizScreen({ themeId, levelIndex, themeProgress = 0, onBack, onVocab, onComplete, onNavigate }: Props) {
  const data = useMemo(() => {
    const category = vocabCategories.find(c => c.themeId === themeId);
    if (!category) return { gridSize: { rows: 0, cols: 0 }, words: [] };
    
    // Get the 7 words for this specific level, deduplicate by answer
    const rawWords = category.words
      .slice(levelIndex * 7, (levelIndex + 1) * 7)
      .map(w => ({
        answer: w.romaji.toUpperCase().replace(/[^A-Z]/g, ''),
        hint: w.indonesian
      }));
    
    // Remove duplicate answers — keep only the first occurrence
    const seen = new Set<string>();
    const wordsForLevel = rawWords.filter(w => {
      if (seen.has(w.answer)) return false;
      seen.add(w.answer);
      return true;
    });
      
    return generateCrossword(wordsForLevel);
  }, [themeId, levelIndex]);

  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [lockedCells, setLockedCells] = useState<Set<string>>(new Set());
  const [shakingCells, setShakingCells] = useState<Set<string>>(new Set());
  const [quizStatus, setQuizStatus] = useState<'playing' | 'success' | 'failed' | 'results'>('playing');
  const [isHardMode, setIsHardMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeTimeouts = useRef<NodeJS.Timeout[]>([]);
  const latestLockedCells = useRef(lockedCells);
  useEffect(() => { latestLockedCells.current = lockedCells; }, [lockedCells]);

  useEffect(() => {
    return () => {
      shakeTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  const themeTitle = useMemo(() => {
    const t = themes.find(t => t.id === themeId);
    return t ? t.title : 'Quiz';
  }, [themeId]);

  // Handle latest refs for keyboard
  const latestSelectedCell = useRef(selectedCell);
  const latestQuizStatus = useRef(quizStatus);
  useEffect(() => { latestSelectedCell.current = selectedCell; }, [selectedCell]);
  useEffect(() => { latestQuizStatus.current = quizStatus; }, [quizStatus]);

  // Timer logic
  useEffect(() => {
    if (quizStatus !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setQuizStatus('failed');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStatus]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Build grid layout from data
  const grid = useMemo(() => {
    const g: any[][] = Array(data.gridSize.rows).fill(null).map(() => 
      Array(data.gridSize.cols).fill(null).map(() => ({ isBlock: true }))
    );

    data.words.forEach(word => {
      let r = word.row;
      let c = word.col;
      for (let i = 0; i < word.answer.length; i++) {
        g[r][c] = {
          ...g[r][c],
          isBlock: false,
          correct: word.answer[i],
          number: i === 0 ? word.id : g[r][c].number,
          wordIds: [...(g[r][c].wordIds || []), word.id]
        };
        if (word.direction === 'across') c++;
        else r++;
      }
    });
    return g;
  }, [data]);

  const handleCellClick = (r: number, c: number) => {
    if (grid[r][c].isBlock) return;
    if (quizStatus === 'success' || quizStatus === 'results' || quizStatus === 'failed') return;
    // Don't select locked (correct) cells
    if (lockedCells.has(`${r}-${c}`)) return;
    
    setSelectedCell({ r, c });
    // Focus native keyboard
    setTimeout(() => inputRef.current?.focus(), 10);
    
    // Clear error for this cell
    const key = `${r}-${c}`;
    if (wrongCells.has(key)) {
      const newWg = new Set(wrongCells);
      newWg.delete(key);
      setWrongCells(newWg);
    }
    
    // Auto-select corresponding word
    const wIds = grid[r][c].wordIds;
    if (wIds && wIds.length > 0) {
       if (!wIds.includes(activeWordId)) {
          setActiveWordId(wIds[0]);
       }
    }
  };

  // Count total non-block cells for progress
  const totalCells = useMemo(() => {
    let count = 0;
    for (let r = 0; r < data.gridSize.rows; r++) {
      for (let c = 0; c < data.gridSize.cols; c++) {
        if (!grid[r]?.[c]?.isBlock) count++;
      }
    }
    return count;
  }, [grid, data]);

  // Check if all cells are locked (auto-complete)
  useEffect(() => {
    if (quizStatus !== 'playing' || totalCells === 0) return;
    if (lockedCells.size === totalCells) {
      setQuizStatus('success');
      setSelectedCell(null);
      if (onComplete) onComplete(50);
    }
  }, [lockedCells, totalCells, quizStatus]);

  const handleKeyPress = (key: string) => {
    const sCell = latestSelectedCell.current || selectedCell;
    if (!sCell) return;
    const { r, c } = sCell;
    const cellKey = `${r}-${c}`;

    // Don't allow editing locked cells
    if (latestLockedCells.current.has(cellKey)) return;

    setAnswers(prev => ({ ...prev, [cellKey]: key }));
    
    // Clear previous error
    if (wrongCells.has(cellKey)) {
      const newWg = new Set(wrongCells);
      newWg.delete(cellKey);
      setWrongCells(newWg);
    }

    const cell = grid[r][c];

    if (!isHardMode) {
      if (key === cell.correct) {
        latestLockedCells.current = new Set([...latestLockedCells.current, cellKey]);
        setLockedCells(latestLockedCells.current);
      } else {
        setShakingCells(prev => {
          const next = new Set(prev);
          next.add(cellKey);
          return next;
        });
        const timeoutId = setTimeout(() => {
          setShakingCells(prev => {
            const next = new Set(prev);
            next.delete(cellKey);
            return next;
          });
        }, 400);
        shakeTimeouts.current.push(timeoutId);
      }
    }

    // Move to next unlocked cell automatically
    const word = data.words.find(w => w.id === activeWordId);
    if (!word) return;

    const findNextUnlockedCell = () => {
      if (word.direction === 'across') {
        for (let nc = c + 1; nc < data.gridSize.cols; nc++) {
          if (!grid[r][nc].isBlock && grid[r][nc].wordIds.includes(word.id) && !latestLockedCells.current.has(`${r}-${nc}`)) {
            return { r, c: nc };
          }
        }
      } else {
        for (let nr = r + 1; nr < data.gridSize.rows; nr++) {
          if (!grid[nr][c].isBlock && grid[nr][c].wordIds.includes(word.id) && !latestLockedCells.current.has(`${nr}-${c}`)) {
            return { r: nr, c };
          }
        }
      }
      return null;
    };

    const nextCell = findNextUnlockedCell();
    if (nextCell) {
      latestSelectedCell.current = nextCell;
      setSelectedCell(nextCell);
    }
  };

  const checkAnswers = () => {
    let hasMistake = false;
    const wrongs = new Set<string>();
    const newShaking = new Set<string>();

    for (let r = 0; r < data.gridSize.rows; r++) {
      for (let c = 0; c < data.gridSize.cols; c++) {
        const cell = grid[r][c];
        const cellKey = `${r}-${c}`;
        if (!cell.isBlock && !lockedCells.has(cellKey)) {
          const val = answers[cellKey];
          if (!val || val !== cell.correct) {
            hasMistake = true;
            wrongs.add(cellKey);
            if (val) newShaking.add(cellKey);
          } else {
            // Lock correct cells found during check
            setLockedCells(prev => {
              const next = new Set(prev);
              next.add(cellKey);
              return next;
            });
          }
        }
      }
    }

    if (hasMistake) {
      setWrongCells(wrongs);
      setShakingCells(newShaking);
      const timeoutId = setTimeout(() => setShakingCells(new Set()), 400);
      shakeTimeouts.current.push(timeoutId);
    } else {
      setQuizStatus('success');
      setSelectedCell(null);
      if (onComplete) {
        onComplete(50);
      }
    }
  };

  const restartQuiz = () => {
    setTimeLeft(3 * 60);
    setAnswers({});
    setSelectedCell(null);
    setWrongCells(new Set());
    setLockedCells(new Set());
    setShakingCells(new Set());
    setQuizStatus('playing');
  };

  const handleDelete = () => {
    const sCell = latestSelectedCell.current || selectedCell;
    if (!sCell) return;
    const { r, c } = sCell;
    const cellKey = `${r}-${c}`;
    
    // Don't delete locked cells
    if (lockedCells.has(cellKey)) return;
    
    if (answers[cellKey]) {
      // Delete current cell's content
      const newAns = { ...answers };
      delete newAns[cellKey];
      setAnswers(newAns);
    } else {
      // Step back to previous unlocked cell and delete
      const word = data.words.find(w => w.id === activeWordId);
      if (!word) return;

      let prevR = r, prevC = c;
      if (word.direction === 'across') {
        for (let nc = c - 1; nc >= 0; nc--) {
          if (!grid[r][nc].isBlock && grid[r][nc].wordIds.includes(word.id) && !lockedCells.has(`${r}-${nc}`)) {
            prevC = nc;
            break;
          }
        }
      } else {
        for (let nr = r - 1; nr >= 0; nr--) {
          if (!grid[nr][c].isBlock && grid[nr][c].wordIds.includes(word.id) && !lockedCells.has(`${nr}-${c}`)) {
            prevR = nr;
            break;
          }
        }
      }

      if (prevR !== r || prevC !== c) {
        const nextCell = { r: prevR, c: prevC };
        latestSelectedCell.current = nextCell;
        setSelectedCell(nextCell);
        const newAns = { ...answers };
        delete newAns[`${prevR}-${prevC}`];
        setAnswers(newAns);
      }
    }
  };

  const handleHintClick = (wordId: number) => {
    setActiveWordId(wordId);
    const word = data.words.find(w => w.id === wordId);
    if (!word) return;

    let targetR = word.row;
    let targetC = word.col;
    let foundUnlocked = false;

    for (let i = 0; i < word.answer.length; i++) {
      const r = word.direction === 'down' ? word.row + i : word.row;
      const c = word.direction === 'across' ? word.col + i : word.col;
      const cellKey = `${r}-${c}`;
      if (!lockedCells.has(cellKey) && !answers[cellKey]) {
        targetR = r;
        targetC = c;
        foundUnlocked = true;
        break;
      }
    }

    // If all empty cells are filled, find first unlocked cell
    if (!foundUnlocked) {
      for (let i = 0; i < word.answer.length; i++) {
        const r = word.direction === 'down' ? word.row + i : word.row;
        const c = word.direction === 'across' ? word.col + i : word.col;
        if (!lockedCells.has(`${r}-${c}`)) {
          targetR = r;
          targetC = c;
          break;
        }
      }
    }

    const nextCell = { r: targetR, c: targetC };
    latestSelectedCell.current = nextCell;
    setSelectedCell(nextCell);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const currentHandleKeyPress = useRef(handleKeyPress);
  const currentHandleDelete = useRef(handleDelete);
  const currentCheckAnswers = useRef(checkAnswers);
  const currentHandleCellClick = useRef(handleCellClick);
  
  useEffect(() => { currentHandleKeyPress.current = handleKeyPress; });
  useEffect(() => { currentHandleDelete.current = handleDelete; });
  useEffect(() => { currentCheckAnswers.current = checkAnswers; });
  useEffect(() => { currentHandleCellClick.current = handleCellClick; });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (latestQuizStatus.current !== 'playing') return;
      if (!latestSelectedCell.current) return;

      if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement !== inputRef.current) {
          currentHandleKeyPress.current(e.key.toUpperCase());
        }
      } else if (e.key === 'Backspace') {
        currentHandleDelete.current();
      } else if (e.key === 'Enter') {
        currentCheckAnswers.current();
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const { r, c } = latestSelectedCell.current;
        let newR = r, newC = c;
        if (e.key === 'ArrowUp') newR -= 1;
        if (e.key === 'ArrowDown') newR += 1;
        if (e.key === 'ArrowLeft') newC -= 1;
        if (e.key === 'ArrowRight') newC += 1;

        if (
          newR >= 0 &&
          newR < data.gridSize.rows &&
          newC >= 0 &&
          newC < data.gridSize.cols &&
          !grid[newR][newC].isBlock
        ) {
          const nextCell = { r: newR, c: newC };
          latestSelectedCell.current = nextCell;
          currentHandleCellClick.current(newR, newC);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, grid]);

  // Group hints by direction
  const acrossWords = data.words.filter(w => w.direction === 'across');
  const downWords = data.words.filter(w => w.direction === 'down');

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-[#2D2D2A] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#7B8E61]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

      <TopBar 
        title="Goi Kurosuwaado" 
        showBack={true} 
        onBack={onBack}
        transparent={true}
        onNavigate={onNavigate}
        rightElement={
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsHardMode(!isHardMode)}
              className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${isHardMode ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-white/70'}`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{isHardMode ? 'HARD' : 'EASY'}</span>
            </button>
            <div className="flex items-center space-x-2 bg-white/10 text-[#7B8E61] px-3 py-1.5 rounded-lg text-sm font-bold font-mono">
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="px-5 py-2 w-full flex justify-between items-center shrink-0">
           <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold tracking-widest uppercase">{themeTitle} - Level {levelIndex + 1}</div>
           <div className="flex items-center space-x-2 text-[#7B8E61] text-sm font-bold">
             <span>Kemajuan {totalCells > 0 ? Math.round((lockedCells.size / totalCells) * 100) : 0}%</span>
           </div>
        </div>

        {/* The Grid Box - Fixed height and centered */}
        <div className="px-5 py-4 flex items-center justify-center shrink-0">
          <div 
            className="grid gap-[2px] w-full mx-auto" 
            style={{ 
              gridTemplateColumns: `repeat(${data.gridSize.cols}, minmax(0, 1fr))`,
              maxWidth: 'min(90vw, 400px)',
            }}
          >
            {grid.map((row, r) => 
               row.map((cell, c) => {
                 if (cell.isBlock) {
                   return <div key={`${r}-${c}`} className="aspect-square bg-[#1A1A17] rounded-[4px]"></div>;
                 }
                 
                 const cellKey = `${r}-${c}`;
                 const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                 const isActiveWord = cell.wordIds?.includes(activeWordId);
                 const isWrong = wrongCells.has(cellKey);
                 const isLocked = lockedCells.has(cellKey);
                 const isShaking = shakingCells.has(cellKey);
                 
                 // If results mode, show correct answer instead (or just disable clicking)
                 const val = quizStatus === 'results' ? cell.correct : (answers[cellKey] || '');

                 return (
                   <div 
                     key={`${r}-${c}-${isShaking ? 's' : ''}`} 
                     onClick={() => handleCellClick(r, c)}
                     className={`aspect-square relative flex items-center justify-center font-bold text-lg sm:text-xl rounded-[4px] transition-colors shadow-sm
                       ${isShaking ? 'animate-cell-shake' : ''}
                       ${isLocked ? 'animate-cell-correct' : ''}
                       ${isLocked ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 cursor-default' :
                         quizStatus === 'playing' ? 'cursor-pointer' : 'cursor-default'}
                       ${!isLocked && isWrong ? 'bg-red-500 text-white ring-2 ring-red-300 z-10' :
                         !isLocked && isSelected ? 'bg-[#7B8E61] text-white ring-2 ring-white/50 z-10' : 
                         !isLocked && isActiveWord ? 'bg-white text-black ring-1 ring-white/20' : 
                         !isLocked ? 'bg-white/90 text-black ring-1 ring-white/20' : ''}
                     `}
                   >
                     {cell.number && (
                       <span className={`absolute top-0.5 left-0.5 text-[8px] sm:text-[9px] leading-none ${isSelected || isWrong || isLocked ? 'text-white/80' : 'text-slate-500'} font-bold`}>{cell.number}</span>
                     )}
                     <span>{val}</span>
                   </div>
                 )
               })
            )}
          </div>
        </div>

        {/* Scrollable Hints Section */}
        <div className="flex-1 overflow-y-auto px-5 pb-32">
           <div className="space-y-3">
             {acrossWords.map(w => (
               <div 
                 key={w.id} 
                 onClick={() => handleHintClick(w.id)}
                 className={`p-3 rounded-xl border-l-[3px] transition-all cursor-pointer
                   ${activeWordId === w.id ? 'bg-[#3A3A35] border-[#7B8E61]' : 'bg-[#1A1A17]/50 border-[#4A4A45] hover:bg-[#1A1A17]'}
                 `}
               >
                 <div className="text-[10px] text-[#7B8E61] font-bold mb-1 uppercase tracking-widest">MENDATAR ({w.id})</div>
                 <div className="text-sm italic text-gray-300">"{w.hint}"</div>
               </div>
             ))}

             {downWords.map(w => (
               <div 
                 key={w.id} 
                 onClick={() => handleHintClick(w.id)}
                 className={`p-3 rounded-xl border-l-[3px] transition-all cursor-pointer
                   ${activeWordId === w.id ? 'bg-[#3A3A35] border-[#D4A373]' : 'bg-[#1A1A17]/50 border-[#4A4A45] hover:bg-[#1A1A17]'}
                 `}
               >
                 <div className="text-[10px] text-[#D4A373] font-bold mb-1 uppercase tracking-widest">MENURUN ({w.id})</div>
                 <div className="text-sm italic text-gray-300">"{w.hint}"</div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Native Keyboard Support & Action Button */}
      {selectedCell && quizStatus === 'playing' && (
        <div className="absolute bottom-0 left-0 w-full z-50 bg-[#2D2D2A] border-t border-[#4A4A45]/50 p-4 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
           <div className="max-w-md mx-auto">
             <button 
                onClick={checkAnswers}
                className="w-full bg-[#D4A373] text-white font-bold py-4 rounded-2xl text-base hover:bg-[#C28E5C] transition-colors shadow-lg active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>CEK JAWABAN</span>
              </button>
           </div>
           
           {/* Hidden input to trigger native keyboard */}
           <input
             ref={inputRef}
             type="text"
             className="absolute opacity-0 pointer-events-none"
             autoFocus
             autoCapitalize="characters"
             autoCorrect="off"
             spellCheck="false"
             value=""
             onChange={(e) => {
               const val = e.target.value.slice(-1).toUpperCase();
               if (/^[A-Z]$/.test(val)) {
                 handleKeyPress(val);
               }
               e.target.value = '';
             }}
           />
        </div>
      )}

      {/* Popovers */}
      {quizStatus === 'success' && (
        <div className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden flex flex-col pt-10 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-green-200" />
            <div className="relative z-10 flex flex-col items-center px-6 pb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-green-200">
                <Star className="w-12 h-12 text-green-700 fill-green-700" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Omedetou!</h2>
              <p className="text-slate-600 text-center mb-6">Kamu berhasil menyelesaikan teka-teki ini dengan tepat.</p>
              
              <div className="flex w-full space-x-4 mb-8">
                <div className="flex-1 bg-slate-100 rounded-2xl py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">PROGRES TEMA</span>
                  <span className="text-xl font-bold text-green-600 flex items-center">{themeProgress}%</span>
                </div>
                <div className="flex-1 bg-slate-100 rounded-2xl py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL WAKTU</span>
                  <span className="text-xl font-bold text-blue-700 flex items-center">⏱ {(180 - timeLeft)}s</span>
                </div>
              </div>

              <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={onBack}
                  className="w-full bg-[#0056A8] text-white font-bold py-4 rounded-xl text-lg hover:bg-[#00488B] transition-colors"
                >
                  Lanjut ke Level Berikutnya →
                </button>
                <button 
                  onClick={() => setQuizStatus('results')}
                  className="w-full bg-slate-200 text-slate-700 font-bold py-4 rounded-xl text-lg hover:bg-slate-300 transition-colors"
                >
                  Lihat Hasil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quizStatus === 'failed' && (
        <div className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden flex flex-col pt-10 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-red-200" />
            <div className="relative z-10 flex flex-col items-center px-6 pb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-red-200">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Failed!</h2>
              <p className="text-slate-600 text-center mb-6">Waktu Habis! Terus berlatih lagi ya.</p>

              <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={restartQuiz}
                  className="w-full bg-[#0056A8] text-white font-bold py-4 rounded-xl text-lg hover:bg-[#00488B] transition-colors"
                >
                  Mulai Ulang
                </button>
                <button 
                  onClick={() => onVocab ? onVocab() : onBack()}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-700 transition-colors"
                >
                  Lihat Bank Kosakata
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
