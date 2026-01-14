import React, { useState, useRef, useEffect } from "react";
import { getMode, normalizePath, setModeInStorage, type Mode } from "@/lib/mode";
import styles from "./modeToggle.module.css";

interface ModeToggleProps {
  currentPath: string;
  isGerman: boolean;
}

export default function ModeToggle({ currentPath, isGerman }: ModeToggleProps) {
  const normalizedPath = normalizePath(currentPath);
  const currentMode = getMode(currentPath);
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null);
  const [isOnDark, setIsOnDark] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);
  const agencyButtonRef = useRef<HTMLButtonElement>(null);
  const hiringButtonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  const updateHighlightPosition = (targetButton: HTMLButtonElement | null) => {
    if (!highlightRef.current || !targetButton || !optionsRef.current) return;
    
    const buttonRect = targetButton.getBoundingClientRect();
    const containerRect = optionsRef.current.getBoundingClientRect();
    
    const top = buttonRect.top - containerRect.top;
    const height = targetButton.offsetHeight;
    
    highlightRef.current.style.top = `${top}px`;
    highlightRef.current.style.height = `${height}px`;
  };
  
  useEffect(() => {
    // Set initial position based on active mode
    const activeButton = currentMode === "agency" ? agencyButtonRef.current : hiringButtonRef.current;
    if (activeButton) {
      updateHighlightPosition(activeButton);
    }
  }, [currentMode]);
  
  useEffect(() => {
    // Update position on hover
    if (hoveredMode) {
      const hoveredButton = hoveredMode === "agency" ? agencyButtonRef.current : hiringButtonRef.current;
      updateHighlightPosition(hoveredButton);
    } else {
      // Snap back to active
      const activeButton = currentMode === "agency" ? agencyButtonRef.current : hiringButtonRef.current;
      updateHighlightPosition(activeButton);
    }
  }, [hoveredMode, currentMode]);

  // Handle Theme Detection (Dark/Light background)
  useEffect(() => {
    let ticking = false;

    const checkTheme = () => {
      // Check the element at the center right of the screen (where the toggle is)
      // The toggle itself is at fixed right: 16px, top: 50%
      // We sample a point slightly to the left of the toggle to hit the content behind it
      const x = window.innerWidth - 100; 
      const y = window.innerHeight / 2;
      
      const elements = document.elementsFromPoint(x, y);
      
      // Look for a data-theme="dark" attribute on any element in the stack
      const isDark = elements.some(el => {
        // Check if the element or its closest parent has the theme attribute
        return el.closest('[data-theme="dark"]');
      });

      setIsOnDark(isDark);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkTheme);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Also check on resize and initially
    window.addEventListener("resize", onScroll, { passive: true });
    checkTheme();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  
  const handleModeChange = (targetMode: Mode) => {
    // Don't navigate if already in target mode
    if (targetMode === currentMode) {
      return;
    }
    
    // Persist choice to localStorage
    setModeInStorage(targetMode);
    
    // Determine target path based on mode and locale
    const prefix = isGerman ? "/de" : "";
    const targetPath = targetMode === "hiring" 
      ? `${prefix}/portfolio`.replace("//", "/")
      : prefix || "/";
    
    // Navigate to target path
    window.location.href = targetPath;
  };

  return (
    <div className={`${styles.edgeRailToggle} ${isOnDark ? styles.onDark : ''}`}>
      <div className={styles.edgeRailStack}>
        <div ref={optionsRef} className={styles.edgeRailOptions}>
          <div 
            ref={highlightRef}
            className={styles.edgeRailHighlight}
          />
          <button
            ref={agencyButtonRef}
            type="button"
            className={`${styles.edgeRailButton} ${currentMode === "agency" ? styles.edgeRailActive : ""}`}
            onClick={() => handleModeChange("agency")}
            onMouseEnter={() => setHoveredMode("agency")}
            onMouseLeave={() => setHoveredMode(null)}
            aria-pressed={currentMode === "agency"}
            aria-label={isGerman ? "Zu Studio-Modus wechseln" : "Switch to Studio mode"}
          >
            <span className={styles.edgeRailText}>STUDIO</span>
          </button>
          <button
            ref={hiringButtonRef}
            type="button"
            className={`${styles.edgeRailButton} ${currentMode === "hiring" ? styles.edgeRailActive : ""}`}
            onClick={() => handleModeChange("hiring")}
            onMouseEnter={() => setHoveredMode("hiring")}
            onMouseLeave={() => setHoveredMode(null)}
            aria-pressed={currentMode === "hiring"}
            aria-label={isGerman ? "Zu Designer-Modus wechseln" : "Switch to Designer mode"}
          >
            <span className={styles.edgeRailText}>DESIGNER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
