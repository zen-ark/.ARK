import React, { useEffect, useRef, useState } from 'react'
import RevealOnScroll from '../RevealOnScroll'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface MetricItemProps {
  value: string
  label: string
  description: string
  delay?: number
}

export interface MetricData {
  value: string;
  label: string;
  description: string;
}

const parseValue = (val: string) => {
  const match = val.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return { prefix: "", num: 0, suffix: val, original: val, isNumeric: false };
  
  let prefix = match[1];
  const num = parseFloat(match[2]);
  const suffix = match[3];
  
  // Check if original had leading zero and wasn't just "0"
  const hasLeadingZero = match[2].length > 1 && match[2].startsWith('0');
  
  return { prefix, num, suffix, hasLeadingZero, isNumeric: true };
};

const formatFinalValue = (value: string) => {
  const { prefix, num, suffix, hasLeadingZero, isNumeric } = parseValue(value);
  if (!isNumeric) return value;
  let formatted = Math.round(num).toString();
  if (hasLeadingZero && Math.round(num) < 10) {
    formatted = "0" + formatted;
  }
  return `${prefix}${formatted}${suffix}`;
};

const CountUp = ({ value, className, delay = 0 }: { value: string, className?: string, delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 })

  const { prefix, num, suffix, hasLeadingZero, isNumeric } = parseValue(value);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [displayValue, setDisplayValue] = useState(() =>
    isNumeric ? (prefersReducedMotion ? formatFinalValue(value) : "0") : value
  );

  useEffect(() => {
    if (!isNumeric) {
      if (displayValue !== value) setDisplayValue(value);
      return;
    }

    if (prefersReducedMotion) {
      setDisplayValue(formatFinalValue(value));
      return;
    }

    if (isInView) {
      const timeoutId = setTimeout(() => {
        motionValue.set(num);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }

    const fallbackId = setTimeout(() => {
      motionValue.set(num);
      setDisplayValue((prev) => (prev === "0" ? formatFinalValue(value) : prev));
    }, 2500 + delay * 1000);
    return () => clearTimeout(fallbackId);
  }, [isInView, num, motionValue, delay, isNumeric, value, displayValue, prefersReducedMotion]);

  useEffect(() => {
    if (!isNumeric) return;

    const unsubscribe = springValue.on("change", (latest) => {
      let formattedNum = Math.round(latest).toString();
      if (hasLeadingZero && Math.round(latest) < 10) {
        formattedNum = "0" + formattedNum;
      }
      setDisplayValue(`${prefix}${formattedNum}${suffix}`);
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, hasLeadingZero, isNumeric]);

  return <span ref={ref} className={className}>{displayValue}</span>
}

const MetricItem = ({ value, label, description, delay = 0 }: MetricItemProps) => (
  <RevealOnScroll delay={delay} className="flex flex-col items-start p-8 bg-white/5 border border-white/10 rounded-2xl h-full">
    <CountUp 
      value={value} 
      className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter"
      delay={0.8}
    />
    <h4 className="text-lg font-mono uppercase tracking-wider text-white/60 mb-2">
      {label}
    </h4>
    <p className="text-base text-white/80 leading-relaxed">
      {description}
    </p>
  </RevealOnScroll>
)

export default function MetricsGrid({ className, items }: { className?: string, items?: MetricData[] }) {
  const defaultItems: MetricData[] = [
    { 
      value: "25h", 
      label: "Turnaround", 
      description: "From project takeover to final handoff, delivering a complete redesign under tight constraints." 
    },
    { 
      value: "42", 
      label: "Pages Architected", 
      description: "Converting a stalled project into a comprehensive 42-page high-fidelity prototype." 
    },
    { 
      value: "05", 
      label: "Business Units", 
      description: "Unified the Shop, Hotel, Restaurant, Events, and HQ under one system." 
    }
  ];

  const displayItems = items || defaultItems;

  return (
    <section className={`w-full max-w-case mx-auto px-4 md:px-6 ${className ? className : "py-12 md:py-24"}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayItems.map((item, index) => (
          <MetricItem 
            key={index}
            value={item.value}
            label={item.label}
            description={item.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  )
}
