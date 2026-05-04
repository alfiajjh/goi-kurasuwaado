export function generateCrossword(words: { answer: string, hint: string }[]) {
  if (words.length === 0) return { gridSize: { rows: 0, cols: 0 }, words: [] };

  // Sort words by length descending for better interlocking
  const sortedWords = [...words].sort((a, b) => b.answer.length - a.answer.length);
  
  const placedWords: any[] = [];
  const grid = new Map<string, { char: string, wordId: number, direction: string }>();

  let idCounter = 1;

  function placeWord(wordObj: any, startR: number, startC: number, direction: string) {
    const word = wordObj.answer;
    placedWords.push({
      id: idCounter,
      direction,
      row: startR,
      col: startC,
      answer: word,
      hint: wordObj.hint
    });

    for (let i = 0; i < word.length; i++) {
       const r = direction === 'down' ? startR + i : startR;
       const c = direction === 'across' ? startC + i : startC;
       grid.set(`${r},${c}`, { char: word[i], wordId: idCounter, direction });
    }
    idCounter++;
  }

  function isValidPlacement(word: string, startR: number, startC: number, direction: string) {
    let intersects = false;
    
    // Check bounding boxes (before and after word)
    const beforeR = direction === 'down' ? startR - 1 : startR;
    const beforeC = direction === 'across' ? startC - 1 : startC;
    if (grid.has(`${beforeR},${beforeC}`)) return false; // Head blocked

    const afterR = direction === 'down' ? startR + word.length : startR;
    const afterC = direction === 'across' ? startC + word.length : startC;
    if (grid.has(`${afterR},${afterC}`)) return false; // Tail blocked

    for (let i = 0; i < word.length; i++) {
       const r = direction === 'down' ? startR + i : startR;
       const c = direction === 'across' ? startC + i : startC;
       
       if (grid.has(`${r},${c}`)) {
          // Cell is occupied
          if (grid.get(`${r},${c}`)!.char !== word[i]) return false; // Letter mismatch
          // Same letter, so it's an intersection
          intersects = true;
       } else {
          // Cell is empty, check neighbors perpendicular to avoid touching adjacent words
          if (direction === 'down') {
             if (grid.has(`${r},${c - 1}`) || grid.has(`${r},${c + 1}`)) return false;
          } else {
             if (grid.has(`${r - 1},${c}`) || grid.has(`${r + 1},${c}`)) return false;
          }
       }
    }
    return intersects; // Must intersect at least one to be a valid *crossed* word placement
  }

  // Place first word horizontally at 0,0
  placeWord(sortedWords[0], 0, 0, 'across');

  // Try placing the rest
  const backlog = [];
  for (let w = 1; w < sortedWords.length; w++) {
    const wordObj = sortedWords[w];
    const word = wordObj.answer;
    let placed = false;

    // Search for intersection opportunities
    for (const [pos, cellData] of grid.entries()) {
       if (placed) break;
       const [rStr, cStr] = pos.split(',');
       const r = parseInt(rStr);
       const c = parseInt(cStr);

       // Check if letter matches any letter in current word
       for (let i = 0; i < word.length; i++) {
          if (word[i] === cellData.char) {
             // Potential intersection
             const newDir = cellData.direction === 'across' ? 'down' : 'across';
             const startR = newDir === 'down' ? r - i : r;
             const startC = newDir === 'across' ? c - i : c;

             if (isValidPlacement(word, startR, startC, newDir)) {
                placeWord(wordObj, startR, startC, newDir);
                placed = true;
                break;
             }
          }
       }
    }

    if (!placed) {
       backlog.push(wordObj);
    }
  }

  // Handle words that couldn't be intersected
  for (const wordObj of backlog) {
     let maxR = -1;
     for (const key of grid.keys()) {
        const [r] = key.split(',').map(Number);
        if (r > maxR) maxR = r;
     }
     placeWord(wordObj, maxR + 2, 0, 'across');
  }

  // Normalize coordinates so grid starts at 0,0
  let minR = 1000, minC = 1000;
  for (const w of placedWords) {
     if (w.row < minR) minR = w.row;
     if (w.col < minC) minC = w.col;
  }

  let finalMaxR = 0, finalMaxC = 0;
  for (const w of placedWords) {
     w.row -= minR;
     w.col -= minC;
     const endRow = w.direction === 'down' ? w.row + w.answer.length - 1 : w.row;
     const endCol = w.direction === 'across' ? w.col + w.answer.length - 1 : w.col;
     if (endRow > finalMaxR) finalMaxR = endRow;
     if (endCol > finalMaxC) finalMaxC = endCol;
  }

  return {
    gridSize: { rows: finalMaxR + 1, cols: finalMaxC + 1 },
    words: placedWords
  };
}
