import React, { useState } from 'react';
import type { EmotionResult } from '../../../types/emotion';
import { analyzeEmotion } from '../../../utils/api';

interface EmotionDetectorProps {
  capturedImage: string;
  onReset: () => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ capturedImage, onReset }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'emotion-photo.jpg', { type: 'image/jpeg' });

      const apiResponse = await analyzeEmotion(file);
      
      if (apiResponse.success && apiResponse.data) {
        setResult(apiResponse.data);
      } else {
        setError(apiResponse.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="emotion-detector">
      <img src={capturedImage} alt="Captured" className="captured-image" />
      
      {!result && !isAnalyzing && !error && (
        <div className="analysis-controls">
          <button className="analyze-button primary" onClick={handleAnalyze}>
            🔍 Analyze Emotion
          </button>
          <button className="analyze-button secondary" onClick={onReset}>
            Retake Photo
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="analyzing">
          <div className="spinner"></div>
          <p>Analyzing emotion...</p>
        </div>
      )}

      {result && (
        <div className="emotion-result">
          <h3>Detected Emotion</h3>
          <div className="emotion-display">
            <span className="emotion-label">{result.emotion}</span>
            <span className="confidence">
              {(result.confidence * 100).toFixed(1)}% confidence
            </span>
          </div>
          <button className="analyze-button secondary" onClick={onReset}>
            Try Again
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button className="analyze-button secondary" onClick={onReset}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;