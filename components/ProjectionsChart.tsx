import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export interface ProjectionData {
  year: string;
  metric: string;
  lowEstimate: number;
  baseEstimate: number;
  highEstimate: number;
  confidenceInterval: string;
}

export interface ProjectionsChartProps {
  revenueData: ProjectionData[];
  volumeData?: ProjectionData[];
  title?: string;
  height?: number;
}

export const ProjectionsChart: React.FC<ProjectionsChartProps> = ({
  revenueData,
  volumeData,
  title = 'Financial Projections',
  height = 400,
}) => {
  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  // Combine revenue and volume data for grouped display
  const chartData = revenueData.map((rev, idx) => ({
    year: rev.year,
    revenueLow: rev.lowEstimate,
    revenueBase: rev.baseEstimate,
    revenueHigh: rev.highEstimate,
    volumeLow: volumeData?.[idx]?.lowEstimate,
    volumeBase: volumeData?.[idx]?.baseEstimate,
    volumeHigh: volumeData?.[idx]?.highEstimate,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              const isRevenue = entry.dataKey.includes('revenue');
              const estimate = entry.dataKey.includes('Low')
                ? 'Low'
                : entry.dataKey.includes('High')
                ? 'High'
                : 'Base';
              
              return (
                <div key={index} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {isRevenue ? 'Revenue' : 'Volume'} ({estimate}):
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Low, base, and high estimates for forward years
        </p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          
          <XAxis
            dataKey="year"
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickFormatter={formatCurrency}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />

          {/* Revenue Bars */}
          <Bar
            dataKey="revenueLow"
            fill="#93C5FD"
            name="Revenue (Low)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="revenueBase"
            fill="#2563EB"
            name="Revenue (Base)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="revenueHigh"
            fill="#1E40AF"
            name="Revenue (High)"
            radius={[4, 4, 0, 0]}
          />

          {/* Volume Bars (if provided) */}
          {volumeData && (
            <>
              <Bar
                dataKey="volumeLow"
                fill="#D1FAE5"
                name="Volume (Low)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="volumeBase"
                fill="#10B981"
                name="Volume (Base)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="volumeHigh"
                fill="#059669"
                name="Volume (High)"
                radius={[4, 4, 0, 0]}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* Confidence Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        {revenueData.map((projection) => (
          <div key={projection.year} className="text-center">
            <p className="text-xs font-medium text-gray-600 mb-1">{projection.year}</p>
            <p className="text-sm text-gray-900">
              {formatCurrency(projection.baseEstimate)}
              <span className="text-xs text-gray-500 ml-1">
                ({projection.confidenceInterval})
              </span>
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectionsChart;
