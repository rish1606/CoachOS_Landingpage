import { useRef, useEffect, useCallback } from 'react';

interface AboutWaveCanvasProps {
    scrollProgress: number;
    characterX: number; // 0-1 normalized X position of character
}

const AboutWaveCanvas = ({ scrollProgress, characterX }: AboutWaveCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const waveTimeRef = useRef(0);
    const lastProgressRef = useRef(0);
    const isVisibleRef = useRef(true);

    // Wave config - matches hero spectrum style exactly
    const CONFIG = {
        numLines: 45,
        lineSpacing: 4.5,
        lineWidth: 0.5,
        roadY: 0.78, // At character feet level (78% down)
        baseOpacity: 0.02,
        coreOpacity: 0.055,
    };

    const drawWaveRoad = useCallback((
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        scrollDelta: number
    ) => {
        const roadY = height * CONFIG.roadY;
        const { numLines, lineSpacing, lineWidth, baseOpacity, coreOpacity } = CONFIG;
        const bandHeight = numLines * lineSpacing;
        const startY = roadY - bandHeight / 2;

        // Wave time advances only on scroll
        waveTimeRef.current += scrollDelta * 80;

        // Character occlusion position
        const charPosX = width * characterX;
        const occlusionRadius = width * 0.06;

        for (let i = 0; i < numLines; i++) {
            const lineY = startY + i * lineSpacing;
            const distFromCenter = Math.abs(i - numLines / 2) / (numLines / 2);
            const verticalFade = 1 - distFromCenter * 0.65;

            ctx.beginPath();
            ctx.lineWidth = lineWidth;

            const segments = 100;
            for (let s = 0; s <= segments; s++) {
                const x = (s / segments) * width;

                // Horizontal fade (soft at edges, bright toward right-center)
                const leftFade = Math.min(1, x / (width * 0.1));
                const rightFade = Math.min(1, (width - x) / (width * 0.12));
                const coreBrightness = Math.exp(-Math.pow((x - width * 0.65) / (width * 0.3), 2));

                // Wave motion
                const waveAmp = 0.8 + coreBrightness * 1.2;
                const wave = Math.sin(x * 0.005 + waveTimeRef.current * 0.008 + i * 0.12) * waveAmp;
                const microWave = Math.sin(x * 0.012 + waveTimeRef.current * 0.015 + i * 0.08) * 0.4;

                const y = lineY + wave + microWave;

                // Character occlusion
                const distToChar = Math.abs(x - charPosX);
                const occlusionFade = distToChar < occlusionRadius
                    ? 0.25 + (distToChar / occlusionRadius) * 0.75
                    : 1;

                const lineOpacity = (baseOpacity + coreOpacity * coreBrightness)
                    * verticalFade * leftFade * rightFade * occlusionFade;

                // Steel blue-grey matching hero
                ctx.strokeStyle = `rgba(140, 160, 185, ${lineOpacity})`;

                if (s === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }, [characterX]);

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isVisibleRef.current) {
            animationRef.current = requestAnimationFrame(render);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        const scrollDelta = scrollProgress - lastProgressRef.current;
        lastProgressRef.current = scrollProgress;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        drawWaveRoad(ctx, width, height, scrollDelta);

        ctx.restore();
        animationRef.current = requestAnimationFrame(render);
    }, [drawWaveRoad, scrollProgress]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        animationRef.current = requestAnimationFrame(render);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [render]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
};

export default AboutWaveCanvas;
