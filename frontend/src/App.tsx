import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProjectsPage from './components/ProjectsPage';
import ComputerVisionPage from './components/ComputerVisionPage';
import MITDataSciencePage from './pages/MITDataSciencePage/MITDataSciencePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/computer-vision" element={<ComputerVisionPage />} />
          <Route path="/projects/mit-data-science" element={<MITDataSciencePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;