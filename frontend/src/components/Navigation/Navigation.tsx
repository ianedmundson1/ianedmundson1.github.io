import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navigation.module.css';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`${styles.navigation} ${className || ''}`}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <a href="/">Ian Edmundson</a>
        </div>
        <ul className={styles.navLinks}>
          <li><a href="/">Home</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/books">Books</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;