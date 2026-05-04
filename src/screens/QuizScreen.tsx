import { useState, useEffect, useMemo, useRef } from 'react';
import TopBar from '../components/TopBar';
import { vocabCategories, themes } from '../data';
import { generateCrossword } from '../utils/crossword';
import { Timer, Star, CheckCircle2, X } from 'lucide-react';

type Props = {
  themeId: string;
  levelIndex: number;
  onBack: () => void;
  onVocab?: () => void;
};

// Keyboard Component
const Keyboard = ({ onKeyPress, onDelete, onEnter }: { onKeyPress: (key: string) => void, onDelete: () => void, onEnter: () => void }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Del', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Cek']
  ];

  return (
    <div className="bg-[#2D2D2A] px-2 py-3 rounded-t-2xl shadow-[0_-10px_20px_rgba(0,0,0,0.2)] w-full max-w-md mx-auto">
      <div className="w-10 h-1 bg-[#4A4A45] rounded-full mx-auto mb-3" />
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center space-x-1 mb-1">
          {row.map(key => {
            const isSpecial = key === 'Del' || key === 'Cek';
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === 'Del') onDelete();
                  else if (key === 'Cek') onEnter();
                  else onKeyPress(key);
                }}
                className={`${isSpecial ? 'w-10 text-xs font-semibold' : 'w-8 text-sm font-bold'} aspect-square bg-[#4A4A45] text-white rounded flex items-center justify-center shadow-sm active:bg-[#3A3A35] active:scale-95 transition-all`}
              >
                {key === 'Del' ? <X className="w-4 h-4" /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default function QuizScreen({ themeId, levelIndex, onBack, onVocab }: Props) {
  const data = useMemo(() => {
    const category = vocabCategories.find(c => c.themeId === themeId);
    if (!category) return { gridSize: { rows: 0, cols: 0 }, words: [] };
    
    // Get the 7 words for this specific level
    const wordsForLevel = category.words
      .slice(levelIndex * 7, (levelIndex + 1) * 7)
      .map(w => ({
        answer: w.romaji.toUpperCase().replace(/[^A-Z]/g, ''),
        hint: w.indonesian
      }));
      
    return generateCrossword(wordsForLevel);
  }, [themeId, levelIndex]);

  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [quizStatus, setQuizStatus] = useState<'playing' | 'success' | 'failed' | 'results'>('playing');

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
    
    setSelectedCell({ r, c });
    
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

  const handleKeyPress = (key: string) => {
    const sCell = latestSelectedCell.current || selectedCell;
    if (!sCell) return;
    const { r, c } = sCell;
    setAnswers(prev => ({ ...prev, [`${r}-${c}`]: key }));
    
    // Clear error
    const cellKey = `${r}-${c}`;
    if (wrongCells.has(cellKey)) {
      const newWg = new Set(wrongCells);
      newWg.delete(cellKey);
      setWrongCells(newWg);
    }

    // Move to next cell automatically
    const word = data.words.find(w => w.id === activeWordId);
    if (!word) return;

    if (word.direction === 'across') {
      if (c + 1 < data.gridSize.cols && !grid[r][c+1].isBlock && grid[r][c+1].wordIds.includes(word.id)) {
        const nextCell = { r, c: c + 1 };
        latestSelectedCell.current = nextCell;
        setSelectedCell(nextCell);
      }
    } else {
      if (r + 1 < data.gridSize.rows && !grid[r+1][c].isBlock && grid[r+1][c].wordIds.includes(word.id)) {
        const nextCell = { r: r + 1, c };
        latestSelectedCell.current = nextCell;
        setSelectedCell(nextCell);
      }
    }
  };

  const checkAnswers = () => {
    let hasMistake = false;
    const wrongs = new Set<string>();

    for (let r = 0; r < data.gridSize.rows; r++) {
      for (let c = 0; c < data.gridSize.cols; c++) {
        const cell = grid[r][c];
        if (!cell.isBlock) {
          const val = answers[`${r}-${c}`];
          if (!val || val !== cell.correct) {
            hasMistake = true;
            wrongs.add(`${r}-${c}`);
          }
        }
      }
    }

    if (hasMistake) {
      setWrongCells(wrongs);
    } else {
      setQuizStatus('success');
      setSelectedCell(null);
    }
  };

  const restartQuiz = () => {
    setTimeLeft(3 * 60);
    setAnswers({});
    setSelectedCell(null);
    setWrongCells(new Set());
    setQuizStatus('playing');
  };

  const handleDelete = () => {
    const sCell = latestSelectedCell.current || selectedCell;
    if (!sCell) return;
    const { r, c } = sCell;
    
    if (answers[`${r}-${c}`]) {
      // Delete current cell's content
      const newAns = { ...answers };
      delete newAns[`${r}-${c}`];
      setAnswers(newAns);
    } else {
      // Step back and delete
      const word = data.words.find(w => w.id === activeWordId);
      if (!word) return;

      let prevR = r, prevC = c;
      if (word.direction === 'across') {
        if (c - 1 >= 0 && !grid[r][c-1].isBlock && grid[r][c-1].wordIds.includes(word.id)) {
          prevC = c - 1;
        }
      } else {
        if (r - 1 >= 0 && !grid[r-1][c].isBlock && grid[r-1][c].wordIds.includes(word.id)) {
          prevR = r - 1;
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

    for (let i = 0; i < word.answer.length; i++) {
      const r = word.direction === 'down' ? word.row + i : word.row;
      const c = word.direction === 'across' ? word.col + i : word.col;
      if (!answers[`${r}-${c}`]) {
        targetR = r;
        targetC = c;
        break;
      }
    }

    const nextCell = { r: targetR, c: targetC };
    latestSelectedCell.current = nextCell;
    setSelectedCell(nextCell);
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
        currentHandleKeyPress.current(e.key.toUpperCase());
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
      <TopBar 
        title="Goi Kurosuwaado" 
        showBack={true} 
        onBack={onBack}
        transparent={true}
        rightElement={
          <div className="flex items-center space-x-2 bg-white/10 text-[#7B8E61] px-3 py-1.5 rounded-lg text-sm font-bold font-mono">
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto pb-72">
        <div className="px-5 mb-5 w-full flex justify-between items-center mt-2">
           <div className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold tracking-widest uppercase">{themeTitle} - Level {levelIndex + 1}</div>
           <div className="flex items-center space-x-2 text-[#7B8E61] text-sm font-bold">
             <span>Kemajuan 0%</span>
           </div>
        </div>

        {/* The Grid Box */}
        <div className="mx-5 mb-6 flex items-center justify-center">
          <div 
            className="grid gap-[2px] w-full" 
            style={{ 
              gridTemplateColumns: `repeat(${data.gridSize.cols}, minmax(0, 1fr))`,
              maxWidth: '300px'
            }}
          >
            {grid.map((row, r) => 
               row.map((cell, c) => {
                 if (cell.isBlock) {
                   return <div key={`${r}-${c}`} className="aspect-square bg-[#1A1A17] rounded-[4px]"></div>;
                 }
                 
                 const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                 const isActiveWord = cell.wordIds?.includes(activeWordId);
                 const isWrong = wrongCells.has(`${r}-${c}`);
                 
                 // If results mode, show correct answer instead (or just disable clicking)
                 const val = quizStatus === 'results' ? cell.correct : (answers[`${r}-${c}`] || '');

                 return (
                   <div 
                     key={`${r}-${c}`} 
                     onClick={() => handleCellClick(r, c)}
                     className={`aspect-square relative flex items-center justify-center font-bold text-xl rounded-[4px] transition-colors shadow-sm
                       ${quizStatus === 'playing' ? 'cursor-pointer' : 'cursor-default'}
                       ${isWrong ? 'bg-red-500 text-white ring-2 ring-red-300 z-10' :
                         isSelected ? 'bg-[#7B8E61] text-white ring-2 ring-white/50 z-10' : 
                         isActiveWord ? 'bg-white text-black ring-1 ring-white/20' : 
                         'bg-white/90 text-black ring-1 ring-white/20'}
                     `}
                   >
                     {cell.number && (
                       <span className={`absolute top-0.5 left-1 text-[9px] leading-none ${isSelected || isWrong ? 'text-white/80' : 'text-slate-500'} font-bold`}>{cell.number}</span>
                     )}
                     <span>{val}</span>
                   </div>
                 )
               })
            )}
          </div>
        </div>

        <div className="px-5">
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

      {/* Virtual Keyboard */}
      {selectedCell && quizStatus === 'playing' && (
        <div className="absolute bottom-0 left-0 w-full z-50 transform translate-y-0 transition-transform bg-[#2D2D2A]">
           <div className="bg-[#2D2D2A] p-3 border-t border-[#4A4A45]/50 flex justify-center">
             <button 
                onClick={checkAnswers}
                className="w-full max-w-sm bg-[#D4A373] text-white font-bold py-2.5 rounded-lg text-sm hover:bg-[#C28E5C] transition-colors shadow-md active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>CEK JAWABAN</span>
              </button>
           </div>
           <Keyboard 
             onKeyPress={handleKeyPress} 
             onDelete={handleDelete} 
             onEnter={checkAnswers} 
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
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">XP EARNED</span>
                  <span className="text-xl font-bold text-amber-500 flex items-center">⚡ +50</span>
                </div>
                <div className="flex-1 bg-slate-100 rounded-2xl py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">TOTAL TIME</span>
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
