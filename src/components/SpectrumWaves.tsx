import { useEffect, useRef } from 'react';

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

        const drawSpectrumBand = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const numLines = 120; // Dense bundle of ultra-thin lines
            const bandCenterY = canvas.height * 0.55; // Mid height
            const peakX = canvas.width * 0.70; // Core peak at 70% width (center-right)
            const bandHeight = canvas.height * 0.35; // Total vertical spread of band

            // Generate lines with Gaussian spacing (tighter at center, wider at edges)
            for (let i = 0; i < numLines; i++) {
                // Map i to a position from -1 to 1 (normalized vertical position in band)
                const normalizedPos = (i / (numLines - 1)) * 2 - 1;
                const distFromCenter = Math.abs(normalizedPos);

                // Gaussian-based spacing: tighter at center (1-2px), wider at edges (4-8px)
                // Use sigmoid-like curve for smooth transition
                const spacingFactor = 1 + distFromCenter * distFromCenter * 3;
                const baseY = bandCenterY + normalizedPos * (bandHeight / 2) * spacingFactor * 0.4;

                ctx.beginPath();

                // Draw each line across the canvas with subtle wave undulation
                for (let x = 0; x <= canvas.width; x += 2) {
                    // Calculate horizontal position relative to peak
                    const relativeX = (x - peakX) / (canvas.width * 0.5);

                    // Micro phase shift animation - energy flowing through band
                    const phase = time * 2 + i * 0.03;

                    // Very subtle wave undulation (low amplitude, smooth)
                    const waveAmplitude = 2 + Math.sin(i * 0.5) * 1; // 1-3px amplitude
                    const microJitter = Math.sin(x * 0.01 + phase) * waveAmplitude;
                    const secondaryWave = Math.sin(x * 0.005 + phase * 0.7) * (waveAmplitude * 0.5);

                    const y = baseY + microJitter + secondaryWave;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                // === GAUSSIAN OPACITY CALCULATION ===
                // Distance from vertical center of band (for density appearance)
                const verticalFade = 1 - distFromCenter * distFromCenter * 0.8;

                // Horizontal Gaussian: peak at 70% width, fades to left and right
                // LEFT tail (behind text): drops to near invisible
                // RIGHT tail: slightly more visible than left

                // Base opacity values
                const coreOpacity = 0.12; // Brightest at core
                const minOpacity = 0.01; // Near invisible at tails

                // Line color: dark silver-blue (cool steel)
                const r = 140;
                const g = 160;
                const b = 185;

                // Create horizontal gradient for Gaussian falloff
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

                // LEFT tail (0-30%): near invisible (behind hero text)
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
                gradient.addColorStop(0.15, `rgba(${r}, ${g}, ${b}, ${minOpacity * verticalFade})`);
                gradient.addColorStop(0.30, `rgba(${r}, ${g}, ${b}, ${minOpacity * 2 * verticalFade})`);

                // MID zone (30-55%): gradually increasing
                gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.3 * verticalFade})`);
                gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.5 * verticalFade})`);

                // CORE zone (55-80%): peak brightness at ~70%
                gradient.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.85 * verticalFade})`);
                gradient.addColorStop(0.70, `rgba(${r}, ${g}, ${b}, ${coreOpacity * verticalFade})`); // PEAK
                gradient.addColorStop(0.78, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.85 * verticalFade})`);

                // RIGHT tail (80-100%): fade but slightly more visible than left
                gradient.addColorStop(0.88, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.4 * verticalFade})`);
                gradient.addColorStop(0.95, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.15 * verticalFade})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${minOpacity * verticalFade})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1; // Ultra-thin hairline strokes (~1px)
                ctx.stroke();
            }
        };

        const animate = () => {
            time += 0.025; // Medium-fast but smooth animation
            drawSpectrumBand();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

export default SpectrumWaves;
