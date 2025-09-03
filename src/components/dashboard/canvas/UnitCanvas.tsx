"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, useGLTF } from "@react-three/drei";
import { BHK } from "@/types/types";
import { bhkModels } from "@/types/bhkModels";

type Props = { bhk: BHK };

// ✅ Safe wrapper for GLTF loading
function SafeBHKModel({ bhk }: { bhk: BHK }) {
  const path = bhkModels[bhk];

  if (!path) {
    return (
      <Html center>
        <div className="text-xs text-red-500 bg-white/90 px-3 py-2 rounded-md shadow">
          Model not available for {bhk}
        </div>
      </Html>
    );
  }

  try {
    const { scene } = useGLTF(path);
    return <primitive object={scene} scale={1.2} />;
  } catch (e) {
    return (
      <Html center>
        <div className="text-xs text-red-500 bg-white/90 px-3 py-2 rounded-md shadow">
          Failed to load {bhk} model
        </div>
      </Html>
    );
  }
}

export default function UnitCanvas({ bhk }: Props) {
  return (
    <Canvas dpr={[1, 2]} className="rounded-md bg-[hsl(var(--card))]">
      <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />

      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />

      {/* Hemisphere light for natural sky/ground tint */}
      <hemisphereLight color={"#ffffff"} groundColor={"#bbbbbb"} intensity={0.6} />

      {/* Main key light */}
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-6, 6, -4]}
        intensity={0.5}
        color={"#ffeedd"}
      />

      {/* Rim light behind model for highlights */}
      <pointLight position={[0, 5, -5]} intensity={0.6} color={"#88ccff"} />

      {/* Model or loader */}
      <Suspense
        fallback={
          <Html center>
            <div className="text-xs text-muted-foreground bg-white/90 px-3 py-2 rounded-md shadow">
              Loading {bhk}...
            </div>
          </Html>
        }
      >
        <SafeBHKModel bhk={bhk} />
      </Suspense>

      <OrbitControls
        enablePan
        enableZoom
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={10}
      />
    </Canvas>

  );
}
