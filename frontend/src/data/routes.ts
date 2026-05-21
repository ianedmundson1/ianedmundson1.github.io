export const ROUTES = {
  home: '/',
  projects: '/projects',
  personalProjects: '/projects/personal',
  mitDataScience: '/projects/mit-data-science',
  ragDemo: '/projects/rag-demo',
  energyOptimization: '/projects/energy-optimization',
  cloudMigration: '/projects/cloud-migration',
  about: '/about',
  analyticsHub: '/analytics',
  seattleFire911: '/analytics/seattle-fire-911',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
