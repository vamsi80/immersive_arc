"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { BHK } from "@/types/types";   // ✅ import shared BHK

type Props = { bhk: BHK };

function BHKModel({ bhk }: { bhk: BHK }) {
  const modelPath: Record<BHK, string | undefined> = {
    "1BHK": "/models/1_BHK.glb",
    "2BHK": "/models/2_BHK.glb",
    "2.5BHK": "/models/2_5_BHK.glb",
    "3BHK": "/models/3_BHK.glb",
    "4BHK": "/models/4_BHK.glb",
  };

  const path = modelPath[bhk];
  if (!path) return null;

  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.2} />;
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

// ✅ preload using same shared paths
useGLTF.preload("/models/1_BHK.glb");
useGLTF.preload("/models/2_BHK.glb");
useGLTF.preload("/models/2_5_BHK.glb");
useGLTF.preload("/models/3_BHK.glb");
useGLTF.preload("/models/4_BHK.glb");
