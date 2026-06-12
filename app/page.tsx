"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import InfoModal from "../components/landing/InfoModal";
import { FigurinesSides } from "@/components/FigurinesSides";
import { PostMapCheckerSection } from "@/components/PostMapCheckerSection";
import { ScrollGlobe } from "@/components/ScrollGlobe";
import { StarsBackground } from "@/components/animate/backgrounds/stars";
import { SwipeGameSection } from "@/components/landing/SwipeGameSection";
import LightBackground from "../components/animate/backgrounds/lightbackground";

type StoryState = "idle" | "spreading" | "readyToClean" | "cleaning" | "cleaned";

function ThreeDLoadingScreen({ onReady }: { onReady: (ready: boolean) => void }) {
  const { active, loaded, total, progress } = useProgress();
  const [showOverlay, setShowOverlay] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const loadingInProgress = active || loaded === 0 || progress < 100;

    if (loadingInProgress) {
      setShowOverlay(true);
      setFadeOut(false);
      onReady(false);
      return undefined;
    }

    const fadeTimer = window.setTimeout(() => {
      setFadeOut(true);
      onReady(true);

      window.setTimeout(() => {
        setShowOverlay(false);
      }, 700);
    }, 350);

    return () => window.clearTimeout(fadeTimer);
  }, [active, loaded, onReady, progress, total]);

  useEffect(() => {
    document.body.style.overflow = showOverlay ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showOverlay]);

  if (!showOverlay) {
    return null;
  }

  const percent = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      className={`fixed inset-0 z-[20000] flex items-center justify-center bg-[#050816] px-6 transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      aria-live="polite"
      aria-label="Loading 3D models"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_42%),linear-gradient(180deg,_rgba(5,8,22,0.98),_rgba(8,12,32,0.98))]" />
      <div className="relative flex w-full max-w-md flex-col items-center rounded-3xl border border-white/10 bg-black/35 px-8 py-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-5 h-16 w-16 rounded-full border border-white/15 border-t-white/80 animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
          Loading experience
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white md:text-3xl">
          Preparing the 3D models
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/70 md:text-base">
          We are loading the globe, characters, and checker scene so the page is ready before you start scrolling.
        </p>
        <div className="mt-8 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-white transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-4 flex w-full items-center justify-between text-xs uppercase tracking-[0.22em] text-white/55">
          <span>{percent}%</span>
          <span>{loaded > 0 ? `${loaded}/${Math.max(total, loaded)} assets` : "Starting"}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [dismissedInWindow, setDismissedInWindow] = useState(false);
  const [storyState, setStoryState] = useState<StoryState>("idle");
  const [mapReady, setMapReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBootReady, setIsBootReady] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mapReady]);

  const MAP_HOLD_END = 0.55;   // Map stays at its end position till 55%
  const MAP_HIDE_END = 0.60;   // Map disappears completely by 60%

  const CHECKER_START = 0.60;  // Checker starts appearing at 60%
  const CHECKER_END = 0.65;    // Checker fully visible at 65%
  const CHECKER_HIDE_START = 0.75; // Checker holds for 0.10 (65-75%), then starts disappearing
  const CHECKER_HIDE_END = 0.80;   // Checker gone by 80%

  const SWIPE_START = 0.80;    // Swipe appears at 80%
  const SWIPE_END = 0.85;      // Swipe fully visible by 85%

  const hideProgress = Math.max(0, Math.min((scrollProgress - MAP_HOLD_END) / (MAP_HIDE_END - MAP_HOLD_END), 1));
  const stageOpacity = 1 - hideProgress;
  const backgroundSwapProgress = hideProgress;

  // Checker in / out logic
  const checkerRevealProgress = Math.max(0, Math.min((scrollProgress - CHECKER_START) / (CHECKER_END - CHECKER_START), 1));
  const checkerHideProgress = Math.max(0, Math.min((scrollProgress - CHECKER_HIDE_START) / (CHECKER_HIDE_END - CHECKER_HIDE_START), 1));
  const checkerOpacity = checkerRevealProgress - checkerHideProgress;

  // Swipe logic
  const swipeRevealProgress = Math.max(0, Math.min((scrollProgress - SWIPE_START) / (SWIPE_END - SWIPE_START), 1));
  const swipeOpacity = swipeRevealProgress;

  const MODAL_WINDOW_START = Math.max(0, MAP_HOLD_END - 0.02);
  const MODAL_WINDOW_END = MAP_HOLD_END + 0.02;

  const shouldShowIntroModal = !dismissedInWindow && scrollProgress >= MODAL_WINDOW_START && scrollProgress <= MODAL_WINDOW_END;

  useEffect(() => {
    if (scrollProgress < MODAL_WINDOW_START || scrollProgress > MODAL_WINDOW_END) {
      // reset dismissal when user scrolls outside the modal window so it can reappear later
      setDismissedInWindow(false);
    }
  }, [scrollProgress]);

  const handleFigurineTrigger = () => {
    setStoryState("spreading");
  };

  const handleMapFullyInfected = () => {
    setStoryState((current) => (current === "spreading" ? "readyToClean" : current));
  };

  const handleMapCleaned = () => {
    setStoryState("cleaned");
  };

  const handleActionButtonClick = () => {
    if (storyState === "readyToClean") {
      setStoryState("cleaning");
      return;
    }

    if (storyState === "cleaned") {
      setStoryState("idle");
    }
  };

  // Action button should only be accessible while the map with red pins is on screen.
  const redDotsVisible = mapReady && stageOpacity > 0.15 && checkerOpacity <= 0.05 && swipeOpacity <= 0.05;

  const showActionButton =
    redDotsVisible && (storyState === "readyToClean" || storyState === "cleaning" || storyState === "cleaned");

  const actionButtonLabel =
    storyState === "cleaning"
      ? "Cleaning with AI..."
      : storyState === "cleaned"
        ? "Start over"
        : "Activate AI Filter";

  const EXTENSION_DOWNLOAD_URL = "#";

  const scrollToProgress = (progress: number) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({
      top: maxScroll * Math.min(Math.max(progress, 0), 1),
      behavior: "smooth",
    });
    setIsNavOpen(false);
  };

  const safeCheckerOpacity = typeof checkerOpacity === "number" ? checkerOpacity : 0;
  const safeSwipeOpacity = typeof swipeOpacity === "number" ? swipeOpacity : 0;

  return (
    <>
      {/* Info modal shown just before the map hold ends */}
      <InfoModal open={shouldShowIntroModal} onClose={() => setDismissedInWindow(true)} />
      <ThreeDLoadingScreen onReady={setIsBootReady} />

      {/* Mobile: Only hamburger button */}
      <button
        type="button"
        onClick={() => setIsNavOpen(!isNavOpen)}
        disabled={!isBootReady}
        className="fixed left-4 top-6 z-[10001] flex flex-col items-center justify-center space-y-1.5 p-2 text-white transition-opacity md:hidden disabled:pointer-events-none disabled:opacity-0"
      >
        <span className={`block h-[2px] w-6 bg-white transition-transform duration-300 ${isNavOpen ? "translate-y-[8px] rotate-45" : ""}`}></span>
        <span className={`block h-[2px] w-6 bg-white transition-opacity duration-300 ${isNavOpen ? "opacity-0" : ""}`}></span>
        <span className={`block h-[2px] w-6 bg-white transition-transform duration-300 ${isNavOpen ? "-translate-y-[8px] -rotate-45" : ""}`}></span>
      </button>

      {/* Mobile dropdown menu */}
      {isNavOpen && isBootReady && (
        <div className="fixed left-0 right-0 top-16 z-[10000] flex flex-col gap-2 border-b border-white/15 bg-black/85 px-4 py-4 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={() => scrollToProgress(0)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => scrollToProgress(MAP_HOLD_END)}  
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15"
          >
            Why should I download
          </button>

          <button
            type="button"
            onClick={() => scrollToProgress(0.75)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15"
          >
            Check Information
          </button>

          <button
            type="button"
            onClick={() => scrollToProgress(0.85)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15"
          >
            Test your scepticism
          </button>

          <a
            href={EXTENSION_DOWNLOAD_URL}
            className="w-full block text-center rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/25"
          >
            Download extension
          </a>
        </div>
      )}

      {/* Desktop navbar */}
      <nav className="hidden left-1/2 top-4 z-[10001] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-2xl border border-white/15 bg-black/40 px-3 py-3 shadow-xl backdrop-blur-md ring-1 ring-white/10 sm:px-4 transition-all duration-300 md:fixed md:flex md:flex-wrap md:items-center md:justify-between md:gap-2 lg:gap-3">
        <button
          type="button"
          onClick={() => scrollToProgress(0)}
          disabled={!isBootReady}
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 sm:text-sm"
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => scrollToProgress(MAP_HOLD_END)}  
          disabled={!isBootReady}
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 sm:text-xs"
        >
          Why should I download
        </button>

        <button
          type="button"
          onClick={() => scrollToProgress(0.75)}
          disabled={!isBootReady}
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 sm:text-xs"
        >
          Check Information
        </button>

        <button
          type="button"
          onClick={() => scrollToProgress(0.85)}
          disabled={!isBootReady}
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-0 sm:text-xs"
        >
          Test your scepticism
        </button>

        <a
          href={EXTENSION_DOWNLOAD_URL}
          className={`rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/25 sm:text-sm ${isBootReady ? "" : "pointer-events-none opacity-50"}`}
        >
          Download extension
        </a>
      </nav>

      <div
        className="pointer-events-none fixed inset-0 z-[-20] transition-opacity duration-1000 ease-out"
        style={{ opacity: stageOpacity }}
      >
        <StarsBackground pointerEvents={false} speed={65} starColor="#dbeafe" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-[-15] transition-opacity duration-1000 ease-out"
        style={{ opacity: backgroundSwapProgress }}
      >
        <LightBackground raysOrigin="top-center" raysColor="#ffffff" raysSpeed={0.7} lightSpread={1.15} rayLength={2.4} saturation={1.04} distortion={0.08} noiseAmount={0.01} followMouse={false} />
      </div>

      <main className={`relative z-10 min-h-[600vh] overflow-x-hidden transition-opacity duration-700 ${isBootReady ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <FigurinesSides
          storyState={storyState}
          onTriggerStory={handleFigurineTrigger}
          canTriggerStory={mapReady}
          opacity={stageOpacity}
        />
        <ScrollGlobe
          storyState={storyState}
          onMapFullyInfected={handleMapFullyInfected}
          onMapCleaned={handleMapCleaned}
          onMapReadyChange={setMapReady}
          opacity={stageOpacity}
        />

      {/* Intro section naturally at top */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-24 pt-20 text-center">
        <div className="relative z-20 mx-auto rounded-3xl bg-black/40 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/10 sm:p-12">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            AI Fake News Detector for Romania
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-300 md:text-lg">
            Detect manipulated news, misinformation, and clickbait in Romanian online media
            with real-time AI analysis built for everyday readers.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 md:text-base">
            Browser extension and web platform for fact-checking signals, credibility scoring,
            and safer digital reading.
          </p>
        </div>
      </section>

      {/* 
        Phase 2 & 3: Fixed positioned elements driven entirely by scroll percentages.
        These will fade in and out exactly where the user is looking without scrolling away.
      */}
      <div 
        className="fixed inset-x-0 inset-y-0 z-[50] flex flex-col items-center justify-center px-2 py-4 sm:px-4 sm:py-6 transition-opacity duration-300 pointer-events-none"
        style={{ 
          opacity: safeCheckerOpacity,
          pointerEvents: safeCheckerOpacity > 0.1 ? "auto" : "none",
          display: safeCheckerOpacity > 0 ? "flex" : "none"
        }}
      >
        <PostMapCheckerSection />
      </div>

      <div 
        className="fixed inset-x-0 inset-y-0 z-[40] flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none"
        style={{ 
          opacity: safeSwipeOpacity,
          pointerEvents: safeSwipeOpacity > 0.1 ? "auto" : "none",
          display: safeSwipeOpacity > 0 ? "flex" : "none"
        }}
      >
        <SwipeGameSection />
      </div>

        {/* Final runway for lower-page pacing */}
        <div className="h-[140vh]" />
      </main>

      {showActionButton ? (
        <button
          type="button"
          onClick={handleActionButtonClick}
          disabled={storyState === "cleaning"}
          className="fixed bottom-8 left-1/2 z-[10000] -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-2xl backdrop-blur-md transition hover:bg-black/85 disabled:cursor-wait disabled:opacity-80 pointer-events-auto"
        >
          {actionButtonLabel}
        </button>
      ) : null}
    </>
  );
}
