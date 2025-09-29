/**
 * Image utilities pre zachovanie originálnej orientácie bez EXIF rotácie
 */

export function createImagePreviewWithoutRotation(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      
      // Vytvoríme URL bez EXIF processing
      const imageUrl = URL.createObjectURL(blob);
      
      // Pre DEBUG: Skúsme načítať obrázok a zistiť jeho rozmery
      const img = new Image();
      img.onload = function() {
        console.log(`📸 Original image dimensions: ${img.naturalWidth}×${img.naturalHeight}`);
        console.log(`📸 Image URL created WITHOUT EXIF rotation: ${imageUrl}`);
        resolve(imageUrl);
      };
      img.onerror = function() {
        reject(new Error('Failed to load image preview'));
      };
      
      // KRITICKÉ: Nastavíme CSS aby sa EXIF orientácia IGNOROVALA
      img.style.imageOrientation = 'none';
      img.src = imageUrl;
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    // Čítame ako ArrayBuffer aby sme obišli akékoľvek EXIF processing
    reader.readAsArrayBuffer(file);
  });
}

export function stripEXIFData(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // Nastavíme canvas na prirodzené rozmery obrázka
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // KRITICKÉ: Ignoruj EXIF orientáciu
      img.style.imageOrientation = 'none';
      
      // Nakreslíme obrázok na canvas (bez EXIF transformácií)
      ctx?.drawImage(img, 0, 0);
      
      // Konvertujeme späť na File bez EXIF dát
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        
        const newFile = new File([blob], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });
        
        console.log(`🧹 EXIF data stripped from ${file.name}`);
        console.log(`📏 Final dimensions: ${canvas.width}×${canvas.height}`);
        resolve(newFile);
      }, file.type, 0.95); // Vysoká kvalita
    };
    
    img.onerror = function() {
      reject(new Error('Failed to load image for EXIF stripping'));
    };
    
    // KRITICKÉ: Zabránime EXIF rotácii
    img.style.imageOrientation = 'none';
    img.src = URL.createObjectURL(file);
  });
}