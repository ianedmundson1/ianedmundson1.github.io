import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
import './ComputerVisionPage.css';

const ComputerVisionPage: React.FC = () => {
  return (
    <div className="computer-vision-page">
      <Navigation />
      <main className="main-content">
        <section className="cv-hero">
          <div className="hero-container">
            <h1 className="hero-title">Computer Vision Projects</h1>
            <p className="hero-subtitle">
              Real-time computer vision applications using OpenCV, deep learning, and image processing
            </p>
          </div>
        </section>

        <section className="cv-projects">
          <div className="section-container">
            <div className="projects-list">
              
              <div className="project-item">
                <div className="project-content">
                  <div className="project-info">
                    <h2>Facial Detection System</h2>
                    <p className="project-summary">
                      Real-time face detection and emotion recognition system using deep learning models 
                      and OpenCV for live video processing with high accuracy and performance.
                    </p>
                    <div className="project-tech">
                      <span className="tech-badge">OpenCV</span>
                      <span className="tech-badge">Python</span>
                      <span className="tech-badge">Deep Learning</span>
                      <span className="tech-badge">Real-time Processing</span>
                    </div>
                    <div className="project-actions">
                      <a href="/projects/computer-vision/facial-detection" className="btn btn-primary">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-item">
                <div className="project-content">
                  <div className="project-info">
                    <h2>Lane Detection Algorithm</h2>
                    <p className="project-summary">
                      Advanced lane detection system for autonomous driving applications using computer vision 
                      and image processing techniques with robust performance in various conditions.
                    </p>
                    <div className="project-tech">
                      <span className="tech-badge">Computer Vision</span>
                      <span className="tech-badge">Image Processing</span>
                      <span className="tech-badge">OpenCV</span>
                      <span className="tech-badge">Autonomous Vehicles</span>
                    </div>
                    <div className="project-actions">
                      <a href="/projects/computer-vision/lane-detection" className="btn btn-primary">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="project-item">
                <div className="project-content">
                  <div className="project-info">
                    <h2>IoT Security Camera System</h2>
                    <p className="project-summary">
                      Raspberry Pi-based security camera system with motion detection, cloud storage 
                      integration, and automated notifications for comprehensive surveillance.
                    </p>
                    <div className="project-tech">
                      <span className="tech-badge">Raspberry Pi</span>
                      <span className="tech-badge">IoT</span>
                      <span className="tech-badge">Motion Detection</span>
                      <span className="tech-badge">Cloud Storage</span>
                    </div>
                    <div className="project-actions">
                      <a href="/projects/computer-vision/security-camera" className="btn btn-primary">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ComputerVisionPage;