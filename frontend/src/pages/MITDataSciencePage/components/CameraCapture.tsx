import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

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
    <div className="camera-container" role="region" aria-label="Camera capture">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="webcam"
        aria-label="Live camera feed"
      />
      <div className="camera-controls">
        <button
          className="capture-button primary"
          onClick={capture}
          aria-label="Capture photo from camera"
        >
          <span aria-hidden="true">📸</span> Capture Photo
        </button>
        <button
          className="capture-button secondary"
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