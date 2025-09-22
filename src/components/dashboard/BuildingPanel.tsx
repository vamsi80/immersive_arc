"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blocks, Plus } from "lucide-react";
import BuildingCanvas, { BuildingMode } from "@/components/dashboard/canvas/BuildingCanvas";
import UnitCanvas from "@/components/dashboard/canvas/UnitCanvas";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Project, Block, Floor, Flat, BHK, FlatWithFloor } from "@/types/types";
import { Button } from "../ui/button";

function getAllFlats(block?: Block | null): FlatWithFloor[] {
  if (!block) return [];
  return Object.values(block.floors).flatMap((floor) =>
    Object.values(floor.flats).map((flat) => ({
      ...flat,
      floorId: floor.floorId,
    }))
  );
}

type Props = {
  mode: BuildingMode;
  selectedProject: Project;
  selectedBlock: Block | null;
  selectedFloor: Floor | null;
  selectedFlat: Flat | null;
  setSelectedFlat: (u: Flat | null) => void;
  filterBhk: BHK | "All";
  filteredFlats: FlatWithFloor[];
  allFlats: FlatWithFloor[];
  isAdmin?: boolean;
  onAddBlock?: (projectId: string) => void;
};

export default function BuildingPanel({
  mode,
  selectedProject,
  selectedBlock,
  selectedFlat,
  // setSelectedFlat,
  isAdmin,
  onAddBlock,
  filterBhk,
  filteredFlats: _filteredFlats,
  allFlats: _allFlats,
}: Props) {
  // safe: getAllFlats now accepts null/undefined
  const allFlats = getAllFlats(selectedBlock);

  const filteredFlats = allFlats.filter((flat) => {
    if (filterBhk === "All") return true;
    return flat.bhk === filterBhk;
  });

  const available = allFlats.filter((f) => f.status === "available").length;
  const sold = allFlats.filter((f) => f.status === "sold").length;
  const reserved = allFlats.filter((f) => f.status === "reserved").length;

  // If no block selected (or no blocks exist) show CTA / placeholder
  if (!selectedBlock) {
    return (
      <div className="h-full min-h-0 flex flex-col gap-3 p-4">
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="mb-3 text-lg font-semibold">No blocks available</div>
            <p className="text-sm text-muted-foreground mb-4">
              This society doesn't have any blocks yet. Add a block to view 3D models and units.
            </p>

            {isAdmin ? (
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => onAddBlock?.(selectedProject.projectId)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add block
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Contact the admin to add blocks.</div>
            )}
          </div>
        </Card>

        {/* Summary area (empty state) */}
        <Card className="px-4 py-3 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{selectedProject.name}</div>
            <div className="text-sm">
              Floors: <span className="font-medium">0</span> • Units: <span className="font-medium">0</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="whitespace-nowrap">
              Available {available}
            </Badge>
            <Badge variant="secondary" className="whitespace-nowrap">
              Sold {sold}
            </Badge>
            <Badge variant="secondary" className="whitespace-nowrap">
              Reserved {reserved}
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  // From here on TS knows selectedBlock is not null (early return above),
  // but to be explicit we use selectedBlock! where necessary.
  return (
    <div className="grid h-full min-h-0 grid-rows-[80%_18%] gap-3 md:gap-4 overflow-hidden">
      <Card className="p-0 shadow-elevated overflow-hidden min-h-0">
        <Tabs defaultValue="block" className="grid grid-rows-[auto_1fr] h-full min-h-0">
          <TabsList
            className="
              sticky top-0 z-10 m-0 px-2 py-2
              border rounded-none
              bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
              overflow-x-auto gap-2
            "
          >
            <TabsTrigger className="whitespace-nowrap" value="block">
              Block 3D
            </TabsTrigger>
            <TabsTrigger className="whitespace-nowrap" value="unit">
              Unit 3D
            </TabsTrigger>
            <TabsTrigger className="whitespace-nowrap" value="plans">
              Floorplans
            </TabsTrigger>
          </TabsList>

          {/* Content area must be flex-1 + min-h-0 so children can scroll */}
          <div className="flex-1 min-h-0">
            {/* Block 3D */}
            <TabsContent value="block" className="m-0 h-full p-2">
              <div className="relative h-full min-h-0">
                <BuildingCanvas
                  mode={mode}
                  block={selectedBlock ?? undefined} // <-- convert null -> undefined
                  selectedFlat={selectedFlat}
                  filterBhk={filterBhk}
                  filteredFlats={filteredFlats}
                  allFlats={allFlats}
                />
                <div className="absolute top-3 left-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs shadow-subtle">
                    <Blocks className="h-4 w-4 opacity-70" />
                    <span className="max-w-[40vw] truncate">{selectedBlock!.name}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Unit 3D */}
            <TabsContent value="unit" className="m-0 h-full p-2">
              <div className="h-full min-h-0 flex items-center justify-center p-2">
                {filterBhk === "All" && !selectedFlat ? (
                  <div className="text-sm text-muted-foreground text-center px-3">
                    Select the unit BHK
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UnitCanvas bhk={(selectedFlat?.bhk || filterBhk) as BHK} />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Floorplans */}
            <TabsContent value="plans" className="m-0 h-full p-2">
              <div className="h-full min-h-0 relative flex items-center justify-center p-3">
                {selectedFlat ? (
                  <Carousel className="w-full max-w-sm sm:max-w-md" opts={{ loop: true }}>
                    <CarouselContent>
                      {["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"].map((src, idx) => (
                        <CarouselItem key={idx} className="flex items-center justify-center">
                          <img
                            src={src}
                            alt={`Floorplan ${idx + 1}`}
                            className="h-56 sm:h-72 w-full object-contain rounded"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <div className="text-sm text-muted-foreground text-center px-3">Select a unit to view floor plans</div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {/* Summary card */}
      <Card
        className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 shadow-subtle"
      >
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            {selectedProject.name} • {selectedBlock!.name}
          </div>
          <div className="text-sm">
            Floors: <span className="font-medium">{Object.keys(selectedBlock!.floors).length}</span> •{" "}
            Units: <span className="font-medium">{allFlats.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="whitespace-nowrap">
            Available {available}
          </Badge>
          <Badge variant="secondary" className="whitespace-nowrap">
            Sold {sold}
          </Badge>
          <Badge variant="secondary" className="whitespace-nowrap">
            Reserved {reserved}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
