import type { EmotionApiResponse } from '../types/emotion';

// ...existing code...
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/**
 * Convert image to 3D pixel array (height, width, channels) for MLflow model
 * Model expects shape: (48, 48, 3) - RGB image
 */
const imageToTensorArray = async (imageDataUrl: string): Promise<number[][][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Model expects 48x48 RGB images
      const targetWidth = 48;
      const targetHeight = 48;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Draw and resize image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Get pixel data (RGBA format)
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imageData.data;
      
      // Convert to 3D array: [height][width][channels]
      // Shape: (48, 48, 3) - RGB only (drop alpha channel)
      const tensorArray: number[][][] = [];
      
      for (let y = 0; y < targetHeight; y++) {
        const row: number[][] = [];
        for (let x = 0; x < targetWidth; x++) {
          const idx = (y * targetWidth + x) * 4;
          // Normalize RGB values to [0, 1] range
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          row.push([r, g, b]);
        }
        tensorArray.push(row);
      }
      
      console.log(`Converted image to tensor shape: (${targetHeight}, ${targetWidth}, 3)`);
      resolve(tensorArray);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageDataUrl;
  });
};

export const analyzeEmotionBase64 = async (imageDataUrl: string): Promise<EmotionApiResponse> => {
  try {
    console.log('Converting image to tensor array...');
    const tensorArray = await imageToTensorArray(imageDataUrl);
    
    // MLflow expects: {"inputs": [tensor_data]}
    // The outer array is for batch dimension
    // Model signature: Tensor('float32', (-1, 48, 48, 3))
    const payload = {
      inputs: [tensorArray]  // Batch of 1 image
    };
    
    console.log('Sending tensor to /api/invocations');
    
    const res = await fetch('/api/invocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText;
      }
      
      throw new Error(`HTTP ${res.status}: ${errorMessage}`);
    }

    const json = await res.json();
    console.log('API Response:', json);
    
    // Handle different response formats from MLflow
    const data = json.predictions ?? json.outputs ?? json;
    return { success: true, data };
    
  } catch (error) {
    console.error('Emotion analysis error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const analyzeEmotion = async (imageFile: File): Promise<EmotionApiResponse> => {
  const dataUrl = await fileToDataUrl(imageFile);
  return analyzeEmotionBase64(dataUrl);
};