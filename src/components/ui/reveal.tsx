"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" };

/** Fades content up as it enters the viewport. Respects reduced-motion. */
export function Reveal({ delay = 0, y = 24, as = "div", children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...(props as HTMLMotionProps<"div"> & HTMLMotionProps<"li">)}
    >
      {children}
    </Comp>
  );
}
