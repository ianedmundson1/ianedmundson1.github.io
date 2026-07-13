import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlotlyEmbed from './PlotlyEmbed';
import { ThemeProvider } from '@/context/ThemeContext';

vi.mock('react-plotly.js/factory', () => ({
  default: () => (props: { 'aria-label'?: string }) => (
    <div data-testid="plotly-stub" aria-label={props['aria-label']} />
  ),
}));

vi.mock('plotly.js-dist-min', () => ({
  default: {},
}));

vi.mock('../../api/plots', () => ({
  usePlotlyFigure: vi.fn(),
}));

import { usePlotlyFigure } from '@/api/plots';

let intersectCallbacks: IntersectionObserverCallback[] = [];

beforeEach(() => {
  intersectCallbacks = [];
  class MockIO {
    constructor(cb: IntersectionObserverCallback) {
      intersectCallbacks.push(cb);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  vi.mocked(usePlotlyFigure).mockReset();
});

const triggerIntersect = () => {
  act(() => {
    intersectCallbacks.forEach((cb) =>
      cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
  });
};

const renderEmbed = (props: Parameters<typeof PlotlyEmbed>[0]) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <PlotlyEmbed {...props} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('PlotlyEmbed', () => {
  it('renders the activation scrim on coarse-pointer devices', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('hover: none'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.mocked(usePlotlyFigure).mockReturnValue({
      data: undefined,
      error: null,
    } as unknown as ReturnType<typeof usePlotlyFigure>);

    renderEmbed({ src: '/x.json', ariaLabel: 'demo plot' });
    expect(
      screen.getByRole('button', { name: /activate interactive controls for demo plot/i }),
    ).toBeInTheDocument();
  });

  it('activates without a tap on fine-pointer devices and shows the poster while loading', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.mocked(usePlotlyFigure).mockReturnValue({
      data: undefined,
      error: null,
    } as unknown as ReturnType<typeof usePlotlyFigure>);

    renderEmbed({ src: '/x.json', ariaLabel: 'demo plot', poster: '/poster.webp' });
    expect(
      screen.queryByRole('button', { name: /activate interactive controls/i }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('img[src="/poster.webp"]')).toBeInTheDocument();
  });

  it('surfaces the query error with role="alert"', () => {
    vi.mocked(usePlotlyFigure).mockReturnValue({
      data: undefined,
      error: new Error('network down'),
    } as unknown as ReturnType<typeof usePlotlyFigure>);

    renderEmbed({ src: '/x.json', ariaLabel: 'demo plot' });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/network down/i);
  });

  it('reveals the plot once the figure resolves and the observer fires', () => {
    vi.mocked(usePlotlyFigure).mockReturnValue({
      data: { data: [], layout: {} },
      error: null,
    } as unknown as ReturnType<typeof usePlotlyFigure>);

    renderEmbed({ figure: { data: [], layout: {} }, ariaLabel: 'demo plot' });
    triggerIntersect();
    // Lazy import resolves on the next tick; Suspense fallback may render first.
    return screen.findByTestId('plotly-stub');
  });
});
