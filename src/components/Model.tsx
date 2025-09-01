"use client";
import React, { forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export const Model = forwardRef((props: { url: string }, ref) => {
  const { scene } = useGLTF(props.url) as any;

  useLayoutEffect(() => {
    // === Center and scale model ===
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    scene.position.sub(center);
    scene.rotation.set(0, Math.PI, 0);

    if (size > 10) {
      const scaleFactor = 10 / size;
      scene.scale.setScalar(scaleFactor);
    }

    // === Log all meshes & materials ===
    console.log("🔎 Listing all meshes and materials from model:", props.url);
    scene.traverse((child: any) => {
      if (child.isMesh) {
        console.log("📌 Mesh:", child.name);

        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material, idx: number) => {
            console.log(
              `   🎨 Material[${idx}] → Name: "${mat.name}" | Object:`,
              mat
            );
          });
        } else if (child.material) {
          console.log(
            `   🎨 Material → Name: "${child.material.name}" | Object:`,
            child.material
          );
        }
      }
    });
  }, [scene, props.url]);

  // === Expose functions to parent ===
  useImperativeHandle(ref, () => ({
    highlightMaterial: (materialName: string, color: string) => {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material?.name === materialName) {
          const mat = child.material as THREE.MeshStandardMaterial;
          
          console.log(`✨ Highlighting material: "${materialName}" → ${color}`);

          // Animate base color
          gsap.to(mat.color, {
            ...new THREE.Color(color),
            duration: 1,
          });

          // 🔥 Slow glowing effect with emissive
          gsap.to(mat.emissive, {
            ...new THREE.Color(color),
            duration: 4,    // slower cycle (increase for slower)
            repeat: -1,     // infinite loop
            yoyo: true,     // fade in/out
            ease: "sine.inOut", // smooth breathing
          });

          mat.emissiveIntensity = 100; // reasonable glow strength
        }
      });
    },
    resetHighlight: () => {
      console.log("🔄 Resetting only flats (not glass/walls)");
      scene.traverse((child: any) => {
        if (child.isMesh && child.material?.name?.startsWith("flat_")) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 0.2;
          if (mat.name.includes("glass")) {
            mat.roughness = 1;  // higher = less sharp reflections
            mat.metalness = 1;  // avoid mirror-like look
          }
          gsap.to(mat.color, { r: 1, g: 1, b: 1, duration: 1 }); // reset to white
        }
      });
    },
  }));

  return <primitive object={scene} dispose={null} />;
});
