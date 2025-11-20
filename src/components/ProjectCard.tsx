import { useRef, useEffect, useState } from 'react';

export interface ProjectCardProps {
  url: string;
  title: string;
  clientName?: string;
  imageSrc: string;
  imageAlt?: string;
  onClose?: () => void;
}

export default function ProjectCard({
  url,
  title,
  clientName,
  imageSrc,
  imageAlt,
  onClose,
}: ProjectCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const [titleCenterY, setTitleCenterY] = useState(0);
  const [titleDimensions, setTitleDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    const updateTitleMeasurements = () => {
      if (titleRef.current && titleContainerRef.current && containerRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const titleContainerRect = titleContainerRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const titleCenter = titleRect.height / 2;
        setTitleCenterY(titleCenter);
        // Use the container div dimensions, not the text element
        setTitleDimensions({
          width: titleContainerRect.width,
          height: titleContainerRect.height,
          x: titleContainerRect.left - containerRect.left,
          y: titleContainerRect.top - containerRect.top,
        });
      }
    };

    const timeoutId = setTimeout(updateTitleMeasurements, 0);
    window.addEventListener('resize', updateTitleMeasurements);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateTitleMeasurements);
    };
  }, [title]);

  return (
    <a
      ref={containerRef}
      href={url}
      className="relative block w-full rounded-[16px] bg-white focus-ring overflow-hidden"
      aria-label={`View project: ${title}${clientName ? ` for ${clientName}` : ""}`}
      style={{
        aspectRatio: "16/9",
        maxHeight: "60vh",
      }}
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={imageAlt || title}
        className="w-full h-full object-cover rounded-[24px]"
      />

      {/* Project Title - Black text on white background (cutout area) */}
      <div ref={titleContainerRef} className="absolute top-0 left-0 z-10 bg-white px-5 py-2.5" style={{ backgroundColor: 'white', position: 'absolute', borderRadius: '0 0 24px 0' }}>
        <h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight uppercase text-black leading-none m-0"
          style={{
            letterSpacing: "-0.025em",
            fontWeight: "200",
          }}
        >
          {title}
        </h2>

        {/* Add.svg - Top Right Corner (curved cutout at top-right of title) */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            top: '0px',
            right: '-24px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0C10.7452 1.24236e-06 1.15877e-06 10.7452 0 24V0H24Z" fill="white"/>
          </svg>
        </div>

        {/* Add.svg - Bottom Left (curved cutout at bottom-left of title) */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            bottom: '-24px',
            left: '0px',
            transformOrigin: 'center center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0C10.7452 1.24236e-06 1.15877e-06 10.7452 0 24V0H24Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Client Name Badge - White border only, Geist Mono font */}
      {clientName && (
        <div 
          className="absolute right-6 md:right-10 z-10"
          style={{
            top: `${titleCenterY}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <span
            className="inline-block px-5 py-2.5 rounded-full text-white text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap border-2 border-white"
            style={{
              fontFamily: "'Geist Mono', monospace",
              background: "transparent",
            }}
          >
            {clientName}
          </span>
        </div>
      )}

      {/* Arrow Button - 2.4x size from list view with blend mode difference */}
      <div 
        className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 pointer-events-none w-[96px] h-[96px] md:w-[115px] md:h-[115px] rounded-full border-[4px] md:border-[5px] border-white flex items-center justify-center"
        style={{
          mixBlendMode: 'difference',
        }}
      >
        <svg
          className="w-[48px] h-[48px] md:w-[58px] md:h-[58px]"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 left-6 md:top-10 md:left-10 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 text-white flex items-center justify-center hover:bg-black/90 transition-colors focus-ring"
          aria-label="Close detail view"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </a>
  );
}
