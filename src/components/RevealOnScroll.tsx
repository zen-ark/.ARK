import React, { useRef } from "react";
import { motion } from "framer-motion";
import { isValidReactNode } from "@/lib/react-utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function RevealOnScroll({ children, delay = 0, className = "" }: RevealOnScrollProps) {
  // Guard against error objects from Astro MDX rendering
  if (!isValidReactNode(children)) {
    console.error('RevealOnScroll received invalid children (likely an error object from Astro)');
    return null;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }} // Reduced from 50 to 20 to match Hero's subtle feel
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.1, once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: delay }}
    >
      {children}
    </motion.div>
  );
}
