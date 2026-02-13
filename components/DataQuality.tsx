import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

export interface DataQualityData {
  confidence_score: number;
  data_sources: string[];
  estimation_methods: string[];
  last_verified: string;
}

export interface DataQualityProps {
  data: DataQualityData;
  compact?: boolean;
}

export const DataQuality: React.FC<DataQualityProps> = ({ 
  data, 
  compact = false 
}) => {
  const getConfidenceLevel = (): { label: string; color: string; icon: React.ReactNode } => {
    const score = data.confidence_score;
    if (score >= 0.9) {
      return {
        label: 'Very High',
        color: 'green',
        icon: <CheckCircle className="w-5 h-5" />,
      };
    } else if (score >= 0.75) {
      return {
        label: 'High',
        color: 'blue',
        icon: <CheckCircle className="w-5 h-5" />,
      };
    } else if (score >= 0.6) {
      return {
        label: 'Medium',
        color: 'yellow',
        icon: <AlertCircle className="w-5 h-5" />,
      };
    } else {
      return {
        label: 'Low',
        color: 'red',
        icon: <AlertCircle className="w-5 h-5" />,
      };
    }
  };

  const confidence = getConfidenceLevel();
  const percentage = Math.round(data.confidence_score * 100);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      progress: 'bg-green-500',
      badge: 'bg-green-100 text-green-800',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      progress: 'bg-blue-500',
      badge: 'bg-blue-100 text-blue-800',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      progress: 'bg-yellow-500',
      badge: 'bg-yellow-100 text-yellow-800',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      progress: 'bg-red-500',
      badge: 'bg-red-100 text-red-800',
    },
  };

  const colors = colorClasses[confidence.color as keyof typeof colorClasses];

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border`}
      >
        <div className={colors.text}>{confidence.icon}</div>
        <div>
          <p className={`text-xs font-semibold ${colors.text}`}>
            {confidence.label} Confidence
          </p>
          <p className="text-xs text-gray-600">{percentage}% • {data.data_sources.length} sources</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Data Quality</h3>
        <p className="text-sm text-gray-500">
          Confidence score and source verification
        </p>
      </div>

      {/* Confidence Score */}
      <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={colors.text}>{confidence.icon}</div>
            <span className={`font-semibold ${colors.text}`}>
              {confidence.label} Confidence
            </span>
          </div>
          <span className={`text-2xl font-bold ${colors.text}`}>
            {percentage}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${colors.progress} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Data Sources */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-semibold text-gray-900">
            Data Sources ({data.data_sources.length})
          </h4>
        </div>
        <div className="space-y-2">
          {data.data_sources.map((source, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg"
            >
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-700">
                  {idx + 1}
                </span>
              </div>
              <p className="text-xs text-gray-700 flex-1">{source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Estimation Methods */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Estimation Methods
        </h4>
        <div className="space-y-2">
          {data.estimation_methods.map((method, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2 text-xs text-gray-700"
            >
              <span className="text-blue-600 font-semibold">•</span>
              <p className="flex-1">{method}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Last Verified */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">Last Verified</span>
          </div>
          <span className="text-xs font-medium text-gray-900">
            {formatDate(data.last_verified)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DataQuality;
