import { useState, useCallback } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import CameraCapture from './components/CameraCapture';
import EmotionDetector from './components/EmotionDetector';
import ImageUpload from './components/ImageUpload';
import './MITDataSciencePage.css';

/* -------------------------------------------------- */
/*  Types                                              */
/* -------------------------------------------------- */
type InputMode = 'idle' | 'camera' | 'upload' | 'result';

/* -------------------------------------------------- */
/*  Static data                                        */
/* -------------------------------------------------- */
const BADGES: readonly { label: string; variant?: string }[] = [
  { label: 'Machine Learning \u2022 Analytics' },
  { label: 'Interactive', variant: 'interactive' },
];

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const MITDataSciencePage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<InputMode>('idle');

  const handleCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    setMode('result');
  }, []);

  const handleUpload = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    setMode('result');
  }, []);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setMode('idle');
  }, []);

  return (
    <div className="mit-data-science-page">
      <a href="#demo" className="skip-link">
        Skip to interactive demo
      </a>

      <Navigation />

      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <section className="project-hero" aria-labelledby="mit-hero-title">
          <div className="hero-container">
            <div className="project-badges" aria-hidden="true">
              {BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`project-badge${b.variant ? ` ${b.variant}` : ''}`}
                >
                  {b.label}
                </span>
              ))}
            </div>

            <h1 id="mit-hero-title" className="hero-title">
              MIT Applied Data Science
            </h1>

            <p className="hero-subtitle">
              Facial Emotion Detection using Deep Learning and Transfer Learning
            </p>
          </div>
        </section>

        {/* ---------- Interactive demo ---------- */}
        <section
          id="demo"
          className="interactive-demo"
          aria-labelledby="demo-heading"
        >
          <div className="section-container">
            <h2 id="demo-heading">Try the Emotion Detection Model</h2>
            <p className="demo-description">
              Take a photo or upload an image to see how the trained model
              classifies facial expressions.
            </p>

            <div className="demo-container">
              {mode === 'idle' && (
                <div className="input-options">
                  <button
                    className="capture-button primary"
                    onClick={() => setMode('camera')}
                    aria-label="Open camera to capture a photo"
                  >
                    <span aria-hidden="true">📸</span> Use Camera
                  </button>
                  <button
                    className="capture-button secondary"
                    onClick={() => setMode('upload')}
                    aria-label="Upload an image file"
                  >
                    <span aria-hidden="true">📁</span> Upload Image
                  </button>
                </div>
              )}

              {mode === 'camera' && (
                <CameraCapture
                  onCapture={handleCapture}
                  onCancel={() => setMode('idle')}
                />
              )}

              {mode === 'upload' && (
                <ImageUpload
                  onUpload={handleUpload}
                  onCancel={() => setMode('idle')}
                />
              )}

              {mode === 'result' && capturedImage && (
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