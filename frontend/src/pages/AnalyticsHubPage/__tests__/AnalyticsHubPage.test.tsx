import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnalyticsHubPage from '../AnalyticsHubPage';

describe('AnalyticsHubPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <AnalyticsHubPage />
      </MemoryRouter>,
    );

  it('renders the hero title', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: 'Analytics' })).toBeInTheDocument();
  });

  it('renders a card linking to the Seattle Fire 911 page', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /Seattle Fire 911 Calls/i });
    expect(link).toHaveAttribute('href', '/analytics/seattle-fire-911');
  });

  it('shows the source table identifier for context', () => {
    renderPage();
    expect(
      screen.getByText('seattle_data.seattle_bronze.seattle_fire_911_calls'),
    ).toBeInTheDocument();
  });
});
