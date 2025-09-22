"use client";

import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Topbar from "@/components/Topbar";
import SidebarNav from "@/components/SidebarNav";
import BuildingPanel from "@/components/dashboard/BuildingPanel";
import RightPanel from "@/components/dashboard/RightPanel";
import { BuildingMode } from "@/components/dashboard/canvas/BuildingCanvas";
import { demoData } from "@/types/demoData";
import { Project, Flat, BHK, FlatWithFloor, FlatStatus, Block } from "@/types/types";

/**
 * DashboardPage (admin-enabled + button)
 *
 * Notes:
 * - This file keeps your original layout and functionality.
 * - Added isAdmin boolean (replace with your real auth check).
 * - Added an admin "+" floating button which opens an Add modal.
 * - Local state is mutated (projects) — in production you should call your API,
 *   then refresh state from server. Handlers below show how to update local state immediately.
 */

export default function DashboardPage() {
  // === ADMIN FLAG (replace with real auth) ===
  const [isAdmin] = useState<boolean>(true); // toggle to false to "disable" adding

  // Load projects (now writable)
  const [projects, setProjects] = useState<Project[]>(Object.values(demoData.projects));
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

  // Admin modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<"project" | "block">("project");
  const [newName, setNewName] = useState("");
  const [newBlockForProject, setNewBlockForProject] = useState<string | null>(Object.values(projects[0].blocks)[0]?.blockId ?? null);

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

  const handleOpenAddBlockModal = (projectId: string) => {
    setAddType("block");
    setNewBlockForProject(projectId);
    setIsAddModalOpen(true);
  };

  // ----------------------------
  // Add handlers (local state)
  // In production: call API, then refresh state from server.
  // ----------------------------

  function createBlock(blockId: string, name: string, modelPath?: string): Block {
    return {
      blockId,
      name,
      ...(modelPath ? { modelPath } : {}),
      floors: {
        floor_1: {
          floorId: "floor_1",
          name: "Floor 1",
          flats: {},
        },
      },
    } as Block;
  }

  /** Create a project without forcing a modelPath on the first block */
  function createProject(projectId: string, name: string): Project {
    const firstBlock = createBlock(`${projectId}_blockA`, "Block A"); // no forced modelPath
    return {
      projectId,
      name,
      location: "",
      description: "",
      blocks: {
        [firstBlock.blockId]: firstBlock,
      },
    } as Project;
  }

  const addProject = (name: string) => {
    const projectId = `proj_${Date.now().toString(36)}`;
    const newProject = createProject(projectId, name);

    // setProjects expects Project[] or (prev => Project[]). This returns a Project[].
    setProjects((prev) => [...prev, newProject]);

    // select new project
    setSelectedProjectId(projectId);
    const firstBlockId = Object.keys(newProject.blocks)[0];
    setSelectedBlockId(firstBlockId);
  };

  const addBlock = (projectId: string, blockName: string) => {
    const blockId = `block_${Date.now().toString(36)}`;

    // reuse existing modelPath if this project has any working model
    const project = projects.find((p) => p.projectId === projectId)!;
    const fallbackModel = Object.values(project.blocks)[0]?.modelPath; // undefined if none

    const newBlock = createBlock(blockId, blockName, fallbackModel);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId !== projectId) return p;
        return {
          ...p,
          blocks: {
            ...p.blocks,
            [newBlock.blockId]: newBlock,
          },
        };
      })
    );

    setSelectedProjectId(projectId);
    setSelectedBlockId(blockId);
  };

  // Modal submit
  const onAddSubmit = () => {
    if (!newName.trim()) return;
    if (addType === "project") {
      addProject(newName.trim());
    } else {
      // block
      const targetProject = newBlockForProject || selectedProjectId;
      addBlock(targetProject, newName.trim());
    }
    // reset modal
    setNewName("");
    setIsAddModalOpen(false);
  };

  // ----------------------------
  // JSX - mostly your original code, with an admin add-flow overlay
  // ----------------------------
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

        onAddProject={() => {
          // open modal or call addProject("New Society")
          setIsAddModalOpen(true);
          setAddType("project");
        }}
        onAddBlock={(projectId) => {
          handleOpenAddBlockModal(projectId);
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
                isAdmin={isAdmin}
                selectedProject={selectedProject}
                selectedBlock={selectedBlockId ? selectedProject.blocks[selectedBlockId] : null}
                selectedFloor={selectedFloorId ? selectedProject.blocks[selectedBlockId!].floors[selectedFloorId] : null}
                selectedFlat={selectedFlat}
                setSelectedFlat={setSelectedFlat}
                filterBhk={filterBhk}
                filteredFlats={filteredFlats}
                allFlats={allFlats}
                onAddBlock={(projectId) => handleOpenAddBlockModal(projectId)}
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

          {/* Admin-only floating "+" button */}
          {isAdmin && (
            <button
              onClick={() => {
                setAddType("project"); // default choice
                setNewBlockForProject(selectedProjectId);
                setIsAddModalOpen(true);
              }}
              className="
                fixed bottom-4 left-4
                z-50
                w-12 h-12 rounded-full
                flex items-center justify-center
                shadow-lg
                bg-emerald-600 text-white text-xl
                focus:outline-none focus:ring-2 focus:ring-emerald-300
              "
              aria-label="Add"
              title="Add project / block"
            >
              +
            </button>
          )}

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
              className={`absolute inset-0 bg-black/30 transition-opacity ${isFiltersOpen ? "opacity-100" : "opacity-0"
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

          {/* ------------------------
              Add Modal (admin)
              ------------------------ */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsAddModalOpen(false)}
              />
              <div className="relative z-10 w-full max-w-lg bg-background rounded-lg shadow-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Add new</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-2 py-1 rounded hover:bg-accent"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAddType("project")}
                        className={`px-3 py-1 rounded ${addType === "project" ? "bg-primary text-white" : "border"}`}
                      >
                        Society (Project)
                      </button>
                      <button
                        onClick={() => setAddType("block")}
                        className={`px-3 py-1 rounded ${addType === "block" ? "bg-primary text-white" : "border"}`}
                      >
                        Block
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full rounded border px-2 py-1"
                      placeholder={addType === "project" ? "Society name" : "Block name"}
                    />
                  </div>

                  {addType === "block" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Project (add block to)</label>
                      <select
                        value={newBlockForProject || ""}
                        onChange={(e) => setNewBlockForProject(e.target.value)}
                        className="w-full rounded border px-2 py-1"
                      >
                        {projects.map((p) => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        setNewName("");
                        setIsAddModalOpen(false);
                      }}
                      className="px-3 py-1 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onAddSubmit}
                      className="px-3 py-1 rounded bg-emerald-600 text-white"
                    >
                      Add
                    </button>
                  </div>

                  <div className="text-xs text-muted-foreground mt-2">
                    Note: this updates local UI state. In production you should call your backend API
                    to persist the new project/block and then re-fetch the list.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
