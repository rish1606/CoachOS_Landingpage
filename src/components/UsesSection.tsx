import { useRef, useMemo, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView, MotionValue, AnimatePresence } from 'framer-motion';

// Lazy load 3D laptop to avoid SSR issues
const Laptop3D = lazy(() => import('./Laptop3D'));

const UsesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Laptop position: 12% → 50% → 88%
    const laptopPercent = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [12, 50, 88]);

    // Wave intensity: soft → peak → soft
    const waveIntensity = useTransform(scrollYProgress, [0.15, 0.4, 0.6, 0.85], [0.4, 0.6, 1, 0.4]);

    // Panel visibility
    const panelAOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.35, 0.42], [0, 1, 1, 0]);
    const panelBOpacity = useTransform(scrollYProgress, [0.42, 0.48, 0.58, 0.65], [0, 1, 1, 0]);
    const panelCOpacity = useTransform(scrollYProgress, [0.65, 0.72, 0.85, 0.95], [0, 1, 1, 0.5]);

    return (
        <section
            id="features"
            ref={sectionRef}
            className="relative bg-[#07080C]"
            style={{ height: '400vh' }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex items-center justify-center" style={{ overflow: 'clip' }}>

                {/* Background gradient - same as Hero */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 28% 18% at 70% 55%, rgba(120,150,190,0.06) 0%, transparent 65%),
                            radial-gradient(ellipse 40% 30% at 70% 55%, rgba(100, 130, 170, 0.04) 0%, transparent 70%),
                            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30, 40, 55, 0.03) 0%, transparent 100%)
                        `
                    }}
                />

                {/* Film grain overlay - very subtle */}
                <div
                    className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none z-50"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '150px'
                    }}
                />

                {/* Background waves - same style as Hero */}
                <WaveBackground intensity={waveIntensity} />

                {/* 3D Laptop */}
                <LaptopContainer laptopPercent={laptopPercent} />

                {/* Content Panels */}
                <PanelA opacity={panelAOpacity} />
                <PanelB opacity={panelBOpacity} />
                <PanelC opacity={panelCOpacity} />

                {/* Next section hint */}
                <AnimatePresence>
                    <motion.a
                        href="#orbit"
                        className="absolute bottom-8 right-10 flex items-center gap-2 text-xs text-white/28 hover:text-white/55 transition-colors z-50"
                        style={{ opacity: panelCOpacity }} // Fade in with the last panel
                        whileHover={{ scale: 1.05 }}
                    >
                        Next: Coach OS Core
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.a>
                </AnimatePresence>
            </div>
        </section>
    );
};

// Laptop container with scroll-linked horizontal movement
const LaptopContainer = ({ laptopPercent }: { laptopPercent: MotionValue<number> }) => {
    const leftStyle = useTransform(laptopPercent, (v) => `${v}%`);
    const translateX = useTransform(laptopPercent, (v) => `${-v}%`);

    return (
        <motion.div
            className="absolute z-10"
            style={{
                left: leftStyle,
                translateX: translateX,
                top: '50%',
                translateY: '-50%',
                width: 'clamp(400px, 48vw, 650px)',
                height: 'clamp(300px, 36vw, 490px)',
            }}
        >
            {/* Occlusion mask - dims waves around laptop */}
            <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_center,rgba(7,8,12,0.95)_0%,rgba(7,8,12,0.6)_40%,transparent_65%)] pointer-events-none z-0" />

            {/* 3D Laptop */}
            <div className="relative w-full h-full z-10">
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
                    </div>
                }>
                    <Laptop3D size={1.3} />
                </Suspense>
            </div>
        </motion.div>
    );
};

// Panel A: "What it is"
const PanelA = ({ opacity }: { opacity: MotionValue<number> }) => (
    <motion.div
        className="absolute inset-0 flex items-center pointer-events-none z-20"
        style={{ opacity }}
    >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="ml-auto max-w-[400px] text-right">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">What it is</h2>
                <p className="text-sm md:text-base text-white/55 mb-5 leading-relaxed">
                    An intelligent platform that unifies your entire coaching business.
                </p>
                <ul className="space-y-2.5 text-white/45 text-sm">
                    <li className="flex items-center justify-end gap-2.5">
                        <span>Client management in one place</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                    </li>
                    <li className="flex items-center justify-end gap-2.5">
                        <span>AI-powered insights & analytics</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                    </li>
                    <li className="flex items-center justify-end gap-2.5">
                        <span>Seamless scheduling & billing</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                    </li>
                </ul>
            </div>
        </div>
    </motion.div>
);

// Panel B: "What it helps"
const PanelB = ({ opacity }: { opacity: MotionValue<number> }) => (
    <motion.div
        className="absolute inset-0 flex items-center pointer-events-none z-20"
        style={{ opacity }}
    >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="flex justify-between items-center">
                <div className="max-w-[220px]">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">What it helps</h2>
                    <p className="text-white/45 text-sm leading-relaxed">
                        Transform how you run your coaching practice.
                    </p>
                </div>
                <div className="max-w-[220px] text-right space-y-3">
                    <div><div className="text-xl md:text-2xl font-bold text-white">10+ hrs</div><div className="text-white/35 text-xs">saved weekly</div></div>
                    <div><div className="text-xl md:text-2xl font-bold text-white">40%</div><div className="text-white/35 text-xs">better retention</div></div>
                    <div><div className="text-xl md:text-2xl font-bold text-white">100%</div><div className="text-white/35 text-xs">clarity on progress</div></div>
                </div>
            </div>
        </div>
    </motion.div>
);

// Panel C: "How to use"
const PanelC = ({ opacity }: { opacity: MotionValue<number> }) => (
    <motion.div
        className="absolute inset-0 flex items-center pointer-events-none z-20"
        style={{ opacity }}
    >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-[400px]">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">How to use</h2>
                <p className="text-sm md:text-base text-white/55 mb-5 leading-relaxed">Get started in three simple steps.</p>
                <div className="space-y-3">
                    {[
                        { num: '1', title: 'Set up your profile', sub: 'Connect your calendar and preferences' },
                        { num: '2', title: 'Add your clients', sub: 'Import or create client profiles' },
                        { num: '3', title: 'Run your programs', sub: 'Deliver plans and track progress' }
                    ].map(step => (
                        <div key={step.num} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-white/60 text-xs font-medium shrink-0">{step.num}</div>
                            <div>
                                <div className="font-medium text-white text-sm">{step.title}</div>
                                <div className="text-white/35 text-xs">{step.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

// Same wave style as Hero - smooth silver-blue, no jitter
// OPTIMIZED: Uses useInView to pause animations when off-screen
const WaveBackground = ({ intensity }: { intensity: MotionValue<number> }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "-10%" });

    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;
    const centerY = viewBoxHeight * 0.5;

    // Waves with visible color
    const waves = useMemo(() =>
        Array.from({ length: 15 }).map((_, i) => {
            const yOffset = centerY + (i - 7) * 22;
            const distFromCenter = Math.abs(i - 7) / 7;
            return {
                key: i,
                yOffset,
                opacity: 0.15 + (1 - distFromCenter) * 0.28, // More visible
                strokeWidth: 0.6 + (1 - distFromCenter) * 0.7,
                duration: 12 + i * 0.4,
                delay: i * 0.1
            };
        }), [centerY]
    );

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 z-0"
            style={{
                opacity: intensity,
                willChange: 'opacity'
            }}
        >
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                <defs>
                    {/* Brighter blue wave gradient - slightly enhanced */}
                    <linearGradient id="usesWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(100,160,240,0)" />
                        <stop offset="25%" stopColor="rgba(120,180,240,0.28)" />
                        <stop offset="50%" stopColor="rgba(160,210,255,0.48)" />
                        <stop offset="75%" stopColor="rgba(120,180,240,0.28)" />
                        <stop offset="100%" stopColor="rgba(100,160,240,0)" />
                    </linearGradient>
                </defs>

                {waves.map(w => (
                    <motion.path
                        key={w.key}
                        fill="none"
                        stroke="url(#usesWaveGradient)"
                        strokeWidth={w.strokeWidth}
                        opacity={w.opacity}
                        d={`M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 15} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`}
                        animate={isInView ? {
                            d: [
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 18} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset - 18} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 18} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                            ]
                        } : undefined}
                        transition={{
                            duration: w.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: w.delay
                        }}
                    />
                ))}
            </svg>
        </motion.div>
    );
};

export default UsesSection;
