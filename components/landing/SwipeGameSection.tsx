"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

type StoryCard = {
  id: number;
  headline: string;
  body: string;
  source: string;
  time: string;
  tag: string;
  isFake: boolean;
};

// Fallback mock data if JSON loading fails
const MOCK_CARDS: StoryCard[] = [
  {
    id: 1,
    headline: "Scientists discover a revolutionary method for treating human brain cancer.",
    body: "Researchers at the Oncology Institute in Cluj-Napoca announced today a major discovery that could revolutionize brain cancer treatment. The study, published in the Nature Medical journal, presents a new therapeutic approach based on nanotechnology. According to the team's statements, the survival rate of patients could increase by up to 60% in the next five years of clinical implementation.",
    source: "Romania News",
    time: "3 hours ago",
    tag: "MEDICAL",
    isFake: false,
  },
  {
    id: 2,
    headline: "The government plans to introduce a new special tax for all homeowners.",
    body: "In a controversial move, the Ministry of Finance announced plans for a new fiscal policy that would affect millions of Romanians. According to anonymous sources in the administration, the tax would be introduced gradually, starting next fiscal year. This would generate additional revenue for the state budget, but could increase the fiscal burden for ordinary citizens. Homeowners' associations are already protesting.",
    source: "Hotnews",
    time: "1 hour ago",
    tag: "ECONOMIC",
    isFake: true,
  },
  {
    id: 3,
    headline: "The University of Bucharest organizes an international conference on applied artificial intelligence.",
    body: "The University of Bucharest will host a three-day conference in September dedicated to the development and applications of artificial intelligence in critical fields. The event will bring together nearly 500 researchers and specialists from over 30 countries. The final papers of projects that could revolutionize sectors such as medicine, agriculture, and smart transportation will be presented. Participation is open and students have reduced ticket prices.",
    source: "University of Bucharest",
    time: "Yesterday",
    tag: "EDUCATION",
    isFake: false,
  },
  {
    id: 4,
    headline: "The famous American actor announced he is retiring from the film industry forever.",
    body: "In a shocking statement on social media, the actor confirmed he will abandon the film industry after four decades of a successful career. According to a short video posted on Instagram, he wants to dedicate himself to charitable activities and spend more time with his family. Fans worldwide reacted with sadness to the news, and film studios are already contacting other stars for planned projects.",
    source: "Entertainment Weekly",
    time: "4 hours ago",
    tag: "CELEBRITY",
    isFake: true,
  },
  {
    id: 5,
    headline: "Romania's national football team qualifies for the semifinals of the European youth championship.",
    body: "Historical performance for the Romanian team! After a spectacular victory in the quarterfinals, our country's young players have won their tickets to the semifinals of the European tournament. Today's match was spectacular, with over 50,000 supporters present in the stadium. The team's coach stated that this is just the beginning and that he hopes for an even better performance in the following rounds of the European competition.",
    source: "ProTV Sport",
    time: "2 hours ago",
    tag: "SPORT",
    isFake: false,
  },
];

function SwipeCard({
  card,
  index,
  active,
  onSwipe,
}: {
  card: StoryCard;
  index: number;
  active: boolean;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const [isFlipped, setIsFlipped] = useState(false);
  const dragStartedRef = useRef(false);

  const handleDragStart = () => {
    dragStartedRef.current = true;
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    }

    // Prevent the synthetic click fired after drag from toggling the card.
    window.setTimeout(() => {
      dragStartedRef.current = false;
    }, 0);
  };

  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dragStartedRef.current) return;
    setIsFlipped(!isFlipped);
  };

  if (index > 2) return null;

  return (
    <motion.div
      className="absolute inset-0 origin-bottom"
      style={{
        zIndex: MOCK_CARDS.length - index,
        x,
        rotate,
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragStart={handleDragStart}
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
      {/* 3D Flip Container */}
      <motion.div
        className="h-full w-full"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* FRONT SIDE */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] border border-white/60 bg-[#0f121a]/95 p-6 shadow-2xl backdrop-blur-md sm:p-8 cursor-grab active:cursor-grabbing flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
          }}
          onClick={toggleFlip}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between text-white/90">
            <span className="text-xl font-medium tracking-widest lowercase">news</span>
            <button
              onClick={toggleFlip}
              className="rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
            >
              {isFlipped ? "Title" : "Details"}
            </button>
          </div>

          {/* Middle: Clickable Title */}
          <div className="my-6 flex-1 flex flex-col justify-center hover:opacity-80 transition-opacity">
            <h3 className="text-[22px] leading-snug sm:text-2xl font-medium tracking-tight text-white/95">
              {card.headline}
            </h3>
            <p className="text-xs text-white/50 mt-3">Click to read the full article →</p>
          </div>

          {/* Bottom Details */}
          <div className="border-t border-white/40 pt-4">
            <div className="flex justify-between items-center text-[9px] tracking-wider uppercase text-white/40 sm:text-[10px] font-semibold">
              <span>Source: {card.source}</span>
              <span>{card.time}</span>
            </div>
          </div>
        </motion.div>

        {/* BACK SIDE */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] border border-white/60 bg-[#0f121a]/95 p-6 shadow-2xl backdrop-blur-md sm:p-8 cursor-grab active:cursor-grabbing flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            rotateY: 180,
          }}
          onClick={toggleFlip}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between text-white/90 mb-4">
            <span className="text-xl font-medium tracking-widest lowercase">full article</span>
            <button
              onClick={toggleFlip}
              className="rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
            >
              {isFlipped ? "Title" : "Details"}
            </button>
          </div>

          {/* Full Article Text */}
          <div className="flex-1 overflow-y-auto pr-2">
            <p className="text-sm leading-relaxed text-white/85">
              {card.body}
            </p>
          </div>

          {/* Back Footer */}
          <div className="border-t border-white/40 pt-4 mt-4">
            <p className="text-[9px] tracking-wider uppercase text-white/40 sm:text-[10px] font-semibold">
              {card.source}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function SwipeGameSection() {
  const [cards, setCards] = useState<StoryCard[]>(MOCK_CARDS);
  const [allCards, setAllCards] = useState<StoryCard[]>(MOCK_CARDS);
  const [score, setScore] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState<null | { correct: boolean }>(null);

  const shuffleCards = (items: StoryCard[]) => {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
  };

  useEffect(() => {
    let mounted = true;

    const loadStories = async () => {
      try {
        const response = await fetch("/swipe-stories.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const payload = (await response.json()) as StoryCard[];
        if (!Array.isArray(payload) || payload.length === 0) return;

        // Keep UI snappy: shuffle first, then load a deck window.
        const deck = shuffleCards(payload).slice(0, 120);

        if (mounted) {
          setAllCards(deck);
          setCards(deck);
          setScore(0);
        }
      } catch {
        // Silent fallback to mock cards.
      }
    };

    loadStories();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSwipe = (direction: "left" | "right") => {
    const currentCard = cards[0];
    const isGuessFake = direction === "right";

    const isCorrect = isGuessFake === currentCard.isFake;
    setSwipeFeedback({ correct: isCorrect });

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setCards((prev) => prev.slice(1));
    }, 40);

    setTimeout(() => {
      setSwipeFeedback(null);
    }, 820);
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
          Fake or Real?
        </h2>
        <p className="mx-auto max-w-lg text-sm sm:text-base text-zinc-300 drop-shadow-sm">
          Train your digital survival instinct. Swipe left for real news, right for fake or satire.
        </p>
      </div>

      {/* Main Game Interface containing Side Buttons and Center Deck */}
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row lg:gap-24">
        
        {/* Desktop Left Button (REAL) */}
        <button
          type="button"
          onClick={swipeLeft}
          className="group hidden flex-col items-center md:flex transition-all hover:-translate-x-2 active:scale-95"
        >
          <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-[3px] border-white group-hover:border-white transition-all group-hover:bg-white/10 shadow-xl">
            <span className="text-sm sm:text-base font-semibold tracking-wide text-white/90 uppercase group-hover:text-white">REAL</span>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            Real
          </span>
        </button>

        {/* Cards Stack Container */}
        <div className="relative aspect-[3/4] w-[300px] sm:w-[350px] shadow-2xl">
          {/* Decorative background wireframes representing the stack */}
          <div className="absolute inset-0 -rotate-3 translate-x-2 translate-y-3 rounded-[2rem] border border-white/30 bg-transparent" />
          <div className="absolute inset-0 -rotate-1 translate-x-1 translate-y-1 rounded-[2rem] border border-white/30 bg-transparent" />

          <AnimatePresence>
            {swipeFeedback && (
              <motion.div
                key={`feedback-${swipeFeedback.correct ? "ok" : "bad"}`}
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 text-4xl font-bold shadow-2xl ${
                    swipeFeedback.correct
                      ? "border-emerald-300 bg-emerald-500/90 text-white"
                      : "border-rose-300 bg-rose-500/90 text-white"
                  }`}
                >
                  {swipeFeedback.correct ? "✓" : "✕"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
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
              <h4 className="text-3xl font-bold text-white mb-2">Finished!</h4>
              <p className="mt-2 text-zinc-300 text-lg">You guessed {score} out of {allCards.length}</p>
              <button 
                onClick={() => { setCards(allCards); setScore(0); }}
                className="mt-8 rounded-full border border-white/50 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/20"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Desktop Right Button (FAKE / SATIRA) */}
        <button
          type="button"
          onClick={swipeRight}
          className="group hidden flex-col items-center md:flex transition-all hover:translate-x-2 active:scale-95"
        >
          <div className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border-[3px] border-white group-hover:border-white transition-all group-hover:bg-white/10 shadow-xl">
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-white/90 uppercase group-hover:text-white text-center leading-tight">FAKE/SATIRE</span>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            Fake / Satire
          </span>
        </button>

        {/* Mobile Buttons (Fallback below cards) */}
        <div className="flex w-[300px] justify-between md:hidden mt-2">
          <button type="button" onClick={swipeLeft} className="flex flex-col items-center active:scale-95 transition-transform">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white">REAL</span>
            </div>
          </button>
          <button type="button" onClick={swipeRight} className="flex flex-col items-center active:scale-95 transition-transform">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white">
              <span className="text-[8px] font-semibold uppercase tracking-wide text-white text-center leading-tight">FAKE/SATIRE</span>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
