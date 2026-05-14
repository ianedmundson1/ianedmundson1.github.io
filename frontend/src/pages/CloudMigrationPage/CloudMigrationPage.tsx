import ProjectDetailLayout from '../../components/ProjectDetailLayout';
import { getProject } from '../../data/projects';

const META = getProject('cloud-migration');

const HIGHLIGHTS = [
  { value: '35,000+', label: 'Data Points Migrated' },
  { value: '6 Years', label: 'Historical Data' },
  { value: '83%', label: 'Faster Transfers' },
  { value: '15+', label: 'ML Models Migrated' },
] as const;

const PIPELINE_STEPS = [
  {
    step: 1,
    title: 'Audit',
    description:
      'Cataloged 35,000+ monitoring points across OSIsoft PI, mapping data types, frequencies, and quality issues.',
  },
  {
    step: 2,
    title: 'Extract',
    description:
      'Built custom open-source extraction tooling that achieved 83% faster transfer speeds vs. the vendor-provided solution.',
  },
  {
    step: 3,
    title: 'Transform',
    description:
      'Standardized timestamps, units, and naming conventions. Applied data quality rules to flag gaps and anomalies.',
  },
  {
    step: 4,
    title: 'Load',
    description:
      'Ingested into Azure Data Lake Gen2 with Delta Lake format for ACID transactions and time-travel capabilities.',
  },
  {
    step: 5,
    title: 'Validate',
    description:
      'Automated reconciliation checks comparing source and destination counts, ranges, and statistical distributions.',
  },
  {
    step: 6,
    title: 'Operationalize',
    description:
      'Established Delta Live Tables for ongoing incremental ingestion of 30M+ daily sensor readings.',
  },
] as const;

const TECH_STACK = [
  'Python', 'Azure Data Lake Gen2', 'Delta Lake', 'Databricks',
  'Delta Live Tables', 'OSIsoft PI', 'SQL', 'pandas',
  'GitHub Actions', 'Docker', 'Azure ML',
] as const;

const OUTCOMES = [
  {
    title: 'Custom Tooling Over Vendor Lock-in',
    description:
      'The vendor-provided migration tool was slow and inflexible. I built an open-source alternative in Python that parallelized extraction and achieved 83% faster transfer speeds, saving weeks of migration time.',
  },
  {
    title: 'MLOps Pipeline Modernization',
    description:
      'Migrated 15+ ML models from siloed CSV-based experimentation to a cloud-native MLOps pipeline with managed feature tables on Databricks, cutting model deployment from weeks to days.',
  },
  {
    title: 'Data Governance at Scale',
    description:
      'Established data quality standards and governance processes across 20,000+ monitoring points, enabling reliable anomaly detection and forecasting downstream.',
  },
] as const;

const CloudMigrationPage = () => (
  <ProjectDetailLayout
    meta={META}
    seo={{
      title: 'Cloud Migration',
      description:
        'Migrating 6 years of sensor data and 35,000+ monitoring points to cloud infrastructure with custom open-source tooling — 83% faster than vendor solutions.',
    }}
    highlights={HIGHLIGHTS}
    overview={{
      content: (
        <>
          <p>
            NIH&apos;s Central Utility Plant relied on an on-premises OSIsoft PI historian
            storing 6 years of operational data across 35,000+ monitoring points. The system was
            reaching capacity limits and couldn&apos;t support the advanced analytics workloads
            needed for energy optimization and predictive maintenance.
          </p>
          <p>
            I led the data migration to Azure Data Lake Gen2 with Delta Lake, establishing a
            modern lakehouse architecture that enabled downstream ML pipelines, real-time
            dashboards, and automated reporting. The migration required careful coordination
            to maintain data continuity for critical facility operations.
          </p>
          <p>
            A key challenge was the vendor-provided migration tool&apos;s poor performance. I
            built custom open-source extraction tooling in Python that parallelized data pulls
            and achieved 83% faster transfer speeds. This approach also gave us full control
            over data transformation and quality checks during migration.
          </p>
        </>
      ),
    }}
    pipeline={{ title: 'Migration Pipeline', steps: PIPELINE_STEPS }}
    features={{ title: 'Key Outcomes', ariaId: 'outcomes-heading', cards: OUTCOMES }}
    techStack={TECH_STACK}
  />
);

export default CloudMigrationPage;
