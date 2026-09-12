"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function HeroMedia() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { clipPath: "inset(0 0 14% 0)", scale: 1.035, opacity: 0.9 }}
      animate={{ clipPath: "inset(0 0 0% 0)", scale: 1, opacity: 1 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 -z-10 overflow-hidden bg-[#202725]"
    >
      <Image
        src="/assets/images/hero_1.png"
        alt="Univers visuel de La Maison Malgache"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,12,0.82)_0%,rgba(8,13,12,0.58)_42%,rgba(8,13,12,0.18)_75%,rgba(8,13,12,0.3)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />
    </motion.div>
  );
}
