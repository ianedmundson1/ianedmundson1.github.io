import React, { useState } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import CameraCapture from './components/CameraCapture';
import EmotionDetector from './components/EmotionDetector';
import ImageUpload from './components/ImageUpload';
import './MITDataSciencePage.css';

const MITDataSciencePage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };

  const handleUpload = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowUpload(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setShowCamera(false);
    setShowUpload(false);
  };

  return (
    <div className="mit-data-science-page">
      <Navigation />
      
      <main className="main-content">
        <section className="project-hero">
          <div className="hero-container">
            <div className="project-badges">
              <span className="project-badge">Machine Learning • Analytics</span>
              <span className="project-badge interactive">🔴 Interactive</span>
            </div>
            <h1 className="hero-title">MIT Applied Data Science</h1>
            <p className="hero-subtitle">
              Facial Emotion Detection using Deep Learning and Transfer Learning
            </p>
          </div>
        </section>

        <section className="interactive-demo">
          <div className="section-container">
            <h2>Try the Emotion Detection Model</h2>
            <p>Take a photo or upload an image to see how our trained model classifies facial expressions!</p>
            
            <div className="demo-container">
              {!showCamera && !showUpload && !capturedImage && (
                <div className="input-options">
                  <button 
                    className="capture-button primary"
                    onClick={() => setShowCamera(true)}
                  >
                    📸 Use Camera
                  </button>
                  <button 
                    className="capture-button secondary"
                    onClick={() => setShowUpload(true)}
                  >
                    📁 Upload Image
                  </button>
                </div>
              )}

              {showCamera && (
                <CameraCapture 
                  onCapture={handleCapture}
                  onCancel={() => setShowCamera(false)}
                />
              )}

              {showUpload && (
                <ImageUpload 
                  onUpload={handleUpload}
                  onCancel={() => setShowUpload(false)}
                />
              )}

              {capturedImage && (
                <EmotionDetector 
                  capturedImage={capturedImage}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MITDataSciencePage;