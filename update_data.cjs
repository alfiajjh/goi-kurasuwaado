const fs = require('fs');

const categories = JSON.parse(fs.readFileSync('parsed_vocab.json', 'utf8'));

// Generate data.ts content
const dataTsContent = `export const APP_DATA = {
  xp: 1240,
  overallProgress: 65,
};

export const themes = [
  { id: 'theme_0', title: 'Aktivitas Sehari-hari', subtitle: 'Rutinitas & Kebutuhan', icon: 'Home', progress: 80, isLocked: false, color: 'text-[#7B8E61]', bgColor: 'bg-[#FBF9F6]' },
  { id: 'theme_1', title: 'Pergerakan & Arah', subtitle: 'Transportasi', icon: 'Plane', progress: 45, isLocked: false, color: 'text-[#D4A373]', bgColor: 'bg-[#FBF9F6]' },
  { id: 'theme_2', title: 'Komunikasi', subtitle: 'Interaksi Sosial', icon: 'Users', progress: 12, isLocked: false, color: 'text-[#8B8B7A]', bgColor: 'bg-[#FBF9F6]' },
  { id: 'theme_3', title: 'Pekerjaan & Belajar', subtitle: 'Aktivitas Kognitif', icon: 'Briefcase', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_4', title: 'Transaksi', subtitle: 'Kepemilikan Barang', icon: 'ShoppingBag', progress: 0, isLocked: false, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_5', title: 'Tindakan Fisik', subtitle: 'Manipulasi Objek', icon: 'Hand', progress: 0, isLocked: true, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_6', title: 'Kondisi & Keadaan', subtitle: 'Perubahan Alam', icon: 'CloudRain', progress: 0, isLocked: true, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
  { id: 'theme_7', title: 'Bahasa Hormat', subtitle: 'Keigo', icon: 'Heart', progress: 0, isLocked: true, color: 'text-slate-400', bgColor: 'bg-[#F5F2ED]' },
];

export const vocabCategories = ${JSON.stringify(categories, null, 2).replace(/"([^"]+)":/g, '$1:')};

export const quizData = {
  'theme_0': {
    gridSize: { rows: 5, cols: 5 },
    words: [
      { id: 1, direction: 'down', row: 0, col: 2, answer: 'TABERU', hint: 'Makan' },
      { id: 2, direction: 'across', row: 2, col: 0, answer: 'ASOBU', hint: 'Bermain' },
    ]
  }
};
`;

fs.writeFileSync('src/data.ts', dataTsContent);
console.log('Updated data.ts');
