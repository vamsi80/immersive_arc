"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Block, Flat, BHK, FlatWithFloor } from "@/types/types";
import { BedDouble, Bath, Sun, UtensilsCrossed, Sofa, User } from "lucide-react";

function getAllFlats(block: Block): FlatWithFloor[] {
  return Object.values(block.floors).flatMap((floor) =>
    Object.values(floor.flats).map((flat) => ({
      ...flat,
      floorId: floor.floorId, // ✅ take from floor, not from Flat
    }))
  );
}

type Props = {
  filteredFlats: FlatWithFloor[];
  selectedFlat: Flat | null;
  setSelectedFlat: (u: Flat) => void;
  filterBhk: BHK | "All";
  selectedBlock: Block;
};

export default function Results({
  filteredFlats,
  selectedFlat,
  setSelectedFlat,
  filterBhk,
  selectedBlock,
}: Props) {
  const allFlats = getAllFlats(selectedBlock);

  return (
    // make the card a flex column so the list can scroll
    <Card className="p-0 shadow-subtle overflow-hidden flex min-h-0 flex-col">
      {/* sticky header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-background/95 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="text-sm text-muted-foreground">Results</div>
        <div className="text-xs">{filteredFlats.length} flats</div>
      </div>

      <div className="p-3 overflow-auto min-h-0 flex-1">
        {/* BHK summary features */}
        {filterBhk !== "All" && (
          <div className="mb-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">{filterBhk} Apartment</div>
              <div className="text-xs text-muted-foreground">
                Available{" "}
                {allFlats.filter((f) => f.bhk === filterBhk && f.status === "available").length} • Sold{" "}
                {allFlats.filter((f) => f.bhk === filterBhk && f.status === "sold").length} • Reserved{" "}
                {allFlats.filter((f) => f.bhk === filterBhk && f.status === "reserved").length}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {getFeatures(filterBhk).map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-start gap-2 rounded-md border bg-background p-2">
                    <Icon className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">{f.label}</div>
                      <div className="text-[11px] text-muted-foreground">{f.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Flats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredFlats.map((f) => (
            <button
              key={f.flatId}
              onClick={() => setSelectedFlat(f)}
              className={cn(
                "rounded-md border h-24 p-2 text-left transition-colors",
                "active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/30",
                selectedFlat?.flatId === f.flatId && "border-primary bg-primary/5"
              )}
              aria-pressed={selectedFlat?.flatId === f.flatId}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{f.flatId}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {f.bhk}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Floor {f.floorId.replace("floor_", "")}
              </div>
              <div
                className={cn(
                  "mt-1 text-[11px]",
                  f.status === "available"
                    ? "text-green-600"
                    : f.status === "sold"
                      ? "text-red-600"
                      : "text-amber-600"
                )}
              >
                {f.status}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}


// Utility: BHK features
function getFeatures(bhk: BHK) {
  // if (bhk === "1BHK")
  //   return [
  //     { icon: BedDouble, label: "1 Bedroom", sub: "Cozy master bedroom" },
  //     { icon: Bath, label: "1 Bathroom", sub: "Common bath" },
  //     { icon: Sun, label: "Balcony", sub: "Ventilated view" },
  //     { icon: UtensilsCrossed, label: "Modular Kitchen", sub: "With utility niche" },
  //     { icon: Sofa, label: "Living & Dining", sub: "Combined space" },
  //   ];
  if (bhk === "2BHK" || bhk === "2.5BHK")
    return [
      { icon: BedDouble, label: `${bhk === "2BHK" ? "2" : "2.5"} Bedrooms`, sub: "Spacious layout" },
      { icon: Bath, label: "2 Bathrooms", sub: "Attached + common" },
      { icon: Sun, label: "1–2 Balconies", sub: "Airy & bright" },
      { icon: UtensilsCrossed, label: "Modular Kitchen", sub: "Utility attached" },
      { icon: Sofa, label: "Living & Dining", sub: "Well designed space" },
    ];
  if (bhk === "3BHK")
    return [
      { icon: BedDouble, label: "3 Bedrooms", sub: "Includes master suite" },
      { icon: Bath, label: "3 Bathrooms", sub: "2 attached + 1 common" },
      { icon: Sun, label: "2–3 Balconies", sub: "Panoramic views" },
      { icon: UtensilsCrossed, label: "Modular Kitchen", sub: "With utility & store" },
      { icon: Sofa, label: "Living & Dining", sub: "Separate dining zone" },
    ];
  return [
    { icon: BedDouble, label: "4 Bedrooms", sub: "Master with walk-in wardrobe" },
    { icon: Bath, label: "4 Bathrooms", sub: "3 attached + 1 common" },
    { icon: Sun, label: "Balconies", sub: "Multiple, airy & scenic" },
    { icon: UtensilsCrossed, label: "Premium Kitchen", sub: "Modular + extended utility" },
    { icon: Sofa, label: "Living & Dining", sub: "Grand + family lounge" },
    { icon: User, label: "Additional Space", sub: "Servant's/extra utility room" },
  ];
}
