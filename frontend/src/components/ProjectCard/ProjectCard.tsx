import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '@/data/projects';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, summary, badges, link, linkLabel, external, interactive, youtube } = project;
  const resolvedLabel = linkLabel ?? (external ? 'View on GitHub' : 'View Details');

  return (
    <article className={styles.card}>
      <div className={styles.badges}>
        {badges.map((badge) => (
          <span key={badge} className={styles.badge}>{badge}</span>
        ))}
        {interactive && (
          <span className={`${styles.badge} ${styles.badgeInteractive}`}>Interactive</span>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{summary}</p>
      {(link || youtube) && (
        <div className={styles.actions}>
          {link && (
            external ? (
              <a
                href={link}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resolvedLabel} &rarr;
              </a>
            ) : (
              <Link to={link} className={styles.link}>
                {resolvedLabel} &rarr;
              </Link>
            )
          )}
          {youtube && (
            <a
              href={youtube}
              className={`${styles.link} ${styles.linkSecondary}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} demo on YouTube (opens in new tab)`}
            >
              Watch demo &rarr;
            </a>
          )}
        </div>
      )}
    </article>
  );
};

export default ProjectCard;
