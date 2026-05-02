export interface Project {
  title: string;
  badges: string[];
  interactive?: boolean;
  description: string;
  link?: string;
  linkLabel?: string;
  external?: boolean;
}

export interface Category {
  title: string;
  description: string;
  projects: Project[];
  viewAllLink?: string;
  viewAllLabel?: string;
}

export const CATEGORIES: Category[] = [
  {
    title: 'Personal Projects',
    description:
      'Side projects exploring computer vision, IoT, and deep learning.',
    viewAllLink: '/projects/personal',
    viewAllLabel: 'View All Personal Projects',
    projects: [
      {
        title: 'Facial Detection System',
        badges: ['OpenCV', 'Python'],
        description:
          'Real-time face detection system using deep learning models and OpenCV for live video processing.',
        link: 'https://github.com/ianedmundson1/Facial-detection',
        linkLabel: 'View Project',
        external: true,
      },
      {
        title: 'Lane Detection Algorithm',
        badges: ['Computer Vision', 'Autonomous Vehicles'],
        description:
          'Advanced lane detection system for autonomous driving applications using computer vision and image processing techniques.',
        link: 'https://github.com/ianedmundson1/Lane-detection',
        linkLabel: 'View Project',
        external: true,
      },
      {
        title: 'IoT Security Camera',
        badges: ['Raspberry Pi', 'IoT'],
        description:
          'Raspberry Pi-based security camera system with motion detection, cloud storage integration, and automated notifications.',
        link: 'https://github.com/ianedmundson1/Security-camera',
        linkLabel: 'View Project',
        external: true,
      },
    ],
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
    projects: [
      {
        title: 'Energy Optimization Systems',
        badges: ['Forecasting', 'Optimization'],
        description:
          'NARX-based 96-hour energy forecasting, XGBoost prediction models for chillers and cooling towers, and PSO-driven corrosion optimization. Contributed to $2.2M in annual savings across operations.',
        link: '/projects/energy-optimization',
        linkLabel: 'View Details',
      },
      {
        title: 'Cloud Data Migration',
        badges: ['Azure', 'ETL'],
        description:
          'Large-scale migration of 35,000+ data points from OSIsoft PI to Azure Data Lake Gen2 with optimized ETL pipelines. Achieved 83% faster transfer speeds via custom tooling.',
        link: '/projects/cloud-migration',
        linkLabel: 'View Details',
      },
    ],
  },
];
