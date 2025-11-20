import { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import ProjectListCard from './ProjectListCard';
import type { ProjectCardProps } from './ProjectCard';

interface ProjectsSectionProps {
  projects: ProjectCardProps[];
}

type LayoutType = 'grid' | 'list';

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [hoveredLayout, setHoveredLayout] = useState<LayoutType | null>(null);
  const gridButtonRef = useRef<HTMLButtonElement>(null);
  const listButtonRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Load layout preference from localStorage, but default to grid
  useEffect(() => {
    const savedLayout = localStorage.getItem('projectsLayout') as LayoutType;
    if (savedLayout === 'grid' || savedLayout === 'list') {
      setLayout(savedLayout);
    } else {
      // Always default to grid (card view)
      setLayout('grid');
    }
  }, []);

  // Update indicator position when layout or hover changes
  useEffect(() => {
    const updateIndicatorPosition = () => {
      const activeButton = hoveredLayout 
        ? (hoveredLayout === 'grid' ? gridButtonRef.current : listButtonRef.current)
        : (layout === 'grid' ? gridButtonRef.current : listButtonRef.current);
      
      if (activeButton && indicatorRef.current) {
        const container = activeButton.parentElement;
        if (container) {
          const buttonRect = activeButton.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          indicatorRef.current.style.width = `${buttonRect.width}px`;
          indicatorRef.current.style.height = `${buttonRect.height}px`;
          indicatorRef.current.style.transform = `translateX(${buttonRect.left - containerRect.left}px)`;
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updateIndicatorPosition();
    });
    
    window.addEventListener('resize', updateIndicatorPosition);
    return () => window.removeEventListener('resize', updateIndicatorPosition);
  }, [layout, hoveredLayout]);

  // Save layout preference to localStorage
  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    setHoveredLayout(null); // Clear hover when clicking
    localStorage.setItem('projectsLayout', newLayout);
  };

  return (
    <section id="projects" className="w-full py-16 lg:py-24" style={{ scrollMarginTop: '80px' }}>
      {/* Header with Title and Toggle Buttons */}
      <div className="w-full px-6 mb-16">
        {/* Title and Toggle Buttons - Aligned at Bottom */}
        <div className="flex items-end gap-4 mb-6">
          {/* Large PROJECTS Title */}
          <h2
            className="flex-grow font-light uppercase text-black leading-none tracking-tight text-[clamp(4.5rem,15vw,12rem)]"
            style={{
              letterSpacing: "-0.02em",
              fontWeight: "200",
              lineHeight: "0.9",
              whiteSpace: "nowrap",
              maxWidth: "calc(100% - 136px)", // leave space for toggles + 16px gap
              marginRight: "16px",
            }}
          >
            PROJECTS
          </h2>

          {/* Toggle Buttons */}
          <div className="relative flex gap-3 flex-shrink-0">
            {/* Sliding Background Indicator */}
            <div
              ref={indicatorRef}
              className={`absolute rounded-md transition-all duration-300 ease-out ${
                hoveredLayout !== null
                  ? 'bg-gray-400'
                  : 'bg-black'
              }`}
              style={{
                transitionProperty: 'transform, width, height, background-color',
              }}
            />

            {/* Grid Button */}
            <button
              ref={gridButtonRef}
              type="button"
              onClick={() => handleLayoutChange('grid')}
              onMouseEnter={() => {
                if (layout !== 'grid') {
                  setHoveredLayout('grid');
                }
              }}
              onMouseLeave={() => {
                if (layout !== 'grid') {
                  setHoveredLayout(null);
                }
              }}
              className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-200 p-0.5 ${
                // White only when: selected AND nothing is hovered (has black background)
                // Black in all other cases: unselected, or selected but something else is hovered
                layout === 'grid' && hoveredLayout === null
                  ? 'text-white'
                  : 'text-black'
              }`}
              aria-label="Grid layout"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill={(layout === 'grid' && hoveredLayout === null) ? 'currentColor' : 'none'}
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill={(layout === 'grid' && hoveredLayout === null) ? 'currentColor' : 'none'}
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill={(layout === 'grid' && hoveredLayout === null) ? 'currentColor' : 'none'}
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill={(layout === 'grid' && hoveredLayout === null) ? 'currentColor' : 'none'}
                />
              </svg>
            </button>

            {/* List Button */}
            <button
              ref={listButtonRef}
              type="button"
              onClick={() => handleLayoutChange('list')}
              onMouseEnter={() => {
                if (layout !== 'list') {
                  setHoveredLayout('list');
                }
              }}
              onMouseLeave={() => {
                if (layout !== 'list') {
                  setHoveredLayout(null);
                }
              }}
              className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-200 p-0.5 ${
                // White only when: selected AND nothing is hovered (has black background)
                // Black in all other cases: unselected, or selected but something else is hovered
                layout === 'list' && hoveredLayout === null
                  ? 'text-white'
                  : 'text-black'
              }`}
              aria-label="List layout"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="2.5"
                  rx="1.25"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="2.5"
                  rx="1.25"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="17"
                  width="18"
                  height="2.5"
                  rx="1.25"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Separator Line - Full Width Below */}
        <div className="w-full h-[2px] bg-black"></div>
      </div>

      {/* Project Cards */}
      <div className="w-full px-6">
        {layout === 'grid' ? (
          // Grid Layout - ProjectCard
          <div className="space-y-16">
            {projects.map((project) => (
              <ProjectCard
                key={project.url}
                url={project.url}
                title={project.title}
                clientName={project.clientName}
                imageSrc={project.imageSrc}
                imageAlt={project.imageAlt}
              />
            ))}
          </div>
        ) : (
          // List Layout - ProjectListCard
          <div>
            {projects.map((project) => (
              <ProjectListCard
                key={project.url}
                url={project.url}
                title={project.title}
                clientName={project.clientName}
                imageSrc={project.imageSrc}
                imageAlt={project.imageAlt}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

