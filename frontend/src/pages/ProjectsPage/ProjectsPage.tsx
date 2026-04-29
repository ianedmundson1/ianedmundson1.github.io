import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import Seo from '../../components/Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import styles from './ProjectsPage.module.css';

/* -------------------------------------------------- */
/*  Data                                               */
/* -------------------------------------------------- */
interface Project {
  title: string;
  badges: string[];
  interactive?: boolean;
  description: string;
  link?: string;
  linkLabel?: string;
  external?: boolean;
}

interface Category {
  icon: string;
  title: string;
  description: string;
  projects: Project[];
  viewAllLink?: string;
  viewAllLabel?: string;
}

const CATEGORIES: Category[] = [
  {
    icon: '🔬',
    title: 'Personal Projects',
    description:
      'Side projects exploring computer vision, IoT, and deep learning — built outside of work.',
    viewAllLink: '/projects/personal',
    viewAllLabel: 'View All Personal Projects',
    projects: [
      {
        title: 'Facial Detection System',
        badges: ['OpenCV', 'Python'],
        description:
          'Real-time face detection and emotion recognition system using deep learning models and OpenCV for live video processing.',
        link: 'https://github.com/ianedmundson1/Facial-detection',
        linkLabel: 'View Project',
        external: true,
      },
      {
        title: 'Lane Detection Algorithm',
        badges: ['Computer Vision', 'Autonomous Vehicles'],
        description:
          'Advanced lane detection system for autonomous driving applications using computer vision and image processing techniques.',
        link: 'https://github.com/ianedmundson1/Lane-detection',
        linkLabel: 'View Project',
        external: true,
      },
      {
        title: 'IoT Security Camera',
        badges: ['Raspberry Pi', 'IoT'],
        description:
          'Raspberry Pi-based security camera system with motion detection, cloud storage integration, and automated notifications.',
        link: 'https://github.com/ianedmundson1/Security-camera',
        linkLabel: 'View Project',
        external: true,
      },
    ],
  },
  {
    icon: '📊',
    title: 'Continuing Education & Certification Programs',
    description:
      'Hands-on coursework and capstone projects from professional data science and AI programs.',
    projects: [
      {
        title: 'MIT Applied Data Science',
        badges: ['Machine Learning', 'Analytics'],
        interactive: true,
        description:
          'Comprehensive data science coursework covering advanced machine learning techniques, statistical analysis, and real-world applications.',
        link: '/projects/mit-data-science',
        linkLabel: 'View Project',
      },
    ],
  },
  {
    icon: '🏛️',
    title: 'Past Work Projects',
    description:
      'Production ML systems, data pipelines, and cloud infrastructure built for federal operations at NIH.',
    projects: [
      {
        title: 'Energy Optimization Systems',
        badges: ['Forecasting', 'Optimization'],
        description:
          'Advanced ML models for energy efficiency optimization using NARX, Prophet, and PSO algorithms for 96-hour advance predictions. Delivered $2.2M in annual savings.',
        link: '/projects/energy-optimization',
        linkLabel: 'View Details',
      },
      {
        title: 'Cloud Data Migration',
        badges: ['Azure', 'ETL'],
        description:
          'Large-scale migration of 35,000+ data points from OSIsoft PI to Azure Data Lake Gen2 with optimized ETL pipelines. Achieved 83% faster transfer speeds via custom tooling.',
        link: '/projects/cloud-migration',
        linkLabel: 'View Details',
      },
    ],
  },
];

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const ProjectsPage: React.FC = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.projectsPage} ref={wrapperRef}>
      <Seo
        title="Projects"
        description="Selected projects by Ian Edmundson: emotion detection with VGG16 transfer learning, energy forecasting at NIH, cloud migration tooling, and computer vision systems."
        path="/projects"
      />
      <a className="skip-link" href="#projects-overview">
        Skip to content
      </a>

      <Navigation />

      <main className="main-content">
        {/* ---- Hero ---- */}
        <header className={styles.projectsHero}>
          <div className={styles.heroContainer}>
            <h1 className={styles.heroTitle}>Projects</h1>
            <p className={styles.heroSubtitle}>
              Explore my work in data science, machine learning, and computer
              vision
            </p>
          </div>
        </header>

        {/* ---- Projects Overview ---- */}
        <section
          id="projects-overview"
          className={`${styles.projectsOverview} fade-section`}
          aria-labelledby="projects-overview-heading"
        >
          <h2 id="projects-overview-heading" className="sr-only">
            All Project Categories
          </h2>
          <div className="section-container">
            <div className={styles.projectCategories}>
              {CATEGORIES.map((category) => (
                <article
                  key={category.title}
                  className={`${styles.categorySection} fade-section`}
                >
                  <h2 className={styles.categoryTitle}>
                    <span className={styles.categoryIcon} aria-hidden="true">
                      {category.icon}
                    </span>
                    {category.title}
                  </h2>
                  <p className={styles.categoryDescription}>
                    {category.description}
                  </p>

                  <div className={styles.projectsGrid}>
                    {category.projects.map((project) => (
                      <article key={project.title} className={styles.projectCard}>
                        <div className={styles.projectHeader}>
                          <h3>{project.title}</h3>
                          <div className={styles.projectBadges}>
                            {project.badges.map((badge) => (
                              <span key={badge} className={styles.projectBadge}>
                                {badge}
                              </span>
                            ))}
                            {project.interactive && (
                              <span className={`${styles.projectBadge} ${styles.interactive}`}>
                                Interactive
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={styles.projectDescription}>
                          {project.description}
                        </p>
                        {project.link && (
                          <div className={styles.projectLinks}>
                            {project.external ? (
                              <a
                                href={project.link}
                                className={`${styles.projectLink} ${styles.primary}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${project.linkLabel ?? 'View Project'} — ${project.title} (opens in new tab)`}
                              >
                                {project.linkLabel ?? 'View Project'}
                              </a>
                            ) : (
                              <Link
                                to={project.link}
                                className={`${styles.projectLink} ${styles.primary}`}
                                aria-label={`${project.linkLabel ?? 'View Project'} — ${project.title}`}
                              >
                                {project.linkLabel ?? 'View Project'}
                              </Link>
                            )}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>

                  {category.viewAllLink && (
                    <div className={styles.categoryFooter}>
                      <Link to={category.viewAllLink} className={styles.viewAllLink}>
                        {category.viewAllLabel} →
                      </Link>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;