import { useEffect, useRef } from "react";

interface CardWaveProps {
    isActive: boolean;
    hue?: number;
}

// Aurora + Gaussian Waves — reduced brightness
const CardWave = ({ isActive }: CardWaveProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intensityRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        let raf = 0;
        let time = Math.random() * 1000;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const orbs = [
            { x: 0.25, y: 0.35, vx: 0.0014, vy: 0.0009, radius: 0.6, color: [175, 210, 240] as const },
            { x: 0.75, y: 0.6, vx: -0.0011, vy: 0.0007, radius: 0.5, color: [150, 190, 230] as const },
            { x: 0.5, y: 0.25, vx: 0.0008, vy: -0.001, radius: 0.45, color: [200, 225, 250] as const },
            { x: 0.6, y: 0.75, vx: -0.0007, vy: -0.0008, radius: 0.35, color: [165, 200, 235] as const },
        ];

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
        };

        const ro = new ResizeObserver(() => resize());
        if (canvas.parentElement) ro.observe(canvas.parentElement);
        resize();

        const smoothstep = (a: number, b: number, x: number) => {
            const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
            return t * t * (3 - 2 * t);
        };

        const draw = () => {
            const target = isActive ? 1.0 : 0.0;
            intensityRef.current += (target - intensityRef.current) * 0.025;

            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (intensityRef.current < 0.005) {
                raf = requestAnimationFrame(draw);
                return;
            }

            const alpha = intensityRef.current;

            // ──── AURORA (reduced brightness) ────
            ctx.globalCompositeOperation = 'screen';

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.x < -0.1 || orb.x > 1.1) orb.vx *= -1;
                if (orb.y < -0.1 || orb.y > 1.1) orb.vy *= -1;

                const cx = orb.x * w;
                const cy = orb.y * h;
                const r = orb.radius * Math.max(w, h);

                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                const [cr, cg, cb] = orb.color;
                // Reduced from 0.32 → 0.18
                grad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.18 * alpha})`);
                grad.addColorStop(0.35, `rgba(${cr},${cg},${cb},${0.08 * alpha})`);
                grad.addColorStop(0.7, `rgba(${cr},${cg},${cb},${0.02 * alpha})`);
                grad.addColorStop(1, `rgba(0,0,0,0)`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            });

            // ──── WAVE LINES (reduced brightness) ────
            const gradLine = ctx.createLinearGradient(0, 0, w, 0);
            gradLine.addColorStop(0, `rgba(190,215,245,0)`);
            gradLine.addColorStop(0.15, `rgba(190,215,245,${0.05 * alpha})`);
            // Reduced from 0.35 → 0.18
            gradLine.addColorStop(0.4, `rgba(215,235,255,${0.18 * alpha})`);
            gradLine.addColorStop(0.6, `rgba(215,235,255,${0.18 * alpha})`);
            gradLine.addColorStop(0.85, `rgba(190,215,245,${0.05 * alpha})`);
            gradLine.addColorStop(1, `rgba(190,215,245,0)`);

            const numLines = 35;
            const centerY = h * 0.5;

            for (let i = 0; i < numLines; i++) {
                const u = (i / (numLines - 1)) * 2 - 1;
                const sigma = 0.2;
                const vFade = Math.exp(-(u * u) / (2 * sigma * sigma));

                // Reduced from 0.9 → 0.55
                ctx.globalAlpha = vFade * alpha * 0.55;
                ctx.beginPath();
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = gradLine;

                const phase = time + i * 0.05;

                for (let x = 0; x <= w; x += 3) {
                    const env = smoothstep(w * 0.03, w * 0.2, x) * (1 - smoothstep(w * 0.8, w * 0.97, x));
                    const amp = 20 * env * vFade;
                    const y = centerY + u * h * 0.14 +
                        Math.sin(x * 0.008 + phase) * amp +
                        Math.sin(x * 0.016 + phase * 0.5) * (amp * 0.2);

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Spine (reduced)
            ctx.globalAlpha = 0.3 * alpha;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 4) {
                const env = smoothstep(w * 0.03, w * 0.2, x) * (1 - smoothstep(w * 0.8, w * 0.97, x));
                const amp = 12 * env;
                const y = centerY + Math.sin(x * 0.008 + time) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `rgba(210,230,255,0.5)`;
            ctx.stroke();

            time += 0.005;
            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [isActive]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ filter: 'blur(0.8px)', mixBlendMode: 'plus-lighter' }}
        />
    );
};

export default CardWave;
