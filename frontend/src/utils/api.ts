import type { EmotionApiResponse } from '../types/emotion';

/**
 * Helper to convert base64 data URL to Blob
 * Needed for webcam captures to be sent as files
 */
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

/**
 * Analyzes emotion from a file object
 * Sends the file to the Python backend for processing and inference
 */
export const analyzeEmotion = async (imageFile: File): Promise<EmotionApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    console.log('Sending image to backend /api/emotion_classification');

    const res = await fetch('/api/emotion_classification', {
      method: 'POST',
      // Note: Do NOT set Content-Type header when sending FormData
      // The browser automatically sets it to multipart/form-data with the boundary
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.detail || errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      
      throw new Error(`HTTP ${res.status}: ${errorMessage}`);
    }

    const json = await res.json();
    console.log('Backend Response:', json);
    
    // The backend returns the raw Databricks response
    // Handle different response formats (predictions is standard for Databricks)
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

/**
 * Analyzes emotion from a base64 string (e.g. webcam)
 * Converts base64 to file and reuses the main function
 */
export const analyzeEmotionBase64 = async (imageDataUrl: string): Promise<EmotionApiResponse> => {
  try {
    // Convert base64 to Blob/File so we can send it to the file upload endpoint
    const blob = dataURItoBlob(imageDataUrl);
    const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
    
    return analyzeEmotion(file);
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    return {
      success: false,
      error: 'Failed to process image data'
    };
  }
};