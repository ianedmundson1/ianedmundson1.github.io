import React from 'react';
import Navigation from '../../components/Navigation/Navigation';
import { useFadeOnScroll } from '../../hooks/useFadeOnScroll';
import styles from './BooksPage.module.css';

/* -------------------------------------------------- */
/*  Types                                              */
/* -------------------------------------------------- */
interface BookReview {
  title: string;
  author: string;
  rating: number;
  tags: string[];
  summary: string;
  keyTakeaways: string[];
  dateRead: string;
}

/* -------------------------------------------------- */
/*  Data — add your reviews here                       */
/* -------------------------------------------------- */
const BOOK_REVIEWS: BookReview[] = [
  // ──────────────────────────────────────────────────────────
  // SAMPLE REVIEWS — edit these with your actual thoughts!
  // Once you have at least one real review, add 'Books' back
  // to the nav in Navigation.tsx (NAV_ITEMS array).
  // ──────────────────────────────────────────────────────────
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    rating: 5,
    tags: ['Data Engineering', 'Distributed Systems'],
    summary:
      'TODO: Write your summary here. What is the book about and who is it for?',
    keyTakeaways: [
      'TODO: What was the most important concept you took away?',
      'TODO: How did it change the way you think about data systems?',
      'TODO: What would you recommend to someone starting this book?',
    ],
    dateRead: 'TODO: Month Year',
  },
  {
    title: 'The Hundred-Page Machine Learning Book',
    author: 'Andriy Burkov',
    rating: 4,
    tags: ['Machine Learning', 'Reference'],
    summary:
      'TODO: Write your summary here. What made this book stand out compared to other ML resources?',
    keyTakeaways: [
      'TODO: What chapter or concept was most valuable to your work?',
      'TODO: How does it compare to learning ML through courses?',
    ],
    dateRead: 'TODO: Month Year',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    rating: 4,
    tags: ['Software Engineering', 'Best Practices'],
    summary:
      'TODO: Write your summary here. How did it influence your coding habits?',
    keyTakeaways: [
      'TODO: Which principle had the biggest impact on your daily work?',
      'TODO: What advice from the book do you find yourself sharing with others?',
    ],
    dateRead: 'TODO: Month Year',
  },
];

/* -------------------------------------------------- */
/*  Helpers                                            */
/* -------------------------------------------------- */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className={styles.starRating} aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? styles.starFilled : styles.starEmpty}
        aria-hidden="true"
      >
        ★
      </span>
    ))}
  </div>
);

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
const BooksPage: React.FC = () => {
  const wrapperRef = useFadeOnScroll('fade-section', 'visible');

  return (
    <div className={styles.booksPage} ref={wrapperRef}>
      <a className="skip-link" href="#book-reviews">
        Skip to book reviews
      </a>

      <Navigation />

      <main className="main-content">
        {/* ---------- Hero ---------- */}
        <header className={styles.hero} aria-labelledby="books-hero-title">
          <div className={styles.heroContainer}>
            <h1 id="books-hero-title" className={styles.heroTitle}>
              Book Reviews
            </h1>
            <p className={styles.heroSubtitle}>
              Notes and takeaways from books on data science, engineering, and
              technology
            </p>
          </div>
        </header>

        {/* ---------- Reviews ---------- */}
        <section
          id="book-reviews"
          className={`${styles.reviewsSection} fade-section`}
          aria-labelledby="reviews-heading"
        >
          <div className="section-container">
            <h2 id="reviews-heading" className="sr-only">
              All Book Reviews
            </h2>

            {BOOK_REVIEWS.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon} aria-hidden="true">📚</span>
                <h3 className={styles.emptyTitle}>Reviews Coming Soon</h3>
                <p>I'm currently reading and writing up notes on books about data engineering, ML systems, and software design. Check back soon!</p>
              </div>
            ) : (
              <div className={styles.reviewsGrid}>
                {BOOK_REVIEWS.map((book) => (
                  <article
                    key={book.title}
                    className={`${styles.reviewCard} fade-section`}
                  >
                    <div className={styles.reviewHeader}>
                      <h3 className={styles.bookTitle}>{book.title}</h3>
                      <p className={styles.bookAuthor}>by {book.author}</p>
                      <StarRating rating={book.rating} />
                    </div>

                    <div className={styles.reviewTags}>
                      {book.tags.map((tag) => (
                        <span key={tag} className={styles.reviewTag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.reviewBody}>
                      <p>{book.summary}</p>

                      <h4>Key Takeaways</h4>
                      <ul className={styles.takeawaysList}>
                        {book.keyTakeaways.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    <footer className={styles.reviewFooter}>
                      <time className={styles.dateRead}>{book.dateRead}</time>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BooksPage;
