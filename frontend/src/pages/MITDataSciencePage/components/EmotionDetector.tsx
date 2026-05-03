import { useEmotionAnalysis, type EmotionApiResponse } from '../../../utils/api';
import styles from './EmotionDetector.module.css';

interface EmotionDetectorProps {
  capturedImage: string;
  onReset: () => void;
}

/**
 * Normalise the varied shapes a Databricks / MLflow model endpoint
 * might return into a single { label, confidencePercent } pair.
 */
const parseModelResponse = (
  data: EmotionApiResponse,
): { label: string; confidencePercent: number } => {
  // The payload may be wrapped in an array
  const result = Array.isArray(data) ? data[0] : data;
  const label =
    result?.label ??
    result?.emotion ??
    result?.prediction ??
    'Unknown';

  const raw =
    result?.score ??
    result?.confidence ??
    result?.probability ??
    0;

  const confidencePercent =
    typeof raw === 'number' && raw <= 1
      ? Math.round(raw * 100)
      : Math.round(raw || 0);

  return { label, confidencePercent };
};

const EmotionDetector = ({ capturedImage, onReset }: EmotionDetectorProps) => {
  const { data, isLoading, error } = useEmotionAnalysis(capturedImage);

  // We can derive prediction and confidence from data if present
  let prediction = '';
  let confidence = 0;
  
  if (data) {
    const parsed = parseModelResponse(data);
    prediction = parsed.label;
    confidence = parsed.confidencePercent;
  }

  const errorMessage = error?.message ?? null;

  return (
    <div className={styles.emotionDetector} role="region" aria-label="Emotion analysis results">
      <div className={styles.imageContainer}>
        <img
          src={capturedImage}
          alt="Submitted for emotion analysis"
          className={styles.capturedImage}
        />
      </div>

      {isLoading && (
        <div className={styles.analyzing} aria-live="polite">
          <div className={styles.spinner} role="status" aria-label="Analyzing" />
          <p>Analyzing facial expression…</p>
        </div>
      )}

      {!isLoading && !errorMessage && prediction && (
        <div className={styles.emotionResult} aria-live="polite">
          <h3>Detected Emotion</h3>
          <div className={styles.emotionDisplay}>
            <div className={styles.emotionBadge}>
              <span className={styles.emotionLabel}>{prediction}</span>
              <span
                className={styles.confidenceBarContainer}
                role="progressbar"
                aria-valuenow={confidence}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${confidence}% confidence`}
              >
                <div
                  className={styles.confidenceBar}
                  style={{ width: `${confidence}%` }}
                />
              </span>
              <span className={styles.confidenceText}>
                {confidence}% confidence
              </span>
            </div>
          </div>
          <button className={`${styles.analyzeButton} ${styles.secondary}`} onClick={onReset}>
            Try Another Image
          </button>
        </div>
      )}

      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          <h3>Analysis Failed</h3>
          <p>{errorMessage}</p>
          <div className={styles.errorActions}>
            <button className={`${styles.analyzeButton} ${styles.secondary}`} onClick={onReset}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;