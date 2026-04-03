"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type ModelConfig = {
  url: string;
  position: [number, number, number];
  scale: number;
  rotationDirection?: 1 | -1;
};

function Model({
  url,
  position,
  scale,
  rotationDirection = 1,
}: ModelConfig) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (!groupRef.current) return;
    const y = typeof window === "undefined" ? 0 : window.scrollY;
    groupRef.current.rotation.y = y * 0.0015 * rotationDirection;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/donald_trump_cartoon_carricature.glb");
useGLTF.preload("/kim_jong-un.glb");

function OneSideCanvas({ model }: { model: ModelConfig }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.1, 4.2], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.1} />
      <Suspense fallback={null}>
        <Model {...model} />
      </Suspense>
    </Canvas>
  );
}

export function SideModels3D() {
  const left = useMemo<ModelConfig>(
    () => ({
      url: "/donald_trump_cartoon_carricature.glb",
      position: [0, -0.35, 0],
      scale: 0.95,
      rotationDirection: 1,
    }),
    [],
  );

  const right = useMemo<ModelConfig>(
    () => ({
      url: "/kim_jong-un.glb",
      position: [0, -0.35, 0],
      scale: 1.05,
      rotationDirection: -1,
    }),
    [],
  );

  return (
    <>
      {/* Left model */}
      <div className="pointer-events-none absolute -left-24 top-1/2 z-0 hidden h-[520px] w-[420px] -translate-y-1/2 md:block xl:-left-44">
        <OneSideCanvas model={left} />
      </div>

      {/* Right model */}
      <div className="pointer-events-none absolute -right-24 top-1/2 z-0 hidden h-[520px] w-[420px] -translate-y-1/2 md:block xl:-right-44">
        <OneSideCanvas model={right} />
      </div>
    </>
  );
}

