import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MITDataSciencePage from '../MITDataSciencePage';

describe('MITDataSciencePage', () => {
  const renderPage = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MITDataSciencePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('renders the hero title', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: 'MIT Applied Data Science' }),
    ).toBeInTheDocument();
  });

  it('renders the skip link', () => {
    renderPage();
    const skipLink = screen.getByText('Skip to interactive demo');
    expect(skipLink).toHaveAttribute('href', '#demo');
  });

  it('shows the demo-down notice instead of the interactive demo', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 2, name: /demo temporarily offline/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open camera/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /upload an image/i })).not.toBeInTheDocument();
  });

  it('renders project badges', () => {
    renderPage();
    expect(screen.getByText('Machine Learning • Analytics')).toBeInTheDocument();
    expect(screen.getByText('Interactive')).toBeInTheDocument();
  });
});
