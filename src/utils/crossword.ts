export function generateCrossword(words: { answer: string, hint: string }[]) {
  if (words.length === 0) return { gridSize: { rows: 0, cols: 0 }, words: [] };

  const MAX_ATTEMPTS = 50;
  let bestLayout: any = null;
  let bestScore = -1000000;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Shuffle words for different layouts, but keep the longest word first on attempt 0
    let currentWords = [...words];
    if (attempt === 0) {
      currentWords.sort((a, b) => b.answer.length - a.answer.length);
    } else {
      currentWords.sort(() => Math.random() - 0.5);
    }

    const placedWords: any[] = [];
    const grid = new Map<string, { char: string, wordId: number, direction: string }>();
    let idCounter = 1;

    function isValidPlacement(word: string, startR: number, startC: number, direction: string) {
      let intersects = false;
      const beforeR = direction === 'down' ? startR - 1 : startR;
      const beforeC = direction === 'across' ? startC - 1 : startC;
      if (grid.has(`${beforeR},${beforeC}`)) return false; 
      
      const afterR = direction === 'down' ? startR + word.length : startR;
      const afterC = direction === 'across' ? startC + word.length : startC;
      if (grid.has(`${afterR},${afterC}`)) return false; 

      for (let i = 0; i < word.length; i++) {
        const r = direction === 'down' ? startR + i : startR;
        const c = direction === 'across' ? startC + i : startC;
        
        if (grid.has(`${r},${c}`)) {
          if (grid.get(`${r},${c}`)!.char !== word[i]) return false;
          intersects = true;
        } else {
          if (direction === 'down') {
            if (grid.has(`${r},${c - 1}`) || grid.has(`${r},${c + 1}`)) return false;
          } else {
            if (grid.has(`${r - 1},${c}`) || grid.has(`${r + 1},${c}`)) return false;
          }
        }
      }
      return intersects;
    }

    function placeWord(wordObj: any, startR: number, startC: number, direction: string) {
      const word = wordObj.answer;
      placedWords.push({
        id: idCounter, direction, row: startR, col: startC, answer: word, hint: wordObj.hint
      });
      for (let i = 0; i < word.length; i++) {
        const r = direction === 'down' ? startR + i : startR;
        const c = direction === 'across' ? startC + i : startC;
        grid.set(`${r},${c}`, { char: word[i], wordId: idCounter, direction });
      }
      idCounter++;
    }

    placeWord(currentWords[0], 0, 0, 'across');
    let unplaced = currentWords.slice(1);
    let changed = true;

    while (changed && unplaced.length > 0) {
      changed = false;
      const nextUnplaced = [];

      for (const wordObj of unplaced) {
        const word = wordObj.answer;
        let placed = false;
        
        const possiblePlacements = [];
        for (const [pos, cellData] of grid.entries()) {
          const [rStr, cStr] = pos.split(',');
          const r = parseInt(rStr);
          const c = parseInt(cStr);

          for (let i = 0; i < word.length; i++) {
            if (word[i] === cellData.char) {
              const newDir = cellData.direction === 'across' ? 'down' : 'across';
              const startR = newDir === 'down' ? r - i : r;
              const startC = newDir === 'across' ? c - i : c;
              if (isValidPlacement(word, startR, startC, newDir)) {
                possiblePlacements.push({ startR, startC, newDir });
              }
            }
          }
        }

        if (possiblePlacements.length > 0) {
          const placement = possiblePlacements[Math.floor(Math.random() * possiblePlacements.length)];
          placeWord(wordObj, placement.startR, placement.startC, placement.newDir);
          placed = true;
          changed = true;
        }

        if (!placed) {
          nextUnplaced.push(wordObj);
        }
      }
      unplaced = nextUnplaced;
    }

    let minR = 1000, minC = 1000, maxR = -1000, maxC = -1000;
    for (const pos of grid.keys()) {
      const [r, c] = pos.split(',').map(Number);
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
      if (c < minC) minC = c;
      if (c > maxC) maxC = c;
    }
    
    // Fallback if grid is empty (shouldn't happen since first word is always placed)
    if (minR === 1000) { minR = 0; maxR = 0; minC = 0; maxC = 0; }

    const area = (maxR - minR + 1) * (maxC - minC + 1);
    const score = (placedWords.length * 10000) - area;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = {
        placedWords: [...placedWords],
        unplaced: [...unplaced],
        minR, minC, maxR, maxC
      };
    }
    
    if (placedWords.length === currentWords.length && attempt > 10) {
        break;
    }
  }

  const finalPlacedWords = bestLayout.placedWords;
  let idCount = 1;
  for (const w of finalPlacedWords) w.id = idCount++;
  
  for (const wordObj of bestLayout.unplaced) {
    wordObj.id = idCount++;
    wordObj.direction = 'across';
    wordObj.row = bestLayout.maxR + 2;
    wordObj.col = bestLayout.minC;
    finalPlacedWords.push(wordObj);
    bestLayout.maxR += 2; 
  }

  let finalMaxR = 0, finalMaxC = 0;
  for (const w of finalPlacedWords) {
    w.row -= bestLayout.minR;
    w.col -= bestLayout.minC;
    const endRow = w.direction === 'down' ? w.row + w.answer.length - 1 : w.row;
    const endCol = w.direction === 'across' ? w.col + w.answer.length - 1 : w.col;
    if (endRow > finalMaxR) finalMaxR = endRow;
    if (endCol > finalMaxC) finalMaxC = endCol;
  }

  return {
    gridSize: { rows: finalMaxR + 1, cols: finalMaxC + 1 },
    words: finalPlacedWords
  };
}
