import React from 'react'
import RevealOnScroll from '../RevealOnScroll'
import LottiePlayer from '../LottiePlayer'

interface CaseStudyHeroProps {
  title: string
  subtitle: string
  imageSrc?: string
  className?: string
}

export default function CaseStudyHero({ title, subtitle, imageSrc, className }: CaseStudyHeroProps) {
  const isLottie = imageSrc?.endsWith('.json');

  return (
    <div className={`w-full relative bg-[#f5f5f5] overflow-hidden ${className ? className : "h-[80vh] min-h-[600px] mb-16"}`}>
      <RevealOnScroll className="w-full h-full">
        {/* Media Content */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center">
          {imageSrc ? (
            isLottie ? (
               <LottiePlayer src={imageSrc} autoplay={true} />
            ) : (
              <img 
                src={imageSrc} 
                alt="Trauffer Project Hero" 
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Abstract representation of devices */}
              <div className="relative w-[60%] h-[60%] bg-gray-300 rounded-lg shadow-2xl transform translate-x-10 translate-y-10 z-10 flex items-center justify-center">
                <span className="text-gray-500 font-mono">MacBook Pro (Desktop)</span>
              </div>
              <div className="absolute left-[15%] bottom-[15%] w-[20%] h-[50%] bg-gray-800 rounded-[3rem] shadow-2xl z-20 flex items-center justify-center border-4 border-gray-700">
                <span className="text-gray-500 font-mono text-xs">iPhone</span>
              </div>
            </div>
          )}
        </div>

        {/* Text overlay — aligned to case study content column */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-8 md:pb-12 md:pt-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
          <div className="max-w-case mx-auto w-full px-4 md:px-6 pointer-events-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  )
}
