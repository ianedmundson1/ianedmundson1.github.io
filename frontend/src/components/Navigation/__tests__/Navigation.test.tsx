import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';
import { ThemeProvider } from '../../../context/ThemeContext';

const renderNavigation = () =>
  render(
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>,
  );

describe('Navigation', () => {
  it('renders the brand link', () => {
    renderNavigation();
    expect(screen.getByRole('link', { name: 'Ian Edmundson' })).toHaveAttribute('href', '/');
  });

  it('renders nav links', () => {
    renderNavigation();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    renderNavigation();
    expect(
      screen.getByRole('button', { name: /switch to (dark|light) mode/i }),
    ).toBeInTheDocument();
  });

  it('toggles the theme when clicked', () => {
    renderNavigation();
    const toggle = screen.getByRole('button', { name: /switch to/i });
    const initialLabel = toggle.getAttribute('aria-label');

    fireEvent.click(toggle);

    const newLabel = toggle.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);
  });

  it('applies optional className prop', () => {
    render(
      <ThemeProvider>
        <Navigation className="custom-class" />
      </ThemeProvider>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom-class');
  });
});
