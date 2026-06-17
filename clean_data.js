import fs from 'fs';

const filePath = 'parsed_vocab.json';
const content = fs.readFileSync(filePath, 'utf-8');
const categories = JSON.parse(content);

for (const category of categories) {
  const seenRomaji = new Set();
  const newWords = [];
  
  for (const word of category.words) {
    if (!seenRomaji.has(word.romaji)) {
      seenRomaji.add(word.romaji);
      newWords.push(word);
    }
  }
  
  category.words = newWords;
  category.count = newWords.length;
}

fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8');
console.log("parsed_vocab.json cleaned successfully.");
