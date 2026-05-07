export interface Experience {
  role: string;
  org: string;
  period: string;
  highlights: readonly string[];
}

export interface TechnicalCapability {
  area: string;
  description: string;
  tags: readonly string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  description: string;
}

export interface Award {
  title: string;
  year: string;
  description: string;
}

export const HERO_SUBTITLE =
  'Data scientist with a background in federal ML infrastructure. I build the systems that hold up when it actually matters.';

export const INTRO_PARAGRAPHS: readonly string[] = [
  "Data scientist with 3+ years at NIH's Central Utility Plant, where I built production ML systems for one of the federal government's largest central utility operations: forecasting, anomaly detection, chiller efficiency analysis, and the data infrastructure to make them reliable. The analytics work was one piece of broader operational improvements that together achieved $2.2M in annual energy savings across the plant, recognized with an NIH Director's Award.",
  'My work spans the full stack: ML modeling in Python (LightGBM, NARX, SHAP), FastAPI services, React front-ends, and data pipelines connecting OSIsoft PI to Azure. I care most about systems that hold up under pressure: a 96-hour forecast during a heatwave, an alert system engineers actually trust.',
  'I care about data done right in the public sector: responsible deployment, clear governance, and tools people can actually use. Currently volunteering with the UW Botanic Gardens, modernizing their seed conservation web application, and with Peace Peloton, enhancing their management workflows.',
];

export const EXPERIENCE: readonly Experience[] = [
  {
    role: 'Technical Volunteer',
    org: 'Peace Peloton',
    period: 'March 2026 - Present',
    highlights: [
      'Optimizing analytics and management workflows for non-profit incubator for black owned businesses',
    ],
  },
  {
    role: 'Technical Volunteer',
    org: 'University of Washington Botanic Gardens',
    period: 'Oct 2025 - Present',
    highlights: [
      'Modernizing a legacy .NET/C# web application for RareCare, a UW seed conservation collections project',
      'Migrating codebase to GitHub, refactoring business logic, improving frontend functionality, and extending database schema',
    ],
  },
  {
    role: 'Data Scientist (Federal, GS-11)',
    org: 'National Institutes of Health (NIH)',
    period: 'Jan 2022 - July 2025',
    highlights: [
      'Established Databricks analytics platform with Delta Live Tables processing 30M+ daily sensor readings across 35,000+ monitoring points, delivering anomaly detection, predictive forecasting, and automated reporting to 30+ stakeholders that supported $2.2M in annual energy savings',
      "Engineered 96-hour cooling demand forecasting system, 50% more accurate than legacy, enabling proactive resource scheduling for NIH's 62,400-ton cooling infrastructure",
      'Developed anomaly detection framework across 20,000+ monitored points; 93% of alerts operator-validated as genuine anomalies, restoring engineer trust after widespread alert fatigue',
      'Migrated 6 years of sensor data (35,000+ monitoring points) to cloud infrastructure at 83% faster transfer speeds using custom tooling over the vendor solution',
      'Migrated 15+ ML models from siloed CSV-based experimentation to a cloud-native MLOps pipeline with managed feature tables, cutting model deployment from weeks to days',
      'Implemented CI/CD pipelines for 10+ analytics applications, cutting deployment cycles by 50%',
      'Created an AI search system for instant retrieval of building codes and safety policies from 1,000+ page compliance manuals',
      'Built a graph-based AI system extracting entities from 500+ operator text logs into an interactive knowledge graph for root cause analysis',
      'Administered Azure resource governance, monitoring ~$120K in annual cloud infrastructure spend',
    ],
  },
  {
    role: 'Data Analyst',
    org: 'Contractor to NIH',
    period: 'Oct 2021 – Dec 2021',
    highlights: [
      'Analyzed engineering and historical data to troubleshoot Central Utility Plant faults and support optimization program refinements',
    ],
  },
  {
    role: 'Facilities Security Engineer',
    org: 'Cape Fox Corporation (Contractor to NIH)',
    period: 'May 2021 – Sept 2021',
    highlights: [
      'Compiled monitoring point documentation and sensor configuration data across CUP infrastructure',
      'Maintained uninterrupted data collection across critical facilities infrastructure by troubleshooting OSIsoft PI historian failures',
    ],
  },
];

export const TECHNICAL_CAPABILITIES: readonly TechnicalCapability[] = [
  {
    area: 'Predictive Analytics',
    description: 'Forecasting and anomaly detection systems to anticipate operational issues',
    tags: ['Python', 'LightGBM', 'SHAP', 'NARX', 'Scikit-learn'],
  },
  {
    area: 'Cloud Infrastructure',
    description: 'Scalable data platforms and ML pipelines',
    tags: ['Databricks', 'Azure Data Lake Gen2', 'Docker', 'GitHub Actions'],
  },
  {
    area: 'Data Engineering',
    description: 'Pipelines and APIs for reliable data flow',
    tags: ['Python', 'SQL', 'FastAPI', 'pandas', 'OSIsoft PI'],
  },
  {
    area: 'Visualization & Reporting',
    description: 'Dashboards translating technical data into actionable insights',
    tags: ['Plotly Dash', 'React', 'Neo4j', 'MLflow'],
  },
];

export const EDUCATION: readonly EducationEntry[] = [
  {
    degree: 'Applied Data Science Program',
    institution: 'MIT Professional Education',
    description:
      'Capstone: facial emotion detection using VGG16 transfer learning, classifying four emotions from 48×48 images with ~72-80% test accuracy.',
  },
  {
    degree: 'Bachelor of Science, Mechanical Engineering',
    institution: 'University of Maryland',
    description: 'Graduated May 2021.',
  },
];

export const AWARDS: readonly Award[] = [
  {
    title: "NIH Director's Award",
    year: '2024',
    description:
      "Recognized for developing ML-based 96-hour forecasting and optimization system that enabled safe operation of NIH's 62,400-ton cooling infrastructure during 2023 El Niño heatwave, when demand approached maximum capacity and required precise chiller sequencing.",
  },
];

export const CERTIFICATIONS: readonly string[] = [
  'Applied Data Science Program: Leveraging AI for Effective Decision-Making, MIT Professional Education',
  'NIH Training Center Emerging Talent Program, NIH',
  'OLAO Lean Six Sigma Green Belt Training Course, NIH',
  'Building Knowledge Graphs with LLMs, Neo4j',
];
