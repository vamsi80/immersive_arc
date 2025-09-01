"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Blocks } from "lucide-react";
import BuildingCanvas, { BuildingMode } from "@/components/dashboard/canvas/BuildingCanvas";
import UnitCanvas from "@/components/dashboard/canvas/UnitCanvas";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Society, Block, Unit, BHK } from "@/types/types";

type Props = {
  mode: BuildingMode;
  selectedSociety: Society;
  selectedBlock: Block;
  selectedUnit: Unit | null;
  setSelectedUnit: (u: Unit | null) => void;
  filterBhk: BHK | "All";
};

export default function BuildingPanel({
  mode,
  selectedSociety,
  selectedBlock,
  selectedUnit,
  filterBhk,
}: Props) {
  return (
    <div className="grid grid-rows-[1fr_auto] gap-4 overflow-hidden">
      <Card className="p-0 shadow-elevated overflow-hidden">
        <Tabs defaultValue="block" className="h-full grid grid-rows-[auto_1fr]">
          <TabsList className="m-2">
            <TabsTrigger value="block">Block 3D</TabsTrigger>
            <TabsTrigger value="unit">Unit 3D</TabsTrigger>
            <TabsTrigger value="plans">Floorplans</TabsTrigger>
          </TabsList>

          {/* Block 3D */}
          <TabsContent value="block" className="m-0 h-full p-2">
            <div className="h-full w-full relative">
              <BuildingCanvas mode={mode} />
              <div className="absolute top-3 left-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs shadow-subtle">
                  <Blocks className="h-4 w-4 opacity-70" />
                  <span>{selectedBlock.name}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Unit 3D */}
          <TabsContent value="unit" className="m-0 h-full p-2">
            <div className="h-full rounded-md bg-muted flex items-center justify-center">
              {filterBhk === "All" && !selectedUnit ? (
                <div className="text-sm text-muted-foreground">
                  Select the unit BHK
                </div>
              ) : selectedUnit ? (
                <UnitCanvas bhk={selectedUnit.bhk} />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Select a unit ({filterBhk})
                </div>
              )}
            </div>
          </TabsContent>

          {/* Floorplans */}
          <TabsContent value="plans" className="m-0 h-full p-2">
            <div className="h-full rounded-md bg-muted relative">
              {selectedUnit ? (
                <div className="h-full flex items-center justify-center">
                  <Carousel className="w-[320px]" opts={{ loop: true }}>
                    <CarouselContent>
                      {["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"].map(
                        (src, idx) => (
                          <CarouselItem key={idx}>
                            <img
                              src={src}
                              alt={`Floorplan ${idx + 1}`}
                              className="h-48 w-full object-contain rounded"
                            />
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Select a unit to view floor plans
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Summary card */}
      <Card className="px-10 flex flex-row items-center justify-between shadow-subtle">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            {selectedSociety.name} • {selectedBlock.name}
          </div>
          <div className="text-sm">
            Floors: <span className="font-medium">{selectedBlock.floors}</span> •
            Units: <span className="font-medium">{selectedBlock.units.length}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            Available {selectedBlock.units.filter((u) => u.availability === "Available").length}
          </Badge>
          <Badge variant="secondary">
            Booked {selectedBlock.units.filter((u) => u.availability === "Booked").length}
          </Badge>
          <Badge variant="secondary">
            On Hold {selectedBlock.units.filter((u) => u.availability === "On Hold").length}
          </Badge>
        </div>
      </Card>
    </div>
  );
}
