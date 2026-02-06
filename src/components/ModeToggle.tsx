import React, { useState, useEffect } from "react";
import { getMode, setModeInStorage, type Mode } from "@/lib/mode";
import styles from "./modeToggle.module.css";

interface ModeToggleProps {
  currentPath: string;
  isGerman: boolean;
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="22.01" />
      <line x1="15" y1="22" x2="15" y2="22.01" />
      <line x1="9" y1="18" x2="9" y2="18.01" />
      <line x1="15" y1="18" x2="15" y2="18.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function StraightArrow({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="0" y1="20" x2="190" y2="20" />
      <path d="M184 14 L 190 20 L 184 26" />
    </svg>
  );
}

export default function ModeToggle({ currentPath, isGerman }: ModeToggleProps) {
  const currentMode = getMode(currentPath);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Determine target mode and related info
  // If current is agency (Studio), target is hiring (Portfolio)
  // If current is hiring (Portfolio), target is agency (Studio)
  const targetMode: Mode = currentMode === "agency" ? "hiring" : "agency";
  const isTargetPortfolio = targetMode === "hiring";

    // Check for onboarding condition
    useEffect(() => {
      // Only show on Studio (agency) mode
      if (currentMode !== 'agency') return;

      // Check if we came from Portfolio
      // We look for 'portfolio' in the referrer
      const referrer = document.referrer;
      const cameFromPortfolio = referrer && referrer.includes('portfolio');

      // Check if user has seen this before
      // Using a consistent key for production
      const storageKey = 'ark_studio_onboarding_seen';
      const hasSeen = localStorage.getItem(storageKey);

      if (cameFromPortfolio && !hasSeen) {
        // Small delay for better UX
        const timer = setTimeout(() => {
          setShowOnboarding(true);
          localStorage.setItem(storageKey, 'true');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [currentMode]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen || showOnboarding) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, showOnboarding]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
    setShowOnboarding(false); // Close onboarding if they click the button
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleConfirm = () => {
    // Persist choice
    setModeInStorage(targetMode);
    
    // Determine target path based on current language
    const prefix = isGerman ? "/de" : "";
    
    // Construct target path
    const targetPath = isTargetPortfolio 
      ? `${prefix}/portfolio` 
      : (prefix || "/");
    
    // Navigate
    window.location.assign(targetPath);
  };

  // Text content based on target mode and language
  const texts = {
    title: isGerman 
      ? (isTargetPortfolio ? "Portfolio" : "Studio") 
      : (isTargetPortfolio ? "View Portfolio" : "Enter Studio"),
    subtitle: isGerman
      ? (isTargetPortfolio ? "Design & Engineering" : "Creative Agency")
      : (isTargetPortfolio ? "Design & Engineering" : "Creative Agency"),
    description: isGerman
      ? `Du wechselst in den ${isTargetPortfolio ? "Portfolio-Bereich" : "Studio-Bereich"}. Diese Ansicht ist für ${isTargetPortfolio ? "Recruiter & Hiring Manager" : "Kunden & Partner"} optimiert.`
      : `You are switching to the ${isTargetPortfolio ? "Portfolio view" : "Studio view"}. This experience is optimized for ${isTargetPortfolio ? "Recruiters & Hiring Managers" : "Clients & Partners"}.`,
    stay: isGerman ? "Abbrechen" : "Cancel",
    proceed: isGerman ? "Wechseln" : "Switch View"
  };

  return (
    <>
      <button 
        type="button"
        className={styles.toggleButton}
        style={{ zIndex: showOnboarding ? 2005 : undefined }}
        onClick={handleOpenModal}
        aria-label={isGerman 
          ? `Wechsle zu ${isTargetPortfolio ? "Portfolio" : "Studio"}` 
          : `Switch to ${isTargetPortfolio ? "Portfolio" : "Studio"}`
        }
      >
        {isTargetPortfolio ? (
          <UserIcon className={styles.toggleIcon} />
        ) : (
          <BuildingIcon className={styles.toggleIcon} />
        )}
      </button>

      {/* Onboarding Modal */}
      {showOnboarding && !isModalOpen && (
        <div 
          className={styles.onboardingOverlay}
          onClick={handleCloseOnboarding}
        >
          <div className={styles.onboardingModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}>
                <UserIcon className={styles.modalIcon} />
              </div>
              <div className={styles.modalTitleGroup}>
                <h2 className={styles.modalTitle}>
                  {isGerman ? "Portfolio" : "Portfolio"}
                </h2>
                <span className={styles.modalSubtitle}>
                  {isGerman ? "Design & Engineering" : "Design & Engineering"}
                </span>
              </div>
            </div>

            <p className={styles.modalText}>
              {isGerman 
                ? "Hier kannst du jederzeit zum Portfolio zurückwechseln" 
                : "Here you can switch back to the portfolio anytime"
              }
            </p>
            
            <div className={styles.onboardingActions}>
              <button 
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleCloseOnboarding}
              >
                {isGerman ? "Verstanden" : "Got it"}
              </button>
              <button 
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={handleConfirm}
              >
                {isGerman ? "Zum Portfolio" : "To Portfolio"}
              </button>
            </div>

            <StraightArrow className={styles.onboardingArrow} />
          </div>
        </div>
      )}

      {isModalOpen && (
        <div 
          className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}>
                {isTargetPortfolio ? (
                  <UserIcon className={styles.modalIcon} />
                ) : (
                  <BuildingIcon className={styles.modalIcon} />
                )}
              </div>
              <div className={styles.modalTitleGroup}>
                <h2 className={styles.modalTitle}>{texts.title}</h2>
                <span className={styles.modalSubtitle}>{texts.subtitle}</span>
              </div>
            </div>
            
            <p className={styles.modalText}>{texts.description}</p>
            
            <div className={styles.modalActions}>
              <button 
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleCloseModal}
              >
                {texts.stay}
              </button>
              <button 
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={handleConfirm}
              >
                <span>{texts.proceed}</span>
                <ArrowRight className={styles.buttonIcon} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
