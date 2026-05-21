import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import Hero from '../../components/Hero/Hero';
import { useFire911Metadata } from '../../api/analytics';
import { ROUTES } from '../../data/routes';
import styles from './SeattleFire911Page.module.css';

const formatRowCount = (n: number) => n.toLocaleString('en-US');

const formatFetchedAt = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
};

const SeattleFire911Page: React.FC = () => {
  const { data, isLoading, error } = useFire911Metadata();

  return (
    <div className={styles.seattleFire911Page}>
      <Seo
        title="Seattle Fire 911 Calls"
        description="Live analytics over Seattle Fire Department 911 dispatch records, queried from a Databricks warehouse."
      />
      <main className="main-content">
        <Hero
          title="Seattle Fire 911 Calls"
          subtitle="Seattle Fire Department dispatch volume from the bronze-layer warehouse table. Refreshed by a separate ingestion pipeline."
        />

        <section className={styles.sourceSection} aria-labelledby="source-heading">
          <div className={styles.sectionContainer}>
            <h2 id="source-heading" className={styles.sectionTitle}>Source</h2>

            {isLoading && (
              <p className={styles.statusMessage} aria-busy="true">
                Loading source metadata...
              </p>
            )}

            {error && (
              <p className={styles.statusMessage} role="alert">
                Could not load source metadata. The warehouse may be unavailable or
                misconfigured.
              </p>
            )}

            {data && (
              <dl className={styles.sourceList}>
                <div className={styles.sourceRow}>
                  <dt>Table</dt>
                  <dd><code>{data.table}</code></dd>
                </div>
                <div className={styles.sourceRow}>
                  <dt>Row count</dt>
                  <dd>{formatRowCount(data.rowCount)}</dd>
                </div>
                <div className={styles.sourceRow}>
                  <dt>Fetched at</dt>
                  <dd>{formatFetchedAt(data.fetchedAt)}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        <section className={styles.placeholderSection} aria-labelledby="placeholder-heading">
          <div className={styles.sectionContainer}>
            <h2 id="placeholder-heading" className={styles.sectionTitle}>Charts</h2>
            <p className={styles.placeholderText}>
              Aggregations land in the next iteration: calls by hour of day, day of week,
              month, and call type.
            </p>
            <p className={styles.backLink}>
              <Link to={ROUTES.analyticsHub}>Back to analytics</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SeattleFire911Page;
