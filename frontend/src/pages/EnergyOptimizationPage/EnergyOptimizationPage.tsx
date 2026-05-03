import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import { getWorkProject } from '../../data/workProjects';
import styles from './EnergyOptimizationPage.module.css';

const META = getWorkProject('energy-optimization');

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
    title: 'Data Infrastructure',
    description:
      'Custom Python/pyodbc pipeline extracted 35,000+ sensor tags from OSIsoft PI historian and migrated 6 years of minute-level data (~110 billion rows) to Azure Data Lake Gen2, 83% faster than vendor tools.',
  },
  {
    step: 2,
    title: 'Feature Engineering',
    description:
      'Forecasting models use campus cooling load, dry-bulb, and wet-bulb temperature as inputs. Chiller efficiency models draw on chilled water supply temp, flow rate, wet-bulb, and refrigeration tonnage across all 10 chillers.',
  },
  {
    step: 3,
    title: 'Demand Forecasting',
    description:
      'NARX neural network and Segmented Linear Inference Model (SLIM) run in parallel, each producing a 96-hour rolling campus cooling load forecast updated hourly. SLIM uses AIC/BIC breakpoint selection; Monte Carlo simulation propagates NOAA weather forecast uncertainty through predictions.',
  },
  {
    step: 4,
    title: 'Chiller Efficiency Analysis',
    description:
      'LightGBM trained on 887,000+ five-minute observations across 10 chillers, evaluated against SVR and Random Forest baselines. SHAP analysis identified chiller selection and wet-bulb temperature as dominant efficiency drivers, 50% improvement in predictive accuracy over linear models.',
  },
  {
    step: 5,
    title: 'Anomaly Detection',
    description:
    'Five-check monitoring framework (sampling rate, out-of-range, missing rate, stale rate, outlier rate) across 20,000+ equipment points. Per-equipment thresholds and alert suppression rules stored in a dedicated parameters SQL table co-designed with plant engineers.',
  },
  {
    step: 6,
    title: 'Reporting',
    description:
      'Plotly Dash dashboards with FastAPI in-memory caching deliver real-time forecasts, equipment status, and anomaly alerts to 30+ stakeholders. Model outputs are written back to OSIsoft PI hourly for direct operator access.',
  },
] as const;

const TECH_STACK = [
  'Python', 'OSIsoft PI', 'Azure Data Lake Gen2', 'NARX', 'SLIM',
  'LightGBM', 'SHAP', 'Isolation Forest', 'Databricks',
  'Plotly Dash', 'FastAPI', 'MLflow', 'pandas', 'SQL',
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
      'Replaced a decades-old rule-based scheduling system with ML-driven optimization.',
  },
  {
    title: 'Data Quality at Scale',
    description:
      'Replaced a failing alert system, where engineers ignored everything due to noise, with a five-check monitoring framework built around per-equipment thresholds co-designed with plant engineers. When validated by operators, 93% of alerts were confirmed genuine anomalies',
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
      />
      <a href="#overview" className="skip-link">Skip to content</a>


      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <header className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContainer}>
            <Link to="/projects" className={styles.backLink}>&larr; Back to Projects</Link>
            <div className={styles.heroBadges}>
              {META.badges.map((b) => (
                <span key={b} className={styles.badge}>{b}</span>
              ))}
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              {META.title}
            </h1>
            <p className={styles.heroSubtitle}>
              {META.summary}
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
                load forecasting to sequence chillers efficiently. Over-provisioning wastes energy,
                under-provisioning risks equipment failure.
              </p>
              <p>
                I designed and deployed a suite of ML systems across the plant: a 96-hour campus
                cooling load forecaster that gives operators the lead time they need to sequence
                chillers days in advance; a chiller efficiency analysis using LightGBM and SHAP to
                identify which chillers to run at which loads; and a five-check anomaly detection
                framework monitoring 20,000+ equipment points. Underpinning all of it was a custom
                Python data pipeline migrating 35,000+ sensor tags from OSIsoft PI to Azure, and
                Plotly Dash dashboards delivering real-time visibility to 30+ stakeholders.
              </p>
              <p>
                The forecasting models proved 50% more accurate than the legacy rule-based system and
                enabled proactive resource scheduling. The analytics work was one part of broader
                operational improvements that together achieved $2.2M in annual energy savings across the plant.
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

      </main>
    </div>
  );
};

export default EnergyOptimizationPage;
