// Generate PWA icons from SVGs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../client/public/icons');

// Create directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Icon sizes to generate
const sizes = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'scan-96x96.png', size: 96 },
  { name: 'meds-96x96.png', size: 96 },
  { name: 'badge-96x96.png', size: 96 }
];

// Function to convert SVG to PNG
async function svgToPng(svgPath, pngPath, size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const image = await loadImage(svgPath);
  ctx.drawImage(image, 0, 0, size, size);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(pngPath, buffer);
}

// Main function
async function generateIcons() {
  try {
    // Generate main app icons from SVG
    const mainIconSvg = path.join(ICONS_DIR, 'icon.svg');
    if (fs.existsSync(mainIconSvg)) {
      for (const icon of sizes) {
        const outPath = path.join(ICONS_DIR, icon.name);
        await svgToPng(mainIconSvg, outPath, icon.size);
        console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
      }
    } else {
      console.error('Main icon SVG not found');
    }
    
    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();