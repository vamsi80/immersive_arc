"use client";
import React, { useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { Block, Flat, BHK, FlatWithFloor } from "@/types/types";
import { Model } from "@/components/Model";

export type BuildingMode = "explore" | "inspect";

type Props = {
  mode?: BuildingMode;
  block: Block;
  selectedFlat: Flat | null;
  filterBhk: BHK | "All";
  filteredFlats: FlatWithFloor[];
  allFlats: FlatWithFloor[];
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
  filteredFlats,
  allFlats,
}: Props) {
  const modelRef = useRef<any>(null);
  const isExplore = mode === "explore";

  useEffect(() => {
    if (!modelRef.current) return;

    // Step 1: reset all flats to neutral gray
    modelRef.current.resetHighlight();

    // Step 2: Decide which list to highlight
    const flatsToHighlight =
      filterBhk === "All" ? allFlats : filteredFlats;

      console.log("🎯 Highlighting these flats:", flatsToHighlight.map(f => f.flatId));

    // Step 3: Highlight based on status + selection
    flatsToHighlight.forEach((flat: FlatWithFloor) => {
      // Selection always wins
      if (selectedFlat && flat.flatId === selectedFlat.flatId) {
        modelRef.current.highlightFlat(flat.flatId, "yellow");
        return;
      }

      // Status-based colors
      if (flat.status === "sold") {
        modelRef.current.highlightFlat(flat.flatId, "red");
      } else if (flat.status === "reserved") {
        modelRef.current.highlightFlat(flat.flatId, "orange");
      } else if (flat.status === "available") {
        modelRef.current.highlightFlat(flat.flatId, "green");
      }
    });
  }, [allFlats, filteredFlats, selectedFlat, filterBhk]);

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
