import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation/Navigation';
import ConnectLinks from '@/components/ConnectLinks/ConnectLinks';
import ErrorBoundary from '@/components/ErrorBoundary';
import styles from './Layout.module.css';

const RouteFallback = () => (
  <main className={`main-content ${styles.routeError}`} role="alert">
    <h1>This page failed to load</h1>
    <p>Something went wrong rendering this page. Try reloading, or pick another from the menu.</p>
    <button type="button" onClick={() => window.location.reload()} className={styles.routeErrorButton}>
      Reload
    </button>
  </main>
);

const Layout = () => {
  const location = useLocation();
  return (
    <>
      <Navigation />
      <ErrorBoundary resetKey={location.pathname} fallback={<RouteFallback />}>
        <Suspense fallback={<div className={styles.loading} role="status" aria-live="polite">Loading…</div>}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
      <ConnectLinks />
    </>
  );
};

export default Layout;