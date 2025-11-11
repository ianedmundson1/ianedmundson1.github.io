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
                  Personal Projects
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
                      <a href="https://github.com/ianedmundson1/Facial-detection" className="project-link primary">
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
                      <a href="https://github.com/ianedmundson1/Lane-detection" className="project-link primary">
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
                      <a href="https://github.com/ianedmundson1/Security-camera" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>
                </div>
                <div className="category-footer">
                  <a href="/projects/computer-vision" className="view-all-link">
                    View All Personal Projects →
                  </a>
                </div>
              </div>

              <div className="category-section">
                <h2 className="category-title">
                  <span className="category-icon">📊</span>
                  Continuing Education & Certification Programs
                </h2>
                <p className="category-description">
                  Advanced analytics, machine learning models, and data engineering solutions for real-world problems.
                </p>
                <div className="projects-grid">
                  <div className="project-card">
                    <div className="project-header">
                      <h3>MIT Applied Data Science</h3>
                      <div className="project-badges">
                        <span className="project-badge">Machine Learning • Analytics</span>
                        <span className="project-badge interactive">Interactive</span>
                      </div>
                    </div>
                    <p className="project-description">
                      Comprehensive data science coursework covering advanced machine learning techniques, statistical analysis, and real-world applications.
                    </p>
                    <div className="project-links">
                      <a href="/projects/mit-data-science" className="project-link primary">
                        View Project
                      </a>
                    </div>
                  </div>
                </div>
                <div className="category-footer">
                  <a href="/projects/data-science" className="view-all-link">
                    View All Continuing Education & Certification Programs Projects →
                  </a>
                </div>
              </div>
              <div className="category-section">
                <h2 className="category-title">
                  <span className="category-icon">📊</span>
                  Past Work Projects
                </h2>
                <p className="category-description">
                  Advanced analytics, machine learning models, and data engineering solutions for real-world problems.
                </p>
                <div className="projects-grid">
                  
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
        
      </main>
    </div>
  );
};

export default ProjectsPage;