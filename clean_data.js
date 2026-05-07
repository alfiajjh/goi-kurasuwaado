import fs from 'fs';

const filePath = 'src/data.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Parse out duplicate romaji within the same category to simplify.
// Actually, let's just do a regex replace to remove specific duplicates we know about
// or use a short script to build a Set per theme.

let categoryRegex = /themeId: "(.*?)",\s*themeName: ".*?",\s*count: \d+,\s*icon: ".*?",\s*words: \[([\s\S]*?)\]\s*\}/g;

let match;
let categories = [];

while ((match = categoryRegex.exec(content)) !== null) {
  let themeId = match[1];
  let wordsStr = match[2];
  
  let wordRegex = /\{\s*kanji: "(.*?)",\s*romaji: "(.*?)",\s*indonesian: "(.*?)"\s*\}/g;
  let wordMatch;
  let words = [];
  let seenRomaji = new Set();
  let duplicateCount = 0;
  
  let cleanWordsStr = wordsStr;
  
  // Find all words, keep track of romaji
  let wordsArray = [];
  while ((wordMatch = wordRegex.exec(wordsStr)) !== null) {
    let fullMatch = wordMatch[0];
    let kanji = wordMatch[1];
    let romaji = wordMatch[2];
    
    if (seenRomaji.has(romaji)) {
      // It's a duplicate, we should remove this from the string
      cleanWordsStr = cleanWordsStr.replace(fullMatch + ',', ''); // Try removing with comma
      cleanWordsStr = cleanWordsStr.replace(fullMatch, '');       // Or without comma if last
      duplicateCount++;
    } else {
      seenRomaji.add(romaji);
      wordsArray.push({ kanji, romaji });
    }
  }
  
  if (duplicateCount > 0) {
    // clean up empty lines and trailing commas
    cleanWordsStr = cleanWordsStr.replace(/,\s*,/g, ',');
    
    let newCategoryStr = match[0].replace(wordsStr, cleanWordsStr);
    
    // update count
    let newCount = wordsArray.length;
    newCategoryStr = newCategoryStr.replace(/count: \d+/, `count: ${newCount}`);
    
    content = content.replace(match[0], newCategoryStr);
  }
}

// Clean up trailing commas before closing brackets
content = content.replace(/,\s*\]/g, '\n    ]');

fs.writeFileSync(filePath, content, 'utf-8');
console.log("data.ts cleaned successfully.");
