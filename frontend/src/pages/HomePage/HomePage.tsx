import React, { useEffect, useRef, useCallback } from 'react';
import Navigation from '../../components/Navigation/Navigation';
import headshot from '../../assets/MEEBOSS_Hiring_Fest_Headshots_1-27-44.jpg';
import './HomePage.css';

/* -------------------------------------------------- */
/*  Data                                               */
/* -------------------------------------------------- */
const EXPERTISE_CARDS = [
  {
    icon: '🤖',
    title: 'Data Science & Machine Learning',
    items: [
      'Forecasting: 96-hour demand prediction systems (NARX, Prophet)',
      'Anomaly Detection: Isolation Forest across 20,000+ monitoring points',
      'MLOps: Cloud-native pipelines with managed feature tables on Databricks',
      'NLP: Knowledge graph extraction from operator logs using LLMs',
      'RAG: AI search over 1,000+ page compliance manuals',
    ],
  },
  {
    icon: '🔧',
    title: 'Data Engineering',
    items: [
      'Platform: Databricks with Delta Live Tables processing 30M+ daily sensor readings',
      'Migration: 6 years of sensor data (35,000+ points) to Azure Data Lake Gen2',
      'Pipelines: CI/CD for 10+ analytics applications, cutting deployment cycles 50%',
      'APIs: FastAPI modernization of legacy analytics codebases',
      'Data Quality: Governance standards across 20,000+ OSIsoft PI monitoring points',
    ],
  },
  {
    icon: '💻',
    title: 'Software Development',
    items: [
      'Backend: FastAPI, Python, SQL — scalable REST APIs',
      'Frontend: React, TypeScript, Vite',
      'Visualization: Plotly Dash dashboards for 30+ stakeholders',
      'DevOps: GitHub Actions CI/CD, Docker, Azure cloud governance',
      'Current: Modernizing legacy .NET/C# app for UW Botanic Gardens',
    ],
  },
] as const;

const IMPACT_ITEMS = [
  { stat: '$2.2M', description: 'Annual energy savings delivered through ML-driven optimization at NIH\'s Central Utility Plant' },
  { stat: '93%', description: 'Reduction in false positive maintenance alerts across 20,000+ monitored points' },
  { stat: '50% More Accurate', description: '96-hour cooling demand forecasting vs. legacy system, enabling proactive chiller sequencing' },
  { stat: '83% Faster', description: 'Data transfer speeds achieved through custom open-source migration tooling vs. vendor solution' },
] as const;

const TECH_CATEGORIES = [
  { title: 'Machine Learning & AI', tags: ['Python', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'Prophet', 'LLMs'] },
  { title: 'Data Engineering', tags: ['Databricks', 'Delta Lake', 'Azure ML', 'OSIsoft PI', 'SQL', 'pandas'] },
  { title: 'Software & DevOps', tags: ['FastAPI', 'React', 'TypeScript', 'Docker', 'GitHub Actions', 'Azure'] },
  { title: 'Visualization & Reporting', tags: ['Plotly', 'Dash', 'Neo4j', 'Knowledge Graphs'] },
] as const;

const CONNECT_LINKS = [
  {
    href: 'https://github.com/ianedmundson1',
    label: 'GitHub',
    external: true,
    iconPath: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  {
    href: 'https://linkedin.com/in/ian-edmundson-a0979a178',
    label: 'LinkedIn',
    external: true,
    iconPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    href: 'mailto:imedmundson@outlook.com',
    label: 'Email',
    external: false,
    iconPath: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z',
  },
] as const;

/* -------------------------------------------------- */
/*  Icon component                                     */
/* -------------------------------------------------- */
interface IconProps {
  path: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ path, size = 20 }) => (
  <svg
    className="connect-icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

/* -------------------------------------------------- */
/*  Scroll-fade hook                                   */
/* -------------------------------------------------- */
function useFadeOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>('.fade-section');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target); // stop observing once visible
          }
        });
      },
      { threshold: 0.15 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(observe, [observe]);

  return ref;
}

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const HomePage: React.FC = () => {
  const wrapperRef = useFadeOnScroll();

  return (
    <div className="homepage" ref={wrapperRef}>
      <a className="skip-link" href="#expertise">
        Skip to content
      </a>

      <Navigation />

      <main className="main-content">
        {/* ---- Hero ---- */}
        <header className="hero">
          <div className="hero-container">
            <div className="hero-text">
              <div className="hero-badge" role="status">
                <span className="hero-badge-dot" aria-hidden="true" />
                Open to opportunities
              </div>
              <h1 className="hero-title">Ian Edmundson</h1>
              <p className="hero-subtitle">Data Scientist & Software Engineer</p>
              <p className="hero-description">
                Building analytics infrastructure and ML systems for federal
                operations. NIH Director&apos;s Award recipient for forecasting that
                protected critical infrastructure during a high-demand crisis
                event.
              </p>
              <div className="hero-actions">
                <a href="/projects" className="btn btn-primary">
                  View Projects
                </a>
                <a href="#expertise" className="btn btn-secondary">
                  My Expertise
                </a>
              </div>
              <p className="hero-award" role="note">
                <span aria-hidden="true">🏆</span> NIH Director&apos;s Award 2024
              </p>
            </div>
            <div className="hero-photo">
              <div className="hero-photo-ring" aria-hidden="true" />
              <img src={headshot} alt="Ian Edmundson headshot" />
            </div>
          </div>
        </header>

        {/* ---- Expertise ---- */}
        <section id="expertise" className="expertise-section fade-section" aria-labelledby="expertise-heading">
          <div className="section-container">
            <h2 id="expertise-heading" className="section-title">Areas of Expertise</h2>
            <p className="section-subtitle">
              From raw data to production models — end-to-end ownership across
              the analytics stack.
            </p>
            <div className="expertise-grid">
              {EXPERTISE_CARDS.map((card) => (
                <article key={card.title} className="expertise-card">
                  <div className="expertise-icon" aria-hidden="true">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <ul>
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Impact ---- */}
        <section className="impact-section fade-section" aria-labelledby="impact-heading">
          <div className="section-container">
            <h2 id="impact-heading" className="section-title">Technical Impact</h2>
            <p className="section-subtitle">
              Measurable outcomes from data-driven solutions in production.
            </p>
            <div className="impact-grid">
              {IMPACT_ITEMS.map((item) => (
                <div key={item.stat} className="impact-item">
                  <h4>{item.stat}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Technologies ---- */}
        <section className="technologies-section fade-section" aria-labelledby="tech-heading">
          <div className="section-container">
            <h2 id="tech-heading" className="section-title">Technologies & Tools</h2>
            <p className="section-subtitle">
              The stack I use to ship reliable, scalable analytics.
            </p>
            <div className="tech-categories">
              {TECH_CATEGORIES.map((category) => (
                <div key={category.title} className="tech-category">
                  <h3>{category.title}</h3>
                  <div className="tech-tags">
                    {category.tags.map((tag) => (
                      <span key={tag} className="tech-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Connect ---- */}
        <section className="connect-section fade-section" aria-labelledby="connect-heading">
          <div className="section-container">
            <h2 id="connect-heading" className="section-title">Connect With Me</h2>
            <p className="connect-description">
              I&apos;m always interested in discussing data science, machine learning,
              and innovative technology solutions. Let&apos;s connect!
            </p>
            <div className="connect-links">
              {CONNECT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="connect-link"
                  {...(link.external && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                  aria-label={
                    link.external
                      ? `${link.label} (opens in new tab)`
                      : link.label
                  }
                >
                  <Icon path={link.iconPath} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;