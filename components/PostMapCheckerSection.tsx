"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import GlowCard from "@/components/animate/backgrounds/cards/glowCard";

function SideModel({
  url,
  rotationDirection,
  scale = 0.06,
}: {
  url: string;
  rotationDirection: 1 | -1;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF(url);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.24 * rotationDirection;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function ModelFrame({
  url,
  rotationDirection,
  glow,
  scale = 0.08, // slightly larger base scale to compensate for lacking border container
}: {
  url: string;
  rotationDirection: 1 | -1;
  glow: string;
  scale?: number;
}) {
  return (
    <div className="h-44 w-36 sm:h-64 sm:w-48">
      <Canvas camera={{ position: [0, 1.3, 4], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[2.3, 4.2, 2.5]} intensity={1.15} color={glow} />
        <Suspense fallback={null}>
          <SideModel url={url} rotationDirection={rotationDirection} scale={scale} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/tik_tok_logo_with_true_topology.glb");
useGLTF.preload("/coin.glb");

type PredictResponse = {
  rezultat_final?: string;
  incredere_model?: string;
  rezultat_final_nou?: string;
  incredere_model_nou?: string;
  acord_modele?: boolean;
  mod_analiza_folosit?: string;
  modele_individuale?: {
    titlu?: string;
    text?: string;
    text_vechi?: string;
    text_nou?: string;
    hibrid?: string;
  };
  error?: string;
};

export function PostMapCheckerSection() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [viewportHeight, setViewportHeight] = useState(1080);

  useEffect(() => {
    const updateViewportHeight = () => setViewportHeight(window.innerHeight);
    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);

  const scaleClass =
    viewportHeight < 760
      ? "scale-[0.76]"
      : viewportHeight < 860
        ? "scale-[0.84]"
        : viewportHeight < 960
          ? "scale-[0.90]"
          : "scale-100";

  const handleAnalyze = async () => {
    const titlu = title.trim();
    const text = content.trim();

    if (!titlu && !text) {
      setError("Enter a title or text for analysis.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titlu, text }),
      });

      const data = (await response.json()) as PredictResponse;

      if (!response.ok) {
        setError(data.error || "Analysis failed.");
        return;
      }

      setResult(data);
    } catch {
      setError("Cannot connect to the backend. Check if the server is running on http://127.0.0.1:8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-8 transform-gpu transition-transform duration-300 ${scaleClass}`}>
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-5 xl:gap-6 2xl:gap-8">
        <div className="hidden flex-shrink-0 lg:block lg:scale-75 xl:scale-90 2xl:scale-100">
          <ModelFrame url="/tik_tok_logo_with_true_topology.glb" rotationDirection={1} glow="#ff0050" scale={1.5} />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[90vw] xl:max-w-4xl rounded-3xl bg-black/40 shadow-xl backdrop-blur-md ring-1 ring-white/10 sm:p-2">
          <GlowCard
          className="w-full"
          glowColor="38 92 40"
          backgroundColor="transparent"
          borderRadius={24}
          glowIntensity={0.90}
          colors={["#243B3F", "#152933", "#112630"]}
        >
          <div className="space-y-3 p-4 sm:space-y-4 sm:p-5 lg:space-y-5 lg:p-7">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">Romanian News Checker</h2>
              <p className="mt-1.5 text-xs text-zinc-300 sm:text-sm lg:text-base">
                Enter the title and text, then send to the backend for the ensemble model verdict.
              </p>
            </div>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="News title..."
              className="w-full rounded-2xl border border-white/20 bg-black/50 p-3 text-sm text-zinc-100 placeholder:text-zinc-400 backdrop-blur-md focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/35 transition-all shadow-inner sm:p-4"
            />

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Enter news text..."
              className="min-h-28 w-full resize-none rounded-2xl border border-white/20 bg-black/50 p-3 text-sm text-zinc-100 placeholder:text-zinc-400 backdrop-blur-md focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/35 transition-all shadow-inner sm:min-h-32 sm:p-4 lg:min-h-40"
            />

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full rounded-2xl border border-cyan-300/30 bg-cyan-500/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100 transition hover:bg-cyan-400/25 disabled:cursor-wait disabled:opacity-70 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.16em]"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {error ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="space-y-3 rounded-2xl border border-white/15 bg-black/40 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-cyan-300/20 bg-cyan-500/10 px-3 py-3 text-sm text-zinc-100">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/90">Ensemble (old text)</p>
                    <p className="mt-1 font-semibold">{result.rezultat_final || "N/A"}</p>
                    <p className="text-xs text-zinc-300">Confidence: {result.incredere_model || "N/A"}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-3 text-sm text-zinc-100">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-emerald-200/90">Ensemble (new text)</p>
                    <p className="mt-1 font-semibold">{result.rezultat_final_nou || "N/A"}</p>
                    <p className="text-xs text-zinc-300">Confidence: {result.incredere_model_nou || "N/A"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-300">A/B Comparison:</span>
                  <span className={`rounded-full px-3 py-1 font-semibold uppercase tracking-[0.12em] ${
                    result.acord_modele ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"
                  }`}>
                    {result.acord_modele ? "Models in agreement" : "Different verdicts"}
                  </span>
                </div>
                <div className="text-xs text-zinc-300">
                  Strategy: {result.mod_analiza_folosit || "N/A"}
                </div>

                <div className="mt-2 border-t border-white/10 pt-3 text-xs text-zinc-300 space-y-1">
                  <p>Title: {result.modele_individuale?.titlu || "N/A"}</p>
                  <p>Text: {result.modele_individuale?.text || result.modele_individuale?.text_vechi || "N/A"}</p>
                  {result.modele_individuale?.text_nou ? <p>Text (new): {result.modele_individuale.text_nou}</p> : null}
                  <p>Hybrid: {result.modele_individuale?.hibrid || "N/A"}</p>
                </div>
              </div>
            ) : null}
          </div>
        </GlowCard>
        </div>

        <div className="hidden flex-shrink-0 lg:block lg:scale-75 xl:scale-90 2xl:scale-100">
          <ModelFrame url="/coin.glb" rotationDirection={-1} glow="#f59e0b" scale={0.08} />
        </div>
      </div>
    </section>
  );
}