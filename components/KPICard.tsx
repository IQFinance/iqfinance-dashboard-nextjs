import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  yoy_growth?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  confidence?: number;
  icon?: React.ReactNode;
  benchmark?: string;
  period?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit,
  yoy_growth,
  trend,
  confidence,
  icon,
  benchmark,
  period,
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
      if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
      if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return String(val);
  };

  const getTrendIcon = () => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (yoy_growth === undefined) return 'text-gray-600';
    if (yoy_growth > 0) return 'text-green-600';
    if (yoy_growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getConfidenceColor = () => {
    if (!confidence) return 'bg-gray-200';
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.75) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          {period && (
            <p className="text-xs text-gray-400">{period}</p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">
          {formatValue(value)}
          {unit && unit !== 'USD' && (
            <span className="text-lg font-normal text-gray-500 ml-1">
              {unit === 'percentage' ? '%' : unit}
            </span>
          )}
        </p>
      </div>

      {/* Growth Indicator & Confidence */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {yoy_growth !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-semibold">
                {yoy_growth > 0 ? '+' : ''}{yoy_growth.toFixed(1)}%
              </span>
            </div>
          )}
          {yoy_growth !== undefined && (
            <span className="text-xs text-gray-500">YoY</span>
          )}
        </div>

        {/* Confidence Indicator */}
        {confidence !== undefined && (
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getConfidenceColor()}`} />
            <span className="text-xs text-gray-500">
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Benchmark */}
      {benchmark && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 line-clamp-2">{benchmark}</p>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;
