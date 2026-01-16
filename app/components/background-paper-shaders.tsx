"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
    pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vec2 uv = vUv;
    
    // Create animated noise pattern
    float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
    noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;
    
    // Mix colors based on noise and position
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity * 0.2); // Reduced intensity for softer look
    
    // Add glow effect
    float glow = 1.0 - length(uv - 0.5) * 1.5;
    glow = pow(glow, 1.5);
    
    gl_FragColor = vec4(color, 1.0); // Full opacity for background
  }
`

export function ShaderPlane({
  position,
  color1 = "#c1ea6f", // primary-green
  color2 = "#ff7cac", // primary-pink
}: {
  position: [number, number, number]
  color1?: string
  color2?: string
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      intensity: { value: 1.0 },
      color1: { value: new THREE.Color(color1) },
      color2: { value: new THREE.Color(color2) },
    }),
    [color1, color2],
  )

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.time.value = state.clock.elapsedTime * 0.5 // Slowed down animation
      material.current.uniforms.intensity.value = 1.0 + Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[16, 9, 64, 64]} /> {/* Increased size and segments */}
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function EnergyRing({
  radius = 1,
  position = [0, 0, 0],
}: {
  radius?: number
  position?: [number, number, number]
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime
      if (Array.isArray(mesh.current.material)) {
        // Handle array of materials if necessary, though here it's likely single
      } else {
        (mesh.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3
      }
    }
  })

  return (
    <mesh ref={mesh} position={position}>
      <ringGeometry args={[radius * 0.8, radius, 32]} />
      <meshBasicMaterial color="#c1ea6f" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  )
}
