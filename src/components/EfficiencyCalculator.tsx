import React, { useState } from 'react';

export default function EfficiencyCalculator() {
  const [tasks, setTasks] = useState(10);
  const [duration, setDuration] = useState(15);
  const [staff, setStaff] = useState(5);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('yearly');

  // Constants
  const DAYS_PER_YEAR = 220;
  const HOURLY_RATE = 120;
  const EFFICIENCY_FACTOR = 0.7;

  // Calculations
  const hoursPerDay = (tasks * duration) / 60;
  const totalHoursYear = hoursPerDay * staff * DAYS_PER_YEAR;
  
  const savedHoursYear = totalHoursYear * EFFICIENCY_FACTOR;
  const savedCHFYear = savedHoursYear * HOURLY_RATE;

  const results = {
    hoursYear: Math.round(savedHoursYear),
    chfYear: Math.round(savedCHFYear),
    hoursMonth: Math.round(savedHoursYear / 12),
    chfMonth: Math.round(savedCHFYear / 12)
  };

  const currentCHF = period === 'yearly' ? results.chfYear : results.chfMonth;
  const currentHours = period === 'yearly' ? results.hoursYear : results.hoursMonth;

  return (
    <div className="w-full max-w-lg mx-auto font-sans text-zinc-200">
      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        {/* Decorative gradient blob */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#facc15]/5 blur-3xl"></div>

        {/* Controls Section */}
        <div className="relative z-10 space-y-8">
          
          {/* Input: Tasks */}
          <div className="group">
            <div className="mb-3 flex items-end justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 transition-colors group-hover:text-zinc-300">
                Repetitive Tasks / Day
              </label>
              <span className="rounded border border-white/5 bg-white/5 px-2 py-1 font-mono text-xs text-white">
                {tasks}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={tasks}
              onChange={(e) => setTasks(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent focus:outline-none [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#facc15] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.5)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />
          </div>

          {/* Input: Duration */}
          <div className="group">
            <div className="mb-3 flex items-end justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 transition-colors group-hover:text-zinc-300">
                Duration / Task (Min)
              </label>
              <span className="rounded border border-white/5 bg-white/5 px-2 py-1 font-mono text-xs text-white">
                {duration} min
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent focus:outline-none [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#facc15] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.5)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />
          </div>

          {/* Input: Staff */}
          <div className="group">
            <div className="mb-3 flex items-end justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 transition-colors group-hover:text-zinc-300">
                Impacted Staff
              </label>
              <span className="rounded border border-white/5 bg-white/5 px-2 py-1 font-mono text-xs text-white">
                {staff}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={staff}
              onChange={(e) => setStaff(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent focus:outline-none [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#facc15] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.5)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
            />
          </div>
        </div>

        {/* Divider with Toggle */}
        <div className="relative my-10 flex items-center justify-center">
          <div className="relative z-10">
            {/* Custom Toggle */}
            <div className="inline-flex rounded-lg border border-white/5 bg-black/40 p-1 backdrop-blur-md">
              <button
                onClick={() => setPeriod('monthly')}
                className={`px-4 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 ${
                  period === 'monthly'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPeriod('yearly')}
                className={`px-4 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-all duration-200 ${
                  period === 'yearly'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="relative z-10 space-y-2 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Potential Savings {period === 'yearly' ? '/ Year' : '/ Month'}
          </p>

          {/* Main Metric (Surgical Yellow) */}
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-2xl font-light text-zinc-600">CHF</span>
            <span className="text-5xl font-bold tracking-tighter text-[#facc15] drop-shadow-[0_0_15px_rgba(250,204,21,0.15)] sm:text-6xl">
              {currentCHF.toLocaleString('de-CH')}
            </span>
          </div>

          {/* Secondary Metric */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
            <svg
              className="h-3 w-3 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-mono text-xs text-zinc-300">
              {currentHours.toLocaleString('de-CH')}h{' '}
              <span className="text-zinc-500">reclaimed</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <button className="group relative mt-10 w-full overflow-hidden rounded-xl bg-white p-4 text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-zinc-200">
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
              Start Discovery Sprint
            </span>
            <svg
              className="h-3 w-3 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              ></path>
            </svg>
          </div>
        </button>
      </div>

      {/* Footer / Disclaimer */}
      <div className="mt-6 space-y-2 text-center">
        <p className="text-[9px] text-zinc-700">
          Based on: <span className="text-zinc-600">220 Days/Year</span> •{' '}
          <span className="text-zinc-600">CHF 120/h Rate</span> •{' '}
          <span className="text-zinc-600">70% AI Efficiency</span>
        </p>
      </div>
    </div>
  );
}
