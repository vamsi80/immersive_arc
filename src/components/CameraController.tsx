"use client";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import gsap from "gsap";

const CameraController = ({ view }: { view: "front" | "top" | "left" | "right" }) => {
  const { camera } = useThree();

  useEffect(() => {
    let targetPos = { x: 0, y: 0, z: 100 };

    if (view === "top") targetPos = { x: 0, y: 100, z: 0 };
    else if (view === "left") targetPos = { x: -100, y: 0, z: 0 };
    else if (view === "right") targetPos = { x: 100, y: 0, z: 0 };

    gsap.to(camera.position, {
      ...targetPos,
      duration: 1,
      onUpdate: () => camera.lookAt(0, 0, 0),
    });
  }, [view, camera]);

  return null;
};

export default CameraController;
