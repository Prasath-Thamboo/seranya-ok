"use client";

import React from "react";
import { motion, Variants, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
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
 *
 * Accessibilité / robustesse :
 * - `immediate` (hero) : animation en CSS pur, le contenu ne dépend pas du JS.
 * - prefers-reduced-motion : aucun mouvement, contenu affiché directement.
 * - Sans JS : la règle <noscript> du layout force [data-reveal] visible.
 */
export default function Reveal({ as = "section", className, immediate = false, children }: RevealProps) {
  const ref = useRef(null);
  const scrollInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = useReducedMotion();
  const Tag = as;

  if (immediate) {
    return (
      <Tag
        className={`motion-safe:[animation:fade-up_1.1s_cubic-bezier(0.22,1,0.36,1)_both] ${className ?? ""}`}
      >
        {children}
      </Tag>
    );
  }

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "section" ? motion.section : motion.div;

  return (
    <MotionTag
      ref={ref}
      data-reveal=""
      className={className}
      initial="hidden"
      animate={scrollInView ? "visible" : "hidden"}
      variants={fadeUp}
    >
      {children}
    </MotionTag>
  );
}
