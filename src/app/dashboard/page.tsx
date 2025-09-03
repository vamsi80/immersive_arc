"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { demoData } from "@/types/demoData";
import { Project, Flat, BHK, FlatWithFloor, FlatStatus } from "@/types/types";
import SidebarNav from "@/components/SidebarNav";
import Topbar from "@/components/Topbar";
import BuildingPanel from "@/components/dashboard/BuildingPanel";
import RightPanel from "@/components/dashboard/RightPanel";
import { BuildingMode } from "@/components/dashboard/canvas/BuildingCanvas";

export default function DashboardPage() {
  // Load projects
  const [projects] = useState<Project[]>(Object.values(demoData.projects));
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].projectId);
  const [selectedBlockId, setSelectedBlockId] = useState(
    Object.values(projects[0].blocks)[0].blockId
  );

  const selectedProject = projects.find((p) => p.projectId === selectedProjectId)!;
  const selectedBlock = selectedProject.blocks[selectedBlockId];

  // Selections
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);

  // Filters & Mode
  const [query, setQuery] = useState("");
  const [filterBhk, setFilterBhk] = useState<BHK | "All">("All");
  const [filterFloor, setFilterFloor] = useState<string | "All">("All");
  const [filterStatus, setFilterStatus] = useState<FlatStatus | "All">("All");
  const [mode, setMode] = useState<BuildingMode>("explore");

  // Reset on project change
  const onSelectProject = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find((x) => x.projectId === id)!;
    setSelectedBlockId(Object.values(proj.blocks)[0].blockId);
    setSelectedFlat(null);
    setSelectedFloorId(null);
  };

  // ✅ All flats
  const allFlats: FlatWithFloor[] = Object.values(selectedBlock.floors).flatMap((floor) =>
    Object.values(floor.flats).map((flat) => ({
      ...flat,
      floorId: floor.floorId,
    }))
  );

  // ✅ Apply filters
  const filteredFlats: FlatWithFloor[] = allFlats.filter((flat) => {
    if (filterBhk !== "All" && flat.bhk !== filterBhk) return false;
    if (filterFloor !== "All" && flat.floorId !== filterFloor) return false;
    if (filterStatus !== "All" && flat.status !== filterStatus) return false;
    if (query && !flat.flatId.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // ✅ Reset filters
  const resetFilters = () => {
    setQuery("");
    setFilterBhk("All");
    setFilterFloor("All");
    setFilterStatus("All");
  };

  return (
    <SidebarProvider>
      <SidebarNav
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
        selectedBlockId={selectedBlockId}
        onSelectBlock={(id) => {
          setSelectedBlockId(id);
          setSelectedFlat(null);
          setSelectedFloorId(null);
        }}
      />
      <SidebarInset>
        <Topbar
          mode={mode}
          setMode={setMode}
          projectName={selectedProject.name}
          blockName={selectedBlock.name}
        />
        <div className="grid grid-cols-[1fr_580px] gap-4 p-4 h-[calc(100svh-56px)] overflow-hidden">
          {/* ✅ Middle: 3D + summary */}
          <BuildingPanel
            mode={mode}
            selectedProject={selectedProject}
            selectedBlock={selectedBlock}
            selectedFloor={selectedFloorId ? selectedBlock.floors[selectedFloorId] : null}
            selectedFlat={selectedFlat}
            setSelectedFlat={setSelectedFlat}
            filterBhk={filterBhk}
            filteredFlats={filteredFlats}
            allFlats={allFlats}
          />

          {/* ✅ Right: Filters + Results */}
          <RightPanel
            query={query}
            setQuery={setQuery}
            filterBhk={filterBhk}
            setFilterBhk={setFilterBhk}
            filterFloor={filterFloor}
            setFilterFloor={setFilterFloor}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            reset={resetFilters}
            selectedBlock={selectedBlock}
            filteredFlats={filteredFlats}
            selectedFlat={selectedFlat}
            setSelectedFlat={setSelectedFlat}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
