"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/15 bg-black/70 shadow-[0_0_40px_rgba(202,152,255,0.1)] backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-6 sm:px-8">
        <div className="font-headline text-2xl sm:text-3xl font-black italic tracking-tighter text-primary">
          Gogoșometru
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center justify-center space-y-1.5 p-2 text-white md:hidden"
        >
          <span className={`block h-[2px] w-6 bg-white transition-transform ${isOpen ? "translate-y-[8px] rotate-45" : ""}`}></span>
          <span className={`block h-[2px] w-6 bg-white transition-opacity ${isOpen ? "opacity-0" : ""}`}></span>
          <span className={`block h-[2px] w-6 bg-white transition-transform ${isOpen ? "-translate-y-[8px] -rotate-45" : ""}`}></span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 lg:gap-12 font-label text-sm uppercase tracking-widest md:flex">
          <a
            className="border-b-4 border-secondary pb-1 text-secondary"
            href="#detect"
          >
            Detectează
          </a>
          <a
            className="text-white/70 transition-colors hover:scale-105 hover:text-secondary"
            href="#cum-functioneaza"
          >
            Cum Funcționează
          </a>
          <a
            className="text-white/70 transition-colors hover:scale-105 hover:text-secondary"
            href="#arhiva"
          >
            Arhivă
          </a>
        </div>

        {/* Desktop Button */}
        <button
          type="button"
          className="hidden md:block rounded-xl bg-primary px-6 py-2.5 lg:px-8 lg:py-3 font-headline font-bold text-on-primary transition-all hover:scale-105 active:scale-95"
        >
          Descarcă
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-24 flex w-full flex-col items-center gap-6 border-b border-outline-variant/15 bg-black/95 py-6 font-label text-sm uppercase tracking-widest backdrop-blur-3xl md:hidden"
          >
            <a
              className="text-secondary"
              href="#detect"
              onClick={() => setIsOpen(false)}
            >
              Detectează
            </a>
            <a
              className="text-white/70 transition-colors hover:text-secondary"
              href="#cum-functioneaza"
              onClick={() => setIsOpen(false)}
            >
              Cum Funcționează
            </a>
            <a
              className="text-white/70 transition-colors hover:text-secondary"
              href="#arhiva"
              onClick={() => setIsOpen(false)}
            >
              Arhivă
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-xl bg-primary px-8 py-3 font-headline font-bold text-on-primary transition-all active:scale-95"
            >
              Descarcă Extensia
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
