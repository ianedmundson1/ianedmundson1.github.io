import React from 'react';
import Seo from '../../components/Seo';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { PROJECTS } from '../../data/personalProjects';
import styles from './PersonalProjectsPage.module.css';

const PersonalProjectsPage: React.FC = () => {
  return (
    <div className={styles.personalProjectsPage}>
      <Seo
        title="Personal Projects"
        description="Side projects by Ian Edmundson — computer vision with OpenCV, IoT systems on Raspberry Pi, and deep-learning experiments built outside of work."
      />
      <main className="main-content">
        <section className={styles.hero}>
          <div className={styles.heroContainer}>
            <h1 className={styles.heroTitle}>Personal Projects</h1>
            <p className={styles.heroSubtitle}>
              Side projects built outside of work; computer vision, IoT, and deep-learning experiments.
            </p>
          </div>
        </section>

        <section className={styles.projectsSection}>
          <div className={styles.sectionContainer}>
            <div className={styles.projectsGrid}>
              {PROJECTS.map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  badges={project.tech.slice(0, 2)}
                  description={project.summary}
                  link={project.href}
                  linkLabel="View on GitHub"
                  external
                  youtube={project.youtube}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonalProjectsPage;
