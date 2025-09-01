"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Unit, Block, BHK } from "@/types/types";
import { BedDouble, Bath, Sun, UtensilsCrossed, Sofa, User } from "lucide-react";

type Props = {
  filteredUnits: Unit[];
  selectedUnit: Unit | null;
  setSelectedUnit: (u: Unit) => void;
  filterBhk: BHK | "All";
  selectedBlock: Block;
};

export default function Results({
  filteredUnits,
  selectedUnit,
  setSelectedUnit,
  filterBhk,
  selectedBlock,
}: Props) {
  return (
    <Card className="p-3 shadow-subtle overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">Results</div>
        <div className="text-xs">{filteredUnits.length} units</div>
      </div>

      {/* BHK summary features */}
      {filterBhk !== "All" && (
        <div className="mb-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">{filterBhk} Apartment</div>
            <div className="text-xs text-muted-foreground">
              Available{" "}
              {selectedBlock.units.filter((u) => u.bhk === filterBhk && u.availability === "Available").length} •
              Booked{" "}
              {selectedBlock.units.filter((u) => u.bhk === filterBhk && u.availability === "Booked").length} • On Hold{" "}
              {selectedBlock.units.filter((u) => u.bhk === filterBhk && u.availability === "On Hold").length}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {getFeatures(filterBhk).map((f, i) => {
              const Icon = f.icon as any;
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

      {/* Units list */}
      <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent">
        {filteredUnits.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUnit(u)}
            className={cn(
              "rounded-md border h-20 p-2 text-left",
              selectedUnit?.id === u.id && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{u.unitNo}</span>
              <Badge variant="secondary" className="text-[10px]">
                {u.bhk}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">Floor {u.floor}</div>
            <div
              className={cn(
                "mt-1 text-[11px]",
                u.availability === "Available"
                  ? "text-green-600"
                  : u.availability === "Booked"
                  ? "text-red-600"
                  : "text-amber-600"
              )}
            >
              {u.availability}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// Utility: BHK features
function getFeatures(bhk: BHK) {
  if (bhk === "1BHK")
    return [
      { icon: BedDouble, label: "1 Bedroom", sub: "Cozy master bedroom" },
      { icon: Bath, label: "1 Bathroom", sub: "Common bath" },
      { icon: Sun, label: "Balcony", sub: "Ventilated view" },
      { icon: UtensilsCrossed, label: "Modular Kitchen", sub: "With utility niche" },
      { icon: Sofa, label: "Living & Dining", sub: "Combined space" },
    ];
  if (bhk === "2BHK")
    return [
      { icon: BedDouble, label: "2 Bedrooms", sub: "1 master + 1 bedroom" },
      { icon: Bath, label: "2 Bathrooms", sub: "1 attached + 1 common" },
      { icon: Sun, label: "1–2 Balconies", sub: "Airy & bright" },
      { icon: UtensilsCrossed, label: "Modular Kitchen", sub: "Utility attached" },
      { icon: Sofa, label: "Living & Dining", sub: "Spacious layout" },
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
