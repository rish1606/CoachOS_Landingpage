import { useEffect, useRef } from 'react';

const SpectrumWaves = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });

        let animationFrameId: number;
        let time = 0;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const numLines = 100; // Increased to 100 lines (50 pairs)
        const bandCenterYRatio = 0.52;
        // Compress the distance between pairs even further
        const bandHeightRatio = 0.055;
        // Reducing from 6.0 to 5.4 to soften the density of the core just a little bit
        const spreadPower = 5.4;
        const speed = -4.5; // "Blackhole wave moving bit fast"

        const pulses = [
            { x: 0, w: 0.15, h: 25, speed: 1.2 },
            { x: 0.4, w: 0.20, h: 18, speed: 0.9 },
            { x: 0.7, w: 0.12, h: 30, speed: 1.4 }
        ];

        const draw = () => {
            if (!ctx) return;
            const w = canvas.width;
            const h = canvas.height;
            const centerY = h * bandCenterYRatio;
            const maxSpread = h * bandHeightRatio;

            // Critical for "1st Image" look: Light Addition Blending & Clean Clear
            ctx.clearRect(0, 0, w, h);
            // "Center stroke should not be this white/glowing": REMOVED 'lighter' mode.
            // Using standard alpha blending so lines layer up like paint, not light.

            // "Not so shiny, subtle blend, normal shade"
            const r = 110, g = 130, b = 160;

            const numPairs = Math.floor(numLines / 2);

            for (let i = 0; i < numLines; i++) {
                const pairIndex = Math.floor(i / 2);
                const isSecondInPair = i % 2 === 1;

                // Normalized pair index -1 to 1
                let pairT = (pairIndex / (numPairs - 1)) * 2 - 1;

                const sign = Math.sign(pairT);
                const absT = Math.abs(pairT);

                // spread is power-based
                // The power function makes pairs tighter in the center and more distant at the edges.
                const pairSpread = sign * Math.pow(absT, spreadPower) * maxSpread;
                const pairBaseY = centerY + pairSpread;

                // In the center, lines in a pair are tightly packed (smaller distance)
                // At the edges, they are slightly more distant.
                // Restoring the edge spread for the two lines inside a pair back to 6.0 so they have normal distance
                const innerDistance = 0.5 + (absT * 6.0); // 0.5px at center, 6.5px at edges
                const lineOffset = isSecondInPair ? innerDistance / 2 : -innerDistance / 2;

                const baseY = pairBaseY + lineOffset;

                // "Thick waves... not as thick as center but thick": Outer lines ~1.5 to 2.0
                const lineWidth = Math.max(1.5, 2.0 * (1 - Math.pow(absT, 0.5)));
                // "upper and lower waves should not be that bright as centre core so reduce opacity of it by 3 or 4"
                // This curve makes the waves slowly dim as they move toward the edges.
                // At center (absT = 0), this is 1.0. At the very edge (absT = 1), this falls to 0.25 (1/4 the opacity).
                const relativeDimming = 1.0 - (0.75 * Math.pow(absT, 1.5));

                // "make vigneete only at last of waves at top and bottom"
                // Push the threshold out to 0.90 so it ONLY fades the very extreme last 10% into total darkness
                let vignetteFade = 1.0;
                const edgeThreshold = 0.90;
                if (absT > edgeThreshold) {
                    // Normalize the fade to occur strictly between 0.90 and 1.0
                    const overflow = (absT - edgeThreshold) / (1.0 - edgeThreshold);
                    vignetteFade = Math.pow(1 - overflow, 2.0); // Smooth fall to black
                }

                // Combine the base density (0.6), the dimming effect (relativeDimming), and the final black fade (vignetteFade)
                const opacity = 0.6 * relativeDimming * vignetteFade;

                ctx.beginPath();
                ctx.lineWidth = lineWidth * dpr;

                // But let's create it for clarity
                const grad = ctx.createLinearGradient(0, 0, w, 0);
                grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
                // "Center stroke should also disappear": Fade out completely below center.
                // From 0 to 0.4: ZERO opacity.
                // From 0.4 to 0.6: Fade in.
                // From 0.6 to 1: Full opacity.
                grad.addColorStop(0.3, `rgba(${r},${g},${b},0)`);
                grad.addColorStop(0.5, `rgba(${r},${g},${b},${opacity * 0.5})`);
                grad.addColorStop(0.7, `rgba(${r},${g},${b},${opacity})`);
                grad.addColorStop(1, `rgba(${r},${g},${b},${opacity})`);

                ctx.strokeStyle = grad;

                // Draw curve
                const xStep = 10 * dpr;
                let started = false;

                for (let x = 0; x <= w; x += xStep) {
                    const xNorm = x / w;

                    // Step 1571 Loop Logic EXACTLY
                    let yOffset = 0;

                    const pRightToLeft = 1.2 - ((time * 0.15) % 1.4);

                    // A single smooth, continuous bump. 
                    // We completely removed the secondary "g2" bump which was causing the "U dip" in the middle.
                    // Made the base slightly wider (multiplier 3 instead of 4) so it feels solid.
                    const g1 = Math.exp(-Math.pow((xNorm - pRightToLeft) * 3, 2)) * 35 * dpr;

                    const noise = Math.sin(xNorm * 10 + time * 2) * 2 * dpr;

                    // Apply the single wave and the noise
                    yOffset = (g1 + noise) * (1 - absT * 0.3);

                    // "Start to fade away once it moved from center to completely fade away in left like a tail"
                    // Left side (0 to 0.5): Fade strongly. Right side (0.5 to 1): Full opacity.
                    // Using power curve for "tail" effect.
                    const tailFade = xNorm < 0.5 ? Math.pow(xNorm * 2, 1.5) : 1;
                    yOffset *= tailFade;

                    if (!started) {
                        ctx.moveTo(x, baseY + yOffset);
                        started = true;
                    } else {
                        ctx.lineTo(x, baseY + yOffset);
                    }
                }

                ctx.stroke();
            }
        };

        const animate = () => {
            time += 0.01;
            draw();
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
            key="spectrum-waves-alpha-fix" // Force new context creation to ensure alpha:true works
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

export default SpectrumWaves;
