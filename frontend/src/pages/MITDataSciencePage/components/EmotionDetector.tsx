import { useState, useEffect } from 'react';
import { analyzeEmotionBase64 } from '../../../utils/api';

interface EmotionDetectorProps {
  capturedImage: string;
  onReset: () => void;
}

/**
 * Normalise the varied shapes a Databricks / MLflow model endpoint
 * might return into a single { label, confidencePercent } pair.
 */
const parseModelResponse = (
  data: unknown,
): { label: string; confidencePercent: number } => {
  // The payload may be wrapped in an array
  const result = Array.isArray(data) ? data[0] : data;

  const record = result as Record<string, unknown> | undefined;
  const label =
    (record?.label as string) ??
    (record?.emotion as string) ??
    (record?.prediction as string) ??
    'Unknown';

  const raw =
    (record?.score as number) ??
    (record?.confidence as number) ??
    (record?.probability as number) ??
    0;

  const confidencePercent =
    typeof raw === 'number' && raw <= 1
      ? Math.round(raw * 100)
      : Math.round(raw || 0);

  return { label, confidencePercent };
};

const EmotionDetector = ({ capturedImage, onReset }: EmotionDetectorProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0);
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
          const { label, confidencePercent } = parseModelResponse(response.data);
          setPrediction(label);
          setConfidence(confidencePercent);
        } else {
          setError(response.error ?? 'Analysis failed');
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Emotion analysis error:', err);
      } finally {
        if (active) setIsAnalyzing(false);
      }
    };

    analyzeImage();
    return () => { active = false; };
  }, [capturedImage]);

  return (
    <div className="emotion-detector" role="region" aria-label="Emotion analysis results">
      <div className="image-container">
        <img
          src={capturedImage}
          alt="Photo submitted for emotion analysis"
          className="captured-image"
        />
      </div>

      {isAnalyzing && (
        <div className="analyzing" aria-live="polite">
          <div className="spinner" role="status" aria-label="Analyzing" />
          <p>Analyzing facial expression…</p>
        </div>
      )}

      {!isAnalyzing && !error && prediction && (
        <div className="emotion-result" aria-live="polite">
          <h3>Detected Emotion</h3>
          <div className="emotion-display">
            <div className="emotion-badge">
              <span className="emotion-label">{prediction}</span>
              <span
                className="confidence-bar-container"
                role="progressbar"
                aria-valuenow={confidence}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${confidence}% confidence`}
              >
                <div
                  className="confidence-bar"
                  style={{ width: `${confidence}%` }}
                />
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
        <div className="error-message" role="alert">
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