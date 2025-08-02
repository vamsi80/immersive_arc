'use client'
// components/ModelViewer.tsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

const Model = () => {
  const gltf = useGLTF('/full_gameready_city_buildings.glb') // your file path here
  return <primitive object={gltf.scene} scale={1.5} />
}

const ModelViewer = () => {
  return (
    <Canvas style={{ height: '1080px', width: '100%' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 5, 5]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default ModelViewer