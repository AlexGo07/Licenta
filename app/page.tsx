"use client";

import { useEffect, useState } from "react";
import { FigurinesSides } from "@/components/FigurinesSides";
import { PostMapCheckerSection } from "@/components/PostMapCheckerSection";
import { ScrollGlobe } from "@/components/ScrollGlobe";
import { StarsBackground } from "@/components/animate/backgrounds/stars";
import { SwipeGameSection } from "@/components/landing/SwipeGameSection";
import LightBackground from "../components/animate/backgrounds/lightbackground";

type StoryState = "idle" | "spreading" | "readyToClean" | "cleaning" | "cleaned";

export default function Home() {
  const [storyState, setStoryState] = useState<StoryState>("idle");
  const [mapReady, setMapReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
  };

  return (
    <>
      <nav className="fixed left-1/2 top-4 z-[10001] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 rounded-2xl border border-white/15 bg-black/40 px-3 py-3 shadow-xl backdrop-blur-md ring-1 ring-white/10 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => scrollToProgress(0)}
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15 sm:text-sm"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => scrollToProgress(0.50)}  
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15 sm:text-xs"
          >
            Why should I download
          </button>

          <button
            type="button"
            onClick={() => scrollToProgress(0.75)}
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15 sm:text-xs"
          >
            Check Infromation
          </button>

          <button
            type="button"
            onClick={() => scrollToProgress(0.85)}
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/15 sm:text-xs"
          >
            Test your scepticism
          </button>

          <a
            href={EXTENSION_DOWNLOAD_URL}
            className="rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/25 sm:text-sm"
          >
            Download extension
          </a>
        </div>
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

      <main className="relative z-10 min-h-[600vh] overflow-x-hidden">
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
          opacity: checkerOpacity,
          pointerEvents: checkerOpacity > 0.1 ? "auto" : "none",
          display: checkerOpacity > 0 ? "flex" : "none"
        }}
      >
        <PostMapCheckerSection />
      </div>

      <div 
        className="fixed inset-x-0 inset-y-0 z-[40] flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none"
        style={{ 
          opacity: swipeOpacity,
          pointerEvents: swipeOpacity > 0.1 ? "auto" : "none",
          display: swipeOpacity > 0 ? "flex" : "none"
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

      {!mapReady ? (
        <div className="fixed left-1/2 top-8 z-[10000] -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-md pointer-events-auto">
          Scroll until Romania locks in to enable interaction
        </div>
      ) : storyState === "idle" ? (
        <div className="fixed left-1/2 top-8 z-[10000] -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-md pointer-events-auto">
          Click a figurine to start the spread story
        </div>
      ) : null}
    </>
  );
}
