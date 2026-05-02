import React from 'react';
import Seo from '../../components/Seo';
import { PROJECTS } from '../../data/personalProjects';
import styles from './PersonalProjectsPage.module.css';

const PersonalProjectsPage: React.FC = () => {
  return (
    <div className={styles.personalProjectsPage}>
      <Seo
        title="Personal Projects"
        description="Side projects by Ian Edmundson — computer vision with OpenCV, IoT systems on Raspberry Pi, and deep-learning experiments built outside of work."
        path="/projects/personal"
      />
      <main className="main-content">
        <section className={styles.hero}>
          <div className={styles.heroContainer}>
            <h1 className={styles.heroTitle}>Personal Projects</h1>
            <p className={styles.heroSubtitle}>
              Side projects built outside of work — computer vision, IoT, and deep-learning experiments.
            </p>
          </div>
        </section>

        <section className={styles.projectsSection}>
          <div className={styles.sectionContainer}>
            <ul className={styles.projectsList}>
              {PROJECTS.map((project) => (
                <li key={project.title} className={styles.projectItem}>
                  <div className={styles.projectContent}>
                    <h2>{project.title}</h2>
                    <p className={styles.projectSummary}>{project.summary}</p>
                    <ul className={styles.projectTech} aria-label="Technologies used">
                      {project.tech.map((tag) => (
                        <li key={tag} className={styles.techBadge}>{tag}</li>
                      ))}
                    </ul>
                    <div className={styles.projectActions}>
                      <a
                        href={project.href}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub (opens in new tab)`}
                      >
                        View on GitHub
                      </a>
                      {project.youtube && (
                        <a
                          href={project.youtube}
                          className={`${styles.btn} ${styles.btnSecondary}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} demo on YouTube (opens in new tab)`}
                        >
                          Watch demo
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonalProjectsPage;