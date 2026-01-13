import { useEffect, useRef } from 'react';
import './SineWaveBackground.css';

const SineWaveBackground = () => {
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

        const drawWave = (
            yOffset: number,
            amplitude: number,
            frequency: number,
            speed: number,
            opacity: number,
            lineWidth: number
        ) => {
            ctx.beginPath();

            // Start from right side, waves positioned in bottom-right area
            const startY = canvas.height * 0.6 + yOffset;
            ctx.moveTo(0, startY);

            for (let x = 0; x <= canvas.width; x++) {
                // Create more organic wave shape
                const wave1 = Math.sin(x * frequency + time * speed) * amplitude;
                const wave2 = Math.sin(x * frequency * 1.5 + time * speed * 0.8) * (amplitude * 0.3);
                const y = startY + wave1 + wave2;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Multiple sine waves layered for depth - positioned towards bottom right
            // Primary wave - most visible
            drawWave(0, 40, 0.002, 0.4, 0.08, 1.5);

            // Secondary waves
            drawWave(50, 35, 0.0025, 0.35, 0.06, 1.2);
            drawWave(100, 30, 0.003, 0.3, 0.05, 1);

            // Tertiary waves - subtle background
            drawWave(150, 25, 0.0035, 0.25, 0.04, 0.8);
            drawWave(200, 20, 0.004, 0.2, 0.03, 0.6);

            // Upper subtle waves
            drawWave(-100, 30, 0.0015, 0.5, 0.03, 0.8);
            drawWave(-150, 25, 0.002, 0.45, 0.025, 0.6);

            time += 0.016;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="sine-wave-background" />;
};

export default SineWaveBackground;
