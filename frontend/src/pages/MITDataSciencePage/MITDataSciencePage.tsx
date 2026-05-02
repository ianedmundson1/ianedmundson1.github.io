import { useState, useCallback } from 'react';
import Seo from '../../components/Seo';
import CameraCapture from './components/CameraCapture';
import EmotionDetector from './components/EmotionDetector';
import ImageUpload from './components/ImageUpload';
import ProjectDetails from './components/ProjectDetails';
import styles from './MITDataSciencePage.module.css';

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
    <div className={styles.mitDataSciencePage}>
      <Seo
        title="MIT Applied Data Science — Emotion Detection"
        description="Live facial emotion classification demo using VGG16 transfer learning. Capstone project from MIT's Applied Data Science Program. Try it with your webcam or upload an image."
        path="/projects/mit-data-science"
      />
      <a href="#demo" className="skip-link">
        Skip to interactive demo
      </a>


      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <section className={styles.projectHero} aria-labelledby="mit-hero-title">
          <div className={styles.heroContainer}>
            <div className={styles.projectBadges} aria-hidden="true">
              {BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`${styles.projectBadge}${b.variant ? ` ${styles[b.variant]}` : ''}`}
                >
                  {b.label}
                </span>
              ))}
            </div>

            <h1 id="mit-hero-title" className={styles.heroTitle}>
              MIT Applied Data Science
            </h1>

            <p className={styles.heroSubtitle}>
              Facial Emotion Detection using Deep Learning and Transfer Learning
            </p>
          </div>
        </section>

        {/* ---------- Interactive demo ---------- */}
        <section
          id="demo"
          className={styles.interactiveDemo}
          aria-labelledby="demo-heading"
        >
          <div className="section-container">
            <h2 id="demo-heading">Try the Emotion Detection Model</h2>
            <p className={styles.demoDescription}>
              Take a photo or upload an image to see how the trained model
              classifies facial expressions.
            </p>

            <div className={styles.demoContainer}>
              {mode === 'idle' && (
                <div className={styles.inputOptions}>
                  <button
                    className={`${styles.captureButton} ${styles.primary}`}
                    onClick={() => setMode('camera')}
                    aria-label="Open camera to capture a photo"
                  >
                    <span aria-hidden="true">📸</span> Use Camera
                  </button>
                  <button
                    className={`${styles.captureButton} ${styles.secondary}`}
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

        {/* ---------- Project details ---------- */}
        <ProjectDetails />
      </main>
    </div>
  );
};

export default MITDataSciencePage;