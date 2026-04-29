import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ConnectLinks from '../../components/ConnectLinks/ConnectLinks';
import Seo from '../../components/Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import styles from './CloudMigrationPage.module.css';

/* -------------------------------------------------- */
/*  Static data                                        */
/* -------------------------------------------------- */
const HIGHLIGHTS = [
  { value: '35,000+', label: 'Data Points Migrated' },
  { value: '6 Years', label: 'Historical Data' },
  { value: '83%', label: 'Faster Transfers' },
  { value: '15+', label: 'ML Models Migrated' },
] as const;

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Audit',
    description:
      'Cataloged 35,000+ monitoring points across OSIsoft PI, mapping data types, frequencies, and quality issues.',
  },
  {
    step: 2,
    title: 'Extract',
    description:
      'Built custom open-source extraction tooling that achieved 83% faster transfer speeds vs. the vendor-provided solution.',
  },
  {
    step: 3,
    title: 'Transform',
    description:
      'Standardized timestamps, units, and naming conventions. Applied data quality rules to flag gaps and anomalies.',
  },
  {
    step: 4,
    title: 'Load',
    description:
      'Ingested into Azure Data Lake Gen2 with Delta Lake format for ACID transactions and time-travel capabilities.',
  },
  {
    step: 5,
    title: 'Validate',
    description:
      'Automated reconciliation checks comparing source and destination counts, ranges, and statistical distributions.',
  },
  {
    step: 6,
    title: 'Operationalize',
    description:
      'Established Delta Live Tables for ongoing incremental ingestion of 30M+ daily sensor readings.',
  },
] as const;

const TECH_STACK = [
  'Python', 'Azure Data Lake Gen2', 'Delta Lake', 'Databricks',
  'Delta Live Tables', 'OSIsoft PI', 'SQL', 'pandas',
  'GitHub Actions', 'Docker', 'Azure ML',
] as const;

const OUTCOMES = [
  {
    title: 'Custom Tooling Over Vendor Lock-in',
    description:
      'The vendor-provided migration tool was slow and inflexible. I built an open-source alternative in Python that parallelized extraction and achieved 83% faster transfer speeds, saving weeks of migration time.',
  },
  {
    title: 'MLOps Pipeline Modernization',
    description:
      'Migrated 15+ ML models from siloed CSV-based experimentation to a cloud-native MLOps pipeline with managed feature tables on Databricks, cutting model deployment from weeks to days.',
  },
  {
    title: 'Data Governance at Scale',
    description:
      'Established data quality standards and governance processes across 20,000+ monitoring points, enabling reliable anomaly detection and forecasting downstream.',
  },
] as const;

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const CloudMigrationPage = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.page} ref={wrapperRef}>
      <Seo
        title="Cloud Migration"
        description="Migrating 6 years of sensor data and 35,000+ monitoring points to cloud infrastructure with custom open-source tooling — 83% faster than vendor solutions."
        path="/projects/cloud-migration"
      />
      <a href="#overview" className="skip-link">Skip to content</a>

      <Navigation />

      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <header className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContainer}>
            <Link to="/projects" className={styles.backLink}>&larr; Back to Projects</Link>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>Azure</span>
              <span className={styles.badge}>ETL</span>
              <span className={styles.badge}>NIH</span>
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              Cloud Data Migration
            </h1>
            <p className={styles.heroSubtitle}>
              Large-scale migration of 6 years of sensor data from OSIsoft PI to Azure Data Lake Gen2 —
              with custom tooling that outperformed the vendor solution by 83%
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
                NIH&apos;s Central Utility Plant relied on an on-premises OSIsoft PI historian
                storing 6 years of operational data across 35,000+ monitoring points. The system was
                reaching capacity limits and couldn&apos;t support the advanced analytics workloads
                needed for energy optimization and predictive maintenance.
              </p>
              <p>
                I led the data migration to Azure Data Lake Gen2 with Delta Lake, establishing a
                modern lakehouse architecture that enabled downstream ML pipelines, real-time
                dashboards, and automated reporting. The migration required careful coordination
                to maintain data continuity for critical facility operations.
              </p>
              <p>
                A key challenge was the vendor-provided migration tool&apos;s poor performance. I
                built custom open-source extraction tooling in Python that parallelized data pulls
                and achieved 83% faster transfer speeds. This approach also gave us full control
                over data transformation and quality checks during migration.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Pipeline ---------- */}
        <section className={`${styles.pipelineSection} fade-section`} aria-labelledby="pipeline-heading">
          <div className="section-container">
            <h2 id="pipeline-heading" className={styles.sectionTitle}>Migration Pipeline</h2>
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

        {/* ---------- Outcomes ---------- */}
        <section className={`${styles.outcomesSection} fade-section`} aria-labelledby="outcomes-heading">
          <div className="section-container">
            <h2 id="outcomes-heading" className={styles.sectionTitle}>Key Outcomes</h2>
            <div className={styles.outcomesGrid}>
              {OUTCOMES.map((o) => (
                <article key={o.title} className={styles.outcomeCard}>
                  <h3>{o.title}</h3>
                  <p>{o.description}</p>
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

export default CloudMigrationPage;
