import React from 'react';
import RevealOnScroll from '../RevealOnScroll';
import LottiePlayer from '../LottiePlayer';

interface CaseStudyHeaderProps {
  label?: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
  clientName?: string;
  services?: string[];
  tech?: string[];
  liveUrl?: string;
  className?: string;
}

export default function CaseStudyHeader({
  label,
  title,
  subtitle,
  imageSrc,
  clientName,
  services,
  tech,
  liveUrl,
  className,
}: CaseStudyHeaderProps) {
  const isLottie = imageSrc?.endsWith('.json');
  const isVideo = imageSrc?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className={`w-full relative bg-[#111] overflow-hidden ${className ? className : "h-[80vh] min-h-[600px] mb-16"}`}>
      <RevealOnScroll className="w-full h-full">
        {/* Background Visual */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center">
          {imageSrc ? (
            isLottie ? (
              <div className="w-full h-full opacity-60">
                 <LottiePlayer src={imageSrc} autoplay={true} />
              </div>
            ) : isVideo ? (
              <video
                src={imageSrc?.replace(/ /g, '%20')}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover opacity-60"
              />
            ) : (
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover opacity-60"
              />
            )
          ) : (
            <div className="relative w-full h-full bg-[#111]" />
          )}
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10">
          <div className="max-w-7xl">
            {label && (
              <div className="mb-4">
                <span className="text-sm md:text-base font-mono uppercase tracking-wider text-white/50 border border-white/20 px-3 py-1 rounded-full">
                  {label}
                </span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              {title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mb-8 leading-relaxed">
              {subtitle}
            </p>

            {liveUrl && (
              <div className="mb-12">
                <a 
                  href={liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                >
                  Visit Live Site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-white/10 pt-8">
              {clientName && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-2">Client</h3>
                  <p className="text-white text-base">{clientName}</p>
                </div>
              )}
              
              {services && services.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service, idx) => (
                      <span key={idx} className="text-white text-base">
                        {service}{idx < services.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tech && tech.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-2">Tech</h3>
                  <div className="flex flex-wrap gap-2">
                    {tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-white/90 text-sm border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
