"use client";

import { useState, useMemo, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { demoData } from "@/types/demoData";
import { Society, Block, Unit, BHK, Availability } from "@/types/types";
import SidebarNav from "@/components/SidebarNav";
import Topbar from "@/components/Topbar";
import BuildingPanel from "@/components/dashboard/BuildingPanel";
import RightPanel from "@/components/dashboard/RightPanel";
import { BuildingMode } from "@/components/dashboard/canvas/BuildingCanvas";

export default function DashboardPage() {
  const [societies] = useState<Society[]>(demoData);
  const [selectedSocietyId, setSelectedSocietyId] = useState(societies[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState(
    societies[0].blocks[0].id,
  );

  const selectedSociety = societies.find((s) => s.id === selectedSocietyId)!;
  const selectedBlock = selectedSociety.blocks.find(
    (b) => b.id === selectedBlockId,
  )!;
  const [filterBhk, setFilterBhk] = useState<BHK | "All">("All");

  const [mode, setMode] = useState<BuildingMode>("explore");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // ensure reset on society change
  const onSelectSociety = (id: string) => {
    setSelectedSocietyId(id);
    const s = societies.find((x) => x.id === id)!;
    setSelectedBlockId(s.blocks[0].id);
    setSelectedUnit(null);
  };

  return (
    <SidebarProvider>
      <SidebarNav
        societies={societies}
        selectedSocietyId={selectedSocietyId}
        onSelectSociety={onSelectSociety}
        selectedBlockId={selectedBlockId}
        onSelectBlock={(id) => {
          setSelectedBlockId(id);
          setSelectedUnit(null);
        }}
      />
      <SidebarInset>
        <Topbar
          mode={mode}
          setMode={setMode}
          societyName={selectedSociety.name}
          blockName={selectedBlock.name}
        />
        <div className="grid grid-cols-[1fr_620px] gap-4 p-4 h-[calc(100svh-56px)] overflow-hidden">
          <BuildingPanel
            mode={mode}
            selectedBlock={selectedBlock}
            selectedSociety={selectedSociety}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
            filterBhk={filterBhk}
          />
          <RightPanel
            selectedBlock={selectedBlock}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
