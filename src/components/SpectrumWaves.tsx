import { useEffect, useRef, useCallback } from "react";

// Gaussian function - creates smooth bell curve shape
const gaussian = (x: number, mean: number, sigma: number): number => {
    return Math.exp(-Math.pow(x - mean, 2) / (2 * sigma * sigma));
};

// Eased smoothstep for transitions
const smoothstep = (edge0: number, edge1: number, x: number): number => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

interface GaussianPulse {
    position: number;
    velocity: number;
    sigma: number;
    amplitude: number;
}

interface WaveLine {
    baseY: number;
    baseThickness: number;
    speed: number;
    opacity: number;
    pulses: GaussianPulse[];
    color: { r: number; g: number; b: number };
    distanceFromCenter: number;
}

const SpectrumWaves = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isVisibleRef = useRef(true);
    const linesRef = useRef<WaveLine[]>([]);
    const timeRef = useRef(0);
    const rafIdRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Initialize wave lines - elegant, uniform, subtle
    const initializeLines = useCallback((): WaveLine[] => {
        const lines: WaveLine[] = [];
        const color = { r: 140, g: 165, b: 195 };
        const totalLines = 18;

        for (let i = 0; i < totalLines; i++) {
            const t = i / (totalLines - 1);
            const centered = t * 2 - 1;
            const distanceFromCenter = Math.abs(centered);

            const numPulses = 2;
            const pulses: GaussianPulse[] = [];
            for (let p = 0; p < numPulses; p++) {
                pulses.push({
                    position: Math.random() * 1.6 - 0.3,
                    velocity: 0.015 + Math.random() * 0.025,
                    sigma: 0.1 + Math.random() * 0.1,
                    amplitude: 4 + Math.random() * 8,
                });
            }

            const thicknessFalloff = gaussian(centered, 0, 0.4);
            const centerThickness = 2.2 + Math.random() * 0.6;
            const edgeThickness = 0.25 + Math.random() * 0.1;
            const baseThickness = edgeThickness + (centerThickness - edgeThickness) * thicknessFalloff;
            const opacity = 0.05 + thicknessFalloff * 0.18;

            lines.push({
                baseY: t,
                baseThickness,
                speed: 0.4 + Math.random() * 0.3,
                opacity,
                pulses,
                color,
                distanceFromCenter,
            });
        }

        return lines;
    }, []);

    // Main animation function using native requestAnimationFrame
    const animate = useCallback((timestamp: number) => {
        // Skip if not visible
        if (!isVisibleRef.current) {
            rafIdRef.current = requestAnimationFrame(animate);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            rafIdRef.current = requestAnimationFrame(animate);
            return;
        }

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
            rafIdRef.current = requestAnimationFrame(animate);
            return;
        }

        // Calculate delta time
        const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
        lastTimeRef.current = timestamp;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        const cappedDelta = Math.min(delta, 50);
        timeRef.current += cappedDelta * 0.001;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        ctx.globalCompositeOperation = "source-over";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const peakXRatio = 0.70;
        const centerYRatio = 0.555;
        const bandHeight = h * 0.12;

        const lines = linesRef.current;
        const sortedLines = [...lines].sort((a, b) => b.distanceFromCenter - a.distanceFromCenter);

        for (const line of sortedLines) {
            const centered = line.baseY * 2 - 1;
            const baseY = centerYRatio * h + centered * (bandHeight * 0.5);

            for (const pulse of line.pulses) {
                pulse.position += pulse.velocity * line.speed * cappedDelta * 0.001;
                if (pulse.position > 1.4) {
                    pulse.position = -0.4;
                    pulse.amplitude = 4 + Math.random() * 10;
                    pulse.sigma = 0.1 + Math.random() * 0.1;
                    pulse.velocity = 0.015 + Math.random() * 0.025;
                }
            }

            const points: { x: number; y: number; thickness: number; alpha: number }[] = [];

            for (let x = 0; x <= w; x += 2) {
                const xNorm = x / w;

                const leftFlatten = smoothstep(0.0, 0.35, xNorm);
                const rightBoost = smoothstep(0.5, 0.85, xNorm) * 0.3 + 1;

                let gaussianSum = 0;
                let maxGaussian = 0;

                for (const pulse of line.pulses) {
                    const g = gaussian(xNorm, pulse.position, pulse.sigma);
                    gaussianSum += g * pulse.amplitude;
                    maxGaussian = Math.max(maxGaussian, g);
                }

                const waveFrequency = 4;
                const waveAmplitude = 3 + (1 - line.distanceFromCenter) * 3;
                const sineWave = Math.sin(xNorm * Math.PI * waveFrequency + timeRef.current * 1.2 + line.baseY * 10) * waveAmplitude;
                const yOffset = (gaussianSum * 0.4 + sineWave * 0.6) * leftFlatten * rightBoost;

                const thicknessFromGaussian = maxGaussian * 0.8;
                const thickness = line.baseThickness * (1 + thicknessFromGaussian);

                const fadeLeft = smoothstep(0.0, 0.2, xNorm);
                const fadeRight = smoothstep(1.0, 0.9, xNorm);
                const peakProximity = gaussian(xNorm, peakXRatio, 0.22);
                const alpha = line.opacity * fadeLeft * fadeRight * (0.7 + peakProximity * 0.3 + maxGaussian * 0.2);

                points.push({
                    x,
                    y: baseY + yOffset,
                    thickness: Math.max(0.25, thickness),
                    alpha: Math.min(0.35, alpha),
                });
            }

            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                const avgThickness = (p1.thickness + p2.thickness) / 2;
                const avgAlpha = (p1.alpha + p2.alpha) / 2;

                ctx.strokeStyle = `rgba(${line.color.r}, ${line.color.g}, ${line.color.b}, ${avgAlpha})`;
                ctx.lineWidth = avgThickness;
                ctx.stroke();
            }
        }

        // Subtle central spine
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
            const xNorm = x / w;
            const leftFlatten = smoothstep(0.0, 0.3, xNorm);
            const rightBoost = smoothstep(0.5, 0.85, xNorm) * 0.25 + 1;

            const pulse1Pos = (timeRef.current * 0.04) % 1.6 - 0.3;
            const pulse2Pos = ((timeRef.current * 0.03) + 0.5) % 1.6 - 0.3;
            const g1 = gaussian(xNorm, pulse1Pos, 0.12) * 6;
            const g2 = gaussian(xNorm, pulse2Pos, 0.1) * 5;

            const spineWave = Math.sin(xNorm * Math.PI * 4.5 + timeRef.current * 1.4) * 4;
            const y = centerYRatio * h + (spineWave + g1 + g2 * 0.5) * leftFlatten * rightBoost;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        const spineGrad = ctx.createLinearGradient(0, 0, w, 0);
        spineGrad.addColorStop(0.0, "rgba(150, 175, 205, 0)");
        spineGrad.addColorStop(0.25, "rgba(150, 175, 205, 0)");
        spineGrad.addColorStop(0.45, "rgba(150, 175, 205, 0.18)");
        spineGrad.addColorStop(peakXRatio, "rgba(165, 185, 215, 0.35)");
        spineGrad.addColorStop(0.85, "rgba(150, 175, 205, 0.12)");
        spineGrad.addColorStop(1.0, "rgba(150, 175, 205, 0.03)");

        ctx.strokeStyle = spineGrad;
        ctx.lineWidth = 1.8 + Math.sin(timeRef.current * 1.5) * 0.3;
        ctx.stroke();

        // Continue animation loop
        rafIdRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        linesRef.current = initializeLines();

        // Visibility observer - pause when 70% scrolled out (threshold 0.3)
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                // Cancel RAF completely when not visible to free main thread
                if (!entry.isIntersecting) {
                    cancelAnimationFrame(rafIdRef.current);
                } else if (entry.isIntersecting && rafIdRef.current === 0) {
                    // Restart animation when becoming visible again
                    rafIdRef.current = requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }  // Pause earlier - when 70% scrolled out
        );
        observer.observe(canvas);

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);

        // Start animation loop
        rafIdRef.current = requestAnimationFrame(animate);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(rafIdRef.current);
        };
    }, [initializeLines, animate]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{
                filter: 'blur(0.25px)',
                willChange: 'transform' // GPU hint
            }}
        />
    );
};

export default SpectrumWaves;
