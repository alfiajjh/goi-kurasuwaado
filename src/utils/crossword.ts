type Point = {
  x: number;
  y: number;
};

type PlacedWord = {
  word: string;
  start: Point;
  direction: 'across' | 'down';
};

type CrosswordResult = {
  grid: string[][];
  words: PlacedWord[];
};

function generateCrossword(words: string[]): CrosswordResult {
  if (words.length === 0) {
    return {
      grid: [[]],
      words: []
    };
  }

  // Sort words by length (descending) to place longer words first
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  let bestLayout: CrosswordResult | null = null;
  
  // Try placing each word as the first word
  for (let i = 0; i < Math.min(sortedWords.length, 5); i++) {
    const firstWord = sortedWords[i];
    const remainingWords = sortedWords.filter((_, index) => index !== i);
    
    // Try both horizontal and vertical placement for the first word
    for (const direction of ['across', 'down'] as const) {
      const layout = attemptLayout(firstWord, direction, remainingWords);
      if (layout && (!bestLayout || layout.words.length > bestLayout.words.length)) {
        bestLayout = layout;
      }
    }
  }
  
  return bestLayout ?? {
    grid: [['']],
    words: []
  };
}

function attemptLayout(
  firstWord: string,
  firstDirection: 'across' | 'down',
  words: string[]
): CrosswordResult | null {
  const placedWords: PlacedWord[] = [];
  
  // Place the first word at center (0,0) for simplicity
  const startPoint: Point = { x: 0, y: 0 };
  placedWords.push({
    word: firstWord,
    start: startPoint,
    direction: firstDirection
  });
  
  // Try to place remaining words
  const unplaced = [...words];
  let progress = true;
  
  while (progress && unplaced.length > 0) {
    progress = false;
    for (let i = 0; i < unplaced.length; i++) {
      const word = unplaced[i];
      const placement = findBestPlacement(word, placedWords);
      if (placement) {
        placedWords.push(placement);
        unplaced.splice(i, 1);
        progress = true;
        break;
      }
    }
  }
  
  if (placedWords.length === 0) return null;
  
  // Find minX and minY to shift
  let minX = 0, minY = 0;
  for (const placed of placedWords) {
    minX = Math.min(minX, placed.start.x);
    minY = Math.min(minY, placed.start.y);
  }
  
  // Shift all placed words so top-left is 0,0
  for (const placed of placedWords) {
    placed.start.x -= minX;
    placed.start.y -= minY;
  }
  
  // Create grid from placed words
  const grid = createGrid(placedWords);
  
  return {
    grid,
    words: placedWords
  };
}

function findBestPlacement(
  word: string,
  placedWords: PlacedWord[]
): PlacedWord | null {
  let bestPlacement: PlacedWord | null = null;
  let maxOverlaps = 0;
  
  // Try to place the word crossing each already placed word
  for (const placed of placedWords) {
    const crossings = findCrossings(word, placed.word);
    
    for (const [wordIndex, placedIndex] of crossings) {
      // Calculate start position for current word based on crossing
      let startPoint: Point;
      let direction: 'across' | 'down';
      
      if (placed.direction === 'across') {
        // Placed word is horizontal, we can cross vertically (down)
        startPoint = {
          x: placed.start.x + placedIndex,
          y: placed.start.y - wordIndex
        };
        direction = 'down';
        
        if (canPlaceWord(word, startPoint, direction, placedWords)) {
          const overlaps = countOverlaps(word, startPoint, direction, placedWords);
          if (overlaps > maxOverlaps) {
            maxOverlaps = overlaps;
            bestPlacement = { word, start: startPoint, direction };
          }
        }
      } else {
        // Placed word is vertical, try horizontal crossing
        startPoint = {
          x: placed.start.x - wordIndex,
          y: placed.start.y + placedIndex
        };
        direction = 'across';
        
        if (canPlaceWord(word, startPoint, direction, placedWords)) {
          const overlaps = countOverlaps(word, startPoint, direction, placedWords);
          if (overlaps > maxOverlaps) {
            maxOverlaps = overlaps;
            bestPlacement = { word, start: startPoint, direction };
          }
        }
      }
    }
  }
  
  return bestPlacement;
}

function findCrossings(word1: string, word2: string): [number, number][] {
  const crossings: [number, number][] = [];
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i] === word2[j]) {
        crossings.push([i, j]);
      }
    }
  }
  return crossings;
}

function canPlaceWord(
  word: string,
  start: Point,
  direction: 'across' | 'down',
  placedWords: PlacedWord[]
): boolean {
  for (let i = -1; i <= word.length; i++) {
    const pos = getPositionAt(start, direction, i);
    const isWordCell = i >= 0 && i < word.length;
    
    let occupiedBy: { char: string, direction: 'across' | 'down' } | null = null;
    for (const placed of placedWords) {
      const existingPos = findLetterPosition(placed, pos);
      if (existingPos !== null) {
        occupiedBy = { char: placed.word[existingPos], direction: placed.direction };
        break;
      }
    }

    if (isWordCell) {
      if (occupiedBy) {
        if (occupiedBy.char !== word[i] || occupiedBy.direction === direction) {
          return false;
        }
      } else {
        const adj1 = direction === 'across' ? { x: pos.x, y: pos.y - 1 } : { x: pos.x - 1, y: pos.y };
        const adj2 = direction === 'across' ? { x: pos.x, y: pos.y + 1 } : { x: pos.x + 1, y: pos.y };
        
        for (const adj of [adj1, adj2]) {
          for (const placed of placedWords) {
            if (findLetterPosition(placed, adj) !== null) {
              return false;
            }
          }
        }
      }
    } else {
      if (occupiedBy) {
        return false;
      }
    }
  }
  
  return true;
}

function getPositionAt(start: Point, direction: 'across' | 'down', offset: number): Point {
  if (direction === 'across') {
    return { x: start.x + offset, y: start.y };
  } else {
    return { x: start.x, y: start.y + offset };
  }
}

function findLetterPosition(placed: PlacedWord, point: Point): number | null {
  if (placed.direction === 'across') {
    if (point.y === placed.start.y) {
      const offset = point.x - placed.start.x;
      if (offset >= 0 && offset < placed.word.length) {
        return offset;
      }
    }
  } else {
    if (point.x === placed.start.x) {
      const offset = point.y - placed.start.y;
      if (offset >= 0 && offset < placed.word.length) {
        return offset;
      }
    }
  }
  return null;
}

function countOverlaps(
  word: string,
  start: Point,
  direction: 'across' | 'down',
  placedWords: PlacedWord[]
): number {
  let overlaps = 0;
  for (let i = 0; i < word.length; i++) {
    const pos = getPositionAt(start, direction, i);
    for (const placed of placedWords) {
      const existingPos = findLetterPosition(placed, pos);
      if (existingPos !== null && placed.word[existingPos] === word[i]) {
        overlaps++;
        break;
      }
    }
  }
  return overlaps;
}

function createGrid(placedWords: PlacedWord[]): string[][] {
  if (placedWords.length === 0) return [['']];
  
  // Find bounds
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  
  for (const placed of placedWords) {
    const start = placed.start;
    const end = getPositionAt(
      start, 
      placed.direction, 
      placed.word.length - 1
    );
    
    minX = Math.min(minX, start.x, end.x);
    maxX = Math.max(maxX, start.x, end.x);
    minY = Math.min(minY, start.y, end.y);
    maxY = Math.max(maxY, start.y, end.y);
  }
  
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  
  // Initialize grid with empty strings
  const grid: string[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(''));
  
  // Fill in the words
  for (const placed of placedWords) {
    const start = placed.start;
    for (let i = 0; i < placed.word.length; i++) {
      const pos = getPositionAt(start, placed.direction, i);
      const gridX = pos.x - minX;
      const gridY = pos.y - minY;
      
      if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
        grid[gridY][gridX] = placed.word[i];
      }
    }
  }
  
  return grid;
}

export { generateCrossword };

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export type { CrosswordResult, PlacedWord };