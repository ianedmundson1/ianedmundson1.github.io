import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
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
              Data scientist with 3+ years building analytics infrastructure and governance programs 
              for federal operations. Recognized with an NIH Director's Award for ML-based forecasting 
              that protected critical infrastructure during a high-demand crisis event.
            </p>
            <div className="hero-actions">
              <a href="/projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#expertise" className="btn btn-secondary">
                My Expertise
              </a>
            </div>
            <div className="hero-award">
              🏆 NIH Director's Award 2024
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
                  <li>Forecasting: 96-hour demand prediction systems (NARX, Prophet)</li>
                  <li>Anomaly Detection: Isolation Forest across 20,000+ monitoring points</li>
                  <li>MLOps: Cloud-native pipelines with managed feature tables on Databricks</li>
                  <li>NLP: Knowledge graph extraction from operator logs using LLMs</li>
                  <li>RAG: AI search over 1,000+ page compliance manuals</li>
                </ul>
              </div>

              <div className="expertise-card">
                <div className="expertise-icon">🔧</div>
                <h3>Data Engineering</h3>
                <ul>
                  <li>Platform: Databricks with Delta Live Tables processing 30M+ daily sensor readings</li>
                  <li>Migration: 6 years of sensor data (35,000+ points) to Azure Data Lake Gen2</li>
                  <li>Pipelines: CI/CD for 10+ analytics applications, cutting deployment cycles 50%</li>
                  <li>APIs: FastAPI modernization of legacy analytics codebases</li>
                  <li>Data Quality: Governance standards across 20,000+ OSIsoft PI monitoring points</li>
                </ul>
              </div>

              <div className="expertise-card">
                <div className="expertise-icon">💻</div>
                <h3>Software Development</h3>
                <ul>
                  <li>Backend: FastAPI, Python, SQL — scalable REST APIs</li>
                  <li>Frontend: React, TypeScript, Vite</li>
                  <li>Visualization: Plotly Dash dashboards for 30+ stakeholders</li>
                  <li>DevOps: GitHub Actions CI/CD, Docker, Azure cloud governance</li>
                  <li>Current: Modernizing legacy .NET/C# app for UW Botanic Gardens</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="impact-section">
          <div className="section-container">
            <h2 className="section-title">Technical Impact</h2>
            <div className="impact-grid">
              <div className="impact-item">
                <h4>$2.2M</h4>
                <p>Annual energy savings delivered through ML-driven optimization at NIH's Central Utility Plant</p>
              </div>
              <div className="impact-item">
                <h4>93%</h4>
                <p>Reduction in false positive maintenance alerts across 20,000+ monitored points</p>
              </div>
              <div className="impact-item">
                <h4>50% More Accurate</h4>
                <p>96-hour cooling demand forecasting vs. legacy system, enabling proactive chiller sequencing</p>
              </div>
              <div className="impact-item">
                <h4>83% Faster</h4>
                <p>Data transfer speeds achieved through custom open-source migration tooling vs. vendor solution</p>
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
                  <span className="tech-tag">TensorFlow</span>
                  <span className="tech-tag">Scikit-learn</span>
                  <span className="tech-tag">XGBoost</span>
                  <span className="tech-tag">Prophet</span>
                  <span className="tech-tag">LLMs</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Data Engineering</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Databricks</span>
                  <span className="tech-tag">Delta Lake</span>
                  <span className="tech-tag">Azure ML</span>
                  <span className="tech-tag">OSIsoft PI</span>
                  <span className="tech-tag">SQL</span>
                  <span className="tech-tag">pandas</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Software & DevOps</h3>
                <div className="tech-tags">
                  <span className="tech-tag">FastAPI</span>
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">TypeScript</span>
                  <span className="tech-tag">Docker</span>
                  <span className="tech-tag">GitHub Actions</span>
                  <span className="tech-tag">Azure</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Visualization & Reporting</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Plotly</span>
                  <span className="tech-tag">Dash</span>
                  <span className="tech-tag">Neo4j</span>
                  <span className="tech-tag">Knowledge Graphs</span>
                </div>
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
              <a href="mailto:imedmundson@outlook.com" className="connect-link">
                <span>Email</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;