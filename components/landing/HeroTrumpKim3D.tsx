"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ModelProps = {
  url: string;
  position: [number, number, number];
  scale: number;
  rotationDirection?: 1 | -1;
};

function ScrollRotatingModel({
  url,
  position,
  scale,
  rotationDirection = 1,
  scrollYRef,
}: ModelProps & { scrollYRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (!groupRef.current) return;
    // Map scroll (px) to a nice rotation amount (radians).
    groupRef.current.rotation.y = scrollYRef.current * 0.0015 * rotationDirection;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/donald_trump_cartoon_carricature.glb");
useGLTF.preload("/kim_jong-un.glb");

function ScrollScene({ models }: { models: ModelProps[] }) {
  const scrollYRef = useRef(0);

  useFrame(() => {
    // Read window scroll inside the r3f loop so we don’t attach wheel listeners.
    // This keeps scrolling “owned” by the page and avoids zoomy-feeling interactions.
    scrollYRef.current = typeof window === "undefined" ? 0 : window.scrollY;
  });

  return (
    <group>
      {models.map((m) => (
        <ScrollRotatingModel key={m.url} {...m} scrollYRef={scrollYRef} />
      ))}
    </group>
  );
}

export function HeroTrumpKim3D() {
  const models = useMemo<ModelProps[]>(
    () => [
      {
        url: "/donald_trump_cartoon_carricature.glb",
        position: [-1.35, -0.15, 0],
        scale: 0.75,
        rotationDirection: 1,
      },
      {
        url: "/kim_jong-un.glb",
        position: [1.35, -0.15, 0],
        scale: 0.75,
        rotationDirection: -1,
      },
    ],
    [],
  );

  return (
    <div className="relative z-10 h-full w-full">
      <div className="absolute -inset-4 rounded-full bg-primary/20 blur-[100px]" />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1.2, 4.2], fov: 35 }}
        // No border/card — the hero layout will decide framing.
        className="relative h-full w-full"
        // Don’t capture scroll/wheel/pointer; page scroll should feel natural.
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2.5, 4, 3]} intensity={1.1} />

        <Suspense fallback={null}>
          <ScrollScene models={models} />
        </Suspense>

        <Environment preset="night" />
      </Canvas>

      <div className="pointer-events-none absolute -bottom-10 -left-10 z-20 rounded-lg border border-outline-variant/20 p-6 glass-card">
        <span className="font-headline text-4xl font-black text-secondary">
          99% FAKE
        </span>
        <p className="font-label text-xs uppercase text-white/60">
          Glazură detectată
        </p>
      </div>
    </div>
  );
}

