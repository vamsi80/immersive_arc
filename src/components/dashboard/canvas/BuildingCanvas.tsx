"use client";
import React, { useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { Block, Flat, BHK } from "@/types/types";
import { Model } from "@/components/Model";

export type BuildingMode = "explore" | "inspect";

type Props = {
  mode?: BuildingMode;
  block: Block;
  selectedFlat: Flat | null;
  filterBhk: BHK | "All";
};

function Loader() {
  return (
    <Html center>
      <div className="text-xs bg-background/80 px-3 py-2 rounded">
        Loading model…
      </div>
    </Html>
  );
}

export default function BuildingCanvas({
  mode = "explore",
  block,
  selectedFlat,
  filterBhk,
}: Props) {
  const modelRef = useRef<any>(null);
  const isExplore = mode === "explore";

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.resetHighlight();

    // All flats
    const allFlats = Object.values(block.floors).flatMap(f => Object.values(f.flats));

    allFlats.forEach((flat) => {
      // Priority 1: Selected Flat
      if (selectedFlat && flat.flatId === selectedFlat.flatId) {
        modelRef.current.highlightFlat(flat.flatId, "yellow");
        return;
      }

      // Priority 2: Sold
      if (flat.status === "sold") {
        modelRef.current.highlightFlat(flat.flatId, "red");
        return;
      }

      // Priority 3: Filter by BHK
      if (filterBhk !== "All" && flat.bhk === filterBhk) {
        modelRef.current.highlightFlat(flat.flatId, flat.bhk === "2BHK" ? "blue" : "green");
      }
    });
  }, [block, selectedFlat, filterBhk]);

  if (!block.modelPath) {
    return <div className="flex items-center justify-center h-full">No model available</div>;
  }

  return (
    <Canvas dpr={[1, 2]} className="rounded-lg bg-[hsl(var(--card))]">
      <PerspectiveCamera makeDefault position={[6, 5, 7]} fov={60} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />

      <Suspense fallback={<Loader />}>
        <Model ref={modelRef} url={block.modelPath} />
        <Environment preset="city" intensity={0.1} />
      </Suspense>

      <OrbitControls
        enablePan={!isExplore}
        enableZoom
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={18}
      />
    </Canvas>
  );
}
