import React from 'react';
import Seo from '@/components/Seo';
import Hero from '@/components/Hero/Hero';
import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';
import { BOOK_REVIEWS } from '@/data/books';
import styles from './BooksPage.module.css';

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
  const wrapperRef = useFadeOnScroll();

  return (
    <div className={styles.booksPage} ref={wrapperRef}>
      <Seo
        title="Books"
        description="A reading list and notes from Ian Edmundson — books on machine learning, software engineering, and data infrastructure."
      />
      <a className="skip-link" href="#book-reviews">
        Skip to book reviews
      </a>


      <main className="main-content">
        <Hero
          title="Book Reviews"
          subtitle="Notes and takeaways from books on data science, engineering, and technology"
          titleId="books-hero-title"
          ariaLabelledBy="books-hero-title"
        />

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
