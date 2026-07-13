import { useMutation } from '@tanstack/react-query';
import { apiFetchRequired } from './client';
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
  const json = await apiFetchRequired<EmotionApiResponse>('/api/emotion_classification', {
    method: 'POST',
    body: formData,
    signal,
  });
  logger.debug('Backend Response:', json);
  return json;
};

export const useEmotionAnalysis = () => {
  return useMutation({
    mutationFn: (imageDataUrl: string) => analyzeEmotion(imageDataUrl),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};
