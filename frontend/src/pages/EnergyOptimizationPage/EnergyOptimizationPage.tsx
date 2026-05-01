import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ConnectLinks from '../../components/ConnectLinks/ConnectLinks';
import Seo from '../../components/Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import styles from './EnergyOptimizationPage.module.css';

/* -------------------------------------------------- */
/*  Static data                                        */
/* -------------------------------------------------- */
const HIGHLIGHTS = [
  { value: '$2.2M', label: 'Annual Savings' },
  { value: '96-hr', label: 'Forecast Horizon' },
  { value: '50%', label: 'More Accurate' },
  { value: '62,400', label: 'Tons Cooling Capacity' },
] as const;

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Ingest',
    description:
      'Stream 30M+ daily sensor readings from OSIsoft PI into Databricks via Delta Live Tables.',
  },
  {
    step: 2,
    title: 'Feature Engineering',
    description:
      'Lag features, rolling statistics, weather data joins, and calendar encodings for 35,000+ monitoring points.',
  },
  {
    step: 3,
    title: 'Model Training',
    description:
      'NARX neural networks and Prophet for 96-hour demand forecasting. XGBoost models for equipment-level prediction on chillers and cooling towers.',
  },
  {
    step: 4,
    title: 'Optimization',
    description:
      'Particle Swarm Optimization (PSO) for corrosion optimization across the cooling infrastructure.',
  },
  {
    step: 5,
    title: 'Deployment',
    description:
      'Automated daily retraining pipeline on Databricks with managed feature tables and model registry.',
  },
  {
    step: 6,
    title: 'Reporting',
    description:
      'Plotly Dash dashboards for 30+ stakeholders showing forecasts, actuals, and savings attribution.',
  },
] as const;

const TECH_STACK = [
  'Python', 'Databricks', 'Delta Live Tables', 'NARX', 'Prophet',
  'XGBoost', 'Particle Swarm Optimization', 'OSIsoft PI', 'Azure ML',
  'Plotly Dash', 'SQL', 'pandas',
] as const;

const CHALLENGES = [
  {
    title: 'El Niño Heatwave (2023)',
    description:
      'Cooling demand approached maximum capacity of NIH\'s 62,400-ton infrastructure. The forecasting system enabled precise chiller sequencing days in advance, preventing equipment failures and ensuring continuous operation of critical research facilities.',
  },
  {
    title: 'Legacy System Migration',
    description:
      'Replaced a decades-old rule-based scheduling system with ML-driven optimization. Required building trust with operations teams by running models in shadow mode for 3 months before going live.',
  },
  {
    title: 'Data Quality at Scale',
    description:
      'Developed anomaly detection (Isolation Forest) across 20,000+ monitoring points that reduced false positive maintenance alerts by 93%, saving operations teams from alert fatigue.',
  },
] as const;

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const EnergyOptimizationPage = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.page} ref={wrapperRef}>
      <Seo
        title="Energy Optimization at NIH"
        description="ML-driven energy optimization at NIH's Central Utility Plant: 96-hour cooling demand forecasting, anomaly detection across 20,000+ points, and $2.2M in annual savings."
        path="/projects/energy-optimization"
      />
      <a href="#overview" className="skip-link">Skip to content</a>

      <Navigation />

      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <header className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContainer}>
            <Link to="/projects" className={styles.backLink}>&larr; Back to Projects</Link>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>Forecasting</span>
              <span className={styles.badge}>Optimization</span>
              <span className={styles.badge}>NIH</span>
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              Energy Optimization Systems
            </h1>
            <p className={styles.heroSubtitle}>
              ML-driven 96-hour demand forecasting and chiller sequencing optimization
              for NIH&apos;s Central Utility Plant, contributing to $2.2M in annual energy savings across operations
            </p>
          </div>
        </header>

        {/* ---------- Highlights ---------- */}
        <section className={styles.highlightsBar} aria-label="Key metrics">
          <div className={styles.highlightsGrid}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className={styles.highlightCard}>
                <span className={styles.highlightValue}>{h.value}</span>
                <span className={styles.highlightLabel}>{h.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Overview ---------- */}
        <section id="overview" className={`${styles.contentSection} fade-section`} aria-labelledby="overview-heading">
          <div className="section-container">
            <h2 id="overview-heading" className={styles.sectionTitle}>Overview</h2>
            <div className={styles.prose}>
              <p>
                NIH&apos;s Bethesda campus operates one of the largest central utility plants in the
                federal government, providing chilled water to over 70 buildings housing critical
                biomedical research. The plant&apos;s 62,400-ton cooling infrastructure requires precise
                load forecasting to sequence chillers efficiently — over-provisioning wastes energy,
                under-provisioning risks equipment failure.
              </p>
              <p>
                I designed and deployed an end-to-end ML system that forecasts cooling demand 96 hours
                in advance, then optimizes chiller sequencing to minimize energy consumption while
                maintaining safety margins. The system processes 30M+ daily sensor readings across
                35,000+ monitoring points and delivers actionable recommendations to plant operators
                via interactive dashboards.
              </p>
              <p>
                The forecasting models proved 50% more accurate than the legacy rule-based system and
                enabled proactive resource scheduling that contributed to $2.2M in annual energy savings.
                This work was recognized with the <strong>NIH Director&apos;s Award in 2024</strong>,
                specifically for enabling safe operation during the 2023 El Niño heatwave when demand
                approached maximum capacity.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Pipeline ---------- */}
        <section className={`${styles.pipelineSection} fade-section`} aria-labelledby="pipeline-heading">
          <div className="section-container">
            <h2 id="pipeline-heading" className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.pipelineGrid}>
              {PIPELINE_STEPS.map((s) => (
                <div key={s.step} className={styles.pipelineCard}>
                  <span className={styles.pipelineStep} aria-hidden="true">{s.step}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Challenges ---------- */}
        <section className={`${styles.challengesSection} fade-section`} aria-labelledby="challenges-heading">
          <div className="section-container">
            <h2 id="challenges-heading" className={styles.sectionTitle}>Key Challenges</h2>
            <div className={styles.challengesGrid}>
              {CHALLENGES.map((c) => (
                <article key={c.title} className={styles.challengeCard}>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Tech Stack ---------- */}
        <section className={`${styles.techSection} fade-section`} aria-labelledby="tech-heading">
          <div className="section-container">
            <h2 id="tech-heading" className={styles.sectionTitle}>Tech Stack</h2>
            <div className={styles.techGrid}>
              {TECH_STACK.map((t) => (
                <span key={t} className={styles.techTag}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        <ConnectLinks variant="gradient" />
      </main>
    </div>
  );
};

export default EnergyOptimizationPage;
