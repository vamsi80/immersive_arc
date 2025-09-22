"use client";
import React, { useEffect, useMemo, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei";
import { Block, Flat, BHK, FlatWithFloor } from "@/types/types";
import { Model, ModelHandle } from "@/components/Model";

export type BuildingMode = "explore" | "inspect";

type Props = {
  mode?: BuildingMode;
  block?: Block | null; // <-- allow missing block
  selectedFlat: Flat | null;
  filterBhk: BHK | "All";
  filteredFlats: FlatWithFloor[];
  allFlats: FlatWithFloor[];
};

function Loader() {
  return (
    <Html center>
      <div className="text-xs bg-background/80 px-3 py-2 rounded shadow">Loading model…</div>
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
  const modelRef = useRef<ModelHandle | null>(null);

  // modelUrl may be undefined if block or block.modelPath is missing
  const modelUrl = useMemo(() => block?.modelPath ?? undefined, [block?.modelPath]);

  // perf knobs for mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
  }, [allFlats, filteredFlats, selectedFlat, filterBhk, modelUrl]);

  // Small wrapper: if url exists, render Model (with required url prop).
  // If not, render a simple placeholder mesh (no external fetch).
  function BlockModel({ url }: { url?: string | undefined }) {
    if (!url) {
      return (
        // placeholder sits inside the canvas and avoids any network fetch
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial />
        </mesh>
      );
    }

    // url exists — render Model (Model expects prop `url`)
    return <Model ref={modelRef} url={url} />;
  }

  return (
    <div className="relative w-full h-full min-h-0">
      <Canvas
        frameloop="demand"
        dpr={[1, isMobile ? 1.5 : 2]}
        className="bg-[hsl(var(--card))]"
        gl={{
          powerPreference: "high-performance",
          antialias: !isMobile,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        style={{ touchAction: "none" }}
        onCreated={({ gl }) => {
          gl.getContext().canvas.addEventListener(
            "webglcontextlost",
            (e) => e.preventDefault(),
            { passive: false }
          );
        }}
      >
        <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />

        {/* lights */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow={!isMobile}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <ambientLight intensity={0.2} />

        <Suspense fallback={<Loader />}>
          <BlockModel url={modelUrl} />
          <Environment preset="city" environmentIntensity={1} />
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

      <div className="absolute bottom-3 right-3 flex gap-3 bg-background/70 rounded-lg px-3 py-2 shadow text-xs">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Sold</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}
