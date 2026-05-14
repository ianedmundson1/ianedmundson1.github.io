export const ROUTES = {
  home: '/',
  projects: '/projects',
  personalProjects: '/projects/personal',
  mitDataScience: '/projects/mit-data-science',
  ragDemo: '/projects/rag-demo',
  energyOptimization: '/projects/energy-optimization',
  cloudMigration: '/projects/cloud-migration',
  about: '/about',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
