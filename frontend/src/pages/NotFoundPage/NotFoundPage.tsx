import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => (
  <>
    <Seo
      title="Page not found"
      description="The page you're looking for doesn't exist."
      path="/404"
    />
    <main className="main-content">
      <div className={styles.container}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            &larr; Back home
          </Link>
          <Link to="/projects" className={styles.btnSecondary}>
            View projects
          </Link>
        </div>
      </div>
    </main>
  </>
);

export default NotFoundPage;
