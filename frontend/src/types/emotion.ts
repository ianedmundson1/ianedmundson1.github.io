export interface EmotionResult {
  emotion: string;
  confidence: number;
}

export interface EmotionApiResponse {
  success: boolean;
  data?: EmotionResult;
  error?: string;
}