import Seo from '../../components/Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import {
  EXPERIENCE,
  TECHNICAL_CAPABILITIES,
  EDUCATION,
  AWARDS,
  CERTIFICATIONS,
} from '../../data/about';
import headshot400 from '../../assets/headshot-400.jpg';
import headshot400Webp from '../../assets/headshot-400.webp';
import headshot800Webp from '../../assets/headshot-800.webp';
import styles from './AboutPage.module.css';

const stagger = (i: number) => ({ '--stagger-index': i } as React.CSSProperties);

const AboutPage = () => {
  const wrapperRef = useFadeOnScroll();

  return (
    <div className={styles.aboutPage} ref={wrapperRef}>
      <Seo
        title="About"
        description="Ian Edmundson's background: federal data scientist at NIH, MIT Applied Data Science alum, and software engineer focused on production ML, forecasting, and analytics infrastructure."
      />
      <a href="#about-intro" className="skip-link">Skip to content</a>

      <main className="main-content">
        <header className={styles.hero} aria-labelledby="about-hero-title">
          <div className={styles.heroContainer}>
            <div className={styles.heroText}>
              <h1 id="about-hero-title" className={styles.heroTitle}>About</h1>
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

        <section
          id="about-intro"
          className={`${styles.introSection} fade-section`}
          aria-labelledby="intro-heading"
          style={stagger(0)}
        >
          <div className="section-container">
            <h2 id="intro-heading" className="sr-only">Introduction</h2>
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

        <section
          className={`${styles.experienceSection} fade-section`}
          aria-labelledby="experience-heading"
          style={stagger(1)}
        >
          <div className="section-container">
            <h2 id="experience-heading" className={styles.sectionTitle}>Experience</h2>
            <div className={styles.timeline}>
              {EXPERIENCE.map((exp) => (
                <article key={exp.role + exp.org} className={styles.timelineItem}>
                  <div className={styles.timelineDot} aria-hidden="true" />
                  <div className={styles.timelineContent}>
                    <h3>{exp.role}</h3>
                    <p className={styles.timelineMeta}>{exp.org} &middot; {exp.period}</p>
                    <ul>
                      {exp.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${styles.capabilitiesSection} fade-section`}
          aria-labelledby="capabilities-heading"
          style={stagger(2)}
        >
          <div className="section-container">
            <h2 id="capabilities-heading" className={styles.sectionTitle}>Technical Capabilities</h2>
            <div className={styles.capabilitiesGrid}>
              {TECHNICAL_CAPABILITIES.map((cap) => (
                <article key={cap.area} className={styles.capabilityCard}>
                  <h3>{cap.area}</h3>
                  <p>{cap.description}</p>
                  <div className={styles.capTags}>
                    {cap.tags.map((tag) => (
                      <span key={tag} className={styles.capTag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${styles.educationSection} fade-section`}
          aria-labelledby="education-heading"
          style={stagger(3)}
        >
          <div className="section-container">
            <h2 id="education-heading" className={styles.sectionTitle}>Education</h2>
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

        <section
          className={`${styles.awardsSection} fade-section`}
          aria-labelledby="awards-heading"
          style={stagger(4)}
        >
          <div className="section-container">
            <h2 id="awards-heading" className={styles.sectionTitle}>Awards & Certifications</h2>
            <div className={styles.awardsGrid}>
              {AWARDS.map((award) => (
                <article key={award.title} className={styles.awardCard}>
                  <div className={styles.awardIcon} aria-hidden="true">{'🏆'}</div>
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
