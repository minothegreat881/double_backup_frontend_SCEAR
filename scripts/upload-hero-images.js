// Script to upload SCEAR hero images to Cloudinary
// Run with: node scripts/upload-hero-images.js

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dii0wl9ke';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Using unsigned preset
const CLOUDINARY_FOLDER = 'scear-hero';

// Hero images to upload
const heroImages = [
  {
    localPath: '../public/images/gallery/roman-battle-formation.png',
    cloudinaryName: 'roman-battle-formation',
    description: 'História page hero'
  },
  {
    localPath: '../public/images/gallery/roman-festival.png',
    cloudinaryName: 'roman-festival',
    description: 'Podujatia page hero'
  },
  {
    localPath: '../public/images/gallery/roman-camp.png',
    cloudinaryName: 'roman-camp',
    description: 'Služby page hero'
  },
  {
    localPath: '../public/images/gallery/roman-formation.png',
    cloudinaryName: 'roman-formation',
    description: 'História články hero'
  }
];

async function uploadToCloudinary(imagePath, publicId, folder) {
  try {
    const fullPath = path.join(__dirname, imagePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`);
      return null;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(fullPath));
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', publicId);
    formData.append('folder', folder);
    formData.append('resource_type', 'image');
    formData.append('tags', 'scear,hero,website');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();

    if (result.secure_url) {
      console.log(`✅ Uploaded ${publicId}: ${result.secure_url}`);
      return result;
    } else {
      console.error(`❌ Failed to upload ${publicId}:`, result.error);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading ${publicId}:`, error.message);
    return null;
  }
}

async function uploadAllHeroImages() {
  console.log('🚀 Starting SCEAR Hero Images Upload to Cloudinary');
  console.log('=========================================\n');

  const results = [];

  for (const image of heroImages) {
    console.log(`📤 Uploading: ${image.description}`);
    const result = await uploadToCloudinary(
      image.localPath,
      image.cloudinaryName,
      CLOUDINARY_FOLDER
    );

    if (result) {
      results.push({
        name: image.cloudinaryName,
        url: result.secure_url,
        description: image.description
      });
    }

    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n=========================================');
  console.log('📊 Upload Summary:');
  console.log('=========================================');
  console.log(`Total attempted: ${heroImages.length}`);
  console.log(`Successfully uploaded: ${results.length}`);

  if (results.length > 0) {
    console.log('\n✅ Uploaded images URLs:');
    results.forEach(img => {
      console.log(`\n${img.description}:`);
      console.log(img.url);
    });
  }

  // Save results to file
  const reportPath = path.join(__dirname, 'hero-images-cloudinary-urls.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 URLs saved to: ${reportPath}`);
}

// Check if node-fetch is installed
try {
  require.resolve('node-fetch');
  require.resolve('form-data');
  // Run the upload
  uploadAllHeroImages().catch(error => {
    console.error('Upload failed:', error);
    process.exit(1);
  });
} catch(e) {
  console.log('📦 Installing required packages...');
  const { execSync } = require('child_process');
  execSync('npm install node-fetch@2 form-data', { stdio: 'inherit' });
  console.log('✅ Packages installed. Please run the script again.');
}