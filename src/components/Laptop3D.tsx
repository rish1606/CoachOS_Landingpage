import { Suspense, useRef, useState, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Laptop3DProps {
    size?: number;
    className?: string;
}

// Error boundary to prevent WebGL crashes from unmounting entire app
interface ErrorBoundaryState {
    hasError: boolean;
}

class WebGLErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: ReactNode, fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('3D Laptop Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Main exported component
const Laptop3D = ({ size = 1, className = '' }: Laptop3DProps) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <WebGLErrorBoundary fallback={<LaptopPlaceholder />}>
                <Canvas
                    camera={{ position: [0, 0, 4], fov: 45 }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                        failIfMajorPerformanceCaveat: false
                    }}
                    style={{ background: 'transparent' }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(0x000000, 0);
                    }}
                >
                    <Suspense fallback={null}>
                        <LaptopScene size={size} />
                    </Suspense>
                </Canvas>
            </WebGLErrorBoundary>
        </div>
    );
};

// Fallback placeholder if WebGL fails
const LaptopPlaceholder = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-64 h-44 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border border-white/10 shadow-2xl flex items-center justify-center">
            <div className="text-white/30 text-sm">3D Model</div>
        </div>
    </div>
);

// Inner scene with laptop model
const LaptopScene = ({ size }: { size: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [isInteracting, setIsInteracting] = useState(false);

    // Idle animation
    useFrame((state) => {
        if (!groupRef.current || isInteracting) return;

        const time = state.clock.getElapsedTime();

        // Subtle floating drift
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.015;

        // Tiny rotation drift
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.008;
        groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.01 + Math.PI;
    });

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#c0d0ff" />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#8090c0" />
            <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Laptop model */}
            <group ref={groupRef} scale={size * 1.8}>
                <LaptopModel />
            </group>

            {/* Interactive controls */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
                rotateSpeed={0.5}
                onStart={() => setIsInteracting(true)}
                onEnd={() => setIsInteracting(false)}
            />
        </>
    );
};

// GLTF model loader with error handling
const LaptopModel = () => {
    const { scene } = useGLTF('/macbook.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                child.material.envMapIntensity = 0.8;
                child.material.needsUpdate = true;
            }
        });
    }, [scene]);

    return <primitive object={scene} />;
};

// Preload the model
useGLTF.preload('/macbook.glb');

export default Laptop3D;
