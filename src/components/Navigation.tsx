import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./navigation.module.css";

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MENU_CLOSE_MS = 320;
const OPEN_DURATION = 720;
const CLOSE_DURATION = 600;
const OPEN_STAGGER = 100;
const TOGGLE_OPEN_LABEL_MS = 520;
const TOGGLE_CLOSE_LABEL_MS = 300;

const DEFAULT_LINKS = [
  { href: "/", label: "Home" },
  { href: "#what-the-ark", label: "WHATS ARK" },
  { href: "/projects", label: "Projects" },
  { href: "#how-ark", label: "HOW ARK" },
  { href: "#behind-ark", label: "BEHIND ARK" },
  { href: "/contact", label: "Contact" },
];

const DEFAULT_TALK_HREF = "mailto:hello@zen.ark";
const DEFAULT_LOGO_LINES = ["Coding", "Portfolio"];

interface Link {
  href: string;
  label: string;
}

interface Props {
  projects?: Link[];
  primaryLinks?: Link[];
  talkHref?: string;
  logoLines?: string[];
  activePath?: string;
}

type GroupKey = "nav" | "projects" | "cta";

const groupOrder: GroupKey[] = ["nav", "projects", "cta"];
const groupTransforms: Record<GroupKey, { translate: number; rotate: number; closeTranslate: number; scale: number }> = {
  nav: { translate: 22, rotate: 2.5, closeTranslate: 16, scale: 0.996 },
  projects: { translate: 26, rotate: -2.5, closeTranslate: 18, scale: 0.996 },
  cta: { translate: 30, rotate: 2, closeTranslate: 22, scale: 0.994 },
};

export default function Navigation({
  projects = [],
  primaryLinks,
  talkHref = DEFAULT_TALK_HREF,
  logoLines = DEFAULT_LOGO_LINES,
  activePath = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [panelOffset, setPanelOffset] = useState(0);
  const [panelRight, setPanelRight] = useState<number | null>(null);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);
  const [togglePhase, setTogglePhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [toggleLabelWidth, setToggleLabelWidth] = useState<number | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const talkBtnRef = useRef<HTMLAnchorElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const menuLabelRef = useRef<HTMLSpanElement | null>(null);
  const closeLabelRef = useRef<HTMLSpanElement | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const measureToggleLabel = useCallback(() => {
    if (!menuLabelRef.current || !closeLabelRef.current) return;
    const menuRect = menuLabelRef.current.getBoundingClientRect();
    const closeRect = closeLabelRef.current.getBoundingClientRect();
    const nextWidth = Math.ceil(Math.max(menuRect.width, closeRect.width));
    setToggleLabelWidth((prev) => (prev === nextWidth ? prev : nextWidth));
  }, []);

  useSafeLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    measureToggleLabel();
    window.addEventListener("resize", measureToggleLabel);

    let cancelled = false;
    if (typeof document !== "undefined") {
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (fonts?.ready) {
        fonts.ready
          .then(() => {
            if (!cancelled) measureToggleLabel();
          })
          .catch(() => undefined);
      }
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", measureToggleLabel);
    };
  }, [measureToggleLabel]);

  useEffect(() => {
    if (isClosing) {
      setTogglePhase("closing");
      return;
    }

    if (open) {
      setTogglePhase("opening");
    } else {
      setTogglePhase("closed");
    }
  }, [open, isClosing]);

  useEffect(() => {
    if (togglePhase === "opening") {
      const timer = window.setTimeout(() => setTogglePhase("open"), TOGGLE_OPEN_LABEL_MS);
      return () => window.clearTimeout(timer);
    }

    if (togglePhase === "closing") {
      const timer = window.setTimeout(() => setTogglePhase("closed"), TOGGLE_CLOSE_LABEL_MS);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [togglePhase]);

  const navLinks = useMemo(() => (primaryLinks?.length ? primaryLinks : DEFAULT_LINKS), [primaryLinks]);
  const projectsLinks = projects;
  const groupCount = projectsLinks.length ? 3 : 2;

  const activeIndex = useMemo(() => {
    // Check if we're on a project subpage - if so, mark Projects as active
    if (activePath.startsWith("/projects/") || activePath.startsWith("/de/projects/")) {
      const projectsMatch = navLinks.findIndex((link) => 
        link.href === "/projects" || link.href === "/de/projects"
      );
      if (projectsMatch >= 0) return projectsMatch;
    }
    
    // Check for hash-based active state
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const hashMatch = navLinks.findIndex((link) => link.href === hash);
        if (hashMatch >= 0) return hashMatch;
      }
    }
    // Fall back to pathname-based matching
    const match = navLinks.findIndex((link) => link.href === activePath);
    return match >= 0 ? match : 0;
  }, [navLinks, activePath]);
  const activeHref = navLinks[activeIndex]?.href || null;

  useEffect(() => {
    if (open && !isClosing) {
      const timer = window.setTimeout(() => setInteractive(true), OPEN_DURATION);
      return () => window.clearTimeout(timer);
    }
    setInteractive(false);
    return undefined;
  }, [open, isClosing]);

  function handleClose() {
    if (isClosing || !open) return;
    setHoveredHref(null);
    setIsClosing(true);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      toggleRef.current?.focus();
    }, MENU_CLOSE_MS);
  }

  function openMenu() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    setHoveredHref(null);
    setOpen(true);
  }

  function toggleMenu() {
    if (open && !isClosing) handleClose();
    else if (!open) openMenu();
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open && !isClosing) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isClosing]);

  useEffect(() => {
    if (!open) return;
    const getFocusables = () =>
      Array.from(overlayRef.current?.querySelectorAll<HTMLElement>("a,button,[tabindex]:not([tabindex='-1'])") || []);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = getFocusables();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    (firstLinkRef.current || getFocusables()[0])?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function onOverlayClick(event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    if (!interactive) return;
    if (target === overlayRef.current || target.classList.contains(styles.underlay)) handleClose();
  }

  useEffect(() => {
    if (!open) return;

    function computeOffsets() {
      const headerHeight = headerRef.current?.getBoundingClientRect().height || 0;
      const root = document.documentElement;
      const gapToken = getComputedStyle(root).getPropertyValue("--space-8").trim();
      void gapToken;
      setPanelOffset(headerHeight);

      const toggleRect = toggleRef.current?.getBoundingClientRect();
      const talkBtnRect = talkBtnRef.current?.getBoundingClientRect();
      
      if (toggleRect) {
        const offset = window.innerWidth - toggleRect.right;
        setPanelRight(Math.max(offset, 16));
        
        // Calculate width from CTA button left to toggle button right
        if (talkBtnRect) {
          const width = toggleRect.right - talkBtnRect.left;
          setPanelWidth(width);
        } else {
          setPanelWidth(null);
        }
      } else {
        setPanelRight(null);
        setPanelWidth(null);
      }
    }
    computeOffsets();
    const resizeObserver = new ResizeObserver(computeOffsets);
    if (headerRef.current) resizeObserver.observe(headerRef.current);
    window.addEventListener("resize", computeOffsets);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", computeOffsets);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (!interactive) return;
      const target = event.target as Node;
      if (!overlayRef.current || !panelRef.current) return;
      if (panelRef.current.contains(target) || toggleRef.current?.contains(target)) return;
      handleClose();
    };

    const onScroll = () => {
      if (!interactive) return;
      handleClose();
    };

    document.addEventListener("mousedown", onDocumentClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, isClosing, interactive]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  const logoHref = navLinks[0]?.href || "/";

  const computeDelay = (order: number, extra = 0) => {
    const value = isClosing ? (groupCount - order - 1) * OPEN_STAGGER : order * OPEN_STAGGER;
    return `${value + extra}ms`;
  };

  const menuStyle = {
    ["--panel-offset" as any]: `${panelOffset}px`,
    ...(panelRight !== null ? { ["--panel-right" as any]: `${panelRight}px` } : {}),
    ...(panelWidth !== null ? { ["--panel-width" as any]: `${panelWidth}px` } : {}),
  } as React.CSSProperties;

  const toggleLabelStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (toggleLabelWidth === null) return undefined;
    return { ["--toggle-label-width" as any]: `${toggleLabelWidth}px` } as React.CSSProperties;
  }, [toggleLabelWidth]);

  const navGroupStyle = {
    ["--delay" as any]: computeDelay(0),
    ["--group-translate" as any]: `${groupTransforms.nav.translate}px`,
    ["--group-close" as any]: `${groupTransforms.nav.closeTranslate}px`,
    ["--group-rotate" as any]: `${groupTransforms.nav.rotate}deg`,
    ["--group-scale" as any]: groupTransforms.nav.scale,
    pointerEvents: !isClosing && interactive ? "auto" : "none",
  } as React.CSSProperties;

  const projectsGroupStyle = {
    ["--delay" as any]: computeDelay(1),
    ["--group-translate" as any]: `${groupTransforms.projects.translate}px`,
    ["--group-close" as any]: `${groupTransforms.projects.closeTranslate}px`,
    ["--group-rotate" as any]: `${groupTransforms.projects.rotate}deg`,
    ["--group-scale" as any]: groupTransforms.projects.scale,
    pointerEvents: !isClosing && interactive ? "auto" : "none",
  } as React.CSSProperties;

  const ctaGroupStyle = {
    ["--delay" as any]: computeDelay(groupCount - 1, 40),
    ["--group-translate" as any]: `${groupTransforms.cta.translate}px`,
    ["--group-close" as any]: `${groupTransforms.cta.closeTranslate}px`,
    ["--group-rotate" as any]: `${groupTransforms.cta.rotate}deg`,
    ["--group-scale" as any]: groupTransforms.cta.scale,
    pointerEvents: !isClosing && interactive ? "auto" : "none",
  } as React.CSSProperties;

  useEffect(() => {
    setHoveredHref(null);
  }, [open]);

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${open ? styles.headerOpen : ""}`}>
        <div className={styles.headerInner}>
          <a className={styles.logo} href={logoHref} aria-label="Go to home page">
            {logoLines.map((line, index) => (
              <span className={styles.logoWord} key={`${line}-${index}`}>
                {line}
              </span>
            ))}
          </a>

          <div className={styles.headerCenter} aria-hidden="true" />

          <div className={styles.headerRight}>
            <a ref={talkBtnRef} className={`${styles.headerPill} ${styles.talkBtn}`} href={talkHref}>
              <span className={styles.talkSweep} aria-hidden></span>
              <span className={styles.talkText}>
                <span className={styles.talkTextInner}>Let&#39;s talk</span>
              </span>
              <span className={styles.talkArrow} aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8 8.673 12.984"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>

            <button
              type="button"
              className={styles.menuToggle}
              data-phase={togglePhase}
              aria-expanded={open}
              aria-controls="glass-overlay"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
              ref={toggleRef}
            >
              <div className={`${styles.headerPill} ${styles.menuToggleInner}`}>
                <div className={styles.menuToggleLabel} aria-hidden="true" data-phase={togglePhase} style={toggleLabelStyle}>
                  <span data-state="close" ref={menuLabelRef}>
                    Menu
                  </span>
                  <span data-state="menu" ref={closeLabelRef}>
                    Close
                  </span>
                </div>
                <div className={styles.menuToggleDots} aria-hidden data-phase={togglePhase}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        id="glass-overlay"
        ref={overlayRef}
        className={`${styles.overlay} ${open ? styles.open : ""} ${isClosing ? styles.closing : ""}`}
        onClick={onOverlayClick}
        aria-hidden={!open}
      >
        <div className={styles.underlay} aria-hidden="true"></div>
        <div className={`${styles.menu} ${open ? styles.menuOpen : ""} ${isClosing ? styles.menuClosing : ""}`} ref={panelRef} style={menuStyle}>
          <div className={`${styles.menuGroup} ${styles.groupNav}`} style={navGroupStyle} data-interactive={!isClosing && interactive ? "true" : "false"}>
            <nav
              className={`${styles.menuSection} ${styles.menuLinks}`}
              aria-label="Primary navigation"
            >
              {navLinks.map((link, index) => {
                const isActive = link.href === activeHref;
                const isHovered = !isActive && hoveredHref === link.href;

                const clearHover = () => {
                  setHoveredHref((prev) => (prev === link.href ? null : prev));
                };

                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  // Handle anchor links (hash links)
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    const pathname = window.location.pathname;
                    const isHomePage = pathname === "/" || pathname === "/de" || pathname === "/de/";
                    const hash = link.href;
                    
                    if (isHomePage) {
                      // Already on home page, just scroll
                      const targetSection = document.querySelector(hash);
                      if (targetSection) {
                        const headerHeight = headerRef.current?.getBoundingClientRect().height || 0;
                        const targetRect = targetSection.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        
                        // Special case: Projects section should scroll to top
                        if (hash === "#projects") {
                          const targetScroll = targetRect.top + window.pageYOffset - headerHeight - 20;
                          window.scrollTo({
                            top: targetScroll,
                            behavior: "smooth"
                          });
                        } else {
                          // Center other sections in viewport
                          const sectionHeight = targetRect.height;
                          const sectionTop = targetRect.top + window.pageYOffset;
                          const centerScroll = sectionTop + (sectionHeight / 2) - (viewportHeight / 2);
                          
                          window.scrollTo({
                            top: Math.max(0, centerScroll),
                            behavior: "smooth"
                          });
                        }
                        handleClose();
                      }
                    } else {
                      // Navigate to home page with hash, browser will handle scroll
                      const homePath = pathname.startsWith("/de") ? "/de/" : "/";
                      handleClose();
                      window.location.href = `${homePath}${hash}`;
                    }
                    return;
                  }
                  
                  // Check if this is the Projects link
                  if (link.href === "/projects" || link.href === "/de/projects") {
                    e.preventDefault();
                    const pathname = window.location.pathname;
                    const isHomePage = pathname === "/" || pathname === "/de" || pathname === "/de/";
                    const isGerman = link.href === "/de/projects";
                    const homePath = isGerman ? "/de/" : "/";
                    
                    if (isHomePage) {
                      // Already on home page, just scroll
                      const projectsSection = document.getElementById("projects");
                      if (projectsSection) {
                        // Calculate scroll position accounting for sticky elements
                        // Get the sticky wrapper (the parent of the sticky element)
                        const stickyWrapper = document.querySelector('[id="what-the-ark"]')?.closest('.sticky')?.parentElement;
                        const stickyWrapperBottom = stickyWrapper ? stickyWrapper.getBoundingClientRect().bottom + window.pageYOffset : 0;
                        const headerHeight = headerRef.current?.getBoundingClientRect().height || 0;
                        
                        // Scroll to just past the sticky section, accounting for header
                        const targetScroll = Math.max(
                          stickyWrapperBottom - headerHeight + 20, // 20px padding
                          projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20
                        );
                        
                        window.scrollTo({
                          top: targetScroll,
                          behavior: "smooth"
                        });
                        handleClose();
                      }
                    } else {
                      // Navigate to home page with hash, browser will handle scroll
                      handleClose();
                      window.location.href = `${homePath}#projects`;
                    }
                  }
                };

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={styles.menuLink}
                    ref={index === 0 ? firstLinkRef : undefined}
                    data-active={isActive || undefined}
                    data-hovered={isHovered || undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={handleClick}
                    onMouseEnter={() => {
                      if (!isActive) {
                        setHoveredHref(link.href);
                      }
                    }}
                    onMouseLeave={clearHover}
                    onFocus={() => {
                      if (!isActive) setHoveredHref(link.href);
                      else setHoveredHref(null);
                    }}
                    onBlur={clearHover}
                  >
                    <div className={styles.menuLinkBackground} aria-hidden />
                    <div className={styles.menuLinkInner}>
                      <div className={styles.menuLinkLabelWrap}>
                        <span className={styles.menuLinkLabelPrimary}>{link.label}</span>
                        <span className={styles.menuLinkLabelClone}>{link.label}</span>
                      </div>
                      <span className={styles.menuLinkIndicator} aria-hidden="true">
                        {isActive ? (
                          <span className={styles.menuLinkDot} />
                        ) : (
                          <span className={styles.menuLinkArrowIcon}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8 8.673 12.984" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </span>
                    </div>
                  </a>
                );
              })}
            </nav>
          </div>

          {projectsLinks.length > 0 && (
            <div
              className={`${styles.menuGroup} ${styles.groupProjects}`}
              style={projectsGroupStyle}
              data-interactive={!isClosing && interactive ? "true" : "false"}
            >
              <div className={`${styles.menuSection} ${styles.menuProjects}`} aria-labelledby="overlay-projects">
                <h3 id="overlay-projects" className={styles.menuProjectsTitle}>Projects</h3>
                <ul className={styles.menuProjectList}>
                  {projectsLinks.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={styles.menuProjectLink}>
                        <span>{item.label}</span>
                        <span className={styles.menuProjectArrow} aria-hidden>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8 8.673 12.984" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div
            className={`${styles.menuGroup} ${styles.groupCta}`}
            style={ctaGroupStyle}
            data-interactive={!isClosing && interactive ? "true" : "false"}
          >
            <a className={`${styles.menuSection} ${styles.menuTalk}`} href={talkHref}>
              <span className={styles.menuTalkText}>Let&#39;s talk</span>
              <span className={styles.menuTalkArrow} aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.343 12h19.314m0 0-7.071-7.071M21.657 12 14.586 19.071" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}


