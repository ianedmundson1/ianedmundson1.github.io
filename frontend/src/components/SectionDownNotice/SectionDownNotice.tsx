import React from 'react';
import styles from './SectionDownNotice.module.css';

interface SectionDownNoticeProps {
  /** Whether the wrapped section is currently down. Defaults to true — the wrapper's presence implies "down." */
  down?: boolean;
  /** Headline shown in the notice (e.g. "Demo Temporarily Offline"). */
  title?: string;
  /** Body text explaining why or when it'll be back. */
  message?: string;
  /** Optional eyebrow label. */
  eyebrow?: string;
  /** Optional id applied to the notice section, so skip-link targets remain valid even when the wrapped content is hidden. */
  id?: string;
  children: React.ReactNode;
}

/**
 * Wraps a section to mark it as temporarily down. When `down` is true (default),
 * the wrapper renders a styled notice in place of the children. To restore the
 * section, set `down={false}` or remove the wrapper entirely — children return
 * unchanged.
 */
const SectionDownNotice: React.FC<SectionDownNoticeProps> = ({
  down = true,
  title = 'Section Temporarily Unavailable',
  message = 'This part of the site is paused. Please check back soon.',
  eyebrow = 'Temporarily offline',
  id,
  children,
}) => {
  if (!down) return <>{children}</>;

  return (
    <section id={id} className={styles.notice} role="status" aria-live="polite">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
      </div>
    </section>
  );
};

export default SectionDownNotice;
