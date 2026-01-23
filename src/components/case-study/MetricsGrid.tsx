import React, { useEffect, useRef, useState } from 'react'
import RevealOnScroll from '../RevealOnScroll'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface MetricItemProps {
  value: string
  label: string
  description: string
  delay?: number
}

const CountUp = ({ value, className, delay = 0 }: { value: string, className?: string, delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 })
  const [displayValue, setDisplayValue] = useState("0")

  // Parse the value
  // "25h" -> prefix: "", number: 25, suffix: "h"
  // "05" -> prefix: "0", number: 5, suffix: "" (special case for leading zero)
  // "100%" -> prefix: "", number: 100, suffix: "%"
  
  const parseValue = (val: string) => {
    const match = val.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
    if (!match) return { prefix: "", num: 0, suffix: val, original: val };
    
    let prefix = match[1];
    const num = parseFloat(match[2]);
    const suffix = match[3];
    const original = val;
    
    // Check if original had leading zero and wasn't just "0"
    const hasLeadingZero = match[2].length > 1 && match[2].startsWith('0');
    
    return { prefix, num, suffix, hasLeadingZero };
  };

  const { prefix, num, suffix, hasLeadingZero } = parseValue(value);

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        motionValue.set(num);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, num, motionValue, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      let formattedNum = Math.round(latest).toString();
      if (hasLeadingZero && Math.round(latest) < 10) {
        formattedNum = "0" + formattedNum;
      }
      setDisplayValue(`${prefix}${formattedNum}${suffix}`);
    });
    return unsubscribe;
  }, [springValue, prefix, suffix, hasLeadingZero]);

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

export default function MetricsGrid({ className }: { className?: string }) {
  return (
    <section className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className ? className : "py-12 md:py-24"}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricItem 
          value="25h" 
          label="Turnaround" 
          description="From project takeover to final handoff, delivering a complete redesign under tight constraints."
          delay={0}
        />
        <MetricItem 
          value="05" 
          label="Branches" 
          description="Unified distinct business units under one cohesive digital design system."
          delay={0.1}
        />
        <MetricItem 
          value="100%" 
          label="Dev-Ready" 
          description="Full component library and documentation delivered for immediate implementation."
          delay={0.2}
        />
      </div>
    </section>
  )
}
