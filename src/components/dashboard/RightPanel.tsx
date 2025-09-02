"use client";

import { useState, useMemo, useEffect } from "react";
import Filters from "./Filters";
import Results from "./Results";
import { Block, Flat, BHK, FlatStatus } from "@/types/types";

function getAllFlats(block: Block): (Flat & { floorId: string })[] {
  return Object.values(block.floors).flatMap((floor) =>
    Object.values(floor.flats).map((flat) => ({
      ...flat,
      floorId: floor.floorId,
    }))
  );
}

type Props = {
  selectedBlock: Block;
  selectedFlat: Flat | null;
  setSelectedFlat: (f: Flat | null) => void;
};

export default function RightPanel({ selectedBlock, selectedFlat, setSelectedFlat }: Props) {
  const [query, setQuery] = useState("");
  const [filterBhk, setFilterBhk] = useState<BHK | "All">("All");
  const [filterFloor, setFilterFloor] = useState<string | "All">("All");
  const [filterStatus, setFilterStatus] = useState<FlatStatus | "All">("All");

  const allFlats = useMemo(() => getAllFlats(selectedBlock), [selectedBlock]);

  const filteredFlats = useMemo(() => {
    return allFlats.filter((f) => {
      if (query && !f.flatId.toLowerCase().includes(query.toLowerCase())) return false;
      if (filterBhk !== "All" && f.bhk !== filterBhk) return false;
      if (filterFloor !== "All" && f.floorId !== filterFloor) return false;
      if (filterStatus !== "All" && f.status !== filterStatus) return false;
      return true;
    });
  }, [allFlats, query, filterBhk, filterFloor, filterStatus]);

  // Auto-select flat
  useEffect(() => {
    if (filteredFlats.length === 0) {
      setSelectedFlat(null);
      return;
    }
    if (!selectedFlat || !filteredFlats.some((f) => f.flatId === selectedFlat.flatId)) {
      setSelectedFlat(filteredFlats[0]);
    }
  }, [filteredFlats, selectedFlat, setSelectedFlat]);

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 overflow-hidden">
      <Filters
        query={query}
        setQuery={setQuery}
        filterBhk={filterBhk}
        setFilterBhk={setFilterBhk}
        filterFloor={filterFloor}
        setFilterFloor={setFilterFloor}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        reset={() => {
          setQuery("");
          setFilterBhk("All");
          setFilterFloor("All");
          setFilterStatus("All");
        }}
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
