import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../Seo';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';

type Highlight = { value: string; label: string };
type PipelineStep = { step: number; title: string; description: string };
type FeatureCard = { title: string; description: string };

type ProjectMeta = {
  title: string;
  summary: string;
  badges: readonly { label: string; variant?: string }[] | readonly string[];
};

type ProjectDetailLayoutProps = {
  meta: ProjectMeta;
  seo: { title: string; description: string };
  /** Skip-link target id; defaults to "overview". */
  skipTargetId?: string;
  /** Skip-link visible text; defaults to "Skip to content". */
  skipLinkText?: string;
  /** Show the "← Back to Projects" link in the hero. Default true. */
  showBackLink?: boolean;
  /** Optional content rendered between hero and highlights (e.g. interactive demo). */
  afterHero?: ReactNode;
  highlights: readonly Highlight[];
  /** When omitted, the Overview section is skipped. */
  overview?: { title?: string; content: ReactNode };
  pipeline: { title: string; steps: readonly PipelineStep[] };
  /** When omitted, the Features section is skipped. */
  features?: { title: string; ariaId: string; cards: readonly FeatureCard[] };
  techStack: readonly string[];
  /** Optional content rendered inside the tech section, after the tag list. */
  afterTech?: ReactNode;
};

const isBadgeObject = (b: unknown): b is { label: string; variant?: string } =>
  typeof b === 'object' && b !== null && 'label' in b;

const ProjectDetailLayout = ({
  meta,
  seo,
  skipTargetId = 'overview',
  skipLinkText = 'Skip to content',
  showBackLink = true,
  afterHero,
  highlights,
  overview,
  pipeline,
  features,
  techStack,
  afterTech,
}: ProjectDetailLayoutProps) => {
  const wrapperRef = useFadeOnScroll();

  return (
    <div className="project-page" ref={wrapperRef}>
      <Seo title={seo.title} description={seo.description} />
      <a href={`#${skipTargetId}`} className="skip-link">{skipLinkText}</a>

      <main className="main-content">
        <header className="project-hero" aria-labelledby="hero-title">
          <div className="project-hero-container">
            {showBackLink && (
              <Link to="/projects" className="project-back-link">&larr; Back to Projects</Link>
            )}
            <div className="project-hero-badges">
              {meta.badges.map((b) => {
                if (isBadgeObject(b)) {
                  return (
                    <span
                      key={b.label}
                      className={`project-hero-badge${b.variant === 'interactive' ? ' is-interactive' : ''}`}
                    >
                      {b.label}
                    </span>
                  );
                }
                return <span key={b} className="project-hero-badge">{b}</span>;
              })}
            </div>
            <h1 id="hero-title" className="project-hero-title">{meta.title}</h1>
            <p className="project-hero-subtitle">{meta.summary}</p>
          </div>
        </header>

        {afterHero}

        <section className="project-highlights-bar" aria-label="Key metrics">
          <div className="project-highlights-grid">
            {highlights.map((h) => (
              <div key={h.label} className="project-highlight-card">
                <span className="project-highlight-value">{h.value}</span>
                <span className="project-highlight-label">{h.label}</span>
              </div>
            ))}
          </div>
        </section>

        {overview && (
          <section id="overview" className="project-content-section fade-section" aria-labelledby="overview-heading">
            <div className="section-container">
              <h2 id="overview-heading" className="project-section-title">{overview.title ?? 'Overview'}</h2>
              <div className="project-prose">{overview.content}</div>
            </div>
          </section>
        )}

        <section className="project-pipeline-section fade-section" aria-labelledby="pipeline-heading">
          <div className="section-container">
            <h2 id="pipeline-heading" className="project-section-title">{pipeline.title}</h2>
            <div className="project-pipeline-grid">
              {pipeline.steps.map((s) => (
                <div key={s.step} className="project-pipeline-card">
                  <span className="project-pipeline-step" aria-hidden="true">{s.step}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {features && (
          <section className="project-feature-section fade-section" aria-labelledby={features.ariaId}>
            <div className="section-container">
              <h2 id={features.ariaId} className="project-section-title">{features.title}</h2>
              <div className="project-feature-grid">
                {features.cards.map((c) => (
                  <article key={c.title} className="project-feature-card">
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="project-tech-section fade-section" aria-labelledby="tech-heading">
          <div className="section-container">
            <h2 id="tech-heading" className="project-section-title">Tech Stack</h2>
            <div className="project-tech-grid">
              {techStack.map((t) => (
                <span key={t} className="project-tech-tag">{t}</span>
              ))}
            </div>
            {afterTech}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetailLayout;
