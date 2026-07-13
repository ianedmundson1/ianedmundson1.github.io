import type { ExpertiseIconId } from '@/components/ExpertiseIcons';

export interface ExpertiseCard {
  iconId: ExpertiseIconId;
  title: string;
  summary: string;
}

export const EXPERTISE_CARDS: ExpertiseCard[] = [
  {
    iconId: 'ml',
    title: 'Data Science & Machine Learning',
    summary:
      'Forecasting, anomaly detection, and NLP systems; from prototype to production on a MLops framework.',
  },
  {
    iconId: 'pipeline',
    title: 'Data Engineering',
    summary:
      'Scalable pipelines processing 30M+ daily readings, cloud migrations, and CI/CD for analytics apps.',
  },
  {
    iconId: 'code',
    title: 'Software Development',
    summary: 'Full-stack delivery from REST APIs to interactive dashboards.',
  },
];

export const IMPACT_ITEMS = [
  {
    stat: '$2.2M',
    label: 'annual savings',
    description: "Energy optimization at NIH's Central Utility Plant, with ML contributing to the total",
    spark: [12, 18, 16, 24, 30, 40, 52, 68, 84, 100],
  },
  {
    stat: '93%',
    label: 'fewer false alerts',
    description: 'Anomaly detection across 20,000+ monitored equipment points',
    spark: [100, 88, 72, 60, 48, 32, 22, 14, 9, 7],
  },
  {
    stat: '+50%',
    label: 'forecast accuracy',
    description: '96-hour cooling demand forecast over the legacy model',
    spark: [40, 38, 44, 50, 58, 62, 68, 75, 82, 90],
  },
  {
    stat: '83%',
    label: 'faster transfers',
    description: 'Custom migration tooling vs. the vendor solution',
    spark: [20, 22, 25, 28, 30, 50, 70, 85, 92, 96],
  },
] as const;

export const HERO_DESCRIPTION =
  "Building analytics infrastructure, ML systems, and data-driven operations tools for research. NIH Director's Award recipient for the cooling demand forecast that protected critical infrastructure during an extreme heat event.";
