export interface BookReview {
  title: string;
  author: string;
  rating: number;
  tags: string[];
  summary: string;
  keyTakeaways: string[];
  dateRead: string;
}

export const BOOK_REVIEWS: BookReview[] = [
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
