import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
  title: string;
  badges: string[];
  description: string;
  link?: string;
  linkLabel?: string;
  external?: boolean;
  interactive?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  badges,
  description,
  link,
  linkLabel = 'View Project',
  external = false,
  interactive = false,
}) => (
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
    <p className={styles.description}>{description}</p>
    {link && (
      external ? (
        <a
          href={link}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkLabel} &rarr;
        </a>
      ) : (
        <Link to={link} className={styles.link}>
          {linkLabel} &rarr;
        </Link>
      )
    )}
  </article>
);

export default ProjectCard;
