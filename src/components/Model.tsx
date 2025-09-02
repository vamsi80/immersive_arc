"use client";
import React, { forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export const Model = forwardRef(({ url }: { url: string }, ref) => {
  const { scene } = useGLTF(url) as any;

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
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.side = THREE.DoubleSide; // fix backface issue
      }
    });
  }, [scene, url]);

  // === Expose API ===
  useImperativeHandle(ref, () => ({
    highlightFlat: (flatId: string, color: string) => {
      scene.traverse((child: any) => {
        if (child.isMesh && child.name === flatId) {
          const mat = child.material as THREE.MeshStandardMaterial;

          gsap.to(mat.color, { ...new THREE.Color(color), duration: 1 });
          gsap.to(mat.emissive, {
            ...new THREE.Color(color),
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          mat.emissiveIntensity = 2;
        }
      });
    },
    resetHighlight: () => {
      scene.traverse((child: any) => {
        if (child.isMesh && child.name.startsWith("flat_")) {
          const mat = child.material as THREE.MeshStandardMaterial;
          gsap.to(mat.color, { r: 0.15, g: 0.36, b: 0.62, duration: 0.8 }); // default blue-gray
          mat.emissive.setRGB(0, 0, 0);
          mat.emissiveIntensity = 0;
        }
      });
    },
  }));

  return <primitive object={scene} dispose={null} />;
});
