// app/dashboard/data/demoData.ts
import { Society, Block, Unit, BHK, Availability } from "./types";

function createBlock(label: string, floors: number): Block {
  const units: Unit[] = [];
  let uid = 0;
  const bhkTypes: BHK[] = ["1BHK", "2BHK", "3BHK", "4BHK"];
  for (let f = 1; f <= Math.min(floors, 10); f++) {
    for (let u = 1; u <= 4; u++) {
      const bhk = bhkTypes[(f + u) % 3];
      const availability: Availability =
        u % 4 === 0 ? "On Hold" : u % 3 === 0 ? "Booked" : "Available";
      units.push({
        id: `${label}-${uid++}`,
        unitNo: `${f}0${u}`,
        bhk,
        floor: f,
        availability,
      });
    }
  }
  return { id: `b-${label}`, name: `Block ${label}`, floors, units };
}

export const demoData: Society[] = [
  {
    id: "s1",
    name: "Azure Heights",
    blocks: [createBlock("A", 10), createBlock("B", 8), createBlock("C", 6)],
  },
  {
    id: "s2",
    name: "Emerald Residences",
    blocks: [createBlock("East", 9), createBlock("West", 9)],
  },
];
