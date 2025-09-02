// export interface Flat {
//   flatId: string;
//   bhk: string;
//   superBuiltUpSqft: number;
//   carpetSqft: number;
//   facing: "East" | "West" | "North" | "South";
//   view: string;
//   balconyCount: number;
//   bathCount: number;
//   parking: "None" | "Open" | "Covered";
//   priceBase: number;
//   priceBand: string;
//   status: "available" | "sold" | "reserved";
// }

// export interface Floor {
//   floorId: string;
//   flats: Flat[];
// }

// export interface Block {
//   blockId: string;
//   name: string;
//   floors: Floor[];
// }

// export interface Project {
//   projectId: string;
//   name: string;
//   location: string;
//   description: string;
//   blocks: Block[];
// }

// // ------------------ Dummy Data ------------------

// const bhkOptions = ["1BHK", "2BHK", "3BHK", "4BHK"];
// const facingOptions: Flat["facing"][] = ["East", "West", "North", "South"];
// const statusOptions: Flat["status"][] = ["available", "sold", "reserved"];
// const views = ["Garden", "Pool", "City", "Park", "Road"];

// function getRandom<T>(arr: T[]): T {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// export const project: Project = {
//   projectId: "sample-project",
//   name: "Skyline Residency",
//   location: "Hyderabad",
//   description: "Luxury apartments with modern amenities",
//   blocks: [
//     {
//       blockId: "A",
//       name: "Block A",
//       floors: Array.from({ length: 10 }, (_, fIndex) => ({
//         floorId: `${fIndex + 1}`,
//         flats: Array.from({ length: 5 }, (_, flatIndex) => {
//           const bhk = getRandom(bhkOptions);
//           const sqft = bhk === "1BHK" ? 700 : bhk === "2BHK" ? 1100 : bhk === "3BHK" ? 1500 : 2000;
//           const carpet = Math.floor(sqft * 0.7);
//           const price = sqft * 5000; // rough formula

//           return {
//             flatId: `A-${fIndex + 1}0${flatIndex + 1}`,
//             bhk,
//             superBuiltUpSqft: sqft,
//             carpetSqft: carpet,
//             facing: getRandom(facingOptions),
//             view: getRandom(views),
//             balconyCount: bhk === "1BHK" ? 1 : 2,
//             bathCount: bhk === "4BHK" ? 4 : bhk === "3BHK" ? 3 : 2,
//             parking: getRandom(["None", "Open", "Covered"]),
//             priceBase: price,
//             priceBand: price < 5000000 ? "40–50L" : price < 8000000 ? "70–80L" : "1Cr+",
//             status: getRandom(statusOptions),
//           };
//         }),
//       })),
//     },
//   ],
// };


// app/dashboard/types.ts
// app/dashboard/data/types.ts

export type BHK = "1BHK" | "2BHK" | "2.5BHK" | "3BHK" | "4BHK";

export type FlatStatus = "available" | "sold" | "reserved" | "on hold";

export interface Flat {
  flatId: string;
  // floorId: string;
  bhk: BHK;
  superBuiltUpSqft: number;
  carpetSqft: number;
  facing: string;
  view: string;
  balconyCount: number;
  bathCount: number;
  parking: string;
  priceBase: number;
  priceBand: string;
  status: FlatStatus;
}

export interface Floor {
  floorId: string;
  flats: Record<string, Flat>;
}

export interface Block {
  blockId: string;
  name: string;
  floors: Record<string, Floor>;
}

export interface Project {
  projectId: string;
  name: string;
  location: string;
  description: string;
  blocks: Record<string, Block>;
}

export interface ProjectsRoot {
  projects: Record<string, Project>;
}
