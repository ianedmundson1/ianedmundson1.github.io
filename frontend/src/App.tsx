import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import RouteAnnouncer from './components/RouteAnnouncer';
import Layout from './components/Layout/Layout';
import { ROUTES } from './data/routes';
import styles from './App.module.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const PersonalProjectsPage = lazy(() => import('./pages/PersonalProjectsPage'));
const MITDataSciencePage = lazy(() => import('./pages/MITDataSciencePage'));
const RagDemoPage = lazy(() => import('./pages/RagDemoPage'));
const EnergyOptimizationPage = lazy(() => import('./pages/EnergyOptimizationPage'));
const CloudMigrationPage = lazy(() => import('./pages/CloudMigrationPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <Router basename={import.meta.env.BASE_URL}>
            <RouteAnnouncer />
            <div className={styles.App}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path={ROUTES.home} element={<HomePage />} />
                  <Route path={ROUTES.projects} element={<ProjectsPage />} />
                  <Route path={ROUTES.personalProjects} element={<PersonalProjectsPage />} />
                  <Route path={ROUTES.mitDataScience} element={<MITDataSciencePage />} />
                  <Route path={ROUTES.ragDemo} element={<RagDemoPage />} />
                  <Route path={ROUTES.energyOptimization} element={<EnergyOptimizationPage />} />
                  <Route path={ROUTES.cloudMigration} element={<CloudMigrationPage />} />
                  <Route path={ROUTES.about} element={<AboutPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
