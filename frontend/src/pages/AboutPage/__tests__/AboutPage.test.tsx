import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import AboutPage from '../AboutPage';

describe('AboutPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

  it('renders the About hero heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /about/i })).toBeInTheDocument();
  });

  it('renders the skip link', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /skip/i })).toBeInTheDocument();
  });
});
