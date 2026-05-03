import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PersonalProjectsPage from '../PersonalProjectsPage';

describe('PersonalProjectsPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <PersonalProjectsPage />
      </MemoryRouter>
    );

  it('renders the h1 heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /personal projects/i })).toBeInTheDocument();
  });

  it('renders the canonical personal projects', () => {
    renderPage();
    expect(screen.getByText('Facial Detection System')).toBeInTheDocument();
    expect(screen.getByText('Lane Detection Algorithm')).toBeInTheDocument();
    expect(screen.getByText('IoT Security Camera System')).toBeInTheDocument();
  });
});
