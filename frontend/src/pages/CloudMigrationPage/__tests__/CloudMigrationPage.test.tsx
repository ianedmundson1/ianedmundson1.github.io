import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CloudMigrationPage from '../CloudMigrationPage';

describe('CloudMigrationPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <CloudMigrationPage />
      </MemoryRouter>
    );

  it('renders the h1 heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the key metrics', () => {
    renderPage();
    expect(screen.getByText('35,000+')).toBeInTheDocument();
    expect(screen.getByText('83%')).toBeInTheDocument();
  });
});
