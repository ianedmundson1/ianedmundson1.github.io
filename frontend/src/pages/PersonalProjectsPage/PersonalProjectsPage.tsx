import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Seo from '../../components/Seo';
import styles from './PersonalProjectsPage.module.css';

interface PersonalProject {
  title: string;
  summary: string;
  tech: string[];
  href: string;
  youtube?: string;
}

const PROJECTS: PersonalProject[] = [
  {
    title: 'Facial Detection System',
    summary:
      'Real-time face detection and emotion recognition using deep-learning models and OpenCV for live video processing.',
    tech: ['OpenCV', 'Python', 'Deep Learning', 'Real-time Processing'],
    href: 'https://github.com/ianedmundson1/Facial-detection',
    youtube: 'https://www.youtube.com/watch?v=0VEvEf_r25U'
  },
  {
    title: 'Lane Detection Algorithm',
    summary:
      'Lane detection for autonomous-driving applications using computer vision and image-processing techniques, robust across varying lighting and road conditions.',
    tech: ['Computer Vision', 'Image Processing', 'OpenCV', 'Autonomous Vehicles'],
    href: 'https://github.com/ianedmundson1/Lane-detection',
    youtube: 'https://www.youtube.com/watch?v=0klrGBsJtYY'
  },
  {
    title: 'IoT Security Camera System',
    summary:
      'Raspberry Pi-based security camera with motion detection, cloud storage, and automated notifications for end-to-end home surveillance.',
    tech: ['Raspberry Pi', 'IoT', 'Motion Detection', 'Cloud Storage'],
    href: 'https://github.com/ianedmundson1/Security-camera',

  },
];

const PersonalProjectsPage: React.FC = () => {
  return (
    <div className={styles.personalProjectsPage}>
      <Seo
        title="Personal Projects"
        description="Side projects by Ian Edmundson — computer vision with OpenCV, IoT systems on Raspberry Pi, and deep-learning experiments built outside of work."
        path="/projects/personal"
      />
      <Navigation />
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