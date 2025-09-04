// src/types/bhkModels.ts
import { BHK } from "@/types/types";

// ✅ Mapping of BHK types to GLB file paths
export const bhkModels: Record<BHK, string | null> = {
  "2BHK": "https://mnqcklxrspemnfhxnwaz.supabase.co/storage/v1/object/public/models/2_BHK.glb",
  "2.5BHK": "https://mnqcklxrspemnfhxnwaz.supabase.co/storage/v1/object/public/models/2.5BHK.glb",
  "3BHK": "https://mnqcklxrspemnfhxnwaz.supabase.co/storage/v1/object/public/models/3_BHK.glb",
  "4BHK": "https://mnqcklxrspemnfhxnwaz.supabase.co/storage/v1/object/public/models/4_BHK.glb",
};

// ✅ Preload available models
import { useGLTF } from "@react-three/drei";
Object.values(bhkModels).forEach((path) => {
  if (path) useGLTF.preload(path);
});
