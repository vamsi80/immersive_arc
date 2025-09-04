"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html, useGLTF } from "@react-three/drei";
import { BHK } from "@/types/types";
import { bhkModels } from "@/types/bhkModels";

type Props = { bhk: BHK };

function SafeBHKModel({ bhk }: { bhk: BHK }) {
  const path = bhkModels[bhk];

  // Always call hook; fallback to placeholder
  const { scene } = useGLTF(path ?? "/placeholder.glb");

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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Preload current BHK (optional)
  useMemo(() => {
    const path = bhkModels[bhk];
    if (path) useGLTF.preload(path);
  }, [bhk]);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, isMobile ? 1.5 : 2]}
      className="rounded-md bg-[hsl(var(--card))]"
      gl={{ powerPreference: "high-performance", antialias: !isMobile, alpha: true }}
      style={{ touchAction: "none" }}
    >
      <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />

      <ambientLight intensity={0.4} />
      <hemisphereLight color="#ffffff" groundColor="#bbbbbb" intensity={0.6} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={isMobile ? 0.9 : 1.2}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 1024 : 2048}
        shadow-mapSize-height={isMobile ? 1024 : 2048}
      />
      <directionalLight position={[-6, 6, -4]} intensity={0.5} color="#ffeedd" />
      <pointLight position={[0, 5, -5]} intensity={0.6} color="#88ccff" />

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
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
