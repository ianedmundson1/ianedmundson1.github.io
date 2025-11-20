import React, { useState, useEffect } from 'react';
import { analyzeEmotionBase64 } from '../../../utils/api';

interface EmotionDetectorProps {
  capturedImage: string;
  onReset: () => void;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ capturedImage, onReset }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    
    const analyzeImage = async () => {
      setIsAnalyzing(true);
      setError(null);
      
      try {
        const response = await analyzeEmotionBase64(capturedImage);
        
        if (!active) return;
        
        if (response.success && response.data) {
          // Handle MLflow response - adjust based on your model's output format
          const result = Array.isArray(response.data) ? response.data[0] : response.data;
          
          // Extract emotion label (adjust property names based on your model)
          const emotionLabel = result?.label ?? result?.emotion ?? result?.prediction ?? 'Unknown';
          
          // Extract confidence score (adjust based on your model's output)
          const rawConfidence = result?.score ?? result?.confidence ?? result?.probability ?? 0;
          
          // Convert to percentage if needed (if model returns 0-1, multiply by 100)
          const confidencePercent = typeof rawConfidence === 'number' && rawConfidence <= 1 
            ? Math.round(rawConfidence * 100) 
            : Math.round(rawConfidence || 0);
          
          setPrediction(emotionLabel);
          setConfidence(confidencePercent);
        } else {
          setError(response.error || 'Analysis failed');
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Emotion analysis error:', err);
      } finally {
        if (active) {
          setIsAnalyzing(false);
        }
      }
    };
    
    analyzeImage();
    
    return () => {
      active = false;
    };
  }, [capturedImage]);

  return (
    <div className="emotion-detector">
      <div className="image-container">
        <img src={capturedImage} alt="Captured" className="captured-image" />
      </div>

      {isAnalyzing && (
        <div className="analyzing">
          <div className="spinner"></div>
          <p>Analyzing facial expression...</p>
        </div>
      )}

      {!isAnalyzing && !error && prediction && (
        <div className="emotion-result">
          <h3>Detected Emotion</h3>
          <div className="emotion-display">
            <div className="emotion-badge">
              <span className="emotion-label">{prediction}</span>
              <span className="confidence-bar-container">
                <div 
                  className="confidence-bar" 
                  style={{ width: `${confidence}%` }}
                ></div>
              </span>
              <span className="confidence-text">
                {confidence}% confidence
              </span>
            </div>
          </div>
          <button className="analyze-button secondary" onClick={onReset}>
            Try Another Image
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <h3>Analysis Failed</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button className="analyze-button secondary" onClick={onReset}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;