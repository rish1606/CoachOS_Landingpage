import { useEffect, useRef } from 'react';

interface WaveOrbProps {
    progress: number; // 0–1 from scroll
}

const WaveOrb = ({ progress }: WaveOrbProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bloomRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(progress);
    progressRef.current = progress;

    useEffect(() => {
        const canvas = canvasRef.current;
        const bloomCanvas = bloomRef.current;
        if (!canvas || !bloomCanvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        const bloomCtx = bloomCanvas.getContext('2d', { alpha: true });
        if (!ctx || !bloomCtx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;
        let time = 0;

        // --- PARTICLE SYSTEM ---
        interface Particle {
            streamIndex: number;
            t: number;
            speed: number;
            size: number;
            opacity: number;
            phase: number;
            // Trail history
            trail: { x: number; y: number }[];
        }

        const NUM_STREAMS = 7;
        const PARTICLES_PER_STREAM = 16;
        const TRAIL_LENGTH = 8;

        const particles: Particle[] = [];
        for (let s = 0; s < NUM_STREAMS; s++) {
            for (let p = 0; p < PARTICLES_PER_STREAM; p++) {
                particles.push({
                    streamIndex: s,
                    t: Math.random(),
                    speed: 0.0012 + Math.random() * 0.003,
                    size: 1 + Math.random() * 2.5,
                    opacity: 0.25 + Math.random() * 0.5,
                    phase: Math.random() * Math.PI * 2,
                    trail: [],
                });
            }
        }

        // --- ORBITAL PARTICLES ---
        const orbitals = [
            { angle: 0, speed: 0.008, radius: 0.85, size: 3, brightness: 0.7 },
            { angle: Math.PI * 0.7, speed: -0.006, radius: 0.72, size: 2.5, brightness: 0.5 },
            { angle: Math.PI * 1.4, speed: 0.01, radius: 0.95, size: 2, brightness: 0.6 },
            { angle: Math.PI * 0.3, speed: -0.012, radius: 0.6, size: 3.5, brightness: 0.8 },
        ];

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                bloomCanvas.width = rect.width * dpr;
                bloomCanvas.height = rect.height * dpr;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                bloomCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
        };

        const ro = new ResizeObserver(() => resize());
        if (canvas.parentElement) ro.observe(canvas.parentElement);
        resize();

        // Helper: get particle world position
        const getParticlePos = (p: Particle, cx: number, cy: number, radius: number, t: number) => {
            const baseAngle = (p.streamIndex / NUM_STREAMS) * Math.PI * 2 + t * 0.15;
            const startX = cx + Math.cos(baseAngle) * radius;
            const startY = cy + Math.sin(baseAngle) * radius;
            const lx = startX + (cx - startX) * p.t;
            const ly = startY + (cy - startY) * p.t;
            const perpAngle = baseAngle + Math.PI / 2;
            const waveOff = (1 - p.t) * 10 * Math.sin(p.t * 8 + t * 2 + p.streamIndex * 1.3 + p.phase);
            const bubbleOff = (1 - p.t * p.t) * 5 * Math.sin(p.t * 18 + t * 4 + p.phase * 2);
            return {
                x: lx + Math.cos(perpAngle) * (waveOff + bubbleOff),
                y: ly + Math.sin(perpAngle) * (waveOff + bubbleOff),
            };
        };

        const draw = () => {
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            const cx = w / 2;
            const cy = h / 2;
            const baseRadius = Math.min(w, h) * 0.38;
            const prog = progressRef.current;

            // BREATHING RHYTHM — slow pulse
            const breathe = 1 + Math.sin(time * 0.8) * 0.02; // 0.98–1.02 scale
            const radius = baseRadius * breathe;

            // Clear both canvases
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            bloomCtx.setTransform(1, 0, 0, 1, 0, 0);
            bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
            bloomCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (prog < 0.01) {
                raf = requestAnimationFrame(draw);
                return;
            }

            const coreAlpha = Math.min(prog * 1.5, 1);

            // ═══ CENTER GLOW (main + bloom) ═══
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.35);
            coreGrad.addColorStop(0, `rgba(140,180,220,${0.18 * coreAlpha})`);
            coreGrad.addColorStop(0.4, `rgba(120,160,210,${0.07 * coreAlpha})`);
            coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
            ctx.fill();

            // Bloom layer — bigger, brighter core glow
            const bloomGrad = bloomCtx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.5);
            bloomGrad.addColorStop(0, `rgba(150,190,235,${0.25 * coreAlpha})`);
            bloomGrad.addColorStop(0.3, `rgba(130,170,220,${0.1 * coreAlpha})`);
            bloomGrad.addColorStop(1, 'rgba(0,0,0,0)');
            bloomCtx.fillStyle = bloomGrad;
            bloomCtx.beginPath();
            bloomCtx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
            bloomCtx.fill();

            // ═══ CONVERGING WAVE STREAMS ═══
            for (let s = 0; s < NUM_STREAMS; s++) {
                const streamProg = Math.max(0, Math.min(1, (prog - s * 0.04) / 0.7));
                if (streamProg <= 0) continue;

                const baseAngle = (s / NUM_STREAMS) * Math.PI * 2 + time * 0.15;
                const startX = cx + Math.cos(baseAngle) * radius;
                const startY = cy + Math.sin(baseAngle) * radius;

                ctx.beginPath();
                ctx.globalAlpha = 0.25 * streamProg * coreAlpha;
                const steps = 60;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    if (t > streamProg) break;
                    const lx = startX + (cx - startX) * t;
                    const ly = startY + (cy - startY) * t;
                    const perpAngle = baseAngle + Math.PI / 2;
                    const waveAmp = (1 - t) * 12 * Math.sin(t * 8 + time * 2 + s * 1.3);
                    const bubbleAmp = (1 - t * t) * 4 * Math.sin(t * 15 + time * 3.5 + s * 2.1);
                    const fx = lx + Math.cos(perpAngle) * (waveAmp + bubbleAmp);
                    const fy = ly + Math.sin(perpAngle) * (waveAmp + bubbleAmp);
                    if (i === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
                }
                const hueShift = s * 15;
                ctx.strokeStyle = `hsla(${210 + hueShift}, 50%, 72%, ${0.4 * streamProg})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // Second harmonic
                ctx.beginPath();
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    if (t > streamProg) break;
                    const lx = startX + (cx - startX) * t;
                    const ly = startY + (cy - startY) * t;
                    const perpAngle = baseAngle + Math.PI / 2;
                    const waveAmp2 = (1 - t) * 8 * Math.sin(t * 12 + time * 1.7 + s * 0.9 + 2);
                    const fx = lx + Math.cos(perpAngle) * waveAmp2;
                    const fy = ly + Math.sin(perpAngle) * waveAmp2;
                    if (i === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
                }
                ctx.strokeStyle = `hsla(${200 + hueShift}, 45%, 65%, ${0.2 * streamProg})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            // ═══ PARTICLES WITH TRAILS ═══
            ctx.globalCompositeOperation = 'screen';
            particles.forEach(p => {
                const streamProg = Math.max(0, Math.min(1, (prog - p.streamIndex * 0.04) / 0.7));
                if (streamProg <= 0) return;

                p.t += p.speed;
                if (p.t > 1) { p.t = 0; p.trail = []; }
                if (p.t > streamProg) return;

                const pos = getParticlePos(p, cx, cy, radius, time);

                // Store trail position
                p.trail.push({ x: pos.x, y: pos.y });
                if (p.trail.length > TRAIL_LENGTH) p.trail.shift();

                const centerBoost = p.t * 0.5;
                const alpha = p.opacity * streamProg * (0.5 + centerBoost) * coreAlpha;

                // Draw trail (fading tail)
                if (p.trail.length > 1) {
                    for (let ti = 0; ti < p.trail.length - 1; ti++) {
                        const trailAlpha = (ti / p.trail.length) * alpha * 0.4;
                        ctx.globalAlpha = trailAlpha;
                        ctx.strokeStyle = `rgba(150,195,240,${trailAlpha})`;
                        ctx.lineWidth = p.size * 0.4 * (ti / p.trail.length);
                        ctx.beginPath();
                        ctx.moveTo(p.trail[ti].x, p.trail[ti].y);
                        ctx.lineTo(p.trail[ti + 1].x, p.trail[ti + 1].y);
                        ctx.stroke();
                    }
                }

                // Bubbly glow particle
                const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 2.5);
                grad.addColorStop(0, `rgba(160,200,240,${alpha})`);
                grad.addColorStop(0.5, `rgba(140,180,230,${alpha * 0.3})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalAlpha = 1;
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, p.size * 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Bright core dot
                ctx.globalAlpha = alpha * 0.9;
                ctx.fillStyle = 'rgba(210,230,255,0.9)';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fill();

                // Bloom for brighter particles near center
                if (p.t > 0.6) {
                    const bloomAlpha = alpha * (p.t - 0.6) * 2;
                    const bGrad = bloomCtx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 5);
                    bGrad.addColorStop(0, `rgba(160,200,240,${bloomAlpha * 0.5})`);
                    bGrad.addColorStop(1, 'rgba(0,0,0,0)');
                    bloomCtx.globalAlpha = 1;
                    bloomCtx.fillStyle = bGrad;
                    bloomCtx.beginPath();
                    bloomCtx.arc(pos.x, pos.y, p.size * 5, 0, Math.PI * 2);
                    bloomCtx.fill();
                }
            });

            // ═══ ORBITAL PARTICLES ═══
            ctx.globalCompositeOperation = 'screen';
            orbitals.forEach(orb => {
                orb.angle += orb.speed;
                const orbAlpha = coreAlpha * orb.brightness * Math.min(prog * 3, 1);
                const ox = cx + Math.cos(orb.angle) * radius * orb.radius;
                const oy = cy + Math.sin(orb.angle) * radius * orb.radius;

                // Main dot
                const oGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.size * 3);
                oGrad.addColorStop(0, `rgba(180,215,250,${orbAlpha})`);
                oGrad.addColorStop(0.4, `rgba(150,195,240,${orbAlpha * 0.4})`);
                oGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalAlpha = 1;
                ctx.fillStyle = oGrad;
                ctx.beginPath();
                ctx.arc(ox, oy, orb.size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Bright center
                ctx.globalAlpha = orbAlpha;
                ctx.fillStyle = 'rgba(220,235,255,0.9)';
                ctx.beginPath();
                ctx.arc(ox, oy, orb.size * 0.7, 0, Math.PI * 2);
                ctx.fill();

                // Bloom for orbitals
                const obGrad = bloomCtx.createRadialGradient(ox, oy, 0, ox, oy, orb.size * 8);
                obGrad.addColorStop(0, `rgba(160,200,245,${orbAlpha * 0.4})`);
                obGrad.addColorStop(1, 'rgba(0,0,0,0)');
                bloomCtx.globalAlpha = 1;
                bloomCtx.fillStyle = obGrad;
                bloomCtx.beginPath();
                bloomCtx.arc(ox, oy, orb.size * 8, 0, Math.PI * 2);
                bloomCtx.fill();
            });

            // ═══ OUTER WAVES ═══
            ctx.globalCompositeOperation = 'source-over';

            // Hard wave outer ring
            const outerRingAlpha = Math.min(prog * 1.2, 0.7);
            const waveStrength = 6 + prog * 10;
            const outerR = radius * (0.95 + prog * 0.15);
            ctx.globalAlpha = outerRingAlpha * 0.5;
            ctx.lineWidth = 1.4;
            ctx.strokeStyle = `rgba(140,180,225,${0.6 * outerRingAlpha})`;
            ctx.beginPath();
            for (let i = 0; i <= 360; i++) {
                const angle = (i / 360) * Math.PI * 2;
                const wave1 = Math.sin(angle * 6 + time * 1.8) * waveStrength;
                const wave2 = Math.sin(angle * 10 - time * 2.5) * (waveStrength * 0.4);
                const r = outerR + wave1 + wave2;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            // Second outer ring
            ctx.globalAlpha = outerRingAlpha * 0.3;
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = `rgba(160,200,240,${0.4 * outerRingAlpha})`;
            ctx.beginPath();
            const outerR2 = radius * (1.0 + prog * 0.2);
            for (let i = 0; i <= 360; i++) {
                const angle = (i / 360) * Math.PI * 2;
                const wave1 = Math.sin(angle * 8 - time * 1.5 + 1) * (waveStrength * 0.7);
                const wave2 = Math.sin(angle * 5 + time * 2.2) * (waveStrength * 0.3);
                const r = outerR2 + wave1 + wave2;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            // Spreading wave arcs (right + left)
            const spreadReach = prog * radius * 0.6;
            if (prog > 0.15) {
                const arcAlpha = Math.min((prog - 0.15) * 2, 0.6);

                // Right arc
                ctx.globalAlpha = arcAlpha * 0.4;
                ctx.lineWidth = 1.2;
                ctx.strokeStyle = `rgba(150,190,235,${0.5 * arcAlpha})`;
                ctx.beginPath();
                for (let i = 0; i <= 100; i++) {
                    const t = i / 100;
                    const sx = cx + radius * 0.3 + t * spreadReach;
                    const sy = cy + Math.sin(t * 12 + time * 2.2) * (8 + t * 15) * prog;
                    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                }
                ctx.stroke();

                // Right harmonic
                ctx.globalAlpha = arcAlpha * 0.2;
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                for (let i = 0; i <= 100; i++) {
                    const t = i / 100;
                    const sx = cx + radius * 0.3 + t * spreadReach;
                    const sy = cy + Math.sin(t * 8 - time * 1.8 + 2) * (6 + t * 12) * prog;
                    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                }
                ctx.stroke();

                // Left arc
                ctx.globalAlpha = arcAlpha * 0.4;
                ctx.lineWidth = 1.2;
                ctx.strokeStyle = `rgba(130,170,220,${0.5 * arcAlpha})`;
                ctx.beginPath();
                for (let i = 0; i <= 100; i++) {
                    const t = i / 100;
                    const sx = cx - radius * 0.3 - t * spreadReach;
                    const sy = cy + Math.sin(t * 12 - time * 2.0 + 1) * (8 + t * 15) * prog;
                    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                }
                ctx.stroke();

                // Left harmonic
                ctx.globalAlpha = arcAlpha * 0.2;
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                for (let i = 0; i <= 100; i++) {
                    const t = i / 100;
                    const sx = cx - radius * 0.3 - t * spreadReach;
                    const sy = cy + Math.sin(t * 8 + time * 1.6 + 3) * (6 + t * 12) * prog;
                    if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                }
                ctx.stroke();
            }

            // Expanding ripple rings
            for (let ring = 0; ring < 3; ring++) {
                const ringProg = Math.max(0, prog - ring * 0.2);
                if (ringProg <= 0) continue;
                const ringR = radius * (1.1 + ring * 0.15 + ringProg * 0.2);
                const ringAlpha = Math.max(0, 0.12 - ring * 0.03) * Math.min(ringProg * 3, 1);
                ctx.globalAlpha = ringAlpha;
                ctx.lineWidth = 0.4;
                ctx.strokeStyle = 'rgba(150,190,230,1)';
                ctx.beginPath();
                ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Core pulse
            const pulseSize = 3 + Math.sin(time * 3) * 1.5;
            const pulseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize * 4);
            pulseGrad.addColorStop(0, `rgba(200,225,255,${0.45 * coreAlpha})`);
            pulseGrad.addColorStop(0.4, `rgba(160,200,240,${0.12 * coreAlpha})`);
            pulseGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.globalAlpha = 1;
            ctx.fillStyle = pulseGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, pulseSize * 4, 0, Math.PI * 2);
            ctx.fill();

            // Core pulse bloom
            const bpGrad = bloomCtx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize * 8);
            bpGrad.addColorStop(0, `rgba(180,215,250,${0.3 * coreAlpha})`);
            bpGrad.addColorStop(0.5, `rgba(150,195,240,${0.08 * coreAlpha})`);
            bpGrad.addColorStop(1, 'rgba(0,0,0,0)');
            bloomCtx.globalAlpha = 1;
            bloomCtx.fillStyle = bpGrad;
            bloomCtx.beginPath();
            bloomCtx.arc(cx, cy, pulseSize * 8, 0, Math.PI * 2);
            bloomCtx.fill();

            time += 0.012;
            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return (
        <div className="relative w-full aspect-square max-w-[400px]">
            {/* Subtle ambient glow */}
            <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    opacity: Math.min(progress * 0.8, 0.5),
                    background: 'radial-gradient(circle at center, rgba(100,160,220,0.1) 0%, transparent 60%)',
                    filter: 'blur(25px)',
                }}
            />
            {/* Bloom canvas (behind, heavily blurred) */}
            <canvas
                ref={bloomRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ filter: 'blur(20px)', opacity: 0.8 }}
            />
            {/* Main canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />
        </div>
    );
};

export default WaveOrb;
