import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../data/routes';
import styles from './Navigation.module.css';

interface NavigationProps {
  className?: string;
}

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Home' },
  { to: ROUTES.projects, label: 'Projects' },
  { to: ROUTES.about, label: 'About' },
] as const;

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [menuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`${styles.navigation} ${className || ''}`}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <Link to="/">Ian Edmundson</Link>
        </div>

        <button
          type="button"
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>

        <ul id="primary-nav" className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={isActive(item.to) ? styles.active : undefined}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.navActions}>
          <a
            href={`${import.meta.env.BASE_URL}resume_ian_edmundson.pdf`}
            className={styles.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download resume (PDF, opens in new tab)"
          >
            Resume
          </a>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
