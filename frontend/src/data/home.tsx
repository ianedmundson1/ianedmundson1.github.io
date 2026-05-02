import React from 'react';

/* -------------------------------------------------- */
/*  Expertise illustrations — wide banner SVGs         */
/* -------------------------------------------------- */

const MLIcon = () => (
  <svg viewBox="0 0 320 100" width="100%" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
    {[40,80,120,160,200,240,280].map(x => (
      <line key={x} x1={x} y1="10" x2={x} y2="90" stroke="var(--color-border)" strokeWidth="0.5" />
    ))}
    {[25,50,75].map(y => (
      <line key={y} x1="20" y1={y} x2="300" y2={y} stroke="var(--color-border)" strokeWidth="0.5" />
    ))}
    <line x1="24" y1="84" x2="296" y2="18" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
    {([
      [32,78],[55,72],[72,68],[96,74],[118,60],[140,64],
      [158,52],[182,46],[205,54],[232,38],[258,34],[286,22],
      [44,82],[130,58],[168,48],[220,42],[270,28],
    ] as [number,number][]).map(([x,y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="var(--color-text-secondary)" opacity="0.7" />
    ))}
    {([
      [72,68],[158,52],[258,34],
    ] as [number,number][]).map(([x,y]) => (
      <circle key={`h-${x}-${y}`} cx={x} cy={y} r="4" fill="var(--color-primary)" />
    ))}
  </svg>
);

const PipelineIcon = () => (
  <svg viewBox="0 0 320 100" width="100%" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
    {([
      { x: 18,  primary: false },
      { x: 100, primary: false },
      { x: 182, primary: true  },
      { x: 264, primary: false },
    ]).map(({ x, primary }) => (
      <rect key={x} x={x} y="34" width="56" height="32" rx="4"
        fill={primary ? 'var(--color-primary)' : 'var(--color-bg-elevated)'}
        stroke={primary ? 'none' : 'var(--color-border)'}
        strokeWidth="1"
      />
    ))}
    {[75, 157, 239].map(x => (
      <g key={x}>
        <line x1={x} y1="50" x2={x + 24} y2="50" stroke="var(--color-border)" strokeWidth="1.5" />
        <polyline points={`${x+18},45 ${x+25},50 ${x+18},55`} fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ))}
    {[42,47,52].map(y => (
      <rect key={y} x="26" y={y} width="32" height="2" rx="1" fill="var(--color-border)" />
    ))}
    <polyline points="214,42 210,50 214,50 210,58" fill="none" stroke="var(--color-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="275,50 279,54 292,42" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 320 100" width="100%" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
    <rect x="20" y="12" width="280" height="76" rx="5" fill="var(--color-bg-elevated)" stroke="var(--color-border)" strokeWidth="1" />
    <rect x="20" y="12" width="280" height="20" rx="5" fill="var(--color-bg)" />
    <rect x="20" y="24" width="280" height="8" fill="var(--color-bg)" />
    <circle cx="36" cy="22" r="3" fill="var(--color-border)" />
    <circle cx="48" cy="22" r="3" fill="var(--color-border)" />
    <circle cx="60" cy="22" r="3" fill="var(--color-border)" />
    <polyline points="30,42 36,46 30,50" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="42" y="42" width="140" height="7" rx="2" fill="var(--color-primary)" opacity="0.15" />
    <rect x="42" y="43" width="60" height="5" rx="1.5" fill="var(--color-primary)" opacity="0.9" />
    <rect x="106" y="43" width="76" height="5" rx="1.5" fill="var(--color-text-muted)" opacity="0.5" />
    <rect x="30" y="56" width="40" height="4" rx="1.5" fill="var(--color-text-muted)" opacity="0.4" />
    <rect x="76" y="56" width="90" height="4" rx="1.5" fill="var(--color-text-secondary)" opacity="0.5" />
    <rect x="30" y="66" width="24" height="4" rx="1.5" fill="var(--color-text-muted)" opacity="0.4" />
    <rect x="60" y="66" width="56" height="4" rx="1.5" fill="var(--color-primary)" opacity="0.5" />
    <rect x="122" y="66" width="40" height="4" rx="1.5" fill="var(--color-text-muted)" opacity="0.3" />
    <rect x="186" y="56" width="6" height="4" rx="1" fill="var(--color-text-muted)" opacity="0.7" />
  </svg>
);

/* -------------------------------------------------- */
/*  Expertise cards                                    */
/* -------------------------------------------------- */
export const EXPERTISE_CARDS: { icon: React.ReactNode; title: string; summary: string }[] = [
  {
    icon: <MLIcon />,
    title: 'Data Science & Machine Learning',
    summary:
      'Forecasting, anomaly detection, and NLP systems; from prototype to production on a MLops framework.',
  },
  {
    icon: <PipelineIcon />,
    title: 'Data Engineering',
    summary:
      'Scalable pipelines processing 30M+ daily readings, cloud migrations, and CI/CD for analytics apps.',
  },
  {
    icon: <CodeIcon />,
    title: 'Software Development',
    summary: 'Full-stack delivery from REST APIs to interactive dashboards.',
  },
];

/* -------------------------------------------------- */
/*  Impact stats                                       */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/*  Featured projects                                  */
/* -------------------------------------------------- */
export const FEATURED_PROJECTS = [
  {
    title: 'MIT Applied Data Science — Emotion Detection',
    badges: ['Machine Learning', 'Interactive Demo'],
    description:
      'Facial emotion classification using VGG16 transfer learning. Try the live demo with your webcam or upload an image.',
    link: '/projects/mit-data-science',
    linkLabel: 'Case study',
  },
  {
    title: 'Facial Detection System',
    badges: ['OpenCV', 'Python'],
    description:
      'Real-time face detection using deep learning models and OpenCV for live video processing.',
    link: 'https://github.com/ianedmundson1/Facial-detection',
    linkLabel: 'GitHub',
    external: true,
  },
  {
    title: 'Lane Detection Algorithm',
    badges: ['Computer Vision', 'Autonomous Vehicles'],
    description:
      'Advanced lane detection for autonomous driving using computer vision and image processing techniques.',
    link: 'https://github.com/ianedmundson1/Lane-detection',
    linkLabel: 'GitHub',
    external: true,
  },
];

/* -------------------------------------------------- */
/*  Hero description                                   */
/* -------------------------------------------------- */
export const HERO_DESCRIPTION =
  "Building analytics infrastructure, ML systems, and data-driven operations tools for research. NIH Director’s Award recipient for the cooling demand forecast that protected critical infrastructure during an extreme heat event.";
