import { PROJECTS as PERSONAL_PROJECTS } from './personalProjects';
import { WORK_PROJECTS } from './workProjects';

export interface Project {
  title: string;
  badges: string[];
  interactive?: boolean;
  description: string;
  link?: string;
  linkLabel?: string;
  external?: boolean;
  youtube?: string;
}

export interface Category {
  title: string;
  description: string;
  projects: Project[];
  viewAllLink?: string;
  viewAllLabel?: string;
}

const personalProjectCards: Project[] = PERSONAL_PROJECTS.map((p) => ({
  title: p.title,
  badges: p.tech.slice(0, 2),
  description: p.summary,
  link: p.href,
  linkLabel: p.linkLabel,
  external: p.external ?? true,
  youtube: p.youtube,
}));

const workProjectCards: Project[] = WORK_PROJECTS.map((p) => ({
  title: p.title,
  badges: p.badges.slice(0, 2),
  description: p.summary,
  link: p.route,
  linkLabel: p.linkLabel,
}));

export const CATEGORIES: Category[] = [
  {
    title: 'Personal Projects',
    description:
      'Side projects exploring computer vision, IoT, and deep learning.',
    viewAllLink: '/projects/personal',
    viewAllLabel: 'View All Personal Projects',
    projects: personalProjectCards,
  },
  {
    title: 'Continuing Education & Certification Programs',
    description:
      'Hands-on coursework and capstone projects from professional data science and AI programs.',
    projects: [
      {
        title: 'MIT Applied Data Science',
        badges: ['Machine Learning', 'Analytics'],
        interactive: true,
        description:
          'Comprehensive data science coursework covering advanced machine learning techniques, statistical analysis, and real-world applications.',
        link: '/projects/mit-data-science',
        linkLabel: 'View Project',
      },
    ],
  },
  {
    title: 'Past Work Projects',
    description:
      'Production ML systems, data pipelines, and cloud infrastructure built for federal operations at NIH.',
    projects: workProjectCards,
  },
];
