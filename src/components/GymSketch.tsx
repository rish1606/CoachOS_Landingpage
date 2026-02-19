import { motion } from 'framer-motion';
import { useMemo } from 'react';

const GymSketch = () => {
    // Rough pencil style filter (applied ONLY to the building now)
    const pencilFilter = (
        <filter id="pencilTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
    );

    // Generate Wavy Road Paths
    const roadPaths = useMemo(() => {
        const paths = [];
        const numLines = 24;

        // Spectrum Colors (cool steel/blue)
        // Matches R:140, G:160, B:185 from SpectrumWaves
        const colorBase = "140, 160, 185";

        for (let i = 0; i < numLines; i++) {
            // Normalized position across the road width (-1 to 1)
            const t = (i / (numLines - 1)) * 2 - 1;

            // Perspective: Bottom is wide, Top is narrow
            const bottomX = 200 + t * 400; // Wider base
            const topX = 200 + t * 20;     // Narrow horizon point

            // Generate points for the wave
            const points = [];
            const steps = 60; // Smoother curves
            for (let s = 0; s <= steps; s++) {
                const v = s / steps; // 0 (bottom) to 1 (top/horizon)

                // Interpolate X based on perspective
                const currentX = bottomX + (topX - bottomX) * v;
                // Non-linear Y for better perspective (compress near horizon)
                // easeOutQuad equivalent: 1 - (1-v)*(1-v) -> fast change then slow?
                // actually we want steps to be smaller at top. v is linear 0->1.
                // let's stick to linear Y for now, but maybe compress slightly.
                const currentY = 300 - v * 80; // 300 to 220

                // Spectrum Wave Logic:
                // Gentle primary sine + subtle secondary
                const waveAmp = (4 * (1 - v)) * Math.max(0.2, 1 - Math.abs(t)); // Fade amp at top and edges
                const waveFreq = 12; // lower freq
                const waveX = Math.sin(v * waveFreq + i * 0.2) * waveAmp;

                points.push(`${currentX + waveX},${currentY}`);
            }

            // Opacity: Spectrum style (fade edges, bright center core)
            // Center strands are brighter
            const centerDist = Math.abs(t);
            const baseOp = 0.6 * (1 - centerDist); // 0.6 at center, 0 at edges

            paths.push({
                d: `M ${points.join(' L ')}`,
                color: `rgba(${colorBase}, ${Math.max(0.05, baseOp)})`,
                width: centerDist < 0.2 ? 1.5 : 1, // Thicker center lines
                delay: Math.abs(t) * 0.2
            });
        }
        return paths;
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <svg
                viewBox="0 0 400 300"
                className="w-full max-w-[500px] h-auto"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {pencilFilter}
                    {/* Add a subtle glow filter for the road */}
                    <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* --- SPECTRUM WAVE ROAD (Clean Style) --- */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ filter: 'url(#roadGlow)' }}
                >
                    {roadPaths.map((road, i) => (
                        <motion.path
                            key={`spectrum-road-${i}`}
                            d={road.d}
                            fill="none"
                            stroke={road.color}
                            strokeWidth={road.width}
                            strokeLinecap="round" // Clean caps
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.8, delay: 0.1 + i * 0.03, ease: "easeOut" }}
                        // NO pencil filter here
                        />
                    ))}
                </motion.g>

                {/* --- GYM BUILDING SKETCH (Pencil Style) --- */}
                <motion.g
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                >
                    {/* Shadow Blob (Clean blur) */}
                    <ellipse cx="200" cy="255" rx="110" ry="15" fill="rgba(0,0,0,0.5)" filter="blur(12px)" />

                    {/* Group with Pencil Filter */}
                    <g style={{ filter: 'url(#pencilTexture)' }}>
                        {/* --- TALL LEFT BLDG --- */}
                        <path
                            d="M120 250 L120 100 L180 120 L180 250 Z"
                            fill="rgba(255,255,255,0.05)"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        {/* Roof */}
                        <path
                            d="M115 100 L185 120"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Windows */}
                        <path d="M135 130 L135 230" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                        <path d="M150 140 L150 210" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                        <path d="M165 150 L165 230" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" />


                        {/* --- RIGHT ANNEX --- */}
                        <path
                            d="M180 250 L280 250 L280 160 L180 160"
                            fill="rgba(255,255,255,0.03)"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        {/* Roof */}
                        <path
                            d="M180 160 L285 160"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Dumbbell Icon */}
                        <rect x="210" y="185" width="10" height="20" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
                        <rect x="240" y="185" width="10" height="20" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
                        <line x1="220" y1="195" x2="240" y2="195" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />

                        {/* Double Doors */}
                        <rect x="210" y="220" width="40" height="30" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
                        <line x1="230" y1="220" x2="230" y2="250" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />


                        {/* --- TREES --- */}
                        <path
                            d="M130 250 L130 230"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1.5"
                        />
                        <ellipse cx="130" cy="225" rx="8" ry="12" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />

                        <path
                            d="M150 250 L150 235"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1.5"
                        />
                        <ellipse cx="150" cy="230" rx="8" ry="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />


                        {/* Base Line */}
                        <path
                            d="M100 250 L300 250"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </g>

                </motion.g>

                {/* --- DECORATIVE PARTICLES (Subtle dust, clean) --- */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle
                        key={`dust-${i}`}
                        cx={140 + Math.random() * 120}
                        cy={120 + Math.random() * 100}
                        r={Math.random() * 1.5}
                        fill="rgba(140, 160, 185, 0.3)" // Matching wave color
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};

export default GymSketch;
