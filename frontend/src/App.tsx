import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './App.module.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ComputerVisionPage = lazy(() => import('./pages/ComputerVisionPage'));
const MITDataSciencePage = lazy(() => import('./pages/MITDataSciencePage/MITDataSciencePage'));

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
        </Routes>
      </div>
      </Suspense>
    </Router>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;