import React from 'react'
import RevealOnScroll from '../RevealOnScroll'

export interface SitemapNode {
  label: string;
  children?: string[];
}

interface IARestructureProps {
  title: string
  description: string
  imageSrc?: string
  seniorNote?: string
  data?: SitemapNode[]
}

interface NodeProps {
  label: string
  children?: string[]
  delay?: number
  isFirst?: boolean
  isLast?: boolean
}

const BranchNode = ({ label, children, delay = 0, isFirst, isLast }: NodeProps) => (
  <RevealOnScroll delay={delay} className="flex flex-col items-center min-w-[120px] flex-1 relative px-2">
    
    {/* Horizontal Connector Line for Tree Structure */}
    {/* We use pseudo-elements simulation with divs to ensure lines connect perfectly to centers */}
    <div className="absolute top-0 left-0 right-0 h-px">
        {/* Left half - hide if first */}
        {!isFirst && (
            <div className="absolute top-0 left-0 w-1/2 h-full bg-white/20"></div>
        )}
        {/* Right half - hide if last */}
        {!isLast && (
            <div className="absolute top-0 right-0 w-[calc(50%+1px)] h-full bg-white/20"></div>
        )}
    </div>

    {/* Vertical Connector Line Top */}
    <div className="h-6 w-px bg-white/20 mb-0 relative">
        {/* Dot at intersection */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.5)]"></div>
    </div>
    
    {/* Level 1 Node */}
    <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 rounded-lg text-center mb-3 transition-colors duration-300">
      <span className="text-xs font-semibold text-white tracking-wide block truncate">{label}</span>
    </div>

    {/* Children Nodes */}
    {children && children.length > 0 && (
      <div className="w-full flex flex-col gap-1.5 relative">
        {/* Connector Line Down to Children Group */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-white/20"></div>
        
        {children.map((child, idx) => (
          <div key={idx} className="bg-black/40 border border-white/10 py-1.5 px-2 rounded text-center transition-colors">
            <span className="text-[10px] text-white/70 block truncate">{child}</span>
          </div>
        ))}
      </div>
    )}
  </RevealOnScroll>
)

export default function IARestructure({ title, description, imageSrc, seniorNote, data }: IARestructureProps) {
  
  const defaultSitemapData = [
    {
      label: "Shop",
      children: []
    },
    {
      label: "Wooden Toys",
      children: ["Manufactory", "Brands", "Sustainability"]
    },
    {
      label: "Experience World",
      children: ["Cow Universe", "Flagship Store"]
    },
    {
      label: "Bretterhotel",
      children: ["Rooms", "Your Stay", "Offers", "Excursions"]
    },
    {
      label: "Restaurants",
      children: ["Alfred's", "Rosa's Bistro"]
    },
    {
      label: "Events & Seminars",
      children: ["Seminars", "Groups", "Occasions", "Social Program"]
    },
    {
      label: "About Us",
      children: ["History", "Team", "Careers", "Contact"]
    }
  ];

  const sitemapData = data || defaultSitemapData;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 bg-transparent">
      <RevealOnScroll>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.2}>
        <div className="w-full bg-[#111] rounded-xl p-8 border border-white/10 shadow-2xl overflow-x-auto mb-12">
            {/* Sitemap Container */}
            <div className="min-w-[800px] flex flex-col items-center">
                
                {/* Root Node */}
                <div className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base mb-0 z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Home
                </div>

                {/* Root Connector */}
                <div className="h-6 w-px bg-white/20"></div>
                
                {/* Branches Container */}
                <div className="flex justify-between w-full pt-0 relative">
                    {/* Note: The horizontal connecting line is now handled by each BranchNode */}
                    
                    {sitemapData.map((branch, idx) => (
                        <BranchNode 
                            key={idx} 
                            label={branch.label} 
                            children={branch.children} 
                            delay={0.1 * idx}
                            isFirst={idx === 0}
                            isLast={idx === sitemapData.length - 1}
                        />
                    ))}
                </div>
            </div>
            
            <div className="mt-6 text-center md:hidden">
                <span className="text-white/30 text-[10px] uppercase tracking-widest">Scroll to explore →</span>
            </div>
        </div>
      </RevealOnScroll>

      {seniorNote && (
        <RevealOnScroll delay={0.3}>
          <div className="max-w-3xl mx-auto bg-blue-500/10 border-l-4 border-blue-500 p-6 md:p-8 rounded-r-lg">
            <h4 className="text-blue-400 font-mono text-sm uppercase tracking-wider mb-2">Senior Note</h4>
            <p className="text-white/80 italic text-lg leading-relaxed">
              "{seniorNote}"
            </p>
          </div>
        </RevealOnScroll>
      )}
    </section>
  )
}
