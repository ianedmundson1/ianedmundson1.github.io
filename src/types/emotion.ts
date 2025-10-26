export interface EmotionResult {
  emotion: 'happy' | 'sad' | 'neutral' | 'surprise';
  confidence: number;
}

export interface EmotionApiResponse {
  success: boolean;
  data?: EmotionResult;
  error?: string;
}