import React from 'react'
import RevealOnScroll from '../RevealOnScroll'
import { isValidReactNode } from '@/lib/react-utils'

interface CaseStudyConclusionProps {
  heading: string
  children: React.ReactNode
}

export default function CaseStudyConclusion({ heading, children }: CaseStudyConclusionProps) {
  // Guard against error objects from Astro MDX rendering
  if (!isValidReactNode(children)) {
    console.error('CaseStudyConclusion received invalid children (likely an error object from Astro)');
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-32 text-center">
      <RevealOnScroll>
        <h2 className="text-sm md:text-base font-mono uppercase tracking-wider text-white/50 mb-6">
          {heading}
        </h2>
        <div className="text-2xl md:text-4xl font-medium text-white leading-tight">
          {children}
        </div>
      </RevealOnScroll>
    </section>
  )
}
