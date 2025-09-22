"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import { BHK, Block, FlatStatus } from "@/types/types";

// function getAllFlats(block: Block) {
//   return Object.values(block.floors).flatMap((f) => Object.values(f.flats));
// }

type Props = {
  query: string;
  setQuery: (v: string) => void;
  filterBhk: BHK | "All";
  setFilterBhk: (v: BHK | "All") => void;
  filterFloor: string | "All";
  setFilterFloor: (v: string | "All") => void;
  filterStatus: FlatStatus | "All";
  setFilterStatus: (v: FlatStatus | "All") => void;
  reset: () => void;
  selectedBlock?: Block | null;
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
  const allFloors = selectedBlock? Object.keys(selectedBlock.floors): [];
  return (
    <Card className="p-3 md:p-4 shadow-subtle">
      {/* grid: stack on mobile, 3-up on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        {/* Search */}
        <div className="md:col-span-6">
          <Label className="text-xs mb-1 block md:hidden">Search</Label>
          <div className="flex items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 h-10"
                placeholder="Search flat ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                inputMode="search"
                aria-label="Search by flat ID"
              />
            </div>
            <Button
              variant="outline"
              onClick={reset}
              title="Reset Filters"
              className="h-10 px-3"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset</span>
            </Button>
          </div>
        </div>

        {/* BHK */}
        <div className="md:col-span-2">
          <Label className="text-xs mb-1 block">BHK</Label>
          <Select value={filterBhk} onValueChange={(v) => setFilterBhk(v as BHK | "All")}>
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="2BHK">2BHK</SelectItem>
              <SelectItem value="2.5BHK">2.5BHK</SelectItem>
              <SelectItem value="3BHK">3BHK</SelectItem>
              <SelectItem value="4BHK">4BHK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Floor */}
        <div className="md:col-span-2">
          <Label className="text-xs mb-1 block">Floor</Label>
          <Select value={filterFloor} onValueChange={(v) => setFilterFloor(v as string | "All")}>
            <SelectTrigger className="h-10 w-full">
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
        <div className="md:col-span-2">
          <Label className="text-xs mb-1 block">Status</Label>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as FlatStatus | "All")}
          >
            <SelectTrigger className="h-10 w-full">
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

