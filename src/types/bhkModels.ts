// src/types/bhkModels.ts
import { BHK } from "@/types/types";

// ✅ Mapping of BHK types to GLB file paths
export const bhkModels: Record<BHK, string | null> = {
  "2BHK": "/models/2BHK.glb",
  "2.5BHK": "/models/2.5BHK.glb",
  "3BHK": "/models/3BHK.glb",
  "4BHK": "/models/4_BHK.glb",
};

// ✅ Preload available models
import { useGLTF } from "@react-three/drei";
Object.values(bhkModels).forEach((path) => {
  if (path) useGLTF.preload(path);
});
