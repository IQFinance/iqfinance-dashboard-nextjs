import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, TrendingUp, AlertTriangle, Shield } from 'lucide-react';

export interface CompetitorData {
  name: string;
  position?: string;
}

export interface StrategicMove {
  action: string;
  date: string;
  value: number;
  impact: string;
}

export interface CompetitiveLandscapeData {
  market_position: string;
  market_share_pct?: number;
  direct_competitors: string[] | CompetitorData[];
  competitive_advantages: string[];
  strategic_risks: string[];
  recent_strategic_moves?: StrategicMove[];
}

export interface CompetitiveTableProps {
  data: CompetitiveLandscapeData;
  title?: string;
}

export const CompetitiveTable: React.FC<CompetitiveTableProps> = ({
  data,
  title = 'Competitive Landscape',
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('advantages');

  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Market position, competitive advantages, and strategic analysis
        </p>
      </div>

      {/* Market Position Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">Market Position</p>
            <p className="text-sm text-blue-700">{data.market_position}</p>
          </div>
          {data.market_share_pct && (
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">
                {data.market_share_pct.toFixed(0)}%
              </p>
              <p className="text-xs text-blue-600">Market Share</p>
            </div>
          )}
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('advantages')}
          className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">
              Competitive Advantages ({data.competitive_advantages.length})
            </span>
          </div>
          <ArrowUpDown className="w-4 h-4 text-green-600" />
        </button>
        
        {expandedSection === 'advantages' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-2"
          >
            {data.competitive_advantages.map((advantage, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-white border border-green-100 rounded-lg"
              >
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-green-700">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 flex-1">{advantage}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Strategic Risks */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('risks')}
          className="w-full flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-900">
              Strategic Risks ({data.strategic_risks.length})
            </span>
          </div>
          <ArrowUpDown className="w-4 h-4 text-orange-600" />
        </button>
        
        {expandedSection === 'risks' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-2"
          >
            {data.strategic_risks.map((risk, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-white border border-orange-100 rounded-lg"
              >
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-orange-700" />
                </div>
                <p className="text-sm text-gray-700 flex-1">{risk}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Recent Strategic Moves */}
      {data.recent_strategic_moves && data.recent_strategic_moves.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('moves')}
            className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">
                Recent Strategic Moves ({data.recent_strategic_moves.length})
              </span>
            </div>
            <ArrowUpDown className="w-4 h-4 text-purple-600" />
          </button>
          
          {expandedSection === 'moves' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 space-y-2"
            >
              {data.recent_strategic_moves.map((move, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-purple-100 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">{move.action}</p>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      {move.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{move.impact}</p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatCurrency(move.value)}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Direct Competitors */}
      <div>
        <button
          onClick={() => toggleSection('competitors')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-900">
            Direct Competitors ({data.direct_competitors.length})
          </span>
          <ArrowUpDown className="w-4 h-4 text-gray-600" />
        </button>
        
        {expandedSection === 'competitors' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {data.direct_competitors.map((competitor, idx) => {
                const name = typeof competitor === 'string' ? competitor : competitor.name;
                const position = typeof competitor === 'object' ? competitor.position : undefined;
                
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-gray-200 rounded-lg text-center hover:border-gray-300 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    {position && (
                      <p className="text-xs text-gray-500 mt-1">{position}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CompetitiveTable;
