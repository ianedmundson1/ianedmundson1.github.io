import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './App.module.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ComputerVisionPage = lazy(() => import('./pages/ComputerVisionPage'));
const MITDataSciencePage = lazy(() => import('./pages/MITDataSciencePage/MITDataSciencePage'));
const EnergyOptimizationPage = lazy(() => import('./pages/EnergyOptimizationPage/EnergyOptimizationPage'));
const CloudMigrationPage = lazy(() => import('./pages/CloudMigrationPage/CloudMigrationPage'));
const BooksPage = lazy(() => import('./pages/BooksPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <ThemeProvider>
    <ErrorBoundary>
    <Router>
      <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
      <div className={styles.App}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/computer-vision" element={<ComputerVisionPage />} />
          <Route path="/projects/mit-data-science" element={<MITDataSciencePage />} />
          <Route path="/projects/energy-optimization" element={<EnergyOptimizationPage />} />
          <Route path="/projects/cloud-migration" element={<CloudMigrationPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
      </Suspense>
    </Router>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;