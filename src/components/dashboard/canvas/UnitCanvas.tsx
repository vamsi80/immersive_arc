"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";

export type BHK = "1BHK" | "2BHK" | "3BHK" | "4BHK";

type Props = { bhk?: BHK };

function BHKModel({ bhk }: { bhk: BHK }) {
  const modelPath = {
    "1BHK": "/models/1bhk.glb",
    "2BHK": "/models/2bhk.glb",
    "3BHK": "/models/3bhk.glb",
    "4BHK": "/models/4bhk.glb",
  }[bhk];

  const { scene } = useGLTF(modelPath);

  return <primitive object={scene} scale={1.2} />;
}

export default function UnitCanvas({ bhk }: Props) {
  if (!bhk) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Select a unit BHK
      </div>
    );
  }

  return (
    <Canvas dpr={[1, 2]} className="rounded-md bg-[hsl(var(--card))]">
      <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={55} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 10, 6]} intensity={0.8} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      <Suspense fallback={null}>
        <BHKModel bhk={bhk} />
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

// Preload models for performance
useGLTF.preload("/models/1bhk.glb");
useGLTF.preload("/models/2bhk.glb");
useGLTF.preload("/models/3bhk.glb");
useGLTF.preload("/models/4bhk.glb");
