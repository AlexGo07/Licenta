"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from "framer-motion";

// Mock data matching the screenshot
const MOCK_CARDS = [
  {
    id: 1,
    headline: "Primăria București a mutat orașul în Delta Dunării ca să scape de trafic.",
    quote: '"Suntem primii din lume cu un oraș plutitor, restul e cancan."',
    source: "Gogoașa.ro",
    time: "Acum 2 ore",
    tag: "VIRAL PE WHATSAPP",
    isFake: true,
  },
  {
    id: 2,
    headline: "Guvernul alocă 5 milioane de euro pentru un studiu despre teleportarea funcționarilor.",
    quote: '"Vrem să eliminăm complet cozile la ghișeu," declară o sursă.',
    source: "News-Zilnic",
    time: "Acum 5 ore",
    tag: "EXCLUSIV",
    isFake: true,
  },
  {
    id: 3,
    headline: "BNR a majorat rata dobânzii de referință cu 0.25%.",
    quote: '"Este o măsură necesară pentru temperarea inflației," au transmis oficialii.',
    source: "Banca Națională",
    time: "Ieri",
    tag: "ECONOMIC",
    isFake: false,
  },
];

function SwipeCard({
  card,
  index,
  active,
  onSwipe,
}: {
  card: typeof MOCK_CARDS[0];
  index: number;
  active: boolean;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    } else {
      // Just let it snap back since dragConstraints snap to 0
    }
  };

  if (index > 2) return null;

  return (
    <motion.div
      className="absolute inset-0 origin-bottom"
      style={{
        zIndex: MOCK_CARDS.length - index,
        x: active ? x : 0,
        rotate: active ? rotate : 0,
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: active ? 1 : 0.95 - index * 0.05,
        y: active ? 0 : index * 12,
        opacity: active ? 1 : 1 - index * 0.2,
      }}
      exit={{ x: x.get() < 0 ? -300 : 300, opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Wrapper to perfectly match the sleek design of the card */}
      <div className="flex h-full w-full flex-col justify-between rounded-[2rem] border border-white/60 bg-[#0f121a]/95 p-6 shadow-2xl backdrop-blur-md sm:p-8 cursor-grab active:cursor-grabbing">
        
        {/* Top Header */}
        <div className="flex items-center justify-between text-white/90">
          <span className="text-xl font-medium tracking-widest lowercase">news</span>
          <span className="rounded-full border border-white/60 px-3 py-1 text-[9px] font-semibold tracking-[0.2em] sm:text-[10px] uppercase text-white/90">
            {card.tag}
          </span>
        </div>

        {/* Middle Content */}
        <div className="my-8 flex-1 flex flex-col justify-center">
          <h3 className="text-[22px] leading-snug sm:text-3xl font-medium tracking-tight text-white/95">
            {card.headline}
          </h3>
        </div>

        {/* Bottom Details */}
        <div className="border-t border-white/40 pt-4">
          <p className="mb-4 text-xs italic text-white/60 sm:text-sm">{card.quote}</p>
          <div className="flex justify-between items-center text-[9px] tracking-wider uppercase text-white/40 sm:text-[10px] font-semibold">
            <span>Sursa: {card.source}</span>
            <span>{card.time}</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export function SwipeGameSection() {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [score, setScore] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    const currentCard = cards[0];
    const isGuessFake = direction === "left";
    
    if (isGuessFake === currentCard.isFake) {
      setScore((s) => s + 1);
    }
    
    setTimeout(() => {
      setCards((prev) => prev.slice(1));
    }, 50); // slight delay allowing animation exit
  };

  const swipeLeft = () => {
    if(cards.length > 0) handleSwipe("left");
  };
  
  const swipeRight = () => {
    if(cards.length > 0) handleSwipe("right");
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pointer-events-auto">
      {/* Title Section */}
      <div className="mb-6 lg:mb-12 text-center drop-shadow-lg">
        <h2 className="mb-3 text-3xl sm:text-5xl font-bold tracking-tight text-white drop-shadow-md">
          Fake sau Pe Bune?
        </h2>
        <p className="mx-auto max-w-lg text-sm sm:text-base text-zinc-300 drop-shadow-sm">
          Antrenează-ți instinctul de supraviețuire digitală. Glisează stânga
          pentru minciuni gogonate, dreapta pentru adevăruri incomode.
        </p>
      </div>

      {/* Main Game Interface containing Side Buttons and Center Deck */}
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row lg:gap-24">
        
        {/* Desktop Left Button (FAKE) */}
        <button
          type="button"
          onClick={swipeLeft}
          className="group hidden flex-col items-center md:flex transition-all hover:-translate-x-2 active:scale-95"
        >
          <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-[3px] border-white group-hover:border-white transition-all group-hover:bg-white/10 shadow-xl">
            <span className="text-3xl sm:text-4xl font-light tracking-widest text-white/90 lowercase group-hover:text-white">close</span>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            Fake
          </span>
        </button>

        {/* Cards Stack Container */}
        <div className="relative aspect-[3/4] w-[300px] sm:w-[350px] shadow-2xl">
          {/* Decorative background wireframes representing the stack */}
          <div className="absolute inset-0 -rotate-3 translate-x-2 translate-y-3 rounded-[2rem] border border-white/30 bg-transparent" />
          <div className="absolute inset-0 -rotate-1 translate-x-1 translate-y-1 rounded-[2rem] border border-white/30 bg-transparent" />
          
          {cards.length > 0 ? (
            <AnimatePresence>
              {cards.map((card, index) => (
                <SwipeCard
                  key={card.id}
                  card={card}
                  index={index}
                  active={index === 0}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[2rem] border border-white/60 bg-[#0f121a]/95 p-8 text-center shadow-xl backdrop-blur-md">
              <h4 className="text-3xl font-bold text-white mb-2">Final!</h4>
              <p className="mt-2 text-zinc-300 text-lg">Ai ghicit {score} din {MOCK_CARDS.length}</p>
              <button 
                onClick={() => { setCards(MOCK_CARDS); setScore(0); }}
                className="mt-8 rounded-full border border-white/50 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/20"
              >
                Mai Încearcă
              </button>
            </div>
          )}
        </div>

        {/* Desktop Right Button (REAL) */}
        <button
          type="button"
          onClick={swipeRight}
          className="group hidden flex-col items-center md:flex transition-all hover:translate-x-2 active:scale-95"
        >
          <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-[3px] border-white group-hover:border-white transition-all group-hover:bg-white/10 shadow-xl">
            <span className="text-3xl sm:text-4xl font-light tracking-widest text-white/90 lowercase group-hover:text-white">check</span>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            Real
          </span>
        </button>

        {/* Mobile Buttons (Fallback below cards) */}
        <div className="flex w-[300px] justify-between md:hidden mt-2">
          <button type="button" onClick={swipeLeft} className="flex flex-col items-center active:scale-95 transition-transform">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white">
              <span className="text-xl font-light lowercase text-white">close</span>
            </div>
          </button>
          <button type="button" onClick={swipeRight} className="flex flex-col items-center active:scale-95 transition-transform">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white">
              <span className="text-xl font-light lowercase text-white">check</span>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
