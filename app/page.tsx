'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PDFExportButton from './components/PDFExportButton';

interface AnalysisResult {
  success: boolean;
  domain: string;
  analysis: string;
  timestamp: string;
  model: string;
}

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
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

  const formatAnalysis = (text: string) => {
    const sections = text.split(/\n(?=\d+\.|[A-Z\s]+:)/);
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n');
      
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="mb-4 p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
          <div className="text-gray-600 whitespace-pre-wrap leading-relaxed text-[15px]">
            {content}
          </div>
        </motion.div>
      );
    });
  };

  if (result) {
    return (
      <div id="dashboard-content" className="min-h-screen bg-[#FAFAFA]">
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0066FF] to-[#5B9FFF] rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  🏢
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">{result.domain}</h1>
                  <p className="text-gray-500 text-sm mt-1">Company Intelligence Report</p>
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Grade</div>
                <div className="text-2xl font-semibold text-[#0066FF]">A+</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Analysis Time</div>
                <div className="text-2xl font-semibold text-gray-900">~30s</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">AI Model</div>
                <div className="text-lg font-semibold text-gray-900">Claude 3.5</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">Generated</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(result.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis Content */}
          <div className="mb-10">
            {formatAnalysis(result.analysis)}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 justify-center"
          >
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors shadow-sm"
            >
              Analyze Another
            </button>
            <PDFExportButton />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      <div className="relative container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
              Company Intelligence
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Deep AI-powered analysis in 30 seconds
            </p>
          </motion.div>

          {/* Search Form */}
          {!loading && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleAnalyze}
              className="mb-16"
            >
              <div className="relative max-w-2xl mx-auto mb-4">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="stripe.com"
                  className="w-full px-6 py-5 text-lg bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
                />
              </div>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mb-4 text-center"
                >
                  {error}
                </motion.p>
              )}

              <div className="text-center">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#0066FF] text-white text-base font-medium rounded-lg hover:bg-[#0052CC] transition-colors shadow-sm"
                >
                  Analyze Company
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-12 h-12 border-3 border-gray-300 border-t-[#0066FF] rounded-full animate-spin mx-auto mb-10"></div>
                
                <div className="space-y-3">
                  {loadingSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: index <= currentStep ? 1 : 0.4,
                        x: 0,
                      }}
                      transition={{ delay: index * 0.2, duration: 0.3 }}
                      className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                        index === currentStep
                          ? 'bg-white border border-[#0066FF]/30'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{step.icon}</span>
                      <span className="text-gray-700 font-medium text-sm">{step.text}</span>
                      {index === currentStep && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Trust Indicators */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex flex-wrap justify-center gap-8 mb-8 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#0066FF]">✓</span>
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0066FF]">✓</span>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0066FF]">✓</span>
                  <span>Secure</span>
                </div>
              </div>
              
              <div className="text-gray-400 text-xs">
                10,000+ companies analyzed
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}