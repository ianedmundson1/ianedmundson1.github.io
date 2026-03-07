import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to light theme when no preference stored', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('uses stored theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles from light to dark', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    });

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles from dark to light', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    });

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(localStorage.getItem('theme')).toBe('light');

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    });
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
