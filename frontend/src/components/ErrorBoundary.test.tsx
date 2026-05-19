import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('boom');
  return <div>safe</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress React's error log noise for expected throws.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('safe')).toBeInTheDocument();
  });

  it('renders the default fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  it('renders a custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>route fallback</div>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('route fallback')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reload page/i })).not.toBeInTheDocument();
  });

  it('clears error state when resetKey changes', async () => {
    const Harness = () => {
      const [key, setKey] = useState('a');
      const [crash, setCrash] = useState(true);
      return (
        <>
          <button
            type="button"
            onClick={() => {
              setCrash(false);
              setKey('b');
            }}
          >
            recover
          </button>
          <ErrorBoundary resetKey={key}>
            <Bomb shouldThrow={crash} />
          </ErrorBoundary>
        </>
      );
    };
    render(<Harness />);
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /recover/i }));
    expect(screen.getByText('safe')).toBeInTheDocument();
  });
});
