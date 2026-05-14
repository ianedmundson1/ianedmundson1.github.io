import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import ConnectLinks from '../ConnectLinks/ConnectLinks';
import styles from './Layout.module.css';

const Layout = () => (
  <>
    <Navigation />
    <Suspense fallback={<div className={styles.loading} role="status" aria-live="polite">Loading…</div>}>
      <Outlet />
    </Suspense>
    <ConnectLinks />
  </>
);

export default Layout;