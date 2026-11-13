import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import type { Mesh } from 'three'
import { useRef } from 'react'

function OrbitObject() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.13
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.17) * 0.12
  })

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 5, 6]} intensity={3} color="#fff4d8" />
      <Float speed={1.2} rotationIntensity={0.28} floatIntensity={0.45}>
        <mesh ref={meshRef} scale={1.45}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#d5efbd"
            roughness={0.18}
            metalness={0.08}
            distort={0.19}
            speed={1.2}
          />
        </mesh>
      </Float>
      <mesh rotation={[0.84, 0.15, -0.5]}>
        <torusGeometry args={[2, 0.008, 12, 160]} />
        <meshBasicMaterial color="#f4f1e9" transparent opacity={0.72} />
      </mesh>
      <Sparkles count={42} scale={5.5} size={2} speed={0.18} color="#f5e4ad" />
    </>
  )
}

export default function OrbitScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 40 }} dpr={[1, 1.5]}>
      <OrbitObject />
    </Canvas>
  )
}
