import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';

export interface BrandAssets {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColors?: string[];
  brandDescription?: string;
  confidence?: number;
  dataSource?: string;
}

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
  brandAssets?: BrandAssets;
}

export interface CompanyHeaderProps {
  data: CompanyOverviewData;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ data }) => {
  const brandAssets = data.brandAssets;
  const primaryColor = brandAssets?.primaryColor || '#3B82F6'; // Default to blue-600
  const hasLogo = brandAssets?.logoUrl && brandAssets.logoUrl.trim() !== '';

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

  // Convert hex to rgba with opacity for subtle backgrounds
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
          {/* Company Logo */}
          {hasLogo ? (
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border-2"
              style={{ 
                borderColor: primaryColor,
                backgroundColor: hexToRgba(primaryColor, 0.05)
              }}
            >
              <img
                src={brandAssets.logoUrl}
                alt={`${data.name} logo`}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  // Fallback to icon on image load error
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;
                  }
                }}
              />
            </div>
          ) : (
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${hexToRgba(primaryColor, 0.7)} 100%)`
              }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
          )}
          
          {/* Company Name & Industry */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.name}
            </h1>
            <div className="flex items-center space-x-3">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: hexToRgba(primaryColor, 0.1),
                  color: primaryColor
                }}
              >
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
          <div 
            className="p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(primaryColor, 0.1)
            }}
          >
            <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Founded</p>
            <p className="text-sm font-semibold text-gray-900">{data.founded}</p>
          </div>
        </div>

        {/* Headquarters */}
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(primaryColor, 0.1)
            }}
          >
            <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Headquarters</p>
            <p className="text-sm font-semibold text-gray-900">{data.headquarters}</p>
          </div>
        </div>

        {/* Business Model */}
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{
              backgroundColor: hexToRgba(primaryColor, 0.1)
            }}
          >
            <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
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
