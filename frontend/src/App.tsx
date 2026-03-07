import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ComputerVisionPage from './pages/ComputerVisionPage';
import MITDataSciencePage from './pages/MITDataSciencePage/MITDataSciencePage';
import styles from './App.module.css';

function App() {
  return (
    <ThemeProvider>
    <Router>
      <div className={styles.App}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/computer-vision" element={<ComputerVisionPage />} />
          <Route path="/projects/mit-data-science" element={<MITDataSciencePage />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;