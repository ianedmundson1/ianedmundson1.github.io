import { ROUTES } from './routes';

export type ProjectKind = 'personal' | 'work' | 'education';

export interface Project {
  /** Stable identifier; also used by detail pages to look up metadata. */
  id: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  /** Short list of display tags shown on the card. */
  badges: string[];
  /** Internal route or external URL. */
  link?: string;
  /** When true, `link` opens in a new tab as an external URL. */
  external?: boolean;
  linkLabel?: string;
  interactive?: boolean;
  youtube?: string;
}

export interface Category {
  title: string;
  description: string;
  kind: ProjectKind;
  viewAllLink?: string;
  viewAllLabel?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'facial-detection',
    kind: 'personal',
    title: 'Facial Detection System',
    summary:
      'Real-time face detection and emotion recognition using deep-learning models and OpenCV for live video processing.',
    badges: ['OpenCV', 'Python'],
    link: 'https://github.com/ianedmundson1/Facial-detection',
    external: true,
    linkLabel: 'View on GitHub',
    youtube: 'https://www.youtube.com/watch?v=0VEvEf_r25U',
  },
  {
    id: 'lane-detection',
    kind: 'personal',
    title: 'Lane Detection Algorithm',
    summary:
      'Lane detection for autonomous-driving applications using computer vision and image-processing techniques, robust across varying lighting and road conditions.',
    badges: ['Computer Vision', 'Image Processing'],
    link: 'https://github.com/ianedmundson1/Lane-detection',
    external: true,
    linkLabel: 'View on GitHub',
    youtube: 'https://www.youtube.com/watch?v=0klrGBsJtYY',
  },
  {
    id: 'iot-security-camera',
    kind: 'personal',
    title: 'IoT Security Camera System',
    summary:
      'Raspberry Pi-based security camera with motion detection, cloud storage, and automated notifications for end-to-end home surveillance.',
    badges: ['Raspberry Pi', 'IoT'],
    link: 'https://github.com/ianedmundson1/Security-camera',
    external: true,
    linkLabel: 'View on GitHub',
  },
  {
    id: 'rag-demo',
    kind: 'personal',
    title: 'RAG Demo',
    summary:
      'Retrieval-Augmented Generation walkthrough combining a vector store with an LLM to ground answers in source documents. Packaged as a Jupyter notebook with a companion presentation.',
    badges: ['Python', 'LangChain'],
    link: ROUTES.ragDemo,
    external: false,
    linkLabel: 'View Details',
  },
  {
    id: 'mit-data-science',
    kind: 'education',
    title: 'MIT Applied Data Science',
    summary:
      'Facial emotion classification using VGG16 transfer learning. Try the live demo with your webcam or upload an image.',
    badges: ['Machine Learning', 'Analytics'],
    link: ROUTES.mitDataScience,
    external: false,
    linkLabel: 'View Project',
    interactive: true,
  },
  {
    id: 'energy-optimization',
    kind: 'work',
    title: 'Energy Optimization Systems',
    summary:
      "96-hour cooling load forecasting, chiller efficiency analysis, and anomaly detection for NIH's Central Utility Plant, part of $2.2M in annual energy savings across plant operations.",
    badges: ['Forecasting', 'Optimization'],
    link: ROUTES.energyOptimization,
    external: false,
    linkLabel: 'View Details',
  },
  {
    id: 'cloud-migration',
    kind: 'work',
    title: 'Cloud Data Migration',
    summary:
      'Large-scale migration of 6 years of sensor data from OSIsoft PI to Azure Data Lake Gen2 with custom tooling that outperformed the vendor solution by 83%.',
    badges: ['Azure', 'ETL'],
    link: ROUTES.cloudMigration,
    external: false,
    linkLabel: 'View Details',
  },
];

export const CATEGORIES: Category[] = [
  {
    title: 'Personal Projects',
    description:
      'Side projects exploring computer vision, IoT, and deep learning.',
    kind: 'personal',
    viewAllLink: ROUTES.personalProjects,
    viewAllLabel: 'View All Personal Projects',
  },
  {
    title: 'Continuing Education & Certification Programs',
    description:
      'Hands-on coursework and capstone projects from professional data science and AI programs.',
    kind: 'education',
  },
  {
    title: 'Past Work Projects',
    description:
      'Production ML systems, data pipelines, and cloud infrastructure built for federal operations at NIH.',
    kind: 'work',
  },
];

/** IDs of projects featured on the home page, in display order. */
export const FEATURED_PROJECT_IDS = [
  'mit-data-science',
  'facial-detection',
  'lane-detection',
] as const;

export const getProject = (id: string): Project => {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
};

export const getProjectsByKind = (kind: ProjectKind): Project[] =>
  PROJECTS.filter((p) => p.kind === kind);

export const getFeaturedProjects = (): Project[] =>
  FEATURED_PROJECT_IDS.map(getProject);
