'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CompanyHeader, 
  KPICard, 
  RevenueTrendChart, 
  ProjectionsChart, 
  CompetitiveTable, 
  DataQuality 
} from '../components';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Globe, 
  Zap 
} from 'lucide-react';

interface CompanyIntelligence {
  success: boolean;
  domain: string;
  timestamp: string;
  model: string;
  company: {
    name: string;
    domain: string;
    industry: string;
    description: string;
    founded_year?: number;
    headquarters?: string;
    employee_count?: string;
    funding_stage?: string;
    total_funding?: string;
  };
  kpis: Array<{
    label: string;
    value: string | number;
    unit?: string;
    yoy_growth?: number;
    trend?: 'increasing' | 'decreasing' | 'stable';
    confidence?: number;
    benchmark?: string;
    period?: string;
  }>;
  growth_metrics: {
    revenue_trend: Array<{
      year: number;
      revenue: number;
      growth_rate?: number;
    }>;
    market_position: string;
    competitive_advantages: string[];
  };
  financial_projections: {
    projections: Array<{
      year: number;
      conservative: number;
      moderate: number;
      optimistic: number;
    }>;
    assumptions: string[];
  };
  competitive_landscape: {
    competitors: Array<{
      name: string;
      revenue_estimate: string;
      market_share?: string;
      key_differentiator: string;
      growth_trajectory: 'high' | 'moderate' | 'low';
    }>;
    market_dynamics: string;
  };
  data_quality: {
    overall_confidence: number;
    source_count: number;
    data_freshness: string;
    gaps: string[];
    methodology_notes: string[];
  };
}

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanyIntelligence | null>(null);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    { icon: '🔍', text: 'Gathering intelligence...' },
    { icon: '🧠', text: 'Processing data...' },
    { icon: '📊', text: 'Analyzing patterns...' },
    { icon: '✨', text: 'Finalizing insights...' },
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setError('Please enter a company domain');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCurrentStep(0);

    // Animate through loading steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      clearInterval(stepInterval);
      setResult(data);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : 'Failed to analyze company');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDomain('');
    setResult(null);
    setError('');
    setCurrentStep(0);
  };

  const getKPIIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('revenue') || lowerLabel.includes('arr')) return <DollarSign className="w-5 h-5" />;
    if (lowerLabel.includes('growth') || lowerLabel.includes('rate')) return <TrendingUp className="w-5 h-5" />;
    if (lowerLabel.includes('customer') || lowerLabel.includes('user')) return <Users className="w-5 h-5" />;
    if (lowerLabel.includes('market')) return <Target className="w-5 h-5" />;
    if (lowerLabel.includes('valuation')) return <Globe className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  // Dashboard View
  if (result) {
    return (
      <div id="dashboard-content" className="min-h-screen bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Reset Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Intelligence Dashboard</h1>
              <p className="text-gray-500 mt-1">Generated on {new Date(result.timestamp).toLocaleString()}</p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              New Analysis
            </button>
          </div>

          {/* Company Header */}
          <CompanyHeader company={result.company} />

          {/* KPIs Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.kpis.map((kpi, index) => (
                <KPICard
                  key={index}
                  {...kpi}
                  icon={getKPIIcon(kpi.label)}
                />
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            {result.growth_metrics.revenue_trend && result.growth_metrics.revenue_trend.length > 0 && (
              <RevenueTrendChart data={result.growth_metrics.revenue_trend} />
            )}

            {/* Financial Projections */}
            {result.financial_projections.projections && result.financial_projections.projections.length > 0 && (
              <ProjectionsChart 
                data={result.financial_projections.projections}
                assumptions={result.financial_projections.assumptions}
              />
            )}
          </div>

          {/* Competitive Landscape */}
          {result.competitive_landscape.competitors && result.competitive_landscape.competitors.length > 0 && (
            <div className="mb-8">
              <CompetitiveTable 
                competitors={result.competitive_landscape.competitors}
                marketDynamics={result.competitive_landscape.market_dynamics}
              />
            </div>
          )}

          {/* Market Position & Competitive Advantages */}
          {result.growth_metrics.competitive_advantages && result.growth_metrics.competitive_advantages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Position & Competitive Advantages</h3>
              <p className="text-gray-700 mb-4">{result.growth_metrics.market_position}</p>
              <div className="space-y-2">
                {result.growth_metrics.competitive_advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <p className="text-gray-700">{advantage}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Data Quality */}
          <DataQuality quality={result.data_quality} />
        </div>
      </div>
    );
  }

  // Search Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            IQ Finance
            <span className="block text-3xl mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Company Intelligence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            Deep financial analysis and market intelligence powered by AI
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label htmlFor="domain" className="block text-sm font-semibold text-gray-700 mb-2">
                Company Domain
              </label>
              <input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g., stripe.com, shopify.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 p-6 bg-blue-50 rounded-lg">
                  <span className="text-3xl animate-pulse">
                    {loadingSteps[currentStep].icon}
                  </span>
                  <p className="text-blue-700 font-medium">
                    {loadingSteps[currentStep].text}
                  </p>
                </div>
                <div className="flex space-x-2 justify-center">
                  {loadingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-blue-600 scale-110' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Analyze Company
              </button>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Our AI analyzes public data, financial reports, and market trends to provide comprehensive company intelligence.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Powered by advanced AI models and real-time market data</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
