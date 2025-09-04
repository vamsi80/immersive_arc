"use client";
import React, { useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei";
// import * as THREE from "three";
import { Block, Flat, BHK, FlatWithFloor } from "@/types/types";
import { Model, ModelHandle } from "@/components/Model";
// import { Mesh } from "three";

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
  // const isExplore = mode === "explore";

  const modelRef = useRef<ModelHandle>(null);

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.resetHighlight();

    const flatsToShow = filterBhk === "All" ? allFlats : filteredFlats;

    flatsToShow.forEach((flat) => {
      if (selectedFlat && flat.flatId === selectedFlat.flatId) {
        modelRef.current?.highlightFlat(flat.flatId, "blue");
        return;
      }
      if (flat.status === "sold") {
        modelRef.current?.highlightFlat(flat.flatId, "red");
        return;
      }
      if (flat.status === "reserved") {
        modelRef.current?.highlightFlat(flat.flatId, "orange");
        return;
      }
      if (flat.status === "available") {
        modelRef.current?.highlightFlat(flat.flatId, "green");
      }
    });

    console.log("🎯 Applied highlights for:", flatsToShow.map((f) => f.flatId));
  }, [allFlats, filteredFlats, selectedFlat, filterBhk, block.modelPath]);

  if (!block.modelPath) {
    return <div className="flex items-center justify-center h-full">No model available</div>;
  }

  <Suspense fallback={<Loader />}>
    <Model ref={modelRef} url={block.modelPath} />
    <Environment preset="city" intensity={0.1} />
  </Suspense>

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
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
        <Suspense fallback={<Loader />}>
          <Model ref={modelRef} url={block.modelPath} />
          <Environment preset="city" environmentIntensity={0.1} />
        </Suspense>

        <OrbitControls
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2.2}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>

      {/* Legend in corner */}
      <div className="absolute bottom-3 right-3 flex gap-3 bg-background/70 rounded-lg px-3 py-2 shadow text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Sold</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}
