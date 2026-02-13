/**
 * Company Intelligence Dashboard Components
 * 
 * A comprehensive suite of React/TypeScript components for visualizing
 * company financial intelligence data with a professional fintech aesthetic.
 * 
 * Built with:
 * - React & TypeScript
 * - Tailwind CSS
 * - Recharts (data visualization)
 * - Framer Motion (animations)
 * - Lucide React (icons)
 */

export { KPICard } from './KPICard';
export type { KPICardProps } from './KPICard';

export { RevenueTrendChart } from './RevenueTrendChart';
export type { RevenueTrendChartProps, RevenueTrendDataPoint } from './RevenueTrendChart';

export { ProjectionsChart } from './ProjectionsChart';
export type { ProjectionsChartProps, ProjectionData } from './ProjectionsChart';

export { CompetitiveTable } from './CompetitiveTable';
export type { 
  CompetitiveTableProps, 
  CompetitiveLandscapeData,
  CompetitorData,
  StrategicMove 
} from './CompetitiveTable';

export { CompanyHeader } from './CompanyHeader';
export type { CompanyHeaderProps, CompanyOverviewData } from './CompanyHeader';

export { DataQuality } from './DataQuality';
export type { DataQualityProps, DataQualityData } from './DataQuality';
