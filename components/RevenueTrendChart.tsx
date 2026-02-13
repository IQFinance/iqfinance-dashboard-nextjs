import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';

export interface RevenueTrendDataPoint {
  year: string;
  revenue: number;
  isProjection?: boolean;
  lowEstimate?: number;
  highEstimate?: number;
}

export interface RevenueTrendChartProps {
  data: RevenueTrendDataPoint[];
  title?: string;
  height?: number;
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
  data,
  title = 'Revenue Trend & Projections',
  height = 400,
}) => {
  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isProjection = payload[0].payload.isProjection;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 mb-2">
            {label} {isProjection && <span className="text-blue-600">(Projected)</span>}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-semibold" style={{ color: entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Split data into historical and projected
  const historicalData = data.filter((d) => !d.isProjection);
  const projectedData = data.filter((d) => d.isProjection);
  
  // Create combined dataset for smooth transition
  const combinedData = [
    ...historicalData,
    ...(projectedData.length > 0 && historicalData.length > 0
      ? [{ ...historicalData[historicalData.length - 1], isProjection: false }]
      : []),
    ...projectedData,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Historical performance with forward-looking projections
        </p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={combinedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>

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
            iconType="line"
          />

          {/* Confidence Interval Area */}
          <Area
            type="monotone"
            dataKey="highEstimate"
            stroke="none"
            fill="url(#confidenceGradient)"
            fillOpacity={1}
            name="High Estimate"
          />
          <Area
            type="monotone"
            dataKey="lowEstimate"
            stroke="none"
            fill="url(#confidenceGradient)"
            fillOpacity={1}
            name="Low Estimate"
          />

          {/* Historical Revenue Line */}
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ fill: '#2563EB', r: 5 }}
            activeDot={{ r: 7 }}
            name="Revenue"
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend for line styles */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-0.5 bg-blue-600" />
          <span>Historical</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-0.5 bg-blue-400 opacity-50" />
          <span>Projected (Base)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-blue-600 opacity-10 border border-blue-300" />
          <span>Confidence Interval</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueTrendChart;
