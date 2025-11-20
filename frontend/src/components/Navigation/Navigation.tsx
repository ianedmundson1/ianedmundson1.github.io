import React from 'react';
import './Navigation.css';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  return (
    <nav className={`navigation ${className || ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <a href="/">Ian Edmundson</a>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/books">Books</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;