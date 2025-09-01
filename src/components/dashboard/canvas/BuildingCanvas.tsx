"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export type BuildingMode = "explore" | "inspect";

function BuildingModel() {
  const group = React.useRef<THREE.Group>(null!);

  // Simple procedural building: podium + tower with window insets
  const floors = 10;
  const unitsPerSide = 4;
  const floorHeight = 0.6;
  const towerWidth = 4;
  const towerDepth = 2.5;

  return (
    <group ref={group} position={[0, floors * floorHeight * 0.5, 0]}>
      {/* Podium */}
      <mesh castShadow receiveShadow position={[0, -floorHeight * 1.5, 0]}>
        <boxGeometry args={[towerWidth + 0.8, floorHeight * 2, towerDepth + 0.8]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Tower */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[towerWidth, floors * floorHeight, towerDepth]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Window grid as small insets */}
      {Array.from({ length: floors }).map((_, fi) =>
        Array.from({ length: unitsPerSide }).map((_, ui) => (
          <mesh
            key={`w-${fi}-${ui}`}
            position={[
              -towerWidth / 2 + 0.5 + (ui * (towerWidth - 1)) / (unitsPerSide - 1),
              -floors * floorHeight * 0.5 + floorHeight * (fi + 0.5),
              towerDepth / 2 + 0.01,
            ]}
          >
            <boxGeometry args={[0.25, 0.25, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.2} />
          </mesh>
        )),
      )}
      {/* Back windows */}
      {Array.from({ length: floors }).map((_, fi) =>
        Array.from({ length: unitsPerSide }).map((_, ui) => (
          <mesh
            key={`wb-${fi}-${ui}`}
            position={[
              -towerWidth / 2 + 0.5 + (ui * (towerWidth - 1)) / (unitsPerSide - 1),
              -floors * floorHeight * 0.5 + floorHeight * (fi + 0.5),
              -towerDepth / 2 - 0.01,
            ]}
          >
            <boxGeometry args={[0.25, 0.25, 0.02]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.2} />
          </mesh>
        )),
      )}
      {/* Simple logo spire */}
      <mesh castShadow receiveShadow position={[towerWidth / 3, floors * floorHeight * 0.55, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 12]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

export default function BuildingCanvas({ mode = "explore" as BuildingMode }) {
  const isExplore = mode === "explore";
  return (
    <Canvas shadows dpr={[1, 2]} className="rounded-lg bg-[hsl(var(--card))]">
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[6, 5, 7]} fov={isExplore ? 45 : 60} />

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 10, 5]}
        intensity={0.8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <shadowMaterial opacity={0.15} />
      </mesh>

      <BuildingModel />

      <OrbitControls
        enablePan={!isExplore}
        enableZoom
        autoRotate={isExplore}
        autoRotateSpeed={0.5}
        maxPolarAngle={isExplore ? Math.PI / 2.2 : Math.PI / 2}
        minDistance={3}
        maxDistance={18}
      />
    </Canvas>
  );
}
