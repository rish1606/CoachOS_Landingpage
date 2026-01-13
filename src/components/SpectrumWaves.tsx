import { useEffect, useRef } from 'react';
import './SpectrumWaves.css';

const SpectrumWaves = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const drawSoftWaves = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height * 0.55;
            const numLines = 50; // More lines for layered depth
            const lineSpacing = 12;

            // Draw soft, overlapping sine-like waves
            for (let i = -numLines / 2; i <= numLines / 2; i++) {
                ctx.beginPath();

                const baseY = centerY + i * lineSpacing;
                const distanceFromCenter = Math.abs(i) / (numLines / 2);

                // Calculate convergence - lines meet at center point
                const convergenceStrength = 100 * (1 - distanceFromCenter * 0.3);

                for (let x = 0; x <= canvas.width; x += 2) {
                    const relativeX = (x - centerX) / (canvas.width / 2);

                    // Smooth Gaussian curve for symmetrical convergence
                    const gaussianCurve = Math.exp(-relativeX * relativeX * 2);

                    // Soft flowing wave motion
                    const wavePhase = time * 0.5 + i * 0.05;
                    const flowingWave = Math.sin(relativeX * 3 + wavePhase) * 8 * (1 - gaussianCurve * 0.5);

                    // Calculate vertical displacement
                    let yOffset;
                    if (i < 0) {
                        // Lines above center converge downward
                        yOffset = gaussianCurve * convergenceStrength * 0.5 + flowingWave;
                    } else if (i > 0) {
                        // Lines below center converge upward
                        yOffset = -gaussianCurve * convergenceStrength * 0.5 + flowingWave;
                    } else {
                        // Center line with subtle wave
                        yOffset = flowingWave * 0.3;
                    }

                    const y = baseY + yOffset;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                // Thin, semi-transparent lines - more visible near center
                const baseOpacity = 0.04;
                const centerBonus = (1 - distanceFromCenter) * 0.08;
                const opacity = baseOpacity + centerBonus;

                ctx.strokeStyle = `rgba(180, 180, 180, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        };

        const animate = () => {
            time += 0.02; // Smooth continuous motion
            drawSoftWaves();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="spectrum-waves" />;
};

export default SpectrumWaves;
