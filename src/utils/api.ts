import type { EmotionApiResponse } from '../types/emotion';

export const analyzeEmotion = async (imageFile: File): Promise<EmotionApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/api/emotion-detection', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};