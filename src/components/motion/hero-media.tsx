"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
export function HeroMedia() { const reduceMotion = useReducedMotion(); return <motion.div initial={reduceMotion ? false : { clipPath: "inset(0 0 18% 0)", y: 18, opacity: 0.88 }} animate={{ clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative min-h-[42svh] overflow-hidden bg-[var(--surface-strong)] md:min-h-[72svh]"><Image src="/assets/images/hero_1.png" alt="Sélection visuelle de La Maison Malgache" fill priority sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" /></motion.div>; }
