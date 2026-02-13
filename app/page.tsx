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
    const sections = text.split(/\.(?=\d+\.|[A-Z\s]+:)/);
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
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm">
                New Analysis
              </button>
              <PDFExportButton />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{result.domain}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Analyzed {new Date(result.timestamp).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric', 
                      minute: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Model: {result.model}
                </div>
              </div>
              <div className="mt-6">
                {formatAnalysis(result.analysis)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2gl"
      >
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            IQFinance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Intelligent company financial analysis powered by advanced AI
          </motion.p>
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-6">
                 {loadingSteps[currentStep].icon}
              </motion.div>
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg text-gray-700 font-medium">
                {loadingSteps[currentStep].text}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleAnalyze}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200"
          >
            <div className="space-y-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !domain.trim()}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm">
              Analyze
            </button>
          </motion.form>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
