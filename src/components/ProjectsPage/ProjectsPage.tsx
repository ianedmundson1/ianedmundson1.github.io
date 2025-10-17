import React from 'react';
import Navigation from '../Navigation/Navigation';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
  return (
    <div className="projects-page">
      <Navigation />
      <main className="main-content">
        <section className="projects-hero">
          <div className="hero-container">
            <h1 className="hero-title">Projects</h1>
            <p className="hero-subtitle">
              Explore my work in data science, machine learning, and computer vision
            </p>
          </div>
        </section>

        <section className="projects-overview">
          <div className="section-container">
            <div className="project-categories">
              
              <div className="category-section">
                <h2 className="category-title">
                  <span className="category-icon">🖥️</span>
                  Computer Vision
                </h2>
                <p className="category-description">
                  Real-time computer vision applications using OpenCV, deep learning, and image processing techniques.
                </p>
                <div className="projects-grid">
                  <div className="project-card">
                    <div className="project-header">
                      <h3>Facial Detection System</h3>
                      <span className="project-badge">OpenCV • Python</span>
                    </div>
                    <p className="project-description">
                      Real-time face detection and emotion recognition system using deep learning models and OpenCV for live video processing.
                    </p>
                    <div className="project-links">
                      <a href="/projects/computer-vision/facial-detection" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>

                  <div className="project-card">
                    <div className="project-header">
                      <h3>Lane Detection Algorithm</h3>
                      <span className="project-badge">Computer Vision • Autonomous Vehicles</span>
                    </div>
                    <p className="project-description">
                      Advanced lane detection system for autonomous driving applications using computer vision and image processing techniques.
                    </p>
                    <div className="project-links">
                      <a href="/projects/computer-vision/lane-detection" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>

                  <div className="project-card">
                    <div className="project-header">
                      <h3>IoT Security Camera</h3>
                      <span className="project-badge">Raspberry Pi • IoT</span>
                    </div>
                    <p className="project-description">
                      Raspberry Pi-based security camera system with motion detection, cloud storage integration, and automated notifications.
                    </p>
                    <div className="project-links">
                      <a href="/projects/computer-vision/security-camera" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>
                </div>
                <div className="category-footer">
                  <a href="/projects/computer-vision" className="view-all-link">
                    View All Computer Vision Projects →
                  </a>
                </div>
              </div>

              <div className="category-section">
                <h2 className="category-title">
                  <span className="category-icon">📊</span>
                  Data Science
                </h2>
                <p className="category-description">
                  Advanced analytics, machine learning models, and data engineering solutions for real-world problems.
                </p>
                <div className="projects-grid">
                  <div className="project-card">
                    <div className="project-header">
                      <h3>MIT Applied Data Science</h3>
                      <span className="project-badge">Machine Learning • Analytics</span>
                    </div>
                    <p className="project-description">
                      Comprehensive data science coursework covering advanced machine learning techniques, statistical analysis, and real-world applications.
                    </p>
                    <div className="project-links">
                      <a href="/projects/data-science/mit-applied-data-science" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>

                  <div className="project-card">
                    <div className="project-header">
                      <h3>Energy Optimization Systems</h3>
                      <span className="project-badge">Forecasting • Optimization</span>
                    </div>
                    <p className="project-description">
                      Advanced ML models for energy efficiency optimization using NARX, Prophet, and PSO algorithms for 96-hour advance predictions.
                    </p>
                    <div className="project-links">
                      <a href="/projects/data-science/energy-optimization" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>

                  <div className="project-card">
                    <div className="project-header">
                      <h3>Cloud Data Migration</h3>
                      <span className="project-badge">Azure • ETL</span>
                    </div>
                    <p className="project-description">
                      Large-scale migration of 35,000+ data points from OSIsoft PI to Azure Data Lake Gen2 with optimized ETL pipelines.
                    </p>
                    <div className="project-links">
                      <a href="/projects/data-science/cloud-migration" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>
                </div>
                <div className="category-footer">
                  <a href="/projects/data-science" className="view-all-link">
                    View All Data Science Projects →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="technologies-section">
          <div className="section-container">
            <h2 className="section-title">Technologies & Tools</h2>
            <div className="tech-categories">
              <div className="tech-category">
                <h3>Machine Learning & AI</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Scikit-learn</span>
                  <span className="tech-tag">TensorFlow</span>
                  <span className="tech-tag">PyTorch</span>
                  <span className="tech-tag">XGBoost</span>
                  <span className="tech-tag">Prophet</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Data Engineering</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Azure</span>
                  <span className="tech-tag">Synapse</span>
                  <span className="tech-tag">Delta Lake</span>
                  <span className="tech-tag">Apache Spark</span>
                  <span className="tech-tag">SQL</span>
                  <span className="tech-tag">ETL</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Computer Vision</h3>
                <div className="tech-tags">
                  <span className="tech-tag">OpenCV</span>
                  <span className="tech-tag">YOLO</span>
                  <span className="tech-tag">PIL</span>
                  <span className="tech-tag">NumPy</span>
                  <span className="tech-tag">Matplotlib</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Development & Deployment</h3>
                <div className="tech-tags">
                  <span className="tech-tag">FastAPI</span>
                  <span className="tech-tag">Plotly Dash</span>
                  <span className="tech-tag">GitHub Actions</span>
                  <span className="tech-tag">Docker</span>
                  <span className="tech-tag">Raspberry Pi</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;