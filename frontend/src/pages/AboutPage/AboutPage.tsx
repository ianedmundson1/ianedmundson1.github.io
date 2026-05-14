import Seo from '../../components/Seo';
import Hero from '../../components/Hero/Hero';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import {
  HERO_SUBTITLE,
  INTRO_PARAGRAPHS,
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
        <Hero
          title="About"
          subtitle={HERO_SUBTITLE}
          titleId="about-hero-title"
          ariaLabelledBy="about-hero-title"
          media={
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
          }
        />

        <section
          id="about-intro"
          className={`${styles.introSection} fade-section`}
          aria-labelledby="intro-heading"
        >
          <div className="section-container">
            <h2 id="intro-heading" className="sr-only">Introduction</h2>
            <div className={styles.introContent}>
              {INTRO_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${styles.experienceSection} fade-section`}
          aria-labelledby="experience-heading"
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
