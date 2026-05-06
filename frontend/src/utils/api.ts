import { useQuery } from '@tanstack/react-query';
import { logger } from './logger';

export interface EmotionApiResponse {
  label: string;
  confidencePercent: number;
}

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

const analyzeEmotion = async (imageFile: File, signal?: AbortSignal): Promise<EmotionApiResponse> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  logger.debug('Sending image to backend /api/emotion_classification');

  const res = await fetch('/api/emotion_classification', {
    method: 'POST',
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage: string;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorText;
    } catch {
      errorMessage = errorText;
    }
    throw new Error(`HTTP ${res.status}: ${errorMessage}`);
  }

  const json = (await res.json()) as EmotionApiResponse;
  logger.debug('Backend Response:', json);
  return json;
};

const analyzeEmotionBase64 = (imageDataUrl: string, signal?: AbortSignal): Promise<EmotionApiResponse> => {
  const blob = dataURItoBlob(imageDataUrl);
  const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
  return analyzeEmotion(file, signal);
};

/**
 * React Query hook for emotion analysis.
 * Caches by image data URL so identical captures don't re-fetch.
 */
export const useEmotionAnalysis = (imageDataUrl: string | null) => {
  return useQuery({
    queryKey: ['emotionAnalysis', imageDataUrl],
    queryFn: ({ signal }) => {
      if (!imageDataUrl) throw new Error('No image data provided');
      return analyzeEmotionBase64(imageDataUrl, signal);
    },
    enabled: !!imageDataUrl,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: Infinity,
  });
};
