import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import Hero from '../../components/Hero/Hero';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import { CATEGORIES } from '../../data/projects';
import styles from './ProjectsPage.module.css';

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const ProjectsPage: React.FC = () => {
  const wrapperRef = useFadeOnScroll();

  return (
    <div className={styles.projectsPage} ref={wrapperRef}>
      <Seo
        title="Projects"
        description="Selected projects by Ian Edmundson: emotion detection with VGG16 transfer learning, energy forecasting at NIH, cloud migration tooling, and computer vision systems."
      />
      <a className="skip-link" href="#projects-overview">
        Skip to content
      </a>


      <main className="main-content">
        <Hero
          title="Projects"
          subtitle="Explore my work in data science, machine learning, and computer vision"
        />

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
                    {category.title}
                  </h2>
                  <p className={styles.categoryDescription}>
                    {category.description}
                  </p>

                  <div className={styles.projectsGrid}>
                    {category.projects.map((project) => (
                      <ProjectCard
                        key={project.title}
                        title={project.title}
                        badges={project.badges}
                        description={project.description}
                        link={project.link}
                        linkLabel={project.linkLabel}
                        external={project.external}
                        interactive={project.interactive}
                        youtube={project.youtube}
                      />
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