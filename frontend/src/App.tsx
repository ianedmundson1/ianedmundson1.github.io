import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import RouteAnnouncer from './components/RouteAnnouncer';
import Layout from './components/Layout/Layout';
import styles from './App.module.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const PersonalProjectsPage = lazy(() => import('./pages/PersonalProjectsPage'));
const MITDataSciencePage = lazy(() => import('./pages/MITDataSciencePage'));
const RagDemoPage = lazy(() => import('./pages/RagDemoPage'));
const EnergyOptimizationPage = lazy(() => import('./pages/EnergyOptimizationPage'));
const CloudMigrationPage = lazy(() => import('./pages/CloudMigrationPage'));
const BooksPage = lazy(() => import('./pages/BooksPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <HelmetProvider>
    <ThemeProvider>
    <ErrorBoundary>
    <Router basename={import.meta.env.BASE_URL}>
      <RouteAnnouncer />
      <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
      <div className={styles.App}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/personal" element={<PersonalProjectsPage />} />
            <Route path="/projects/mit-data-science" element={<MITDataSciencePage />} />
            <Route path="/projects/rag-demo" element={<RagDemoPage />} />
            <Route path="/projects/energy-optimization" element={<EnergyOptimizationPage />} />
            <Route path="/projects/cloud-migration" element={<CloudMigrationPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
      </Suspense>
    </Router>
    </ErrorBoundary>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;