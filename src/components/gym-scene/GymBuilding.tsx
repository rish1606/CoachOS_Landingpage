import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

export function GymBuilding(props: any) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        // subtle hover/float
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.5;
    });

    const materialProps = {
        color: '#0B0B0F',
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
    };

    const edgeColor = '#4a5568'; // slate-600ish

    return (
        <group ref={meshRef} {...props}>
            {/* Main Building Body */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial {...materialProps} />
                <Edges scale={1} threshold={15} color={edgeColor} />
            </mesh>

            {/* Roof (Triangular Prism-ish) */}
            <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[1.5, 1, 4]} />
                <meshStandardMaterial {...materialProps} />
                <Edges scale={1} threshold={15} color={edgeColor} />
            </mesh>

            {/* Door */}
            <mesh position={[0, 0.5, 1.01]}>
                <planeGeometry args={[0.8, 1.2]} />
                <meshStandardMaterial color="#1a1a1e" />
                <Edges scale={1} threshold={15} color={edgeColor} />
            </mesh>

            {/* "GYM" Text Sign placeholder - could be real text later if needed */}
            <mesh position={[0, 1.6, 1.01]}>
                <planeGeometry args={[1.2, 0.4]} />
                <meshStandardMaterial color="#0B0B0F" />
                <Edges scale={1} color={edgeColor} />
            </mesh>
        </group>
    );
}
