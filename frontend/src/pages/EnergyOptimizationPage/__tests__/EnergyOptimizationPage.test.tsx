import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import EnergyOptimizationPage from '../EnergyOptimizationPage';

describe('EnergyOptimizationPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <EnergyOptimizationPage />
      </MemoryRouter>
    );

  it('renders the h1 heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the key metrics', () => {
    renderPage();
    expect(screen.getByText('$2.2M')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
