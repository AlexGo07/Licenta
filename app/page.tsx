"use client";

import { useState } from "react";
import { FigurinesSides } from "@/components/FigurinesSides";
import { ScrollGlobe } from "@/components/ScrollGlobe";
import { StarsBackground } from "@/components/animate/backgrounds/stars";

type StoryState = "idle" | "spreading" | "readyToClean" | "cleaning" | "cleaned";

export default function Home() {
  const [storyState, setStoryState] = useState<StoryState>("idle");
  const [mapReady, setMapReady] = useState(false);

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

  const showActionButton =
    mapReady && (storyState === "readyToClean" || storyState === "cleaning" || storyState === "cleaned");

  const actionButtonLabel =
    storyState === "cleaning"
      ? "Cleaning with AI..."
      : storyState === "cleaned"
        ? "Start over"
        : "Activate AI Filter";

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-10]">
        <StarsBackground pointerEvents={false} speed={65} starColor="#dbeafe" />
      </div>

      <main className="relative min-h-[500vh] overflow-x-hidden z-10 pointer-events-none">
        <FigurinesSides
          storyState={storyState}
          onTriggerStory={handleFigurineTrigger}
          canTriggerStory={mapReady}
        />
        <ScrollGlobe
          storyState={storyState}
          onMapFullyInfected={handleMapFullyInfected}
          onMapCleaned={handleMapCleaned}
          onMapReadyChange={setMapReady}
        />

      {/* Re-enabled content section */}
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

        {/* Scroll runway so globe/figurines can react while page scrolls naturally */}
        <div className="h-[400vh]" />
      </main>
    </>
  );
}
