import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import Sparkline from '../../components/Sparkline';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import headshot400 from '../../assets/headshot-400.jpg';
import headshot400Webp from '../../assets/headshot-400.webp';
import headshot800Webp from '../../assets/headshot-800.webp';
import { EXPERTISE_CARDS, IMPACT_ITEMS, FEATURED_PROJECTS, HERO_DESCRIPTION } from '../../data/home';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import styles from './HomePage.module.css';

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ian Edmundson',
  url: 'https://ianedmundson.github.io',
  jobTitle: 'Data Scientist & Software Engineer',
  sameAs: [
    'https://www.linkedin.com/in/ianedmundson',
    'https://github.com/ianedmundson1',
  ],
} as const;

const HomePage: React.FC = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.homepage} ref={wrapperRef}>
      <Seo
        title="Ian Edmundson"
        description={HERO_DESCRIPTION}
        jsonLd={PERSON_JSON_LD}
      />
      <a className="skip-link" href="#expertise">
        Skip to content
      </a>


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
                {HERO_DESCRIPTION}
              </p>
              <div className={styles.heroActions}>
                <Link to="/projects" className={`${styles.btn} ${styles.btnPrimary}`}>
                  View projects &rarr;
                </Link>
                <Link to="/about" className={`${styles.btn} ${styles.btnSecondary}`}>
                  About
                </Link>
                <a
                  href={`${import.meta.env.BASE_URL}resume_ian_edmundson.pdf`}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resume
                </a>
              </div>
              <p className={styles.heroAward} role="note">
                NIH Director&apos;s Award &middot; 2024
              </p>
            </div>
            <div className={styles.heroPhoto}>
              <div className={styles.heroPhotoRing} aria-hidden="true" />
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${headshot400Webp} 400w, ${headshot800Webp} 800w`}
                  sizes="260px"
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

        {/* ---- Expertise ---- */}
        <section id="expertise" className={`${styles.expertiseSection} fade-section`} aria-labelledby="expertise-heading">
          <div className="section-container">
            <span className={styles.eyebrow}>01 / Expertise</span>
            <h2 id="expertise-heading" className={styles.sectionTitle}>Areas of practice</h2>
            <p className={styles.sectionSubtitle}>
              From raw data to production models. End-to-end ownership across
              the analytics stack.
            </p>
            <div className={styles.expertiseGrid}>
              {EXPERTISE_CARDS.map((card) => (
                <article key={card.title} className={styles.expertiseCard}>
                  <div className={styles.expertiseIcon}>{card.icon}</div>
                  <div className={styles.expertiseCardBody}>
                    <h3>{card.title}</h3>
                    <p>{card.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Impact ---- */}
        <section className={`${styles.impactSection} fade-section`} aria-labelledby="impact-heading">
          <div className="section-container">
            <span className={styles.eyebrow}>02 / Impact</span>
            <h2 id="impact-heading" className={styles.sectionTitle}>Measured outcomes</h2>
            <p className={styles.sectionSubtitle}>
              Production results from data-driven systems.
            </p>
            <div className={styles.impactGrid}>
              {IMPACT_ITEMS.map((item) => (
                <div key={item.stat} className={styles.impactItem}>
                  <Sparkline
                    data={item.spark}
                    width={96}
                    height={28}
                    className={styles.impactSpark}
                    ariaLabel={`Trend for ${item.label}`}
                  />
                  <h4>{item.stat}</h4>
                  <p>
                    <span className={styles.impactLabel}>{item.label}</span>
                    {' — '}{item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Featured Projects ---- */}
        <section className={`${styles.featuredSection} fade-section`} aria-labelledby="featured-heading">
          <div className="section-container">
            <span className={styles.eyebrow}>03 / Selected work</span>
            <h2 id="featured-heading" className={styles.sectionTitle}>Featured projects</h2>
            <p className={styles.sectionSubtitle}>
              A few highlights. See all my work on the projects page.
            </p>
            <div className={styles.featuredGrid}>
              {FEATURED_PROJECTS.map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  badges={[...project.badges]}
                  description={project.description}
                  link={project.link}
                  linkLabel={project.linkLabel}
                  external={project.external}
                  youtube={project.youtube}
                />
              ))}
            </div>
            <div className={styles.featuredFooter}>
              <Link to="/projects" className={styles.viewAllBtn}>
                View all projects &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Connect ---- */}
      </main>
    </div>
  );
};

export default HomePage;
