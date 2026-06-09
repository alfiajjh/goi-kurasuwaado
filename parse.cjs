const fs = require('fs');

const content = fs.readFileSync('vocab.txt', 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

const categories = [];
let currentCategory = null;

const icons = ['Home', 'Plane', 'Users', 'Briefcase', 'ShoppingBag', 'Hand', 'CloudRain', 'Heart'];
let iconIndex = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.match(/^\d+\./)) {
    const themeName = line.replace(/^\d+\.\s*/, '');
    currentCategory = {
      themeId: `theme_${iconIndex}`,
      themeName,
      count: 0,
      icon: icons[iconIndex % icons.length],
      words: []
    };
    iconIndex++;
    categories.push(currentCategory);
  } else if (line.startsWith('Bahasa Jepang')) {
    // Header line, skip
  } else if (currentCategory && line) {
    const parts = line.split('\t');
    if (parts.length >= 3) {
      currentCategory.words.push({
        kanji: parts[0].trim(),
        romaji: parts[1].trim(),
        indonesian: parts[2].trim()
      });
      currentCategory.count++;
    }
  }
}

fs.writeFileSync('parsed_vocab.json', JSON.stringify(categories, null, 2));
console.log('Done parsing.');
