import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, afterEach } from 'vitest';
import SeattleFire911Page from '../SeattleFire911Page';

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SeattleFire911Page />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SeattleFire911Page', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('renders the hero and source heading immediately', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Seattle Fire 911 Calls' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Source' })).toBeInTheDocument();
  });

  it('shows the loading state while the metadata request is in flight', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading source metadata/i)).toBeInTheDocument();
  });

  it('renders the metadata once it loads', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          table: 'cat.schema.fire_911',
          rowCount: 12345,
          fetchedAt: '2026-05-20T14:30:00Z',
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('cat.schema.fire_911')).toBeInTheDocument();
    });
    expect(screen.getByText('12,345')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ detail: 'down' }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      }),
    );
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/could not load source metadata/i);
    });
  });

  it('links back to the analytics hub', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderPage();
    const link = screen.getByRole('link', { name: /back to analytics/i });
    expect(link).toHaveAttribute('href', '/analytics');
  });
});
