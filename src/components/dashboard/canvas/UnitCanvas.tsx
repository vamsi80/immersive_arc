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
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 10, 6]} intensity={0.8} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

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
