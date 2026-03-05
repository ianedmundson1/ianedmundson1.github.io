import React, { useEffect, useRef, useCallback } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import './ProjectsPage.css';

/* -------------------------------------------------- */
/*  Data                                               */
/* -------------------------------------------------- */
interface Project {
  title: string;
  badges: string[];
  interactive?: boolean;
  description: string;
  link: string;
  linkLabel?: string;
  external?: boolean;
}

interface Category {
  icon: string;
  title: string;
  description: string;
  projects: Project[];
  viewAllLink: string;
  viewAllLabel: string;
}

const CATEGORIES: Category[] = [
  {
    icon: '🔬',
    title: 'Personal Projects',
    description:
      'Real-time computer vision applications using OpenCV, deep learning, and image processing techniques.',
    viewAllLink: '/projects/computer-vision',
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
      'Advanced analytics, machine learning models, and data engineering solutions for real-world problems.',
    viewAllLink: '/projects/data-science',
    viewAllLabel: 'View All Continuing Education Projects',
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
      'Advanced analytics, machine learning models, and data engineering solutions for real-world problems.',
    viewAllLink: '/projects/data-science',
    viewAllLabel: 'View All Data Science Projects',
    projects: [
      {
        title: 'Energy Optimization Systems',
        badges: ['Forecasting', 'Optimization'],
        description:
          'Advanced ML models for energy efficiency optimization using NARX, Prophet, and PSO algorithms for 96-hour advance predictions.',
        link: '/projects/data-science/energy-optimization',
        linkLabel: 'View Project',
      },
      {
        title: 'Cloud Data Migration',
        badges: ['Azure', 'ETL'],
        description:
          'Large-scale migration of 35,000+ data points from OSIsoft PI to Azure Data Lake Gen2 with optimized ETL pipelines.',
        link: '/projects/data-science/cloud-migration',
        linkLabel: 'View Project',
      },
    ],
  },
];

/* -------------------------------------------------- */
/*  Scroll-fade hook                                   */
/* -------------------------------------------------- */
function useFadeOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>('.fade-section');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(observe, [observe]);

  return ref;
}

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const ProjectsPage: React.FC = () => {
  const wrapperRef = useFadeOnScroll();

  return (
    <div className="projects-page" ref={wrapperRef}>
      <a className="skip-link" href="#projects-overview">
        Skip to content
      </a>

      <Navigation />

      <main className="main-content">
        {/* ---- Hero ---- */}
        <header className="projects-hero">
          <div className="hero-container">
            <h1 className="hero-title">Projects</h1>
            <p className="hero-subtitle">
              Explore my work in data science, machine learning, and computer
              vision
            </p>
          </div>
        </header>

        {/* ---- Projects Overview ---- */}
        <section
          id="projects-overview"
          className="projects-overview fade-section"
          aria-labelledby="projects-overview-heading"
        >
          <h2 id="projects-overview-heading" className="sr-only">
            All Project Categories
          </h2>
          <div className="section-container">
            <div className="project-categories">
              {CATEGORIES.map((category) => (
                <article
                  key={category.title}
                  className="category-section fade-section"
                >
                  <h2 className="category-title">
                    <span className="category-icon" aria-hidden="true">
                      {category.icon}
                    </span>
                    {category.title}
                  </h2>
                  <p className="category-description">
                    {category.description}
                  </p>

                  <div className="projects-grid">
                    {category.projects.map((project) => (
                      <article key={project.title} className="project-card">
                        <div className="project-header">
                          <h3>{project.title}</h3>
                          <div className="project-badges">
                            {project.badges.map((badge) => (
                              <span key={badge} className="project-badge">
                                {badge}
                              </span>
                            ))}
                            {project.interactive && (
                              <span className="project-badge interactive">
                                Interactive
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="project-description">
                          {project.description}
                        </p>
                        <div className="project-links">
                          <a
                            href={project.link}
                            className="project-link primary"
                            {...(project.external && {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                            })}
                            aria-label={
                              project.external
                                ? `${project.linkLabel ?? 'View Project'} — ${project.title} (opens in new tab)`
                                : `${project.linkLabel ?? 'View Project'} — ${project.title}`
                            }
                          >
                            {project.linkLabel ?? 'View Project'}
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="category-footer">
                    <a href={category.viewAllLink} className="view-all-link">
                      {category.viewAllLabel} →
                    </a>
                  </div>
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