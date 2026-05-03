export interface WorkProject {
  slug: 'energy-optimization' | 'cloud-migration';
  title: string;
  route: string;
  badges: string[];
  /** Used as both the detail-page hero subtitle and the card description. */
  summary: string;
  linkLabel: string;
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'energy-optimization',
    title: 'Energy Optimization Systems',
    route: '/projects/energy-optimization',
    badges: ['Forecasting', 'Optimization', 'NIH'],
    summary:
      "96-hour cooling load forecasting, chiller efficiency analysis, and anomaly detection for NIH's Central Utility Plant, part of $2.2M in annual energy savings across plant operations.",
    linkLabel: 'View Details',
  },
  {
    slug: 'cloud-migration',
    title: 'Cloud Data Migration',
    route: '/projects/cloud-migration',
    badges: ['Azure', 'ETL', 'NIH'],
    summary:
      'Large-scale migration of 6 years of sensor data from OSIsoft PI to Azure Data Lake Gen2 with custom tooling that outperformed the vendor solution by 83%.',
    linkLabel: 'View Details',
  },
];

export const getWorkProject = (slug: WorkProject['slug']): WorkProject => {
  const project = WORK_PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown work project: ${slug}`);
  return project;
};