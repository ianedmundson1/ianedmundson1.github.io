import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
import styles from './ComputerVisionPage.module.css';

const ComputerVisionPage: React.FC = () => {
  return (
    <div className={styles.computerVisionPage}>
      <Navigation />
      <main className="main-content">
        <section className={styles.cvHero}>
          <div className={styles.heroContainer}>
            <h1 className={styles.heroTitle}>Computer Vision Projects</h1>
            <p className={styles.heroSubtitle}>
              Real-time computer vision applications using OpenCV, deep learning, and image processing
            </p>
          </div>
        </section>

        <section className={styles.cvProjects}>
          <div className={styles.sectionContainer}>
            <div className={styles.projectsList}>
              
              <div className={styles.projectItem}>
                <div className={styles.projectContent}>
                  <div className={styles.projectInfo}>
                    <h2>Facial Detection System</h2>
                    <p className={styles.projectSummary}>
                      Real-time face detection and emotion recognition system using deep learning models 
                      and OpenCV for live video processing with high accuracy and performance.
                    </p>
                    <div className={styles.projectTech}>
                      <span className={styles.techBadge}>OpenCV</span>
                      <span className={styles.techBadge}>Python</span>
                      <span className={styles.techBadge}>Deep Learning</span>
                      <span className={styles.techBadge}>Real-time Processing</span>
                    </div>
                    <div className={styles.projectActions}>
                      <a href="https://github.com/ianedmundson1/Facial-detection" className={`${styles.btn} ${styles.btnPrimary}`} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.projectItem}>
                <div className={styles.projectContent}>
                  <div className={styles.projectInfo}>
                    <h2>Lane Detection Algorithm</h2>
                    <p className={styles.projectSummary}>
                      Advanced lane detection system for autonomous driving applications using computer vision 
                      and image processing techniques with robust performance in various conditions.
                    </p>
                    <div className={styles.projectTech}>
                      <span className={styles.techBadge}>Computer Vision</span>
                      <span className={styles.techBadge}>Image Processing</span>
                      <span className={styles.techBadge}>OpenCV</span>
                      <span className={styles.techBadge}>Autonomous Vehicles</span>
                    </div>
                    <div className={styles.projectActions}>
                      <a href="https://github.com/ianedmundson1/Lane-detection" className={`${styles.btn} ${styles.btnPrimary}`} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.projectItem}>
                <div className={styles.projectContent}>
                  <div className={styles.projectInfo}>
                    <h2>IoT Security Camera System</h2>
                    <p className={styles.projectSummary}>
                      Raspberry Pi-based security camera system with motion detection, cloud storage 
                      integration, and automated notifications for comprehensive surveillance.
                    </p>
                    <div className={styles.projectTech}>
                      <span className={styles.techBadge}>Raspberry Pi</span>
                      <span className={styles.techBadge}>IoT</span>
                      <span className={styles.techBadge}>Motion Detection</span>
                      <span className={styles.techBadge}>Cloud Storage</span>
                    </div>
                    <div className={styles.projectActions}>
                      <a href="https://github.com/ianedmundson1/Security-camera" className={`${styles.btn} ${styles.btnPrimary}`} target="_blank" rel="noopener noreferrer">
                        View on GitHub
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