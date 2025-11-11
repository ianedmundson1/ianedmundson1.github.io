import React, { useState } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import CameraCapture from './components/CameraCapture';
import EmotionDetector from './components/EmotionDetector';
import './MITDataSciencePage.css';

const MITDataSciencePage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setShowCamera(false);
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
            <p>Take a photo and see how our trained model classifies your facial expression!</p>
            
            <div className="demo-container">
              {!showCamera && !capturedImage && (
                <button 
                  className="capture-button primary"
                  onClick={() => setShowCamera(true)}
                >
                  📸 Start Camera
                </button>
              )}

              {showCamera && (
                <CameraCapture 
                  onCapture={handleCapture}
                  onCancel={() => setShowCamera(false)}
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

        {/* Project details section would go here */}
      </main>
    </div>
  );
};

export default MITDataSciencePage;