import React from 'react'
import RevealOnScroll from '../RevealOnScroll'

interface GalleryBlockProps {
  title: string
  description: string
  imageSrc?: string
  theme: 'light' | 'dark'
  imagePosition: 'left' | 'right'
}

const GalleryBlock = ({ title, description, imageSrc, theme, imagePosition }: GalleryBlockProps) => {
  const isDarkBlock = theme === 'dark'
  // Use specific background for dark block as requested
  const bgColor = isDarkBlock ? 'bg-[#1A1A1A]' : 'bg-transparent'
  const textColor = 'text-white'
  const subTextColor = 'text-white/60'

  return (
    <div className={`w-full ${bgColor} py-20 md:py-32 overflow-hidden transition-colors duration-700 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`flex flex-col gap-12 md:gap-24 items-center ${imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          
          {/* Text Content */}
          <div className="w-full md:w-1/2">
            <RevealOnScroll>
              <div className={`max-w-lg ${imagePosition === 'right' ? 'mr-auto' : 'ml-auto'}`}>
                <h3 className={`text-3xl md:text-5xl font-bold mb-6 ${textColor}`}>
                  {title}
                </h3>
                <p className={`text-lg md:text-xl leading-relaxed ${subTextColor}`}>
                  {description}
                </p>
              </div>
            </RevealOnScroll>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-1/2">
            <RevealOnScroll delay={0.2}>
              <div className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5`}>
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-[#f5f5f5]' : 'bg-[#0f0f0f]'}`}>
                    <span className={`font-mono ${theme === 'light' ? 'text-black/40' : 'text-white/40'}`}>
                      {theme === 'light' ? 'Light UI Mockup' : 'Dark UI Mockup'}
                    </span>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function AlternatingGallery() {
  return (
    <section className="w-full">
      <GalleryBlock 
        title="Heritage & Play"
        description="Focusing on warmth and nostalgia for the wooden toy collection. The interface uses light, airy layouts with generous whitespace to let the craftsmanship shine."
        theme="light"
        imagePosition="right"
      />
      <GalleryBlock 
        title="Sophisticated Stay"
        description="Using deep tones and high-contrast typography to elevate the hotel and dining experience. The dark mode aesthetic creates an intimate, premium atmosphere."
        theme="dark"
        imagePosition="left"
      />
    </section>
  )
}
