import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, '../public/no bg png sequence');
const outputDir = join(__dirname, '../public/no bg webp sequence');

// Get all PNG files and sort them
const files = readdirSync(inputDir)
  .filter(file => file.endsWith('.png'))
  .sort();

console.log(`Found ${files.length} PNG files to convert...`);

let converted = 0;
let errors = 0;

for (const file of files) {
  const inputPath = join(inputDir, file);
  const outputFile = file.replace('.png', '.webp');
  const outputPath = join(outputDir, outputFile);
  
  try {
    // Use sharp to convert PNG to WebP with 85% quality and alpha channel
    // quality: 85 sets quality to 85%
    // alphaQuality: 100 preserves alpha channel quality
    await sharp(inputPath)
      .webp({ 
        quality: 85,
        alphaQuality: 100,
        effort: 6 // Higher effort = better compression but slower
      })
      .toFile(outputPath);
    
    converted++;
    if (converted % 10 === 0) {
      console.log(`Converted ${converted}/${files.length} files...`);
    }
  } catch (error) {
    console.error(`Error converting ${file}:`, error.message);
    errors++;
  }
}

console.log(`\nConversion complete!`);
console.log(`Successfully converted: ${converted} files`);
if (errors > 0) {
  console.log(`Errors: ${errors} files`);
}
