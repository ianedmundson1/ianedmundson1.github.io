import Seo from '../../components/Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import headshot400 from '../../assets/headshot-400.jpg';
import headshot400Webp from '../../assets/headshot-400.webp';
import headshot800Webp from '../../assets/headshot-800.webp';
import styles from './AboutPage.module.css';

/* -------------------------------------------------- */
/*  Static data                                        */
/* -------------------------------------------------- */
const EXPERIENCE = [
  {
    role: 'Technical Volunteer',
    org: 'Peace Peloton',
    period: 'March 2026 - Present',
    highlights: [
      'Optimizing analytics and management workflows for non-profit incubator for black owned businesses',
    ],
  },
  {
    role: 'Technical Volunteer',
    org: 'University of Washington Botanic Gardens',
    period: 'Oct 2025 - Present',
    highlights: [
      'Modernizing a legacy .NET/C# web application for RareCare, a UW seed conservation collections project',
      'Migrating codebase to GitHub, refactoring business logic, improving frontend functionality, and extending database schema',
    ],
  },
  {
    role: 'Data Scientist (Federal, GS-11)',
    org: 'National Institutes of Health (NIH)',
    period: 'Jan 2022 - July 2025',
    highlights: [
      'Established Databricks analytics platform with Delta Live Tables processing 30M+ daily sensor readings across 35,000+ monitoring points, delivering anomaly detection, predictive forecasting, and automated reporting to 30+ stakeholders that supported $2.2M in annual energy savings',
      'Engineered 96-hour cooling demand forecasting system, 50% more accurate than legacy, enabling proactive resource scheduling for NIH\'s 62,400-ton cooling infrastructure',
      'Developed anomaly detection framework across 20,000+ monitored points; 93% of alerts operator-validated as genuine anomalies, restoring engineer trust after widespread alert fatigue',
      'Migrated 6 years of sensor data (35,000+ monitoring points) to cloud infrastructure at 83% faster transfer speeds using custom tooling over the vendor solution',
      'Migrated 15+ ML models from siloed CSV-based experimentation to a cloud-native MLOps pipeline with managed feature tables, cutting model deployment from weeks to days',
      'Implemented CI/CD pipelines for 10+ analytics applications, cutting deployment cycles by 50%',
      'Created an AI search system for instant retrieval of building codes and safety policies from 1,000+ page compliance manuals',
      'Built a graph-based AI system extracting entities from 500+ operator text logs into an interactive knowledge graph for root cause analysis',
      'Administered Azure resource governance, monitoring ~$120K in annual cloud infrastructure spend',
    ],
  },
  {
    role: 'Data Analyst',
    org: 'Contractor to NIH',
    period: 'Oct 2021 – Dec 2021',
    highlights: [
      'Analyzed engineering and historical data to troubleshoot Central Utility Plant faults and support optimization program refinements',
    ],
  },
  {
    role: 'Facilities Security Engineer',
    org: 'Cape Fox Corporation (Contractor to NIH)',
    period: 'May 2021 – Sept 2021',
    highlights: [
      'Compiled monitoring point documentation and sensor configuration data across CUP infrastructure',
      'Maintained uninterrupted data collection across critical facilities infrastructure by troubleshooting OSIsoft PI historian failures',
    ],
  },
] as const;

const TECHNICAL_CAPABILITIES = [
  {
    area: 'Predictive Analytics',
    description: 'Forecasting and anomaly detection systems to anticipate operational issues',
    tags: ['Python', 'LightGBM', 'SHAP', 'NARX', 'Scikit-learn'],
  },
  {
    area: 'Cloud Infrastructure',
    description: 'Scalable data platforms and ML pipelines',
    tags: ['Databricks', 'Azure Data Lake Gen2', 'Docker', 'GitHub Actions'],
  },
  {
    area: 'Data Engineering',
    description: 'Pipelines and APIs for reliable data flow',
    tags: ['Python', 'SQL', 'FastAPI', 'pandas', 'OSIsoft PI'],
  },
  {
    area: 'Visualization & Reporting',
    description: 'Dashboards translating technical data into actionable insights',
    tags: ['Plotly Dash', 'React', 'Neo4j', 'MLflow'],
  },
] as const;

const EDUCATION = [
  {
    degree: 'Applied Data Science Program',
    institution: 'MIT Professional Education',
    description:
      'Capstone: facial emotion detection using VGG16 transfer learning, classifying four emotions from 48×48 images with ~72-80% test accuracy.',
  },
  {
    degree: 'Bachelor of Science, Mechanical Engineering',
    institution: 'University of Maryland',
    description: 'Graduated May 2021.',
  },
] as const;

const AWARDS = [
  {
    title: 'NIH Director\'s Award',
    year: '2024',
    description:
      'Recognized for developing ML-based 96-hour forecasting and optimization system that enabled safe operation of NIH\'s 62,400-ton cooling infrastructure during 2023 El Niño heatwave, when demand approached maximum capacity and required precise chiller sequencing.',
  },
] as const;

const CERTIFICATIONS = [
  'Applied Data Science Program: Leveraging AI for Effective Decision-Making, MIT Professional Education',
  'NIH Training Center Emerging Talent Program, NIH',
  'OLAO Lean Six Sigma Green Belt Training Course, NIH',
  'Building Knowledge Graphs with LLMs, Neo4j',
] as const;


/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const AboutPage = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.aboutPage} ref={wrapperRef}>
      <Seo
        title="About"
        description="Ian Edmundson's background: federal data scientist at NIH, MIT Applied Data Science alum, and software engineer focused on production ML, forecasting, and analytics infrastructure."
        path="/about"
      />
      <a href="#about-intro" className="skip-link">
        Skip to content
      </a>

      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <header className={styles.hero} aria-labelledby="about-hero-title">
          <div className={styles.heroContainer}>
            <div className={styles.heroText}>
              <h1 id="about-hero-title" className={styles.heroTitle}>
                About
              </h1>
              <p className={styles.heroSubtitle}>
                Data scientist with a background in federal ML infrastructure. I build the systems that hold up when it actually matters.
              </p>
            </div>
            <div className={styles.heroPhoto}>
              <div className={styles.heroPhotoRing} aria-hidden="true" />
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${headshot400Webp} 400w, ${headshot800Webp} 800w`}
                  sizes="220px"
                />
                <img
                  src={headshot400}
                  alt="Ian Edmundson headshot"
                  width={400}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </header>

        {/* ---------- Intro ---------- */}
        <section
          id="about-intro"
          className={`${styles.introSection} fade-section`}
          aria-labelledby="intro-heading"
        >
          <div className="section-container">
            <h2 id="intro-heading" className="sr-only">
              Introduction
            </h2>
            <div className={styles.introContent}>
              <p>
                Data scientist with 3+ years at NIH&apos;s Central Utility Plant,
                where I built production ML systems for one of the federal
                government&apos;s largest central utility operations: forecasting,
                anomaly detection, chiller efficiency analysis, and the data
                infrastructure to make them reliable. The analytics work was
                one piece of broader operational improvements that together
                achieved $2.2M in annual energy savings across the plant,
                recognized with an NIH Director&apos;s Award.
              </p>
              <p>
                My work spans the full stack: ML modeling in Python (LightGBM,
                NARX, SHAP), FastAPI services, React front-ends, and data
                pipelines connecting OSIsoft PI to Azure. I care most about
                systems that hold up under pressure: a 96-hour forecast during
                a heatwave, an alert system engineers actually trust.
              </p>
              <p>
                I care about data done right in the public sector: responsible
                deployment, clear governance, and tools people can actually use.
                Currently volunteering with the UW Botanic Gardens, modernizing their
                seed conservation web application, and with Peace Peloton, enhancing 
                their management workflows.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Experience ---------- */}
        <section
          className={`${styles.experienceSection} fade-section`}
          aria-labelledby="experience-heading"
        >
          <div className="section-container">
            <h2 id="experience-heading" className={styles.sectionTitle}>
              Experience
            </h2>
            <div className={styles.timeline}>
              {EXPERIENCE.map((exp) => (
                <article key={exp.role + exp.org} className={styles.timelineItem}>
                  <div className={styles.timelineDot} aria-hidden="true" />
                  <div className={styles.timelineContent}>
                    <h3>{exp.role}</h3>
                    <p className={styles.timelineMeta}>
                      {exp.org} &middot; {exp.period}
                    </p>
                    <ul>
                      {exp.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Technical Capabilities ---------- */}
        <section
          className={`${styles.capabilitiesSection} fade-section`}
          aria-labelledby="capabilities-heading"
        >
          <div className="section-container">
            <h2 id="capabilities-heading" className={styles.sectionTitle}>
              Technical Capabilities
            </h2>
            <div className={styles.capabilitiesGrid}>
              {TECHNICAL_CAPABILITIES.map((cap) => (
                <article key={cap.area} className={styles.capabilityCard}>
                  <h3>{cap.area}</h3>
                  <p>{cap.description}</p>
                  <div className={styles.capTags}>
                    {cap.tags.map((tag) => (
                      <span key={tag} className={styles.capTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Education ---------- */}
        <section
          className={`${styles.educationSection} fade-section`}
          aria-labelledby="education-heading"
        >
          <div className="section-container">
            <h2 id="education-heading" className={styles.sectionTitle}>
              Education
            </h2>
            <div className={styles.educationGrid}>
              {EDUCATION.map((ed) => (
                <article key={ed.degree} className={styles.educationCard}>
                  <h3>{ed.degree}</h3>
                  <p className={styles.institution}>{ed.institution}</p>
                  <p>{ed.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Awards ---------- */}
        <section
          className={`${styles.awardsSection} fade-section`}
          aria-labelledby="awards-heading"
        >
          <div className="section-container">
            <h2 id="awards-heading" className={styles.sectionTitle}>
              Awards & Certifications
            </h2>
            <div className={styles.awardsGrid}>
              {AWARDS.map((award) => (
                <article key={award.title} className={styles.awardCard}>
                  <div className={styles.awardIcon} aria-hidden="true">
                    {'\uD83C\uDFC6'}
                  </div>
                  <h3>
                    {award.title}{' '}
                    <span className={styles.awardYear}>{award.year}</span>
                  </h3>
                  <p>{award.description}</p>
                </article>
              ))}
            </div>

            <div className={styles.certGrid}>
              {CERTIFICATIONS.map((c) => (
                <div key={c} className={styles.certCard}>{c}</div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AboutPage;
