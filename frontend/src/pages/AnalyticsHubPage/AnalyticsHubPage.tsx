import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import Hero from '@/components/Hero/Hero';
import { ROUTES } from '@/data/routes';
import styles from './AnalyticsHubPage.module.css';

interface Dataset {
  title: string;
  blurb: string;
  to: string;
  source: string;
}

const DATASETS: readonly Dataset[] = [
  {
    title: 'Seattle Fire 911 Calls',
    blurb:
      'Dispatch records from the Seattle Fire Department. Volume by time of day, day of week, and call type.',
    to: ROUTES.seattleFire911,
    source: 'seattle_data.seattle_bronze.seattle_fire_911_calls',
  },
] as const;

const AnalyticsHubPage: React.FC = () => {
  return (
    <div className={styles.analyticsHubPage}>
      <Seo
        title="Analytics"
        description="Public-data analytics dashboards by Ian Edmundson, starting with Seattle Fire Department 911 call records."
      />
      <main className="main-content">
        <Hero
          title="Analytics"
          subtitle="Dashboards over public datasets, refreshed by a separate ingestion pipeline and queried live from the warehouse."
        />

        <section className={styles.datasetsSection}>
          <div className={styles.sectionContainer}>
            <ul className={styles.datasetsGrid}>
              {DATASETS.map((d) => (
                <li key={d.to}>
                  <Link to={d.to} className={styles.datasetCard}>
                    <h2 className={styles.datasetTitle}>{d.title}</h2>
                    <p className={styles.datasetBlurb}>{d.blurb}</p>
                    <p className={styles.datasetSource}>
                      <span className={styles.datasetSourceLabel}>Source: </span>
                      <code>{d.source}</code>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsHubPage;
