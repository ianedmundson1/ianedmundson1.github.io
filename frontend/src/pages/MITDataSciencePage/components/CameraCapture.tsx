import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import styles from '../MITDataSciencePage.module.css';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <div className={styles.cameraContainer} role="region" aria-label="Camera capture">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className={styles.webcam}
        aria-label="Live camera feed"
      />
      <div className={styles.cameraControls}>
        <button
          className={`${styles.captureButton} ${styles.primary}`}
          onClick={capture}
          aria-label="Capture photo from camera"
        >
          <span aria-hidden="true">📸</span> Capture Photo
        </button>
        <button
          className={`${styles.captureButton} ${styles.secondary}`}
          onClick={onCancel}
          aria-label="Cancel and return to options"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;