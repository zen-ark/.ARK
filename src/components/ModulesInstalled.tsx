import React, { useEffect, useRef, useState } from "react";

interface Module {
  id: string;
  title: string;
  description: string;
  build: string;
  lastRun: string;
}

const modules: Module[] = [
  {
    id: "01",
    title: "Interface Design",
    description: "Product UI, dashboards, systems.",
    build: "v2.4",
    lastRun: "00:43s",
  },
  {
    id: "02",
    title: "Creative Direction",
    description: "Concept, narrative, visual identity.",
    build: "v1.8",
    lastRun: "12:05s",
  },
  {
    id: "03",
    title: "Motion & Interactive",
    description: "Prototyping, transitions, micro-UX.",
    build: "v3.0",
    lastRun: "00:12s",
  },
  {
    id: "04",
    title: "Design Systems",
    description: "Tokens, components, documentation.",
    build: "v2.1",
    lastRun: "04:20s",
  },
  {
    id: "05",
    title: "Brand Design",
    description: "Minimal, digital-first identities.",
    build: "v1.5",
    lastRun: "08:15s",
  },
  {
    id: "06",
    title: "Technical Integration",
    description: "Framer, React, Astro hand-off.",
    build: "v2.9",
    lastRun: "01:30s",
  },
];

type ModuleStatus = "queued" | "installing" | "verified";

interface ActiveModuleCardProps {
  module: Module | null;
  isFinal: boolean;
}

function ActiveModuleCard({ module, isFinal }: ActiveModuleCardProps) {
  if (!module) {
    return (
      <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 p-10 text-center shadow-inner">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-neutral-400">
          System awaiting installation
        </p>
      </div>
    );
  }

  const statusLabel = isFinal ? "VERIFIED" : "INSTALLING…";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_40px_120px_rgba(0,0,0,0.08)] transition-transform duration-500 animate-active-entry">
      {!isFinal && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-60 [animation:activeSweep_1s_ease-out_forwards]" />
        </div>
      )}

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-400">
            Module {module.id}
          </p>
          <h3 className="mt-2 text-3xl font-semibold uppercase tracking-tight text-neutral-900 md:text-4xl">
            {module.title}
          </h3>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.4em]">
          <span className={`text-sm ${isFinal ? "text-[#3BD58B]" : "text-neutral-500"}`}>{statusLabel}</span>
          <span
            className={`relative h-3 w-3 rounded-full ${
              isFinal ? "bg-[#3BD58B]" : "bg-[#3BD58B] shadow-[0_0_12px_#3BD58B]"
            }`}
          >
            {!isFinal && (
              <span className="absolute inset-0 animate-ping rounded-full bg-[#3BD58B]/60"></span>
            )}
          </span>
        </div>
      </header>

      <p className="mb-6 text-base leading-relaxed text-neutral-600 md:text-lg">{module.description}</p>

      {!isFinal && (
        <div className="mb-6 space-y-1 font-mono text-[11px] text-neutral-500">
          <div className="flex items-center gap-2 text-[#3BD58B]">
            <span className="text-base leading-none">›</span>
            <span className="text-neutral-500">validating checksum…</span>
          </div>
          <div className="flex items-center gap-2 text-[#3BD58B]">
            <span className="text-base leading-none">›</span>
            <span className="text-neutral-500">allocating resources…</span>
          </div>
        </div>
      )}

      <footer className="flex flex-wrap gap-4 border-t border-neutral-100 pt-4 font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-400">
        <span>Build {module.build}</span>
        <span className="ml-auto">Last Run {module.lastRun}</span>
      </footer>
    </div>
  );
}

interface HistoryItemProps {
  module: Module;
  isNewest: boolean;
}

function HistoryItem({ module, isNewest }: HistoryItemProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border border-neutral-200/70 bg-white/60 px-4 py-3 text-xs font-mono uppercase tracking-[0.4em] text-neutral-400 transition-all duration-500 hover:border-neutral-400 hover:bg-white ${
        isNewest ? "history-enter shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-[11px] text-neutral-500">
          {module.id}
        </div>
        <div className="hidden text-[10px] text-neutral-500 sm:block">{module.title}</div>
      </div>
      <div className="flex items-center gap-2 text-[#3BD58B]">
        <span className="text-[10px] tracking-[0.4em]">VERIFIED</span>
        <span className="h-2 w-2 rounded-full bg-[#3BD58B]" />
      </div>
    </div>
  );
}

export default function ModulesInstalled() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const anchorsWrapperRef = useRef<HTMLDivElement>(null);
  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [lastStackedId, setLastStackedId] = useState<string | null>(null);
  const prevActiveRef = useRef(-1);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const viewportHeight = window.innerHeight;
      const anchors = anchorRefs.current;

      let nextActive = -1;
      const triggerLine = viewportHeight * 0.45;

      anchors.forEach((anchor, index) => {
        if (!anchor) return;
        const rect = anchor.getBoundingClientRect();
        if (rect.top <= triggerLine) {
          nextActive = index;
        }
      });

      if (nextActive >= modules.length) nextActive = modules.length - 1;
      setActiveIndex(nextActive);

      if (anchorsWrapperRef.current) {
        const wrapperRect = anchorsWrapperRef.current.getBoundingClientRect();
        const totalScrollable = Math.max(wrapperRect.height - viewportHeight, 1);
        const scrolled = Math.min(Math.max(-wrapperRect.top, 0), totalScrollable);
        setProgress(scrolled / totalScrollable);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const prevIndex = prevActiveRef.current;

    if (activeIndex === -1) {
      setHistory([]);
      prevActiveRef.current = -1;
      return;
    }

    if (prevIndex === activeIndex) return;

    setHistory((prev) => {
      let nextHistory = prev;

      if (prevIndex > -1 && activeIndex > prevIndex) {
        if (!prev.includes(prevIndex)) {
          nextHistory = [...prev, prevIndex];
          setLastStackedId(modules[prevIndex].id);
        }
      }

      if (activeIndex < prevIndex) {
        nextHistory = prev.filter((idx) => idx < activeIndex);
      }

      return nextHistory;
    });

    prevActiveRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!lastStackedId) return;
    const timer = setTimeout(() => setLastStackedId(null), 800);
    return () => clearTimeout(timer);
  }, [lastStackedId]);

  const activeModule = activeIndex >= 0 ? modules[activeIndex] : null;
  const isFinalActive =
    activeIndex === modules.length - 1 && history.length === modules.length - 1;

  const historyItems = [...history].sort((a, b) => a - b);

  return (
    <>
      <section
        ref={sectionRef}
        id="modules-installed"
        className="relative w-full bg-white text-black pt-[20vh]"
      >
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-12">
          {/* Left Console */}
          <div className="relative col-span-1 border-b border-neutral-200 bg-white/95 backdrop-blur-sm md:sticky md:top-0 md:col-span-4 md:h-screen md:border-b-0 md:border-r">
            <div className="flex h-full flex-col justify-between px-6 pt-[120px] md:px-12">
              <div
                className="w-full border-t border-black/10 pt-4"
                style={{ marginTop: "16px" }}
              >
                <div className="mb-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.4em] text-neutral-500 md:mb-8">
                  <span>SYSTEM / MODULES</span>
                  <span>
                    INSTALLING /{" "}
                    {activeIndex > -1 ? `${Math.min(activeIndex + 1, modules.length)}` : "--"}
                  </span>
                </div>

                <div className="mb-8">
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400">
                    <span>Progress</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full bg-black transition-all duration-300 ease-out"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                </div>

                <div
                  ref={titleRef}
                  className="mb-8 w-full"
                >
                  <img
                    src="/The Ark Model.svg"
                    alt="The Ark Model"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div
                className={`hidden pb-12 transition-opacity duration-500 md:block ${
                  activeIndex > -1 ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="mb-4 border-l-2 border-[#3BD58B] pl-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-500">
                    Active Module
                  </p>
                  <div className="text-lg font-bold uppercase leading-tight md:text-xl">
                    {activeModule?.title || "Waiting..."}
                  </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-500">
                  <span>Status:</span>
                  <span className="flex items-center gap-2 text-[#3BD58B]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3BD58B] opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3BD58B]"></span>
                    </span>
                    INSTALLING…
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area */}
          <div className="relative col-span-1 md:col-span-8">
            <div className="sticky top-0 space-y-10 pb-12 pt-[120px]">
              <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6">
                <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-500">
                  <span>History</span>
                  <span>{history.length} / {modules.length - 1}</span>
                </div>
                <div className="space-y-3">
                  {historyItems.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.4em] text-neutral-400">
                      No installations logged yet
                    </div>
                  )}
                  {historyItems.map((idx) => (
                    <HistoryItem
                      key={modules[idx].id}
                      module={modules[idx]}
                      isNewest={modules[idx].id === lastStackedId}
                    />
                  ))}
                </div>
              </div>

              <ActiveModuleCard module={activeModule} isFinal={isFinalActive} />
            </div>

            <div ref={anchorsWrapperRef} className="mt-20 space-y-0 opacity-0">
              {modules.map((module, index) => (
                <div
                  key={`anchor-${module.id}`}
                  ref={(el) => (anchorRefs.current[index] = el)}
                  className="h-[120vh]"
                />
              ))}
              <div className="h-[40vh]" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes activeSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes activeEntry {
          0% { opacity: 0; transform: translateY(48px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes historyEnter {
          0% { opacity: 0; transform: translateY(16px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .history-enter {
          animation: historyEnter 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .animate-active-entry {
          animation: activeEntry 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
      `}</style>
    </>
  );
}
