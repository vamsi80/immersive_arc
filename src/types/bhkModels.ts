import { BHK } from "@/types/types";

export const bhkModels: Record<BHK, string | null> = {
  "2BHK": "/models/2BHK_new.glb",
  "2.5BHK": "/models/2.5BHK.glb",
  "3BHK": "/models/3BHK.glb",
  "4BHK": "/models/4BHK_new.glb",
};

import { useGLTF } from "@react-three/drei";
Object.values(bhkModels).forEach((path) => {
  if (path) useGLTF.preload(path);
});
