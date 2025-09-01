"use client";

import { useState, useMemo, useEffect } from "react";
import Filters from "./Filters";
import Results from "./Results";
import { Block, Unit, Availability, BHK } from "@/types/types";

type Props = {
  selectedBlock: Block;
  selectedUnit: Unit | null;
  setSelectedUnit: (u: Unit | null) => void;
};

export default function RightPanel({ selectedBlock, selectedUnit, setSelectedUnit }: Props) {
  const [query, setQuery] = useState("");
  const [filterBhk, setFilterBhk] = useState<BHK | "All">("All");
  const [filterFloor, setFilterFloor] = useState<number | "All">("All");
  const [filterAvail, setFilterAvail] = useState<Availability | "All">("All");

  const filteredUnits = useMemo(() => {
    return selectedBlock.units.filter((u) => {
      if (query && !`${u.unitNo}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (filterBhk !== "All" && u.bhk !== filterBhk) return false;
      if (filterFloor !== "All" && u.floor !== filterFloor) return false;
      if (filterAvail !== "All" && u.availability !== filterAvail) return false;
      return true;
    });
  }, [selectedBlock.units, query, filterBhk, filterFloor, filterAvail]);

  // Auto-select unit
  useEffect(() => {
    if (filteredUnits.length === 0) {
      setSelectedUnit(null);
      return;
    }
    if (!selectedUnit || !filteredUnits.some((u) => u.id === selectedUnit.id)) {
      setSelectedUnit(filteredUnits[0]);
    }
  }, [filteredUnits]);

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 overflow-hidden">
      <Filters
        query={query}
        setQuery={setQuery}
        filterBhk={filterBhk}
        setFilterBhk={setFilterBhk}
        filterFloor={filterFloor}
        setFilterFloor={setFilterFloor}
        filterAvail={filterAvail}
        setFilterAvail={setFilterAvail}
        reset={() => {
          setQuery("");
          setFilterBhk("All");
          setFilterFloor("All");
          setFilterAvail("All");
        }}
        selectedBlock={selectedBlock}
      />
      <Results
        filteredUnits={filteredUnits}
        selectedUnit={selectedUnit}
        setSelectedUnit={(u) => setSelectedUnit(u)}
        filterBhk={filterBhk}
        selectedBlock={selectedBlock}
      />
    </div>
  );
}
