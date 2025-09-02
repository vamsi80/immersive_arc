"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { demoData } from "@/types/demoData"
import { Project, Flat, BHK } from "@/types/types";
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
  const [filterBhk, setFilterBhk] = useState<BHK | "All">("All");
  const [mode, setMode] = useState<BuildingMode>("explore");

  // Reset on project change
  const onSelectProject = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find((x) => x.projectId === id)!;
    setSelectedBlockId(Object.values(proj.blocks)[0].blockId);
    setSelectedFlat(null);
    setSelectedFloorId(null);
  };

  return (
    <SidebarProvider>
      <SidebarNav
        projects={projects} // ✅ SidebarNav must support this prop
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
          projectName={selectedProject.name} // ✅ Topbar must accept projectName now
          blockName={selectedBlock.name}
        />
        <div className="grid grid-cols-[1fr_620px] gap-4 p-4 h-[calc(100svh-56px)] overflow-hidden">
          <BuildingPanel
            mode={mode}
            selectedProject={selectedProject}
            selectedBlock={selectedBlock}
            selectedFloor={selectedFloorId ? selectedBlock.floors[selectedFloorId] : null}
            selectedFlat={selectedFlat}
            setSelectedFlat={setSelectedFlat}
            filterBhk={filterBhk}
          />
          <RightPanel
            selectedBlock={selectedBlock}
            selectedFlat={selectedFlat} // ✅ RightPanel must accept selectedFlat
            setSelectedFlat={setSelectedFlat}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
