import { useEffect, useRef } from "react";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, x: number) => {
    const t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
};

const SpectrumWaves = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isVisibleRef = useRef(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Visibility detection - pause when off screen
        const observer = new IntersectionObserver(
            ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let raf = 0;
        let time = 0;
        let lastFrameTime = 0;
        const targetFPS = 30; // Throttle to 30fps for better performance
        const frameInterval = 1000 / targetFPS;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);

            // IMPORTANT: reset then scale
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);

        // --- LOCK THESE TO MATCH YOUR ORIGINAL ---
        const peakXRatio = 0.70;     // bright core position
        const centerYRatio = 0.555;  // band vertical position (paragraph level)
        const bandHeightRatio = 0.20;// tight band thickness

        // Color (cool steel)
        const r = 140, g = 160, b = 185;

        const draw = (timestamp: number) => {
            // Skip if not visible (off-screen)
            if (!isVisibleRef.current) {
                raf = requestAnimationFrame(draw);
                return;
            }

            // FPS throttling - skip frames if too fast
            const elapsed = timestamp - lastFrameTime;
            if (elapsed < frameInterval) {
                raf = requestAnimationFrame(draw);
                return;
            }
            lastFrameTime = timestamp - (elapsed % frameInterval);

            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            // Proper full clear (in CSS px space)
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            ctx.globalCompositeOperation = "source-over";
            ctx.filter = "none";

            const peakX = w * peakXRatio;
            const centerY = h * centerYRatio;
            const bandH = h * bandHeightRatio;

            // Gradient: keep alpha LOW inside stops (key difference)
            const grad = ctx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0.00, `rgba(${r},${g},${b},0)`);
            grad.addColorStop(0.25, `rgba(${r},${g},${b},0)`);
            grad.addColorStop(0.42, `rgba(${r},${g},${b},0.02)`);

            grad.addColorStop(0.58, `rgba(${r},${g},${b},0.05)`);
            grad.addColorStop(0.64, `rgba(${r},${g},${b},0.10)`);
            grad.addColorStop(peakXRatio, `rgba(${r},${g},${b},0.14)`); // tight + not too bright

            grad.addColorStop(0.78, `rgba(${r},${g},${b},0.10)`);
            grad.addColorStop(0.88, `rgba(${r},${g},${b},0.04)`);
            grad.addColorStop(1.00, `rgba(${r},${g},${b},0.015)`);

            // Hairline density (don’t go crazy)
            const numLines = 170;

            // vertical gaussian (smaller = tighter)
            const sigma = 0.52;

            for (let i = 0; i < numLines; i++) {
                const u = (i / (numLines - 1)) * 2 - 1;

                // center packing
                const eased = Math.sign(u) * Math.pow(Math.abs(u), 1.55);
                const dist = Math.abs(eased);

                const vFade = Math.exp(-(dist * dist) / (2 * sigma * sigma));

                // BASE Y
                const y0 = centerY + eased * (bandH * 0.5);

                // THIS is the main fix: super low per-line alpha
                ctx.globalAlpha = 0.55 * vFade; // vFade already drops edges hard

                // tiny motion (original is subtle)
                const phase = time * 1.7 + i * 0.035;

                ctx.beginPath();

                for (let x = 0; x <= w; x += 2) {
                    // keep left calmer, motion starts later
                    const rightness = smoothstep(w * 0.42, w * 0.80, x);

                    // slight boost near peak, but still subtle
                    const peakBoost = 0.75 + 0.25 * smoothstep(peakX - w * 0.10, peakX + w * 0.18, x);

                    const amp = 0.95 * rightness * peakBoost; // < 1px-ish most places

                    const y =
                        y0 +
                        Math.sin(x * 0.010 + phase) * amp +
                        Math.sin(x * 0.0048 + phase * 0.7) * (amp * 0.32);

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.strokeStyle = grad;
                ctx.lineWidth = 0.65; // crisp hairline
                ctx.stroke();
            }

            // Crisp spine (single bright thread) — DO NOT make it thick
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 2) {
                const rightness = smoothstep(w * 0.44, w * 0.82, x);
                const peakBoost = 0.8 + 0.2 * smoothstep(peakX - w * 0.10, peakX + w * 0.14, x);
                const amp = 0.55 * rightness * peakBoost;
                const y = centerY + Math.sin(x * 0.010 + time * 1.9) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = grad;
            ctx.stroke();

            // Micro glow removed - using CSS blur on canvas instead for better GPU performance

            ctx.globalAlpha = 1;

            time += 0.018;
            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);

        // Cleanup observer on unmount
        const cleanup = () => {
            observer.disconnect();
        };

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            cleanup();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ filter: 'blur(0.3px)' }}
        />
    );
};

export default SpectrumWaves;
