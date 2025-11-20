export interface ProjectListCardProps {
  url: string;
  title: string;
  clientName?: string;
  imageSrc: string;
  imageAlt?: string;
  onSelect?: () => void;
}

export default function ProjectListCard({
  url,
  title,
  clientName,
  imageSrc,
  imageAlt,
  onSelect,
}: ProjectListCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect?.();
  };

  return (
    <div className="w-full border-b-2 border-black">
      <a
        href={url}
        onClick={handleClick}
        className="flex items-center gap-6 md:gap-10 py-8 md:py-12 group cursor-pointer"
        aria-label={`View project: ${title}${clientName ? ` for ${clientName}` : ""}`}
      >
        {/* Small Image with Rounded Corner */}
        <div className="flex-shrink-0 w-40 md:w-56 lg:w-64 h-28 md:h-36 lg:h-40 relative">
          <div className="w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-white">
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
          <div className="flex flex-col items-start gap-3 md:gap-4 min-w-0">
            {/* Client Name Badge */}
            {clientName && (
              <span
                className="inline-block px-4 md:px-5 py-2 md:py-2.5 rounded-full text-black text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap border-2 border-black flex-shrink-0"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  background: "transparent",
                }}
              >
                {clientName}
              </span>
            )}

            {/* Project Title */}
            <h3
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight uppercase text-black leading-none"
              style={{
                letterSpacing: "-0.025em",
                fontWeight: "200",
              }}
            >
              {title}
            </h3>
          </div>

          {/* Arrow Button */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-black flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

