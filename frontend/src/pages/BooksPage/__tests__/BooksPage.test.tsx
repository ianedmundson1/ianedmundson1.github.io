import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BooksPage from '../BooksPage';

describe('BooksPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <BooksPage />
      </MemoryRouter>
    );

  it('renders the Book Reviews heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1, name: /book reviews/i })).toBeInTheDocument();
  });

  it('renders the seeded book reviews from data/books.ts', () => {
    renderPage();
    expect(screen.getByText('Designing Data-Intensive Applications')).toBeInTheDocument();
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });
});
