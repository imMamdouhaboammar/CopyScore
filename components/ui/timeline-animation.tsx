"use client";

import React from "react";
import { motion, useInView, type Variants, type TargetAndTransition } from "motion/react";

export interface TimelineContentProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants | {
    visible: (i: number) => TargetAndTransition;
    hidden: TargetAndTransition;
  };
  as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "article" | "section" | string;
  className?: string;
}

const motionElements: Record<string, React.ComponentType<any>> = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  p: motion.p,
  span: motion.span,
  article: motion.article,
  section: motion.section,
};

export function TimelineContent({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  as = "div",
  className = "",
  ...props
}: TimelineContentProps) {
  const fallbackRef = React.useRef<HTMLDivElement>(null);
  const targetRef = timelineRef || fallbackRef;

  const isInView = useInView(targetRef, {
    once: true,
    amount: 0.1,
  });

  const defaultVariants: Variants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const Component = motionElements[as] || motion.div;

  return (
    <Component
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants || defaultVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export default TimelineContent;
