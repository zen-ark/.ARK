import { useEffect, useRef, useState } from "react";
import styles from "./ProjectCard.module.css";

export type ProjectCardProps = {
  url: string;
  title: string;
  tags: string[];
  cover: string;
  coverAlt?: string;
  accent?: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(m.matches);
    set();
    m.addEventListener?.("change", set);
    return () => m.removeEventListener?.("change", set);
  }, []);
  return reduced;
}

export default function ProjectCard({ url, title, tags, cover, coverAlt, accent }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = mediaRef.current as HTMLVideoElement | null;
    if (!video || video.tagName !== "VIDEO") return;
    if (hovered || inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hovered, inView]);

  const ringColor = accent ?? "var(--color-primary, #fff)";

  return (
    <a
      href={url}
      aria-label={`Open project: ${title}`}
      className="group relative block rounded-[var(--radius-2xl,28px)] overflow-hidden border border-white/20 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{
        willChange: "transform, opacity",
        transform: !reduced ? undefined : "none",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-md)",
        // @ts-ignore
        "--tw-ring-color": ringColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative aspect-[16/9] md:aspect-[2/1] xl:aspect-[2/1] w-full bg-black">
        {cover.endsWith(".mp4") ? (
          <video
            ref={mediaRef as any}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={cover} type="video/mp4" />
          </video>
        ) : (
          <img
            ref={mediaRef as any}
            src={cover}
            alt={coverAlt || title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            onError={(e) => {
              const idx = Math.floor(Math.random() * 3) + 1;
              (e.currentTarget as HTMLImageElement).src = `/images/placeholders/laptop-${idx}.png`;
            }}
          />
        )}

        {/* Chips */}
        {tags?.length > 0 && (
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5 flex flex-wrap gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            {tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full border border-white/30 text-[11px] leading-none bg-black/30 backdrop-blur-[2px] text-white"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Title with staggering effect */}
        <div className="absolute left-4 bottom-4 sm:left-5 sm:bottom-5 pointer-events-none select-none">
          <h3 className={`${styles.projectItemLine2} m-0 text-white font-semibold tracking-tight text-[clamp(22px,3vw,36px)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]`}>
            <div className={styles.projectItemLine2Inner}>
              {title.split("").map((char, index) => {
                // Handle spaces as width spacers
                if (char === " ") {
                  return (
                    <div
                      key={`space-${index}`}
                      className={styles.projectItemLine2InnerList}
                      style={{ width: "0.3em" }}
                    >
                      <span> </span>
                    </div>
                  );
                }
                return (
                  <div
                    key={`char-${index}`}
                    className={styles.projectItemLine2InnerList}
                  >
                    <span>{char}</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.projectItemLine2Icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </h3>
          <p className="m-0 mt-1 text-white/70 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* optional excerpt slot via parent can be added later */}
          </p>
        </div>
      </div>
    </a>
  );
}


