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
    headline: "Oamenii de știință descoperă o metodă revoluționară pentru tratamentul cancerului creierul uman.",
    body: "Cercetătorii de la Institutul de Oncologie din Cluj-Napoca au anunțat azi o descoperire majoră care ar putea revolutiona tratamentul cancerului cerebral. Studiul, publicat în revista Nature Medical, prezintă o nouă abordare terapeutică bazată pe nanotehnologie. Según declarațiile echipei, rata de supraviețuire a pacienților ar putea crește cu până la 60% în următorii cinci ani de implementare clinică.",
    source: "Știri România",
    time: "Acum 3 ore",
    tag: "MEDICAL",
    isFake: false,
  },
  {
    id: 2,
    headline: "Guvernul plănuiește să introducă o nouă taxă specială pentru toți proprietarii de case.",
    body: "Într-o mișcare controversată, Ministerul Finanțelor a anunțat planurile pentru o nouă politică fiscală care ar afecta milioane de români. Potrivit unor surse anonime din administrație, taxa ar fi introdusă treptat, începând cu următorul an fiscal. Aceasta ar genera venituri suplimentare în bugetul de stat, dar ar putea crește sarcina fiscală pentru cetățenii obișnuiți. Asociațiile de proprietari protestează deja.",
    source: "Hotnews",
    time: "Acum 1 oră",
    tag: "ECONOMIC",
    isFake: true,
  },
  {
    id: 3,
    headline: "Universitatea din București organizează o conferință internațională despre inteligența artificială aplicată.",
    body: "Universitatea din București va găzdui în septembrie o conferință de trei zile dedicată dezvoltării și aplicațiilor inteligenței artificiale în domenii critice. Evenimentul va reuni cerca 500 de cercetători și specialiști din peste 30 de țări. Vor fi prezentate lucrările finale ale unor proiecte care ar putea revolutiona sectoare cum sunt medicina, agricultura și transporturile inteligente. Participarea este deschisă și studență cu bilet de intrare redus.",
    source: "Universitatea din București",
    time: "Ieri",
    tag: "EDUCAȚIE",
    isFake: false,
  },
  {
    id: 4,
    headline: "Celebrul actor american a anunțat că se pensionează din industria cinematografică pentru totdeauna.",
    body: "Într-o declarație șocantă pe rețelele sociale, actorul a confirmat că va abandona industria filmului după patru decenii de carieră reușită. Potrivit unei scurte filmări publicate pe Instagram, el dorește să se dedice activităților caritabile și să petreacă mai mult timp cu familia sa. Fanii din întreaga lume au reacționat cu tristeți la știrea, iar studiourile de film deja contactează alte vedete pentru proiectele plănuite.",
    source: "Entertainment Weekly",
    time: "Acum 4 ore",
    tag: "CELEBRITY",
    isFake: true,
  },
  {
    id: 5,
    headline: "Echipa națională de fotbal a României se califică în semifinalele campionatului european de tineret.",
    body: "Performanță istorică pentru echipa României! După o victorie spectaculoasă în sferturi, tinerii jucători ai țării noastre au câștigat biletele pentru semifinalele turneului european. Meciul de azi a fost spectaculos, cu mai mult de 50,000 de suporteri prezenți în stadion. Antrenorul echipei a declarat că aceasta este abia începutul și că speră la o performanță și mai bună în tururile următoare ale competiției europene.",
    source: "ProTV Sport",
    time: "Acum 2 ore",
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
              {isFlipped ? "Titlu" : "Detalii"}
            </button>
          </div>

          {/* Middle: Clickable Title */}
          <div className="my-6 flex-1 flex flex-col justify-center hover:opacity-80 transition-opacity">
            <h3 className="text-[22px] leading-snug sm:text-2xl font-medium tracking-tight text-white/95">
              {card.headline}
            </h3>
            <p className="text-xs text-white/50 mt-3">Dă click pentru a citi tot articolul →</p>
          </div>

          {/* Bottom Details */}
          <div className="border-t border-white/40 pt-4">
            <div className="flex justify-between items-center text-[9px] tracking-wider uppercase text-white/40 sm:text-[10px] font-semibold">
              <span>Sursa: {card.source}</span>
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
            <span className="text-xl font-medium tracking-widest lowercase">articol complet</span>
            <button
              onClick={toggleFlip}
              className="rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
            >
              {isFlipped ? "Titlu" : "Detalii"}
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

  useEffect(() => {
    let mounted = true;

    const loadStories = async () => {
      try {
        const response = await fetch("/swipe-stories.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const payload = (await response.json()) as StoryCard[];
        if (!Array.isArray(payload) || payload.length === 0) return;

        // Keep UI snappy: load a deck window first.
        const deck = payload.slice(0, 120);

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
          Fake sau Pe Bune?
        </h2>
        <p className="mx-auto max-w-lg text-sm sm:text-base text-zinc-300 drop-shadow-sm">
          Antrenează-ți instinctul de supraviețuire digitală. Glisează stânga
          pentru știri reale, dreapta pentru fake sau satiră.
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
              <h4 className="text-3xl font-bold text-white mb-2">Final!</h4>
              <p className="mt-2 text-zinc-300 text-lg">Ai ghicit {score} din {allCards.length}</p>
              <button 
                onClick={() => { setCards(allCards); setScore(0); }}
                className="mt-8 rounded-full border border-white/50 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/20"
              >
                Mai Încearcă
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
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-white/90 uppercase group-hover:text-white text-center leading-tight">FAKE/SATIRA</span>
          </div>
          <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 group-hover:text-white">
            Fake / Satira
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
              <span className="text-[8px] font-semibold uppercase tracking-wide text-white text-center leading-tight">FAKE/SATIRA</span>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}
