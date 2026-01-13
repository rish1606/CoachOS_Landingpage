import { useEffect, useRef, useState } from 'react';
import './Laptop3D.css';

interface Laptop3DProps {
    screenContent?: string;
}

const Laptop3D = ({ screenContent }: Laptop3DProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 5, y: -15 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (isHovering) return;

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.008;
            // Subtle floating animation
            const floatY = Math.sin(time) * 3;
            const rotateY = -15 + Math.sin(time * 0.5) * 5;

            setRotation({ x: 5 + floatY * 0.2, y: rotateY });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovering]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateY = ((e.clientX - centerX) / rect.width) * 20;
        const rotateX = ((centerY - e.clientY) / rect.height) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    return (
        <div
            ref={containerRef}
            className="laptop-3d-container"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            <div className="laptop-glow-effect" />
            <div
                className="laptop-3d"
                style={{
                    transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
            >
                {/* Screen Lid */}
                <div className="laptop-screen">
                    <div className="screen-bezel">
                        <div className="screen-camera" />
                        <div className="screen-display">
                            {screenContent ? (
                                <img src={screenContent} alt="Dashboard" className="screen-content-image" />
                            ) : (
                                <div className="screen-content">
                                    {/* Sidebar */}
                                    <div className="dashboard-sidebar">
                                        <div className="sidebar-logo">
                                            <div className="logo-icon" />
                                        </div>
                                        <div className="sidebar-nav">
                                            <div className="nav-item active" />
                                            <div className="nav-item" />
                                            <div className="nav-item" />
                                            <div className="nav-item" />
                                            <div className="nav-item" />
                                        </div>
                                    </div>
                                    {/* Main Content */}
                                    <div className="dashboard-main">
                                        <div className="dashboard-header">
                                            <div className="header-search" />
                                            <div className="header-actions">
                                                <div className="action-btn" />
                                                <div className="action-btn" />
                                                <div className="user-avatar" />
                                            </div>
                                        </div>
                                        <div className="dashboard-content">
                                            <div className="content-card large">
                                                <div className="card-header-line" />
                                                <div className="card-chart" />
                                            </div>
                                            <div className="content-row">
                                                <div className="content-card small">
                                                    <div className="card-icon" />
                                                    <div className="card-text" />
                                                </div>
                                                <div className="content-card small">
                                                    <div className="card-icon" />
                                                    <div className="card-text" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="screen-reflection" />
                    </div>
                </div>

                {/* Hinge */}
                <div className="laptop-hinge" />

                {/* Base/Keyboard */}
                <div className="laptop-base">
                    <div className="keyboard-area">
                        {/* Keyboard rows */}
                        {[...Array(4)].map((_, rowIndex) => (
                            <div key={rowIndex} className="keyboard-row">
                                {[...Array(rowIndex === 3 ? 8 : 12)].map((_, keyIndex) => (
                                    <div
                                        key={keyIndex}
                                        className={`key ${rowIndex === 3 && keyIndex === 4 ? 'spacebar' : ''}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="trackpad" />
                    <div className="base-front-edge" />
                </div>
            </div>
        </div>
    );
};

export default Laptop3D;
