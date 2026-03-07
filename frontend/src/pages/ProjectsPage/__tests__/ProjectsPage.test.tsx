import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from '../ProjectsPage';

describe('ProjectsPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>,
    );

  it('renders the hero title', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  });

  it('renders all category sections', () => {
    renderPage();
    expect(screen.getByText('Personal Projects')).toBeInTheDocument();
    expect(screen.getByText('Continuing Education & Certification Programs')).toBeInTheDocument();
    expect(screen.getByText('Past Work Projects')).toBeInTheDocument();
  });

  it('renders project cards within categories', () => {
    renderPage();
    expect(screen.getByText('Facial Detection System')).toBeInTheDocument();
    expect(screen.getByText('MIT Applied Data Science')).toBeInTheDocument();
    expect(screen.getByText('Energy Optimization Systems')).toBeInTheDocument();
  });

  it('renders the skip link', () => {
    renderPage();
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toHaveAttribute('href', '#projects-overview');
  });

  it('renders external links with proper attributes', () => {
    renderPage();
    const externalLinks = screen.getAllByText('View Project');
    const externalLink = externalLinks.find(
      (link) => link.closest('a')?.getAttribute('href') === 'https://github.com/ianedmundson1/Facial-detection',
    );
    expect(externalLink?.closest('a')).toHaveAttribute('target', '_blank');
    expect(externalLink?.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
