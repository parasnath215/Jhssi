const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const assestsDir = path.join(publicDir, 'Assests');
const researchDir = path.join(publicDir, 'Research_Papers');
const archivesJsonPath = path.join(__dirname, 'src', 'data', 'archives.json');

const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const QUARTER_NAMES = [
  "Jan-{Y} to Mar-{Y}",
  "Apr-{Y} to Jun-{Y}",
  "Jul-{Y} to Sep-{Y}",
  "Oct-{Y} to Dec-{Y}"
];

function getQuarterIndex(month) {
  if (month >= 1 && month <= 3) return 0;
  if (month >= 4 && month <= 6) return 1;
  if (month >= 7 && month <= 9) return 2;
  if (month >= 10 && month <= 12) return 3;
  return -1;
}

const data = {};
YEARS.forEach(y => {
  data[y] = [
    { name: QUARTER_NAMES[0].replace(/{Y}/g, y), papers: [] },
    { name: QUARTER_NAMES[1].replace(/{Y}/g, y), papers: [] },
    { name: QUARTER_NAMES[2].replace(/{Y}/g, y), papers: [] },
    { name: QUARTER_NAMES[3].replace(/{Y}/g, y), papers: [] },
  ];
});

// Process Assests
if (fs.existsSync(assestsDir)) {
  const years = fs.readdirSync(assestsDir);
  for (const year of years) {
    if (!YEARS.includes(year)) continue;
    const yearDir = path.join(assestsDir, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;

    const files = fs.readdirSync(yearDir);
    for (const file of files) {
      if (!file.toLowerCase().endsWith('.pdf')) continue;
      
      // Extract month from file name (e.g. "01-2019, 1-7.pdf")
      const match = file.match(/^(\d{2})-(\d{4})/);
      if (match) {
        const month = parseInt(match[1], 10);
        const y = match[2];
        const qIdx = getQuarterIndex(month);
        
        if (qIdx !== -1 && data[y]) {
          data[y][qIdx].papers.push({
            name: file,
            url: `/Assests/${y}/${encodeURIComponent(file)}`
          });
        }
      }
    }
  }
}

// Process Research_Papers
if (fs.existsSync(researchDir)) {
  const years = fs.readdirSync(researchDir);
  for (const year of years) {
    if (!YEARS.includes(year)) continue;
    const yearDir = path.join(researchDir, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;

    const quarters = fs.readdirSync(yearDir);
    for (const q of quarters) {
      const qDir = path.join(yearDir, q);
      if (!fs.statSync(qDir).isDirectory()) continue;
      
      const qIdx = QUARTER_NAMES.findIndex(n => n.replace(/{Y}/g, year) === q);
      if (qIdx === -1) continue;

      const files = fs.readdirSync(qDir);
      for (const file of files) {
        if (!file.toLowerCase().endsWith('.pdf')) continue;
        
        data[year][qIdx].papers.push({
          name: file,
          url: `/Research_Papers/${year}/${encodeURIComponent(q)}/${encodeURIComponent(file)}`
        });
      }
    }
  }
}

const finalOutput = YEARS.map(y => ({
  year: y,
  quarters: data[y]
}));

fs.writeFileSync(archivesJsonPath, JSON.stringify(finalOutput, null, 2));
console.log('Successfully updated archives.json');
