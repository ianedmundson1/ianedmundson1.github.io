import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ConnectLinks from '../../components/ConnectLinks/ConnectLinks';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import headshot from '../../assets/MEEBOSS_Hiring_Fest_Headshots_1-27-44.jpg';
import styles from './HomePage.module.css';

/* -------------------------------------------------- */
/*  Data                                               */
/* -------------------------------------------------- */
const EXPERTISE_CARDS = [
  {
    icon: '\uD83E\uDD16',
    title: 'Data Science & Machine Learning',
    summary:
      'Forecasting, anomaly detection, and NLP systems — from prototype to production on Databricks.',
  },
  {
    icon: '\uD83D\uDD27',
    title: 'Data Engineering',
    summary:
      'Scalable pipelines processing 30M+ daily readings, cloud migrations, and CI/CD for analytics apps.',
  },
  {
    icon: '\uD83D\uDCBB',
    title: 'Software Development',
    summary:
      'Full-stack delivery with FastAPI, React, and TypeScript — from REST APIs to interactive dashboards.',
  },
] as const;

const IMPACT_ITEMS = [
  { stat: '$2.2M', description: 'Annual energy savings delivered through ML-driven optimization at NIH\'s Central Utility Plant' },
  { stat: '93%', description: 'Reduction in false positive maintenance alerts across 20,000+ monitored points' },
  { stat: '50% More Accurate', description: '96-hour cooling demand forecasting vs. legacy system, enabling proactive chiller sequencing' },
  { stat: '83% Faster', description: 'Data transfer speeds achieved through custom open-source migration tooling vs. vendor solution' },
] as const;

const FEATURED_PROJECTS = [
  {
    title: 'MIT Applied Data Science — Emotion Detection',
    badges: ['Machine Learning', 'Interactive Demo'],
    description:
      'Facial emotion classification using VGG16 transfer learning. Try the live demo with your webcam or upload an image.',
    link: '/projects/mit-data-science',
  },
  {
    title: 'Facial Detection System',
    badges: ['OpenCV', 'Python'],
    description:
      'Real-time face detection and emotion recognition using deep learning models and OpenCV for live video processing.',
    link: 'https://github.com/ianedmundson1/Facial-detection',
    external: true,
  },
  {
    title: 'Lane Detection Algorithm',
    badges: ['Computer Vision', 'Autonomous Vehicles'],
    description:
      'Advanced lane detection for autonomous driving using computer vision and image processing techniques.',
    link: 'https://github.com/ianedmundson1/Lane-detection',
    external: true,
  },
] as const;


/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const HomePage: React.FC = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.homepage} ref={wrapperRef}>
      <a className="skip-link" href="#expertise">
        Skip to content
      </a>

      <Navigation />

      <main className="main-content">
        {/* ---- Hero ---- */}
        <header className={styles.hero}>
          <div className={styles.heroContainer}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge} role="status">
                <span className={styles.heroBadgeDot} aria-hidden="true" />
                Open to opportunities
              </div>
              <h1 className={styles.heroTitle}>Ian Edmundson</h1>
              <p className={styles.heroSubtitle}>Data Scientist & Software Engineer</p>
              <p className={styles.heroDescription}>
                Building analytics infrastructure and ML systems for federal
                operations. NIH Director&apos;s Award recipient for forecasting that
                protected critical infrastructure during a high-demand crisis
                event.
              </p>
              <div className={styles.heroActions}>
                <Link to="/projects" className={`${styles.btn} ${styles.btnPrimary}`}>
                  View Projects
                </Link>
                <Link to="/about" className={`${styles.btn} ${styles.btnSecondary}`}>
                  About Me
                </Link>
                <a
                  href="/resume_ian_edmundson.pdf"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resume (PDF)
                </a>
              </div>
              <p className={styles.heroAward} role="note">
                <span aria-hidden="true">{'\uD83C\uDFC6'}</span> NIH Director&apos;s Award 2024
              </p>
            </div>
            <div className={styles.heroPhoto}>
              <div className={styles.heroPhotoRing} aria-hidden="true" />
              <img src={headshot} alt="Ian Edmundson headshot" />
            </div>
          </div>
        </header>

        {/* ---- Expertise (condensed) ---- */}
        <section id="expertise" className={`${styles.expertiseSection} fade-section`} aria-labelledby="expertise-heading">
          <div className="section-container">
            <h2 id="expertise-heading" className={styles.sectionTitle}>Areas of Expertise</h2>
            <p className={styles.sectionSubtitle}>
              From raw data to production models — end-to-end ownership across
              the analytics stack.
            </p>
            <div className={styles.expertiseGrid}>
              {EXPERTISE_CARDS.map((card) => (
                <article key={card.title} className={styles.expertiseCard}>
                  <div className={styles.expertiseIcon} aria-hidden="true">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Impact ---- */}
        <section className={`${styles.impactSection} fade-section`} aria-labelledby="impact-heading">
          <div className="section-container">
            <h2 id="impact-heading" className={styles.sectionTitle}>Technical Impact</h2>
            <p className={styles.sectionSubtitle}>
              Measurable outcomes from data-driven solutions in production.
            </p>
            <div className={styles.impactGrid}>
              {IMPACT_ITEMS.map((item) => (
                <div key={item.stat} className={styles.impactItem}>
                  <h4>{item.stat}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Featured Projects ---- */}
        <section className={`${styles.featuredSection} fade-section`} aria-labelledby="featured-heading">
          <div className="section-container">
            <h2 id="featured-heading" className={styles.sectionTitle}>Featured Projects</h2>
            <p className={styles.sectionSubtitle}>
              A few highlights — see all my work on the projects page.
            </p>
            <div className={styles.featuredGrid}>
              {FEATURED_PROJECTS.map((project) => (
                <article key={project.title} className={styles.featuredCard}>
                  <div className={styles.featuredBadges}>
                    {project.badges.map((badge) => (
                      <span key={badge} className={styles.featuredBadge}>{badge}</span>
                    ))}
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {'external' in project && project.external ? (
                    <a
                      href={project.link}
                      className={styles.featuredLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub &rarr;
                    </a>
                  ) : (
                    <Link to={project.link} className={styles.featuredLink}>
                      View Project &rarr;
                    </Link>
                  )}
                </article>
              ))}
            </div>
            <div className={styles.featuredFooter}>
              <Link to="/projects" className={styles.viewAllBtn}>
                View All Projects &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Connect ---- */}
        <ConnectLinks variant="gradient" />
      </main>
    </div>
  );
};

export default HomePage;
