import React from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  subtitle?: string;
  titleId?: string;
  ariaLabelledBy?: string;
  media?: React.ReactNode;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  titleId,
  ariaLabelledBy,
  media,
  className,
}) => {
  const containerClass = media
    ? `${styles.container} ${styles.containerWithMedia}`
    : styles.container;

  return (
    <header
      className={`${styles.hero} ${className || ''}`.trim()}
      aria-labelledby={ariaLabelledBy}
    >
      <div className={containerClass}>
        <div className={styles.text}>
          <h1 id={titleId} className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {media && <div className={styles.media}>{media}</div>}
      </div>
    </header>
  );
};

export default Hero;
