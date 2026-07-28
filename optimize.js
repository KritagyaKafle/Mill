const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const srcDir = 'public/images/hero-frames/src';
const destDir = 'public/images/hero-frames';
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jpg')).sort();

const totalFrames = files.length;
const targetFrames = 80;
const step = totalFrames / targetFrames;

const selectedFiles = [];
for (let i = 0; i < targetFrames; i++) {
  const index = Math.floor(i * step);
  if (index < totalFrames) {
    selectedFiles.push(files[index]);
  }
}

async function processFrames() {
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const srcPath = path.join(srcDir, file);
    const outName = String(i + 1).padStart(3, '0') + '.webp';
    const destPath = path.join(destDir, outName);
    
    await sharp(srcPath)
      .resize(1280, 720)
      .webp({ quality: 80 })
      .toFile(destPath);
  }
  console.log('Optimization complete!');
}
processFrames();
