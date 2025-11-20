"use client";

import { useEffect, useState } from "react";

interface CardData {
  label: string;
  mode: string;
  status: string;
  bgColor: string;
}

const cards: CardData[] = [
  {
    label: "CREATIVE",
    mode: "MODE: EXPLORATION",
    status: "STATUS: ACTIVE",
    bgColor: "bg-[hsl(0_0%_98%)]",
  },
  {
    label: "INTERACTIVE",
    mode: "MODE: INPUT / OUTPUT",
    status: "STATUS: RESPONSIVE",
    bgColor: "bg-[hsl(0_0%_95%)]",
  },
  {
    label: "SYSTEMATIC",
    mode: "MODE: STRUCTURE",
    status: "STATUS: STABLE",
    bgColor: "bg-[hsl(0_0%_92%)]",
  },
];

// Final order: SYSTEMATIC (left), INTERACTIVE (center), CREATIVE (right)
const finalOrder = [2, 1, 0]; // indices: systematic, interactive, creative

export default function WhatArkDoes() {
  const [headerHeight, setHeaderHeight] = useState(0);

  // Calculate header height for padding
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight, { passive: true });

    // Also check after a short delay to ensure header is fully rendered
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section id="what-the-ark" className="w-full flex flex-col py-16 lg:py-24" style={{ paddingTop: headerHeight > 0 ? `${headerHeight + 16}px` : "4rem", minHeight: "100vh", backgroundColor: "hsl(var(--color-bg-canvas))" }}>
          {/* Heading - large, fluid, full width */}
          <div className="wtark-heading w-full" style={{ marginBottom: "16px" }}>
            {/* <h2 
              className="font-light uppercase text-black w-full px-6"
              style={{
                fontSize: "13.5vw",
                lineHeight: 0.9,
                letterSpacing: "normal",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              WHAT THE .ARK
            </h2> */}
            <div className="w-full px-6 mt-4">
              <img 
                src="/What the ark.svg" 
                alt="What the ark" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Copy row - two columns on desktop */}
          <div className="wtark-copy mb-16 lg:mb-24 px-6">
            <div className="hidden lg:flex lg:justify-between lg:gap-8">
              <p className="wtark-copy-text wtark-copy-left">
                .ARK IS A DIGITAL STUDIO BUILT AROUND ONE EXTENSION, RUN BY A SINGLE DESIGNER.
              </p>
              <p className="wtark-copy-text wtark-copy-right">
                WE CRAFT CLEAR INTERFACES AND CINEMATIC WEB EXPERIENCES WITH PRECISION AND EXPERIMENTATION.
              </p>
            </div>
            
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-4">
              <p className="wtark-copy-text" style={{ textAlign: "left" }}>
                {`.ARK IS A DIGITAL STUDIO BUILT AROUND ONE EXTENSION, RUN BY A SINGLE DESIGNER.`}
              </p>
              <p className="wtark-copy-text" style={{ textAlign: "left" }}>
                {`WE CRAFT CLEAR INTERFACES AND CINEMATIC WEB EXPERIENCES WITH PRECISION AND EXPERIMENTATION.`}
              </p>
            </div>
          </div>

          {/* Cards row - fills remaining vertical space */}
          <div className="cards-row flex-1 flex flex-col px-6" style={{ minHeight: "50vh" }}>
            {/* Desktop: Grid layout with cards as direct children */}
            <div className="hidden lg:grid cards-grid flex-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", columnGap: "32px", height: "50vh" }}>
              {finalOrder.map((cardIndex) => {
                const card = cards[cardIndex];
                return (
                  <Card
                    key={cardIndex}
                    card={card}
                    metadataOpacity={1}
                  />
                );
              })}
            </div>

            {/* Mobile: Vertical stacked layout */}
            <div className="lg:hidden flex flex-col gap-6" style={{ rowGap: "24px" }}>
              {finalOrder.map((cardIndex) => {
                const card = cards[cardIndex];
                return (
                  <Card
                    key={cardIndex}
                    card={card}
                    metadataOpacity={1}
                  />
                );
              })}
            </div>
          </div>
        </section>
  );
}

interface CardProps {
  card: CardData;
  metadataOpacity: number;
}

function Card({ card, metadataOpacity }: CardProps) {
  return (
    <div
      className={`wtark-card ${card.bgColor} rounded-2xl overflow-hidden w-full`}
      style={{
        position: "relative",
        height: "50vh",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Reserved space for future 3D canvas (top 50%) */}
      <div className="w-full" style={{ height: "50%" }} />

      {/* Metadata area (bottom 50%) - bottom-left aligned */}
      <div className="relative h-[50%] p-4 flex flex-col justify-end">
        <div>
          <div
            className="text-black font-mono"
            style={{
              fontFamily: "var(--font-mono)",
            }}
          >
            <div className="text-base md:text-lg font-medium uppercase tracking-wide mb-2">
              {card.label}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-wide opacity-70 mb-1">
              {card.mode}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-wide opacity-70">
              {card.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
