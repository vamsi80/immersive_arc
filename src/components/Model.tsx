"use client";
import React, { forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type ModelHandle = {
  highlightFlat: (flatId: string, color: string) => void;
  resetHighlight: () => void;
};

type ModelProps = {
  url: string;
};

export const Model = forwardRef<ModelHandle, ModelProps>(({ url }, ref) => {
  const { scene } = useGLTF(url);

  useLayoutEffect(() => {
    // === Center & scale ===
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    scene.position.sub(center);
    scene.rotation.set(0, Math.PI, 0);

    if (size > 10) {
      const scaleFactor = 10 / size;
      scene.scale.setScalar(scaleFactor);
    }

    // Debug log
    console.log("Loaded model:", url);
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => (mat.side = THREE.DoubleSide));
        } else {
          (mesh.material as THREE.Material).side = THREE.DoubleSide;
        }
      }
    });
  }, [scene, url]);

  // === Expose API ===
  useImperativeHandle(ref, () => ({
    highlightFlat: (flatId: string, color: string) => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          materials.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).name === flatId) {
              const m = mat as THREE.MeshStandardMaterial;
              m.color.set(color);
              m.emissive.set(color);
              m.emissiveIntensity = 1.5;
            }
          });
        }
      });
    },
    resetHighlight: () => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          materials.forEach((mat) => {
            const m = mat as THREE.MeshStandardMaterial;
            if (m.name.startsWith("flat_")) {
              // reset to neutral gray
              m.color.setRGB(0.8, 0.8, 0.8);
              m.emissive.setRGB(0, 0, 0);
              m.emissiveIntensity = 0;
            }
          });
        }
      });
    },
  }));

  return <primitive object={scene} dispose={null} />;
});

Model.displayName = "Model";
