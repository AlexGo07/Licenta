"use client";

import { useMemo, useRef, useState } from "react";
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

function calculateRisk(text: string): number {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return 0;

  const sensationalTerms = ["soc", "urgent", "secret", "exclusiv", "imediat", "incredibil", "breaking"];
  const matches = sensationalTerms.reduce((sum, term) => sum + (normalized.includes(term) ? 1 : 0), 0);
  const punctuationWeight = Math.min(20, (normalized.match(/[!?]/g)?.length ?? 0) * 3);
  const termWeight = matches * 11;
  const lengthWeight = Math.min(28, Math.floor(normalized.length / 16));

  return Math.min(100, 16 + punctuationWeight + termWeight + lengthWeight);
}

export function PostMapCheckerSection() {
  const [content, setContent] = useState("");
  const score = useMemo(() => calculateRisk(content), [content]);
  const status = score < 35 ? "Likely reliable" : score < 70 ? "Needs verification" : "High fake-news risk";

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-10">
      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-10">
        <div className="flex-shrink-0">
          <ModelFrame url="/tik_tok_logo_with_true_topology.glb" rotationDirection={1} glow="#ff0050" scale={1.5} />
        </div>

        <div className="w-full max-w-3xl relative z-20 mx-auto rounded-3xl bg-black/40 shadow-xl backdrop-blur-md ring-1 ring-white/10 sm:p-4">
          <GlowCard
          className="w-full"
          glowColor="38 92 40"
          backgroundColor="transparent"
          borderRadius={24}
          glowIntensity={0.90}
          colors={["#243B3F", "#152933", "#112630"]}
        >
          <div className="space-y-5 p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Romanian News Checker</h2>
              <p className="mt-2 text-sm text-zinc-300 sm:text-base">
                Paste a suspicious snippet and inspect the estimated disinformation risk.
              </p>
            </div>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste article text, headline, or social post..."
              className="min-h-40 w-full resize-y rounded-2xl border border-white/20 bg-black/50 p-4 text-sm text-zinc-100 placeholder:text-zinc-400 backdrop-blur-md focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/35 transition-all shadow-inner"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
                <span>Fake-news probability</span>
                <span>{score}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-800/80 ring-1 ring-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-500 transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-sm font-medium text-zinc-100">Status: {status}</p>
            </div>
          </div>
        </GlowCard>
        </div>

        <div className="flex-shrink-0">
          <ModelFrame url="/coin.glb" rotationDirection={-1} glow="#f59e0b" scale={0.08} />
        </div>
      </div>
    </section>
  );
}