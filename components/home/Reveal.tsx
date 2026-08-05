"use client";

import React from "react";
import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

interface RevealProps {
  as?: "section" | "div";
  className?: string;
  /** Animate immediately on mount instead of waiting for scroll into view (e.g. the hero). */
  immediate?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps server-rendered children with the site's fade-up reveal animation.
 * Keeps the framer-motion client boundary as small as possible so the rest of
 * the page (data, images, links) stays server-rendered and is present in the
 * initial HTML. Does not re-wrap individual children so grid/flex layouts
 * passed in as children keep their original DOM structure.
 */
export default function Reveal({ as = "section", className, immediate = false, children }: RevealProps) {
  const ref = useRef(null);
  const scrollInView = useInView(ref, { once: true, margin: "-100px" });
  const inView = immediate || scrollInView;
  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
    >
      {children}
    </MotionTag>
  );
}
