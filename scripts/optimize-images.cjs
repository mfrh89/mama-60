const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const folders = [
  'src/assets/images/masonry',
  'src/assets/images/slider',
];

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Skip if WebP already exists and is newer
  if (fs.existsSync(outputPath)) {
    const originalStat = fs.statSync(filePath);
    const webpStat = fs.statSync(outputPath);
    if (webpStat.mtime > originalStat.mtime) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} (WebP exists)`);
      return;
    }
  }

  try {
    const info = await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(filePath).size;
    const savings = ((1 - info.size / originalSize) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(filePath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
}

async function processFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      await optimizeImage(filePath);
    }
  }
}

async function main() {
  console.log('🖼️  Optimizing images to WebP...\n');
  
  for (const folder of folders) {
    console.log(`\n📁 Processing ${folder}...`);
    await processFolder(folder);
  }
  
  console.log('\n✨ Done!');
}

main();
