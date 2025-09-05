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

  // Mobile drawer for filters/results
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

        {/* Layout:
            - Mobile (<md): single column (3D first); RightPanel lives in slide-over.
            - md+: two columns with fixed right pane width.
        */}
        <div
          className="
            relative
            p-3 md:p-4
            h-[calc(100dvh-56px)] md:h-[calc(100svh-56px)]
            overflow-hidden
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-3 md:gap-4
              md:grid-cols-[1fr_420px]
              lg:grid-cols-[1fr_520px]
              xl:grid-cols-[1fr_580px]
              h-full
            "
          >
            {/* ✅ Middle: 3D + summary (always visible) */}
            <div className="min-h-0 bg-background">
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
            </div>

            {/* ✅ Right: Filters + Results
                - Hidden on mobile; visible from md upward.
            */}
            <div className="hidden md:block min-h-0 rounded-xl border bg-background">
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
          </div>

          {/* 🔘 Mobile floating button to open Filters/Results */}
          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="
              md:hidden
              fixed bottom-4 right-4
              z-40
              rounded-full px-4 py-2
              shadow-lg
              bg-primary text-primary-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/40
            "
            aria-label="Open filters and results"
          >
            Filters
          </button>

          {/* 📱 Mobile slide-over for RightPanel */}
          <div
            className={`
              md:hidden
              fixed inset-0 z-50
              transition-transform duration-300
              ${isFiltersOpen ? "translate-x-0" : "translate-x-full"}
              pointer-events-auto
            `}
            aria-hidden={!isFiltersOpen}
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              onClick={() => setIsFiltersOpen(false)}
              className={`absolute inset-0 bg-black/30 transition-opacity ${
                isFiltersOpen ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Panel */}
            <div
              className="
                absolute right-0 top-0 h-full w-[92%] max-w-sm
                bg-background border-l
                shadow-xl
                flex flex-col
              "
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="font-medium">Filters & Results</div>
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(false)}
                  className="rounded-md px-3 py-1 border hover:bg-accent"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-auto p-2">
                <RightPanel
                  query={query}
                  setQuery={setQuery}
                  filterBhk={filterBhk}
                  setFilterBhk={(v) => {
                    setFilterBhk(v);
                  }}
                  filterFloor={filterFloor}
                  setFilterFloor={setFilterFloor}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  reset={() => {
                    resetFilters();
                  }}
                  selectedBlock={selectedBlock}
                  filteredFlats={filteredFlats}
                  selectedFlat={selectedFlat}
                  setSelectedFlat={(f) => {
                    setSelectedFlat(f);
                    // Optional: close drawer when a flat is chosen
                    setIsFiltersOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
