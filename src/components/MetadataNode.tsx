"use client";

import { useEffect, useMemo, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface MetadataNodeProps {
  label: string;
  mode: string;
  status: string;
  imageSrc: string;
  visible: boolean;
  reduced: boolean;
  anchor: Position;
  card: Position;
}

export default function MetadataNode({
  label,
  mode,
  status,
  imageSrc,
  visible,
  reduced,
  anchor,
  card,
}: MetadataNodeProps) {
  const lineColor = "rgba(0, 0, 0, 0.45)";
  const [loadedSrc, setLoadedSrc] = useState(imageSrc);

  useEffect(() => {
    let active = true;
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      if (active) setLoadedSrc(imageSrc);
    };
    return () => {
      active = false;
    };
  }, [imageSrc]);

  const anchorPercent = useMemo(
    () => ({
      x: `${(anchor.x * 100).toFixed(2)}%`,
      y: `${(anchor.y * 100).toFixed(2)}%`,
    }),
    [anchor.x, anchor.y]
  );

  const cardPercent = useMemo(
    () => ({
      x: `${(card.x * 100).toFixed(2)}%`,
      y: `${(card.y * 100).toFixed(2)}%`,
    }),
    [card.x, card.y]
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden={!visible}
    >
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <line
          x1={anchorPercent.x}
          y1={anchorPercent.y}
          x2={cardPercent.x}
          y2={cardPercent.y}
          stroke={lineColor}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={anchorPercent.x} cy={anchorPercent.y} r="2" fill={lineColor} />
        <circle cx={cardPercent.x} cy={cardPercent.y} r="2" fill={lineColor} />
      </svg>

      <div
        className="absolute pointer-events-auto"
        style={{
          left: cardPercent.x,
          top: cardPercent.y,
          transform: "translate(-50%, -50%)",
          transition: reduced ? "none" : "transform 0.2s ease",
        }}
      >
        <div
          className="rounded-lg overflow-hidden p-2 sm:p-3 w-40 sm:w-48 md:w-56 bg-white/85 backdrop-blur-sm"
          style={{ border: `1px solid ${lineColor}` }}
        >
          <div className="relative h-20 sm:h-24 w-full rounded-md overflow-hidden mb-3 bg-gray-100 border border-black/5">
            {loadedSrc && (
              <img
                src={loadedSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scale(1.2)" }}
                draggable={false}
              />
            )}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>

          <div className="font-mono text-[10px] md:text-xs leading-tight text-black space-y-1">
            <div className="font-medium opacity-100 mb-2 tracking-wide">{label}</div>
            <div className="flex justify-between opacity-60">
              <span>MODE</span>
              <span>{mode.split(": ")[1] || "N/A"}</span>
            </div>
            <div className="flex justify-between opacity-60">
              <span>STATUS</span>
              <span>{status.split(": ")[1] || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

