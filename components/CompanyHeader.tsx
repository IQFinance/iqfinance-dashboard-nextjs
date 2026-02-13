import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';

export interface CompanyOverviewData {
  name: string;
  founded: string;
  headquarters: string;
  industry: string;
  business_model: string;
  description: string;
  valuation?: {
    value: number;
    currency: string;
    date: string;
  };
  last_updated?: string;
}

export interface CompanyHeaderProps {
  data: CompanyOverviewData;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
    >
      {/* Main Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          {/* Company Logo Placeholder */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          
          {/* Company Name & Industry */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.name}
            </h1>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {data.industry}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Briefcase className="w-3 h-3 mr-1" />
                {data.business_model.split(' ').slice(0, 3).join(' ')}...
              </span>
            </div>
          </div>
        </div>

        {/* Valuation */}
        {data.valuation && (
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(data.valuation.value)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Valuation • {formatDate(data.valuation.date)}
            </p>
          </div>
        )}
      </div>

      {/* Company Description */}
      <p className="text-sm text-gray-700 leading-relaxed mb-6">
        {data.description}
      </p>

      {/* Key Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        {/* Founded */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Founded</p>
            <p className="text-sm font-semibold text-gray-900">{data.founded}</p>
          </div>
        </div>

        {/* Headquarters */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Headquarters</p>
            <p className="text-sm font-semibold text-gray-900">{data.headquarters}</p>
          </div>
        </div>

        {/* Business Model */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Business Model</p>
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
              {data.business_model.split(',')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      {data.last_updated && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-right">
            Last updated: {formatDate(data.last_updated)}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyHeader;
