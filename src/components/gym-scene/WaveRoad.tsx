import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader
const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    
    vec3 wPos = position;
    
    // Wave effect
    float elevation = sin(wPos.x * 2.0 + uTime * 0.5) * 0.2 
                    + sin(wPos.z * 1.5 + uTime * uSpeed) * 0.2;
    
    wPos.y += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(wPos, 1.0);
  }
`;

// Fragment shader
const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uHighColor;
  
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Grid pattern
    float grid = step(0.95, fract(vUv.x * 20.0)) + step(0.95, fract(vUv.y * 20.0));
    
    vec3 color = mix(uColor, uHighColor, vElevation * 2.0 + 0.5);
    
    // Add grid lines
    color += vec3(grid * 0.05);

    // Vignette / fade edges
    float alpha = 1.0 - smoothstep(0.0, 0.2, distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(color, alpha * 0.8);
  }
`;

export function WaveRoad(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: 0.2 },
        uColor: { value: new THREE.Color('#0B0B0F') },
        uHighColor: { value: new THREE.Color('#1e293b') }, // slate-800
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            // @ts-ignore
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} {...props}>
            <planeGeometry args={[20, 40, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
