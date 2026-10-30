// scripts/generate.js
const fs = require('fs');
const path = require('path');

const IGNORE_FILES = ['index.html', 'template.html', '404.html'];
const rootDir = path.resolve(__dirname, '..');

// Lấy danh sách file html
const files = fs.readdirSync(rootDir).filter(file => {
  return file.endsWith('.html') && !IGNORE_FILES.includes(file) && !file.startsWith('.');
});

const videos = files.map(file => {
  const filePath = path.join(rootDir, file);
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // Lấy title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : file.replace('.html', '');

  // Lấy ngày sửa đổi cuối cùng của file để làm mốc thời gian sắp xếp
  const stats = fs.statSync(filePath);
  const updatedAt = stats.mtime.getTime(); 

  return {
    name: file,
    title: title,
    updatedAt: updatedAt
  };
});

// Sắp xếp video mới nhất lên đầu
videos.sort((a, b) => b.updatedAt - a.updatedAt);

// Ghi ra file videos.json
fs.writeFileSync(
  path.join(rootDir, 'videos.json'), 
  JSON.stringify(videos, null, 2)
);

console.log(`Đã tạo videos.json với ${videos.length} video.`);
