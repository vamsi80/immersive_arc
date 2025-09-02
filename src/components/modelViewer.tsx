"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";

import CameraController from "./CameraController";
import { Model } from "./Model";
import * as THREE from "three";

const ModelViewer = () => {
  const modelRef = useRef<any>(null);

  const data = [
    { flatId: "flat_101", material: "flat_101", bhk: "2BHK", sqft: 600, sold: false, floor: 1, block: "A" },
    { flatId: "flat_102", material: "flat_102", bhk: "2BHK", sqft: 900, sold: false, floor: 1, block: "A" },
    { flatId: "flat_201", material: "flat_201", bhk: "1BHK", sqft: 610, sold: false, floor: 2, block: "A" },
    { flatId: "flat_202", material: "flat_202", bhk: "2BHK", sqft: 920, sold: false, floor: 2, block: "A" },
    { flatId: "flat_301", material: "flat_301", bhk: "1BHK", sqft: 620, sold: true, floor: 3, block: "A" },
    { flatId: "flat_302", material: "flat_302", bhk: "2BHK", sqft: 930, sold: false, floor: 3, block: "A" },
    { flatId: "flat_401", material: "flat_401", bhk: "1BHK", sqft: 630, sold: false, floor: 4, block: "A" },
    { flatId: "flat_402", material: "flat_402", bhk: "2BHK", sqft: 940, sold: true, floor: 4, block: "A" },
    { flatId: "flat_501", material: "flat_501", bhk: "1BHK", sqft: 640, sold: false, floor: 5, block: "A" },
    { flatId: "flat_502", material: "flat_502", bhk: "2BHK", sqft: 950, sold: false, floor: 5, block: "A" },
    { flatId: "flat_601", material: "flat_601", bhk: "1BHK", sqft: 650, sold: false, floor: 6, block: "A" },
    { flatId: "flat_602", material: "flat_602", bhk: "2BHK", sqft: 960, sold: false, floor: 6, block: "A" },
    { flatId: "flat_701", material: "flat_701", bhk: "1BHK", sqft: 660, sold: false, floor: 7, block: "A" },
    { flatId: "flat_702", material: "flat_702", bhk: "2BHK", sqft: 970, sold: false, floor: 7, block: "A" },
    { flatId: "flat_801", material: "flat_801", bhk: "1BHK", sqft: 670, sold: false, floor: 8, block: "A" },
    { flatId: "flat_802", material: "flat_802", bhk: "2BHK", sqft: 980, sold: false, floor: 8, block: "A" },
    { flatId: "flat_901", material: "flat_901", bhk: "1BHK", sqft: 680, sold: false, floor: 9, block: "A" },
    { flatId: "flat_902", material: "flat_902", bhk: "2BHK", sqft: 990, sold: false, floor: 9, block: "A" },
    { flatId: "flat_1001", material: "flat_1001", bhk: "1BHK", sqft: 690, sold: false, floor: 10, block: "A" },
    { flatId: "flat_1002", material: "flat_1002", bhk: "2BHK", sqft: 1000, sold: false, floor: 10, block: "A" },
    { flatId: "flat_1101", material: "flat_1101", bhk: "1BHK", sqft: 700, sold: false, floor: 11, block: "A" },
    { flatId: "flat_1102", material: "flat_1102", bhk: "2BHK", sqft: 1010, sold: false, floor: 11, block: "A" },
    { flatId: "flat_1201", material: "flat_1201", bhk: "1BHK", sqft: 710, sold: false, floor: 12, block: "A" },
    { flatId: "flat_1202", material: "flat_1202", bhk: "2BHK", sqft: 1020, sold: false, floor: 12, block: "A" },
    { flatId: "flat_1301", material: "flat_1301", bhk: "1BHK", sqft: 720, sold: false, floor: 13, block: "A" },
    { flatId: "flat_1302", material: "flat_1302", bhk: "2BHK", sqft: 1030, sold: false, floor: 13, block: "A" },
    { flatId: "flat_1401", material: "flat_1401", bhk: "1BHK", sqft: 730, sold: false, floor: 14, block: "A" },
    { flatId: "flat_1402", material: "flat_1402", bhk: "2BHK", sqft: 1040, sold: false, floor: 14, block: "A" },
    { flatId: "flat_1501", material: "flat_1501", bhk: "1BHK", sqft: 740, sold: false, floor: 15, block: "A" },
    { flatId: "flat_1502", material: "flat_1502", bhk: "2BHK", sqft: 1050, sold: false, floor: 15, block: "A" },
    { flatId: "flat_1601", material: "flat_1601", bhk: "1BHK", sqft: 750, sold: false, floor: 16, block: "A" },
    { flatId: "flat_1602", material: "flat_1602", bhk: "2BHK", sqft: 1060, sold: false, floor: 16, block: "A" },
    { flatId: "flat_1701", material: "flat_1701", bhk: "1BHK", sqft: 760, sold: false, floor: 17, block: "A" },
    { flatId: "flat_1702", material: "flat_1702", bhk: "2BHK", sqft: 1070, sold: false, floor: 17, block: "A" },
    { flatId: "flat_1801", material: "flat_1801", bhk: "1BHK", sqft: 770, sold: false, floor: 18, block: "A" },
    { flatId: "flat_1802", material: "flat_1802", bhk: "2BHK", sqft: 1080, sold: false, floor: 18, block: "A" },
    { flatId: "flat_1901", material: "flat_1901", bhk: "1BHK", sqft: 780, sold: false, floor: 19, block: "A" },
    { flatId: "flat_1902", material: "flat_1902", bhk: "2BHK", sqft: 1090, sold: false, floor: 19, block: "A" },
    { flatId: "flat_2001", material: "flat_2001", bhk: "1BHK", sqft: 790, sold: false, floor: 20, block: "A" },
    { flatId: "flat_2002", material: "flat_2002", bhk: "2BHK", sqft: 1100, sold: false, floor: 20, block: "A" }
  ];

  const [filter, setFilter] = useState<"all" | "1BHK" | "2BHK">("all");
  const [view, setView] = useState<"front" | "top" | "left" | "right">("front");

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current?.resetHighlight();

    data.forEach((flat) => {
      if (flat.sold) {
        modelRef.current?.highlightMaterial(flat.material, "red");
      } else {
        if (filter === "all" || flat.bhk === filter) {
          if (flat.bhk === "1BHK") {
            modelRef.current?.highlightMaterial(flat.material, "blue");
          } else if (flat.bhk === "2BHK") {
            modelRef.current?.highlightMaterial(flat.material, "green");
          }
        }
      }
    });
  }, [filter, data]);

  const cycleViews = () => {
    if (view === "front") setView("right");
    else if (view === "right") setView("left");
    else if (view === "left") setView("top");
    else setView("front");
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black text-white overflow-hidden">
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <label>Filter by BHK:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-2 py-1 text-black"
        >
          <option value="all">All</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
        </select>
      </div>

      <button
        className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded z-10"
        onClick={cycleViews}
      >
        Switch View (Current: {view})
      </button>

      <Canvas
        // shadows
        camera={{ position: [10, 10, 20], fov: 7 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.1} />

        <Suspense fallback={null}>
          <Model ref={modelRef} url="/BLOCK_A.glb" />
          <Environment preset="city" background={false} intensity={0.02} />
        </Suspense>

        {/* <ContactShadows
          position={[0, -1, 0]}
          opacity={0.5}
          scale={20}
          blur={2.5}
        /> */}

        <CameraController view={view} />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
