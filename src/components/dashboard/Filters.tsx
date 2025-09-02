"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import { BHK, Block, FlatStatus } from "@/types/types";

function getAllFlats(block: Block) {
  return Object.values(block.floors).flatMap((f) => Object.values(f.flats));
}

type Props = {
  query: string;
  setQuery: (v: string) => void;
  filterBhk: BHK | "All";
  setFilterBhk: (v: BHK | "All") => void;
  filterFloor: string | "All"; // using string to match floorId
  setFilterFloor: (v: string | "All") => void;
  filterStatus: FlatStatus | "All";
  setFilterStatus: (v: FlatStatus | "All") => void;
  reset: () => void;
  selectedBlock: Block;
};

export default function Filters({
  query,
  setQuery,
  filterBhk,
  setFilterBhk,
  filterFloor,
  setFilterFloor,
  filterStatus,
  setFilterStatus,
  reset,
  selectedBlock,
}: Props) {
  const allFloors = Object.keys(selectedBlock.floors);

  return (
    <Card className="p-4 shadow-subtle">
      <div className="grid grid-cols-6 gap-3 items-end">
        {/* Search */}
        <div className="col-span-6 flex items-center gap-2">
          <Search className="text-muted-foreground" />
          <Input
            placeholder="Search flat ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            title="Reset Filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* BHK */}
        <div className="col-span-2">
          <Label className="text-xs mb-1">BHK</Label>
          <Select value={filterBhk} onValueChange={(v) => setFilterBhk(v as any)}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="1BHK">1BHK</SelectItem>
              <SelectItem value="2BHK">2BHK</SelectItem>
              <SelectItem value="2.5BHK">2.5BHK</SelectItem>
              <SelectItem value="3BHK">3BHK</SelectItem>
              <SelectItem value="4BHK">4BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Floor */}
        <div className="col-span-2">
          <Label className="text-xs mb-1">Floor</Label>
          <Select
            value={filterFloor}
            onValueChange={(v) => setFilterFloor(v as any)}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {allFloors.map((fid) => (
                <SelectItem key={fid} value={fid}>
                  {fid.replace("floor_", "Floor ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <Label className="text-xs mb-1">Status</Label>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
