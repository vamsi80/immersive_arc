"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, useGLTF } from "@react-three/drei";
import { BHK } from "@/types/types";
import { bhkModels } from "@/types/bhkModels";

type Props = { bhk: BHK };

function SafeBHKModel({ bhk }: { bhk: BHK }) {
  const path = bhkModels[bhk];

  // ✅ Always call hook, use fallback path if missing
  const { scene } = useGLTF(path ?? "/placeholder.glb");

  // If path is invalid, show message instead of model
  if (!path) {
    return (
      <Html center>
        <div className="text-xs text-red-500 bg-white/90 px-3 py-2 rounded-md shadow">
          Model not available for {bhk}
        </div>
      </Html>
    );
  }

  return <primitive object={scene} scale={1.2} />;
}


export default function UnitCanvas({ bhk }: Props) {
  return (
    <Canvas dpr={[1, 2]} className="rounded-md bg-[hsl(var(--card))]">
      <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />

      <ambientLight intensity={0.4} />
      <hemisphereLight color={"#ffffff"} groundColor={"#bbbbbb"} intensity={0.6} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 6, -4]} intensity={0.5} color={"#ffeedd"} />
      <pointLight position={[0, 5, -5]} intensity={0.6} color={"#88ccff"} />

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
