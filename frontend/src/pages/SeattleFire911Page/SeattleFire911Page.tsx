import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/Seo';
import Hero from '@/components/Hero/Hero';
import { useFire911Metadata, useFire911RecentCalls, useFire911Last24hByCategory } from '@/api/analytics';
import { ROUTES } from '@/data/routes';
import styles from './SeattleFire911Page.module.css';
import type { Figure } from '@/api/plots';
import PlotlyEmbed from '@/components/PlotlyEmbed';

const formatRowCount = (n: number) => n.toLocaleString('en-US');

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
};

const SeattleFire911Page: React.FC = () => {
  const { data, isLoading, error } = useFire911Metadata();
  const recent = useFire911RecentCalls();
  const byCategory = useFire911Last24hByCategory();

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
                  <dd>{formatDateTime(data.fetchedAt)}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        <section className={styles.recentSection} aria-labelledby="recent-heading">
          <div className={styles.sectionContainer}>
            <h2 id="recent-heading" className={styles.sectionTitle}>Recent calls</h2>
            <p className={styles.sectionSubtitle}>10 most recent dispatch records.</p>

            {recent.isLoading && (
              <p className={styles.statusMessage} aria-busy="true">
                Loading recent calls...
              </p>
            )}

            {recent.error && (
              <p className={styles.statusMessage} role="alert">
                Could not load recent calls. The warehouse may be unavailable or
                misconfigured.
              </p>
            )}

            {recent.data && (
              <ul className={styles.callsList}>
                {recent.data.calls.map((call,i) => (
                  <li key={`${call.incidentNumber}-${call.datetime}-${i}`}>
                    <article className={styles.callCard}>
                      <p className={styles.callType}>{call.type}</p>
                      <p className={styles.callAddress}>{call.address}</p>
                      <p className={styles.callMeta}>
                        <time dateTime={call.datetime}>{formatDateTime(call.datetime)}</time>
                        <span className={styles.callIncident}>#{call.incidentNumber}</span>
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className={styles.byCategorySection} aria-labelledby="by-category-heading">
          <div className={styles.sectionContainer}>
            <h2 id="by-category-heading" className={styles.sectionTitle}>Calls by category, last 24 hours</h2>
            <p className={styles.sectionSubtitle}>
              {byCategory.data
                ? <>Window ending <time dateTime={byCategory.data.windowEnd}>{formatDateTime(byCategory.data.windowEnd)}</time></>  
                : 'Loading window...'}
            </p>
            {byCategory.isLoading && (
              <p className={styles.statusMessage} aria-busy="true">
                Loading calls by category...
              </p>
            )}

            {byCategory.error && (
              <p className={styles.statusMessage} role="alert">
                Could not load calls by category. The warehouse may be unavailable or
                misconfigured.
              </p>
            )}

            {byCategory.data && byCategory.data.buckets.length === 0 &&(
              <p className={styles.statusMessage}>No calls in the last 24 hours</p>
            )}

            {byCategory.data && byCategory.data.buckets.length > 0 && (() => {

              const buckets = byCategory.data.buckets;
              const figure: Figure = {
                data: [{
                  type: 'bar',
                  orientation: 'h',
                  x: buckets.map((b) => b.count),
                  y: buckets.map((b) => b.type),
                }],
                layout: {
                  xaxis: { title: {text: 'Calls'} },
                  yaxis: { title: {text: '' }, automargin: true, autorange: 'reversed'},
                  margin: {l: 20, r:20, t: 20, b:50 },
                },
              };
              return(
                <PlotlyEmbed
                  figure={figure}
                  ariaLabel="Calls by category in the last 24 hours, horizontal bar chart"
                  height={Math.max(300, buckets.length * 32)}
                  mobileHeight={Math.max(280, buckets.length * 28)}
                  />
              );
            }
            )()}
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
