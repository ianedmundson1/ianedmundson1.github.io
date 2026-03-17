import styles from './ProjectDetails.module.css';

/* -------------------------------------------------- */
/*  Static data                                        */
/* -------------------------------------------------- */
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
    description:
      'Resize to 48\u00D748 RGB, augment with random flipping & rotation.',
  },
  {
    step: 2,
    title: 'Transfer Learn',
    description:
      'VGG16 (ImageNet) as frozen backbone; fine-tune the top conv layers.',
  },
  {
    step: 3,
    title: 'Tune',
    description:
      'Hyperband search over dense-layer size, dropout, and learning rate.',
  },
  {
    step: 4,
    title: 'Train',
    description:
      'Adam + ReduceLROnPlateau, early stopping (patience\u00A012), 30 epochs.',
  },
  {
    step: 5,
    title: 'Evaluate',
    description:
      'Accuracy, per-class precision / recall / F1, confusion matrix.',
  },
] as const;

const TECH_STACK = [
  'Python',
  'TensorFlow',
  'Keras',
  'VGG16',
  'Keras Tuner',
  'scikit-learn',
  'Matplotlib',
  'Seaborn',
  'NumPy',
] as const;

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const ProjectDetails = () => (
  <>
    {/* ---------- At-a-glance stats ---------- */}
    <section className={styles.highlights} aria-label="Project highlights">
      <div className={styles.highlightsGrid}>
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className={styles.highlightCard}>
            <span className={styles.highlightValue}>{h.value}</span>
            <span className={styles.highlightLabel}>{h.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* ---------- About ---------- */}
    <section
      className={styles.projectDetails}
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <div className={styles.projectContent}>
          <h2 id="about-heading">About the Project</h2>
          <p>
            Built as the capstone for the{' '}
            <strong>MIT Applied Data Science Program</strong>, this project
            trains a deep-learning classifier that detects four facial
            emotions — <em>happy</em>, <em>sad</em>, <em>neutral</em>, and{' '}
            <em>surprise</em> — from 48&times;48-pixel images. Transfer
            learning with VGG16 lets the model reach strong accuracy even on
            a relatively small dataset (~15K training images, ~5K
            validation, 128 test).
          </p>
          <p>
            Facial emotions are a core part of human communication.
            Accurately reading them can improve human-computer interaction,
            health diagnostics, and assistive technologies.
          </p>
        </div>
      </div>
    </section>

    {/* ---------- Pipeline ---------- */}
    <section
      className={styles.pipelineSection}
      aria-labelledby="pipeline-heading"
    >
      <div className="section-container">
        <h2 id="pipeline-heading">How It Works</h2>
        <div className={styles.pipelineGrid}>
          {PIPELINE_STEPS.map((s) => (
            <div key={s.step} className={styles.pipelineCard}>
              <span className={styles.pipelineStep} aria-hidden="true">
                {s.step}
              </span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ---------- Tech & links ---------- */}
    <section
      className={styles.techSection}
      aria-labelledby="tech-heading"
    >
      <div className="section-container">
        <h2 id="tech-heading">Tech Stack</h2>
        <div className={styles.techStack}>
          {TECH_STACK.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>

        <h2 id="future-heading" className={styles.futureHeading}>
          What&rsquo;s Next
        </h2>
        <ul className={styles.futureWorkList}>
          <li>Extend the model to detect additional emotions</li>
          <li>Experiment with ResNet and EfficientNet architectures</li>
          <li>Optimize for faster inference on edge devices</li>
          <li>Adopt F1-score as the primary evaluation metric</li>
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
      </div>
    </section>
  </>
);

export default ProjectDetails;
