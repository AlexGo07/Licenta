"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import type { Group, Mesh } from "three";

type StoryState = "idle" | "spreading" | "readyToClean" | "cleaning" | "cleaned";

type ScrollGlobeProps = {
  storyState: StoryState;
  onMapFullyInfected: () => void;
  onMapCleaned: () => void;
  onMapReadyChange: (isReady: boolean) => void;
  opacity?: number;
};

const CITY_PINS = [
  { name: "Timisoara", position: [-120, 9, 0.35], delay: 0.80 },
  { name: "Oradea", position: [-110, -33, 0.35], delay: 0.76 },
  { name: "Cluj", position: [-77, -29, 0.35], delay: 0.86 },
  { name: "Sibiu", position: [-60, -0.05, 0.35], delay: 0.24 },
  { name: "Brasov", position: [-32, -0.12, 0.35], delay: 0.32 },
  { name: "Craiova", position: [-63, 46, 0.35], delay: 0.4 },
  { name: "Bucharest", position: [-15, 35, 0.35], delay: 0.94 },
  { name: "Galati", position: [21, -2, 0.35], delay: 0.56 },
  { name: "Iasi", position: [2, -53, 0.35], delay: 0.64 },
  { name: "Constanta", position: [40, 33, 0.35], delay: 0.72 },
  { name: "Bacau", position: [-8, -32, 0.35], delay: 0.16 },
  { name: "Arad", position: [-120, -3, 0.35], delay: 0.25 },
  { name: "Satu Mare", position: [-93, -56, 0.35], delay: 0.35 },
  { name: "Baia Mare", position: [-80, -55, 0.35], delay: 0.30 },
  { name: "Buzau", position: [-3, 11, 0.35], delay: 0.5 },
  { name: "Ploiesti", position: [-19, 20, 0.35], delay: 0.45 },
  { name: "Focsani", position: [3, -7, 0.35], delay: 0.52 },
  { name: "Resita", position: [-105, 21, 0.35], delay: 0.28 },
  { name: "Pitesti", position: [-43, 26, 0.35], delay: 0.38 },
  { name: "Tulcea", position: [40, 5, 0.35], delay: 0.6 },
  { name: "Slatina", position: [-51, 41, 0.35], delay: 0.44 },
  { name: "Zalau", position: [-89, -39, 0.35], delay: 0.22 },
  { name: "Targu Mures", position: [-56, -23, 0.35], delay: 0.26 },
  { name: "Drobeta-Turnu Severin", position: [-83, 37, 0.35], delay: 0.48 },
  { name: "Alba Iulia", position: [-73, -7, 0.35], delay: 0.18 },
  { name: "Deva", position: [-86, 1, 0.35], delay: 0.2 },
  { name: "Slobozia", position: [12, 27, 0.35], delay: 0.58 },
  { name: "Calarasi", position: [13, 38, 0.35], delay: 0.62 },
  { name: "Giurgiu", position: [-15, 53, 0.35], delay: 0.54 },
  { name: "Bistrita", position: [-59.5, -42, 0.35], delay: 0.34 },
  { name: "Suceava", position: [-26.5, -62, 0.35], delay: 0.42 },
  { name: "Vaslui", position: [8, -37, 0.35], delay: 0.5 },
  { name: "Targoviste", position: [-31.5, 21.7, 0.35], delay: 0.46 },
  { name: "Ramnicu Valcea", position: [-54, 20.3, 0.35], delay: 0.36 },
  { name: "Miercurea Ciuc", position: [-29.8, -22, 0.35], delay: 0.32 },
  { name: "Sfantu Gheorghe", position: [-28, -7, 0.35], delay: 0.3 },
  { name: "targu Jiu", position: [-75.5, 26, 0.35], delay: 0.28 },
  { name: "Braila", position: [21, 5, 0.35], delay: 0.24 },
  { name: "Alexandria", position: [-29, 52, 0.35], delay: 0.4 },
  { name: "Piatra Neamț", position: [-21.7, -41, 0.35], delay: 0.44 },
  { name: "Botoșani", position: [-19, -67, 0.35], delay: 0.48 },
] as const;

function CityPin({
  position,
  delay,
  spreadProgressRef,
  cleanProgressRef,
  storyState,
  sizeMultiplier,
}: {
  position: readonly [number, number, number];
  delay: number;
  spreadProgressRef: MutableRefObject<number>;
  cleanProgressRef: MutableRefObject<number>;
  storyState: StoryState;
  sizeMultiplier: number;
}) {
  const pinRef = useRef<Mesh | null>(null);
  const glowRef = useRef<Mesh | null>(null);

  useFrame((state) => {
    if (!pinRef.current || !glowRef.current) return;

    const spreadAmount = THREE.MathUtils.clamp((spreadProgressRef.current - delay) / 0.12, 0, 1);
    const cleanAmount = THREE.MathUtils.clamp((cleanProgressRef.current - delay) / 0.12, 0, 1);
    const influence = storyState === "cleaning" || storyState === "cleaned" ? cleanAmount : spreadAmount;

    const neutral = new THREE.Color("#046DEC");
    const infected = new THREE.Color("#ef4444");
    const cleaned = new THREE.Color("#22c55e");
    const targetColor =
      storyState === "cleaning" || storyState === "cleaned"
        ? infected.clone().lerp(cleaned, influence)
        : neutral.clone().lerp(infected, influence);

    const pinMaterial = pinRef.current.material as THREE.MeshBasicMaterial;
    const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;

    pinMaterial.color.lerp(targetColor, 0.2);
    pinMaterial.opacity = 0.9;

    glowMaterial.color.lerp(targetColor, 0.2);
    glowMaterial.opacity = 0.12 + influence * 0.25;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 5.5 + delay * 10) * 0.05 * influence;
    pinRef.current.scale.setScalar(pulse * sizeMultiplier);
    glowRef.current.scale.setScalar((1.75 + influence * 0.45) * sizeMultiplier);
  });

  return (
    <group position={position}>
      <mesh ref={glowRef} renderOrder={1}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.12} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
      <mesh ref={pinRef} renderOrder={2}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial
          color="#cbd5e1"
          transparent
          opacity={0.95}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CityPins({
  spreadProgressRef,
  cleanProgressRef,
  storyState,
  sizeMultiplier,
  visible,
}: {
  spreadProgressRef: MutableRefObject<number>;
  cleanProgressRef: MutableRefObject<number>;
  storyState: StoryState;
  sizeMultiplier: number;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <group>
      {CITY_PINS.map((city) => (
        <CityPin
          key={city.name}
          position={city.position}
          delay={city.delay}
          spreadProgressRef={spreadProgressRef}
          cleanProgressRef={cleanProgressRef}
          storyState={storyState}
          sizeMultiplier={sizeMultiplier}
        />
      ))}
    </group>
  );
}

function GlobeModel({
  scaleMultiplier,
  storyState,
  onMapFullyInfected,
  onMapCleaned,
  onMapReadyChange,
}: {
  scaleMultiplier: number;
  storyState: StoryState;
  onMapFullyInfected: () => void;
  onMapCleaned: () => void;
  onMapReadyChange: (isReady: boolean) => void;
}) {
  const containerRef = useRef<Group | null>(null);
  const globeRef = useRef<Group | null>(null);
  const romaniaRef = useRef<Group | null>(null);
  const spreadProgressRef = useRef(0);
  const cleanProgressRef = useRef(0);
  const infectionNotifiedRef = useRef(false);
  const cleanNotifiedRef = useRef(false);
  const mapReadyRef = useRef(false);
  const currentContainerScaleRef = useRef(1);
  const currentRomaniaScaleRef = useRef(1);

  const { scene: globeScene } = useGLTF("/globe.glb");
  const { scene: romaniaScene } = useGLTF("/Romania.glb");
  const currentSpin = useRef(0);

  // --- HARDCODED ANIMATION PHASES ---
  // Phase 1 ending state (Globe lands on Romania)
  const GLOBE_START_SCALE = 0.7 * scaleMultiplier;
  const GLOBE_END_SCALE = 1.3 * scaleMultiplier;

  // Globe XY placement can be tuned separately for desktop and mobile.
  const GLOBE_DESKTOP_START_X = -0.5;
  const GLOBE_DESKTOP_END_X = -0.5;
  const GLOBE_DESKTOP_START_Y = -1.7;
  const GLOBE_DESKTOP_END_Y = -1.3;

  const GLOBE_MOBILE_START_X = -0.5;
  const GLOBE_MOBILE_END_X = -0.4;
  const GLOBE_MOBILE_START_Y = -0.6;
  const GLOBE_MOBILE_END_Y = -1.15;

  const isMobile = scaleMultiplier < 1;
  const GLOBE_START_X = isMobile ? GLOBE_MOBILE_START_X : GLOBE_DESKTOP_START_X;
  const GLOBE_END_X = isMobile ? GLOBE_MOBILE_END_X : GLOBE_DESKTOP_END_X;
  const GLOBE_START_Y = isMobile ? GLOBE_MOBILE_START_Y : GLOBE_DESKTOP_START_Y;
  const GLOBE_END_Y = isMobile ? GLOBE_MOBILE_END_Y : GLOBE_DESKTOP_END_Y;
  const GLOBE_TARGET_ROT_X = 0.17;
  const GLOBE_TARGET_ROT_Y = 0.5;

  // Phase 2 ending state (Romania detaches)
  const ROMANIA_START_SCALE = 0.0;
  const ROMANIA_END_SCALE = 0.02;

  // === DESKTOP POSITION ===
  const ROMANIA_POS_DESKTOP_X = 1.2;
  const ROMANIA_POS_DESKTOP_Y = 0.5;
  const ROMANIA_POS_DESKTOP_Z = -0.7;

  // === MOBILE POSITION (Adjust these separately for mobile!) ===
  const ROMANIA_POS_MOBILE_X = 2;
  const ROMANIA_POS_MOBILE_Y = -4;
  const ROMANIA_POS_MOBILE_Z = -4;

  // Choose the right position based on device size
  const ROMANIA_END_POS_X = isMobile ? ROMANIA_POS_MOBILE_X : ROMANIA_POS_DESKTOP_X;
  const ROMANIA_END_POS_Y = isMobile ? ROMANIA_POS_MOBILE_Y : ROMANIA_POS_DESKTOP_Y;
  const ROMANIA_END_POS_Z = isMobile ? ROMANIA_POS_MOBILE_Z : ROMANIA_POS_DESKTOP_Z;

  // If the map is lying flat and facing away, -Math.PI / 2 (or Math.PI / 2) will stand it up to face the camera.
  // Math.PI = 180 degrees. Math.PI / 2 = 90 degrees.
  const ROMANIA_ROT_X = Math.PI / 2 + 0.5;
  const ROMANIA_ROT_Y = 0;
  const ROMANIA_ROT_Z = 0.3;

  const GLOBE_FALLBACK_Z = -2.0;
  const IDLE_SCROLL_END = 0.18;
  const MAP_SCROLL_PORTION = 0.5;

  useEffect(() => {
    if (storyState === "idle" || storyState === "spreading") {
      spreadProgressRef.current = 0;
      cleanProgressRef.current = 0;
      infectionNotifiedRef.current = false;
      cleanNotifiedRef.current = false;
    }

    if (storyState === "cleaning") {
      cleanProgressRef.current = 0;
      cleanNotifiedRef.current = false;
    }

    if (storyState === "cleaned") {
      spreadProgressRef.current = 1;
      cleanProgressRef.current = 1;
    }
  }, [storyState]);

  useFrame((state, delta) => {
    if (!containerRef.current || !globeRef.current || !romaniaRef.current) return;

    // Calculate normalized scroll progress
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = Math.min((typeof window !== "undefined" ? window.scrollY : 0) / maxScroll, 1);
    const mapPhaseProgress = Math.min(scrollProgress / MAP_SCROLL_PORTION, 1);

    // Phase 0: Idle spin only (no zoom) while SEO text still overlaps the globe.
    // After IDLE_SCROLL_END, remap the remaining scroll range to the old p1/p2 timeline.
    const adjustedScroll = THREE.MathUtils.clamp(
      (mapPhaseProgress - IDLE_SCROLL_END) / (1 - IDLE_SCROLL_END),
      0,
      1,
    );

    // Split adjusted scroll into two phases:
    // p1: 0.0 to 0.3 (Globe zooms in and locks onto Romania)
    // p2: 0.3 to 1.0 (Globe sinks back, Romania map pops out)
    const p1 = Math.min(adjustedScroll / 0.3, 1);
    const p2 = Math.max(0, (adjustedScroll - 0.3) / 0.7);
    const mapIsReady = p2 >= 0.995;

    if (mapIsReady !== mapReadyRef.current) {
      mapReadyRef.current = mapIsReady;
      onMapReadyChange(mapIsReady);
    }

    if (storyState === "spreading") {
      spreadProgressRef.current = Math.min(1, spreadProgressRef.current + delta * 0.25);

      if (spreadProgressRef.current >= 1 && !infectionNotifiedRef.current) {
        infectionNotifiedRef.current = true;
        onMapFullyInfected();
      }
    } else if (storyState === "readyToClean" || storyState === "cleaning" || storyState === "cleaned") {
      spreadProgressRef.current = 1;
    }

    if (storyState === "cleaning") {
      cleanProgressRef.current = Math.min(1, cleanProgressRef.current + delta * 0.35);

      if (cleanProgressRef.current >= 1 && !cleanNotifiedRef.current) {
        cleanNotifiedRef.current = true;
        onMapCleaned();
      }
    } else if (storyState === "cleaned") {
      cleanProgressRef.current = 1;
    }

    // === PHASE 1: CONTAINER POSITION & SCALE ===
    const targetScale = GLOBE_START_SCALE + (GLOBE_END_SCALE - GLOBE_START_SCALE) * p1;
    const targetX = GLOBE_START_X + (GLOBE_END_X - GLOBE_START_X) * p1;
    const targetY = GLOBE_START_Y + (GLOBE_END_Y - GLOBE_START_Y) * p1;

    containerRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    containerRef.current.position.lerp(new THREE.Vector3(targetX, targetY, 0), 0.1);
    currentContainerScaleRef.current = containerRef.current.scale.x;

    // === PHASE 1: CONTAINER ROTATION ===
    if (adjustedScroll <= 0) {
      // Idle spinning near the top
      currentSpin.current += delta * 0.2;
      const idleRotX = -0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;

      containerRef.current.rotation.x = THREE.MathUtils.lerp(containerRef.current.rotation.x, idleRotX, 0.1);
      containerRef.current.rotation.y = currentSpin.current;
    } else {
      // Lock rotation onto Romania
      containerRef.current.rotation.x = THREE.MathUtils.lerp(containerRef.current.rotation.x, GLOBE_TARGET_ROT_X, 0.1);

      let diff = GLOBE_TARGET_ROT_Y - (containerRef.current.rotation.y % (Math.PI * 2));
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      // Lock rotation smoothly, but clamp it hard once p2 starts
      const rotSpeed = p2 > 0 ? 0.3 : 0.1;
      containerRef.current.rotation.y += diff * rotSpeed;
      currentSpin.current = containerRef.current.rotation.y;
    }

    // === PHASE 2: ROMANIA MAP DETACHES ===
    // Scale up the Romania map
    const romTargetScale = ROMANIA_START_SCALE + p2 * (ROMANIA_END_SCALE - ROMANIA_START_SCALE);
    romaniaRef.current.scale.lerp(new THREE.Vector3(romTargetScale, romTargetScale, romTargetScale), 0.1);
    currentRomaniaScaleRef.current = Math.max(0.0001, romaniaRef.current.scale.x);

    // Slide map to its final position
    const romTargetX = p2 * ROMANIA_END_POS_X;
    const romTargetY = p2 * ROMANIA_END_POS_Y;
    const romTargetZ = p2 * ROMANIA_END_POS_Z;
    romaniaRef.current.position.lerp(new THREE.Vector3(romTargetX, romTargetY, romTargetZ), 0.1);

    // Sink the globe backwards and scale it down to 0 so it completely disappears!
    const globeTargetZ = p2 * GLOBE_FALLBACK_Z;
    const globeTargetScale = Math.max(0, 1.0 - p2 * 1.5);

    globeRef.current.position.lerp(new THREE.Vector3(0, 0, globeTargetZ), 0.1);
    globeRef.current.scale.lerp(new THREE.Vector3(globeTargetScale, globeTargetScale, globeTargetScale), 0.1);
  });

  return (
    <group ref={containerRef}>
      <group ref={globeRef}>
        <primitive object={globeScene} />
      </group>
      <group ref={romaniaRef} rotation={[ROMANIA_ROT_X, ROMANIA_ROT_Y, ROMANIA_ROT_Z]}>
        <primitive object={romaniaScene} />
        <CityPins
          spreadProgressRef={spreadProgressRef}
          cleanProgressRef={cleanProgressRef}
          storyState={storyState}
          sizeMultiplier={Math.max(10, 1 / (currentContainerScaleRef.current * currentRomaniaScaleRef.current))}
          visible={mapReadyRef.current}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/globe.glb");
useGLTF.preload("/Romania.glb");

export function ScrollGlobe({
  storyState,
  onMapFullyInfected,
  onMapCleaned,
  onMapReadyChange,
  opacity = 1,
}: ScrollGlobeProps) {
  const [mounted, setMounted] = useState(false);
  const [scaleMultiplier, setScaleMultiplier] = useState(1);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      const width = window.innerWidth;
      // Shrink proportionally if on a smaller screen (below 768px)
      setScaleMultiplier(width < 768 ? Math.max(0.5, width / 768) : 1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const portal = (
    <div
      className="fixed inset-0 z-0 h-screen w-screen transition-opacity duration-1000 ease-out"
      style={{ 
        opacity,
        pointerEvents: opacity > 0 ? "auto" : "none",
        display: opacity > 0 ? "block" : "none"
      }}
      aria-hidden="true"
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 4.5, 3.5], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ camera }) => {
          camera.lookAt(-0.1, 3.75, 2.8);
        }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[0.0, 4.2, 3]} intensity={1.5} />
        <GlobeModel
          scaleMultiplier={scaleMultiplier}
          storyState={storyState}
          onMapFullyInfected={onMapFullyInfected}
          onMapCleaned={onMapCleaned}
          onMapReadyChange={onMapReadyChange}
        />
      </Canvas>
    </div>
  );

  return createPortal(portal, document.body);
}

