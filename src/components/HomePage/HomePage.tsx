import React from 'react';
import Navigation from '../Navigation/Navigation';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Navigation />
      <main className="main-content">
        <section className="hero">
          <div className="hero-container">
            <h1 className="hero-title">Ian Edmundson</h1>
            <p className="hero-subtitle">
              Data Scientist & Software Engineer
            </p>
            <p className="hero-description">
              Passionate about building scalable, data-driven solutions that optimize operations 
              and drive measurable business value. I specialize in end-to-end machine learning 
              solutions, from data engineering pipelines to production-ready models.
            </p>
            <div className="hero-actions">
              <a href="/projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#expertise" className="btn btn-secondary">
                My Expertise
              </a>
            </div>
          </div>
        </section>

        <section id="expertise" className="expertise-section">
          <div className="section-container">
            <h2 className="section-title">Areas of Expertise</h2>
            <div className="expertise-grid">
              <div className="expertise-card">
                <div className="expertise-icon">🤖</div>
                <h3>Data Science & Machine Learning</h3>
                <ul>
                  <li>Advanced Modeling: Multi-Layer Perceptron, Random Forest, XGBoost</li>
                  <li>Forecasting Systems: NARX and Prophet models for 96-hour advance prediction</li>
                  <li>Optimization Algorithms: PSO and Genetic Algorithms</li>
                  <li>Anomaly Detection: Isolation Forest for time-series analysis</li>
                  <li>RAG Systems: Azure PromptFlow with ChatGPT-4</li>
                </ul>
              </div>

              <div className="expertise-card">
                <div className="expertise-icon">🔧</div>
                <h3>Data Engineering</h3>
                <ul>
                  <li>Cloud Migration: 35,000+ data points from OSIsoft PI to Azure Data Lake Gen2</li>
                  <li>ETL Pipelines: Scalable architectures for real-time processing</li>
                  <li>Modern Data Stack: Azure Synapse, Delta Lakes, ACID transactions</li>
                  <li>Performance Optimization: Multithreading and parallel processing</li>
                </ul>
              </div>

              <div className="expertise-card">
                <div className="expertise-icon">💻</div>
                <h3>Software Development</h3>
                <ul>
                  <li>API Development: FastAPI modernization with Swagger UI</li>
                  <li>Data Visualization: Interactive Plotly Dash dashboards</li>
                  <li>DevOps: CI/CD automation using GitHub Actions</li>
                  <li>Cloud Architecture: Azure ML integration for model deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-projects">
          <div className="section-container">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <div className="project-icon">🏭</div>
                <h3>Energy Optimization Systems</h3>
                <p>Advanced machine learning models for optimizing energy efficiency at large-scale facilities, reducing operational costs through predictive analytics.</p>
                <a href="/projects/data-science">Explore Project →</a>
              </div>

              <div className="project-card">
                <div className="project-icon">👁️</div>
                <h3>Computer Vision Applications</h3>
                <p>Real-time face detection and emotion recognition systems using deep learning and OpenCV.</p>
                <a href="/projects/computer-vision/facial-detection">Explore Project →</a>
              </div>

              <div className="project-card">
                <div className="project-icon">🛡️</div>
                <h3>IoT Security Solutions</h3>
                <p>Raspberry Pi-based security camera system with motion detection, cloud storage, and automated notifications.</p>
                <a href="/projects/computer-vision/security-camera">Explore Project →</a>
              </div>

              <div className="project-card">
                <div className="project-icon">🚗</div>
                <h3>Autonomous Vehicle Technology</h3>
                <p>Lane detection algorithms for autonomous driving applications using computer vision and image processing.</p>
                <a href="/projects/computer-vision/lane-detection">Explore Project →</a>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <div className="section-container">
            <h2 className="section-title">Technical Impact</h2>
            <div className="impact-grid">
              <div className="impact-item">
                <h4>Energy Efficiency</h4>
                <p>Delivered measurable cost reductions through ML-driven optimization at NIH's Central Utility Plant</p>
              </div>
              <div className="impact-item">
                <h4>Predictive Analytics</h4>
                <p>Enabled proactive operational planning with 96-hour advance forecasting models</p>
              </div>
              <div className="impact-item">
                <h4>System Reliability</h4>
                <p>Improved uptime through anomaly detection and preventive maintenance strategies</p>
              </div>
              <div className="impact-item">
                <h4>Data Accessibility</h4>
                <p>Streamlined data workflows and real-time decision-making capabilities</p>
              </div>
            </div>
          </div>
        </section>

        <section className="connect-section">
          <div className="section-container">
            <h2 className="section-title">Connect With Me</h2>
            <p className="connect-description">
              I'm always interested in discussing data science, machine learning, and innovative technology solutions. Let's connect!
            </p>
            <div className="connect-links">
              <a href="https://github.com/ianedmundson1" className="connect-link" target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/ian-edmundson-a0979a178" className="connect-link" target="_blank" rel="noopener noreferrer">
                <span>LinkedIn</span>
              </a>
              <a href="/books" className="connect-link">
                <span>Book Reviews</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;