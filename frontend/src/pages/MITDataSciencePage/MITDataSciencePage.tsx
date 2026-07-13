import { useState, useCallback } from 'react';
import { Camera, Upload } from 'lucide-react';
import ProjectDetailLayout from '../../components/ProjectDetailLayout';
import SectionDownNotice from '../../components/SectionDownNotice';
import CameraCapture from './components/CameraCapture';
import EmotionDetector from './components/EmotionDetector';
import ImageUpload from './components/ImageUpload';
import styles from './MITDataSciencePage.module.css';
import { useEmotionAnalysis } from '../../api/emotion';

type InputMode = 'idle' | 'camera' | 'upload' | 'result';

const META = {
  title: 'MIT Applied Data Science',
  summary: 'Facial Emotion Detection using Deep Learning and Transfer Learning',
  badges: [
    { label: 'Machine Learning • Analytics' },
    { label: 'Interactive', variant: 'interactive' },
  ],
} as const;

const HIGHLIGHTS = [
  { value: '4', label: 'Emotion Classes' },
  { value: '15K+', label: 'Training Images' },
  { value: '~72–80%', label: 'Test Accuracy' },
  { value: 'VGG16', label: 'Backbone Model' },
] as const;

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Preprocess',
    description: 'Resize to 48×48 RGB, augment with random flipping & rotation.',
  },
  {
    step: 2,
    title: 'Transfer Learn',
    description: 'VGG16 (ImageNet) as frozen backbone; fine-tune the top conv layers.',
  },
  {
    step: 3,
    title: 'Tune',
    description: 'Hyperband search over dense-layer size, dropout, and learning rate.',
  },
  {
    step: 4,
    title: 'Train',
    description: 'Adam + ReduceLROnPlateau, early stopping (patience 12), 30 epochs.',
  },
  {
    step: 5,
    title: 'Evaluate',
    description: 'Accuracy, per-class precision / recall / F1, confusion matrix.',
  },
] as const;

const TECH_STACK = [
  'Python', 'TensorFlow', 'Keras', 'VGG16', 'Keras Tuner',
  'scikit-learn', 'Matplotlib', 'Seaborn', 'NumPy',
] as const;

const FUTURE_WORK = [
  'Extend the model to detect additional emotions',
  'Experiment with ResNet and EfficientNet architectures',
  'Optimize for faster inference on edge devices',
  'Adopt F1-score as the primary evaluation metric',
] as const;

const MITDataSciencePage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<InputMode>('idle');
  const { mutate: analyzeEmotion, data, isPending, error, reset } = useEmotionAnalysis();
  
  const handleCapture = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    setMode('result');
    analyzeEmotion(imageSrc)
  }, [analyzeEmotion]);

  const handleUpload = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    setMode('result');
    analyzeEmotion(imageSrc)
  }, [analyzeEmotion]);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setMode('idle');
    reset();
  }, []);

  const demoExplicitlyEnabled = import.meta.env.VITE_ENABLE_EMOTION_DEMO === 'true';
  const demoDown = !demoExplicitlyEnabled;

  const interactiveDemo = (
    <SectionDownNotice
      id="demo"
      down={demoDown}
      title="Demo Temporarily Offline"
      message="The emotion detection backend is paused. The full project write-up is below."
    >
      <section
        id="demo"
        className={styles.interactiveDemo}
        aria-labelledby="demo-heading"
      >
        <div className="section-container">
          <h2 id="demo-heading">Try the Emotion Detection Model</h2>
          <p className={styles.demoDescription}>
            Take a photo or upload an image to see how the trained model classifies facial expressions.
          </p>

          <div className={styles.demoContainer}>
            {mode === 'idle' && (
              <div className={styles.inputOptions}>
                <button
                  type="button"
                  className={`${styles.captureButton} ${styles.primary}`}
                  onClick={() => setMode('camera')}
                  aria-label="Open camera to capture a photo"
                >
                  <Camera size={18} aria-hidden="true" /> Use Camera
                </button>
                <button
                  type="button"
                  className={`${styles.captureButton} ${styles.secondary}`}
                  onClick={() => setMode('upload')}
                  aria-label="Upload an image file"
                >
                  <Upload size={18} aria-hidden="true" /> Upload Image
                </button>
              </div>
            )}

            {mode === 'camera' && (
              <CameraCapture onCapture={handleCapture} onCancel={() => setMode('idle')} />
            )}

            {mode === 'upload' && (
              <ImageUpload onUpload={handleUpload} onCancel={() => setMode('idle')} />
            )}

            {mode === 'result' && capturedImage && (
              <EmotionDetector 
                capturedImage={capturedImage} 
                data={data}
                isPending={isPending}
                error={error}
                onReset={handleReset} 
                />
            )}
          </div>
        </div>
      </section>
    </SectionDownNotice>
  );

  return (
    <ProjectDetailLayout
      meta={META}
      seo={{
        title: 'MIT Applied Data Science — Emotion Detection',
        description:
          "Live facial emotion classification demo using VGG16 transfer learning. Capstone project from MIT's Applied Data Science Program. Try it with your webcam or upload an image.",
      }}
      skipTargetId="demo"
      skipLinkText="Skip to interactive demo"
      showBackLink={false}
      afterHero={interactiveDemo}
      highlights={HIGHLIGHTS}
      overview={{
        title: 'About the Project',
        content: (
          <>
            <p>
              Built as the capstone for the{' '}
              <strong>MIT Applied Data Science Program</strong>, this project trains a
              deep-learning classifier that detects four facial emotions — <em>happy</em>,{' '}
              <em>sad</em>, <em>neutral</em>, and <em>surprise</em> — from
              48&times;48-pixel images. Transfer learning with VGG16 lets the model reach
              strong accuracy even on a relatively small dataset (~15K training images,
              ~5K validation, 128 test).
            </p>
            <p>
              Facial emotions are a core part of human communication. Accurately reading
              them can improve human-computer interaction, health diagnostics, and
              assistive technologies.
            </p>
          </>
        ),
      }}
      pipeline={{ title: 'How It Works', steps: PIPELINE_STEPS }}
      techStack={TECH_STACK}
      afterTech={
        <>
          <h2 id="future-heading" className={`project-section-title ${styles.futureHeading}`}>
            What&rsquo;s Next
          </h2>
          <ul className={styles.futureWorkList}>
            {FUTURE_WORK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className={styles.projectLinks}>
            <a
              href="https://github.com/ianedmundson1/MIT_Applied_Data_Science"
              className={styles.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub (opens in a new tab)"
            >
              View on GitHub
            </a>
          </div>
        </>
      }
    />
  );
};

export default MITDataSciencePage;
