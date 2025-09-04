"use client";

import Filters from "./Filters";
import Results from "./Results";
import { Block, Flat, BHK, FlatWithFloor, FlatStatus } from "@/types/types";

type Props = {
  // Filters + setters come from DashboardPage
  query: string;
  setQuery: (v: string) => void;
  filterBhk: BHK | "All";
  setFilterBhk: (v: BHK | "All") => void;
  filterFloor: string | "All";
  setFilterFloor: (v: string | "All") => void;
  filterStatus: FlatStatus | "All";
  setFilterStatus: (v: FlatStatus | "All") => void;
  reset: () => void;

  // Data + selection
  selectedBlock: Block;
  filteredFlats: FlatWithFloor[];
  selectedFlat: Flat | null;
  setSelectedFlat: (f: Flat | null) => void;
};

export default function RightPanel({
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
  filteredFlats,
  selectedFlat,
  setSelectedFlat,
}: Props) {
  return (
    <div className="grid grid-rows-[auto_1fr] gap-3 md:gap-4 overflow-hidden min-h-0">
      <Filters
        query={query}
        setQuery={setQuery}
        filterBhk={filterBhk}
        setFilterBhk={setFilterBhk}
        filterFloor={filterFloor}
        setFilterFloor={setFilterFloor}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        reset={reset}
        selectedBlock={selectedBlock}
      />
      <Results
        filteredFlats={filteredFlats}
        selectedFlat={selectedFlat}
        setSelectedFlat={setSelectedFlat}
        filterBhk={filterBhk}
        selectedBlock={selectedBlock}
      />
    </div>
  );
}
