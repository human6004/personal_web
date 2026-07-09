"use client";

import { motion, useReducedMotion } from "motion/react";

type StaggerTextProps = {
  text: string;
  className?: string;
};

// Hero title hiện ra theo từng từ. Tôn trọng reduced-motion (hiện thẳng).
export function StaggerText({ text, className }: StaggerTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.045 }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "0.5em" },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
            }
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.h1>
  );
}
