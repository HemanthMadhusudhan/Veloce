import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const input = 'public/logo.png';
  
  if (!fs.existsSync(input)) {
    console.error('public/logo.png not found!');
    process.exit(1);
  }

  try {
    // Generate favicon.png (256x256)
    await sharp(input)
      .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile('public/favicon.png');
    console.log('Generated public/favicon.png (256x256)');

    // Generate apple-touch-icon.png (180x180) - iOS prefers solid background, often white for logos
    // The logo has a black background or is black on transparent. Let's make it on a white background for apple-touch-icon
    await sharp(input)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toFile('public/apple-touch-icon.png');
    console.log('Generated public/apple-touch-icon.png (180x180)');
    
    // Generate og-image.png (1200x630) for Google Showcase
    // Let's create a nice showcase image with the logo in the center
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      {
        input: await sharp(input).resize(400, 400, { fit: 'contain' }).toBuffer(),
        gravity: 'center'
      }
    ])
    .toFile('public/og-image.png');
    console.log('Generated public/og-image.png (1200x630)');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
