import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';
import { logger } from '../utils/logger';

export interface EmotionApiResponse {
  label: string;
  confidencePercent: number;
}

const dataURItoBlob = (dataURI: string) => {
  const [header, payload] = dataURI.split(',');
  if (!header || !payload) {
    throw new Error('Invalid data URI');
  }
  const mimeMatch = header.match(/^data:([^;]+)/);
  if (!mimeMatch?.[1]) {
    throw new Error('Invalid data URI: missing MIME type');
  }
  const byteString = atob(payload);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeMatch[1] });
};

const analyzeEmotion = async (
  imageDataUrl: string,
  signal?: AbortSignal,
): Promise<EmotionApiResponse> => {
  const blob = dataURItoBlob(imageDataUrl);
  const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', file);

  logger.debug('Sending image to backend /api/emotion_classification');
  const json = await apiFetch<EmotionApiResponse>('/api/emotion_classification', {
    method: 'POST',
    body: formData,
    signal,
  });
  if (!json) throw new Error('Empty response from /api/emotion_classification');
  logger.debug('Backend Response:', json);
  return json;
};

export const useEmotionAnalysis = (imageDataUrl: string | null) => {
  return useQuery({
    queryKey: ['emotionAnalysis', imageDataUrl],
    queryFn: ({ signal }) => {
      if (!imageDataUrl) throw new Error('No image data provided');
      return analyzeEmotion(imageDataUrl, signal);
    },
    enabled: !!imageDataUrl,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: Infinity,
  });
};
