import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AEOScanResult } from '../lib/aeo-analyzer';

const AEORadar: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [result, setResult] = useState<AEOScanResult | null>(null);

  const performScan = async () => {
    if (!url) return;
    
    setStatus('scanning');
    setScanProgress(0);
    setResult(null);
    setErrorMessage('');

    // Start progress animation independently of the fetch
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) return prev; // Hold at 90% until complete
        return prev + (Math.random() * 5);
      });
    }, 200);

    const actions = [
      "Initializing AEO protocols...",
      "Fetching site content...",
      "Parsing Schema.org definitions...",
      "Analyzing signal-to-noise ratio...",
      "Mapping entity relationships...",
      "Verifying sitemap integrity...",
      "Calculating Machine-Readability Score..."
    ];

    // Cycle through actions for visual feedback
    let actionIndex = 0;
    const actionInterval = setInterval(() => {
      setCurrentAction(actions[actionIndex % actions.length]);
      actionIndex++;
    }, 800);

    try {
      const response = await fetch('/api/aeo-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResult(data);
      setScanProgress(100);
      setStatus('complete');
    } catch (error: any) {
      console.error('Scan error:', error);
      setErrorMessage(error.message || "Failed to scan URL");
      setStatus('error');
    } finally {
      clearInterval(progressInterval);
      clearInterval(actionInterval);
    }
  };

  const resetScan = () => {
    setStatus('idle');
    setUrl('');
    setResult(null);
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-bg-surface/40 backdrop-blur-md border border-border-default rounded-12 text-text-primary overflow-hidden relative">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-brand-accent mb-2">
            AEO Radar
          </h2>
          <p className="text-text-subtle text-sm uppercase tracking-wider">AI-Visibility Scan</p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-full max-w-md relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-brand-accent rounded-6 blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <input
                  type="text"
                  placeholder="Enter your website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="relative w-full bg-bg-canvas border border-border-default rounded-6 px-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-border-focus transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && performScan()}
                />
              </div>
              <button
                onClick={performScan}
                disabled={!url}
                className="px-8 py-3 bg-text-primary text-bg-canvas font-bold rounded-6 hover:bg-text-subtle transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>INITIATE SCAN</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </button>
            </motion.div>
          )}

          {status === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              {/* Radar Animation */}
              <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
                {/* Static Rings */}
                <div className="absolute inset-0 border border-brand/20 rounded-full" />
                <div className="absolute inset-8 border border-brand/20 rounded-full" />
                <div className="absolute inset-16 border border-brand/20 rounded-full" />
                
                {/* Rotating Scan Line */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-brand/10 to-brand/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}
                />

                {/* Pulsing Core */}
                <motion.div
                  className="w-4 h-4 bg-brand rounded-full shadow-[0_0_20px_rgba(var(--color-brand-primary),0.8)]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-brand font-mono text-sm">{currentAction}</p>
                <div className="w-64 h-1 bg-bg-elevated rounded-pill overflow-hidden">
                  <motion.div
                    className="h-full bg-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-xl font-bold text-error mb-2">Scan Failed</h3>
              <p className="text-text-subtle mb-6 max-w-md">{errorMessage}</p>
              <button 
                onClick={resetScan}
                className="px-6 py-2 bg-bg-elevated hover:bg-bg-muted rounded-6 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {status === 'complete' && result && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Score Column */}
                <div className="flex flex-col items-center justify-center p-6 bg-bg-elevated rounded-12 border border-border-default">
                  <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-bg-muted"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440}
                        animate={{ strokeDashoffset: 440 - (440 * result.totalScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`${result.totalScore < 50 ? 'text-error' : 'text-success'}`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={`text-4xl font-bold ${result.totalScore < 50 ? 'text-error' : 'text-success'}`}>
                        {result.totalScore}
                      </span>
                      <span className="text-xs text-text-subtle">/ 100</span>
                    </div>
                  </div>
                  
                  {result.totalScore < 50 && (
                    <div className="flex items-center gap-2 text-error bg-error/10 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                      HIGH ALERT: INVISIBLE
                    </div>
                  )}
                </div>

                {/* Breakdown Column */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Scan Analysis</h3>
                  
                  <div className="space-y-3">
                    <ScoreBar label="Schema Density" score={result.breakdown.schemaDensity} max={40} color="bg-brand" />
                    <ScoreBar label="Signal-to-Noise" score={result.breakdown.signalToNoise} max={20} color="bg-brand-accent" />
                    <ScoreBar label="Entity Clarity" score={result.breakdown.entityClarity} max={20} color="bg-info" />
                    <ScoreBar label="Sitemap Health" score={result.breakdown.sitemapHealth} max={20} color="bg-success" />
                  </div>

                  <div className="mt-6 p-4 bg-bg-elevated rounded-6 border border-border-default">
                    <p className="text-sm text-text-subtle italic">
                      {result.totalScore < 50 
                        ? '"Your business is invisible to 70% of AI queries."'
                        : '"Your business has good visibility, but there is room for improvement."'}
                    </p>
                    <button className="mt-4 w-full py-2 bg-text-primary rounded text-sm font-bold hover:bg-text-subtle transition-colors text-bg-canvas">
                      {result.totalScore < 50 ? 'I want to fix this' : 'Optimize further'}
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={resetScan}
                className="mt-6 text-sm text-text-tertiary hover:text-text-primary transition-colors underline decoration-dotted"
              >
                Scan another URL
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score, max, color }: { label: string, score: number, max: number, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-text-subtle">
      <span>{label}</span>
      <span>{score}/{max}</span>
    </div>
    <div className="h-2 bg-bg-elevated rounded-pill overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${(score / max) * 100}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  </div>
);

export default AEORadar;
