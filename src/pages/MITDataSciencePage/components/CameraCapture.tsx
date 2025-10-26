import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <div className="camera-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="webcam"
      />
      <div className="camera-controls">
        <button className="capture-button primary" onClick={capture}>
          📸 Capture Photo
        </button>
        <button className="capture-button secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;