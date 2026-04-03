"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

type StoryState = "idle" | "spreading" | "readyToClean" | "cleaning" | "cleaned";

function Figurine({
  url,
  side,
  baseRotationY,
  targetRotationY,
  baseScale,
  interactive,
  onTriggerStory,
}: {
  url: string;
  side: "left" | "right";
  baseRotationY: number;
  targetRotationY: number;
  baseScale: number;
  interactive: boolean;
  onTriggerStory: () => void;
}) {
  const groupRef = useRef<Group | null>(null);
  const { scene } = useGLTF(url);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Tie to the exact same normalized scroll progress (0.0 to 1.0) as the Globe
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min((typeof window !== "undefined" ? window.scrollY : 0) / maxScroll, 1);
    const spinEndProgress = 0.3;

    const spinProgress = Math.min(scrollProgress / spinEndProgress, 1);
    const scrollRotation = THREE.MathUtils.lerp(baseRotationY, targetRotationY, spinProgress);

    // Keep figurines in visually consistent places across different aspect ratios.
    const vpWidth = state.viewport.width;
    const vpHeight = state.viewport.height;

    const sideOffsetFactor = vpWidth < 6 ? 0.36 : 0.42;
    const targetX = (side === "left" ? -1 : 1) * vpWidth * sideOffsetFactor;
    const targetY = -vpHeight * 0.32;

    // Resize by aspect-driven viewport width (not raw pixel resolution).
    const aspectScale = THREE.MathUtils.clamp(vpWidth / 7.8, 0.55, 1);
    const targetScale = baseScale * aspectScale;

    groupRef.current.rotation.y = scrollRotation;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.16);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.16);
    groupRef.current.position.z = 0;
    groupRef.current.scale.setScalar(targetScale);
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;

    event.stopPropagation();
    onTriggerStory();
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1} onClick={handleClick}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/donald_trump_cartoon_carricature.glb");
useGLTF.preload("/kim_jong-un.glb");

export function FigurinesSides({
  storyState,
  onTriggerStory,
  canTriggerStory,
  opacity = 1,
}: {
  storyState: StoryState;
  onTriggerStory: () => void;
  canTriggerStory: boolean;
  opacity?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const interactive = canTriggerStory && (storyState === "idle" || storyState === "cleaned");

  const portal = (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] h-screen w-screen transition-opacity duration-1000 ease-out"
      style={{ opacity }}
      aria-hidden="true"
    >
      <Canvas
        className="pointer-events-auto h-full w-full"
        camera={{ position: [0, 1.15, 7.0], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2.5, 4, 2.5]} intensity={1.1} />
        <Suspense fallback={null}>
          <Figurine
            url="/donald_trump_cartoon_carricature.glb"
            side="left"
            baseRotationY={-1.5}
            targetRotationY={-0.25}
            baseScale={1.6}
            interactive={interactive}
            onTriggerStory={onTriggerStory}
          />
          <Figurine
            url="/kim_jong-un.glb"
            side="right"
            baseRotationY={0}
            targetRotationY={-1.35}
            baseScale={0.74}
            interactive={interactive}
            onTriggerStory={onTriggerStory}
          />
        </Suspense>
      </Canvas>
    </div>
  );

  return createPortal(portal, document.body);
}

