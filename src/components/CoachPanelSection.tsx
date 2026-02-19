import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const features = [
    { title: "Trainer & Admin Access", subtitle: "Secure trainer and admin dashboard with centralised client management." },
    { title: "Program Assignment", subtitle: "Assign workout programs and structured meal plans to clients, with ability to update based on progress." },
    { title: "Class & Session Management", subtitle: "Class and session scheduling, booking management for group and personal training." },
    { title: "Client Tracking", subtitle: "Access to workout logs, food logs, and client progress history and tracking." },
];

const CoachPanelSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Scroll 1: Title label
    const titleOpacity = useTransform(scrollYProgress, [0, 0.06, 0.88, 0.95], [0, 1, 1, 0]);
    // Scroll 2: H1 heading
    const h1Opacity = useTransform(scrollYProgress, [0.06, 0.14, 0.88, 0.95], [0, 1, 1, 0]);
    // Scroll 3: H2 + subheading together
    const subOpacity = useTransform(scrollYProgress, [0.14, 0.22, 0.88, 0.95], [0, 1, 1, 0]);
    // Scroll 4: Dashboard
    const dashOpacity = useTransform(scrollYProgress, [0.22, 0.32, 0.88, 0.95], [0, 1, 1, 0]);
    // Scroll 5-8: Each feature fades in individually
    const feat0Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.88, 0.95], [0, 1, 1, 0]);
    const feat1Opacity = useTransform(scrollYProgress, [0.42, 0.52, 0.88, 0.95], [0, 1, 1, 0]);
    const feat2Opacity = useTransform(scrollYProgress, [0.52, 0.62, 0.88, 0.95], [0, 1, 1, 0]);
    const feat3Opacity = useTransform(scrollYProgress, [0.62, 0.72, 0.88, 0.95], [0, 1, 1, 0]);

    const featOpacities = [feat0Opacity, feat1Opacity, feat2Opacity, feat3Opacity];

    return (
        <section ref={containerRef} className="relative bg-[#07080C]" style={{ height: '350vh' }}>
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                {/* Background layers — matching Hero page exactly */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* BACK LAYER: Faint blue cast + soft radial glow */}
                    <div className="absolute inset-0"
                        style={{
                            background: `
                            radial-gradient(ellipse 28% 18% at 70% 55%, rgba(120,150,190,0.06) 0%, transparent 65%),
                            radial-gradient(ellipse 40% 30% at 70% 55%, rgba(100, 130, 170, 0.04) 0%, transparent 70%),
                            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30, 40, 55, 0.03) 0%, transparent 100%)
                        `
                        }}
                    />

                    {/* Soft core glow */}
                    <div className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse 35% 25% at 70% 55%, rgba(140, 160, 190, 0.04) 0%, transparent 60%)'
                        }}
                    />

                    {/* Vignette */}
                    <div className="absolute inset-0"
                        style={{
                            background: `
                            radial-gradient(ellipse 100% 100% at 50% 50%, 
                                transparent 35%, 
                                rgba(0, 0, 0, 0.08) 60%, 
                                rgba(0, 0, 0, 0.15) 80%,
                                rgba(0, 0, 0, 0.22) 100%
                            )
                        `
                        }}
                    />

                    {/* Film grain texture */}
                    <div className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'repeat',
                            mixBlendMode: 'overlay'
                        }}
                    />

                    {/* Wave background — full coverage */}
                    <WaveBackground />
                </div>

                {/* Top & bottom vignette — same as Mobile App */}
                <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-20"
                    style={{ background: 'linear-gradient(to bottom, #07080C, transparent)' }}
                />
                <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-20"
                    style={{ background: 'linear-gradient(to top, #07080C, transparent)' }}
                />

                <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

                    {/* Title label — fades in first */}
                    <div className="text-center mb-24">
                        <motion.p style={{ opacity: titleOpacity }} className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-medium">
                            Coach Panel
                        </motion.p>
                        <motion.h1 style={{ opacity: h1Opacity }} className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Premium Client Management
                        </motion.h1>
                    </div>

                    {/* Three column layout: H1 left — Dashboard center — Features right */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_auto_1fr] gap-10 lg:gap-12 items-start">

                        {/* LEFT — Heading + short description, flush left */}
                        <motion.div style={{ opacity: subOpacity }} className="flex flex-col justify-start pt-4">
                            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug mb-5">
                                All your clients,<br />one place.
                            </h2>
                            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-sm">
                                Management tools for trainers and administrators to assign programs, schedule sessions, and monitor client progress — all from a single centralised dashboard.
                            </p>
                        </motion.div>

                        {/* CENTER — Dashboard mockup */}
                        <motion.div style={{ opacity: dashOpacity }} className="relative w-[340px] md:w-[400px] mx-auto">
                            <div className="relative bg-[#0F1014] rounded-xl border border-white/8 shadow-2xl p-3 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                                {/* Header dots */}
                                <div className="h-6 w-full border-b border-white/8 flex items-center gap-1.5 px-3 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/40" />
                                </div>
                                {/* Content skeleton */}
                                <div className="grid grid-cols-3 gap-2 h-52">
                                    <div className="col-span-1 bg-white/5 rounded-md h-full animate-pulse" />
                                    <div className="col-span-2 space-y-2">
                                        <div className="h-20 bg-white/5 rounded-md w-full" />
                                        <div className="h-8 bg-white/5 rounded-md w-full" />
                                        <div className="h-8 bg-white/5 rounded-md w-full" />
                                        <div className="h-8 bg-white/5 rounded-md w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating chat card */}
                            <div className="absolute -right-8 -top-5 w-36 p-2.5 bg-[#1A1B20] border border-white/8 rounded-lg shadow-lg z-20">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[7px] text-blue-300 font-semibold">JD</div>
                                    <div className="h-1.5 w-14 bg-white/15 rounded-full" />
                                </div>
                                <div className="h-1.5 w-full bg-white/8 rounded-full mb-1" />
                                <div className="h-1.5 w-2/3 bg-white/8 rounded-full" />
                            </div>

                            {/* Floating video card */}
                            <div className="absolute -left-6 -bottom-4 w-28 aspect-video bg-[#15161A] border border-blue-500/20 rounded-lg shadow-lg z-20 overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-1 left-1.5 text-[6px] text-blue-400/70 font-mono">LIVE</div>
                            </div>

                            {/* Floating Diet & Exercise card */}
                            <div className="absolute -right-10 bottom-10 w-40 p-2.5 bg-[#1A1B20] border border-white/6 rounded-lg shadow-lg z-20">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                                    </div>
                                    <span className="text-white/80 text-[10px] font-medium">Diet & Exercise</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full bg-white/8 rounded-full" />
                                    <div className="h-1.5 w-3/4 bg-white/6 rounded-full" />
                                </div>
                            </div>

                            {/* Floating Past Insights card */}
                            <div className="absolute -left-10 top-14 w-40 p-2.5 bg-[#1A1B20] border border-white/6 rounded-lg shadow-lg z-20">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="w-5 h-5 rounded-md bg-blue-500/15 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                    </div>
                                    <span className="text-white/80 text-[10px] font-medium">Past Insights</span>
                                </div>
                                <div className="flex items-end gap-0.5 h-6">
                                    <div className="w-2.5 bg-blue-500/25 rounded-sm" style={{ height: '40%' }} />
                                    <div className="w-2.5 bg-blue-500/35 rounded-sm" style={{ height: '70%' }} />
                                    <div className="w-2.5 bg-blue-500/40 rounded-sm" style={{ height: '55%' }} />
                                    <div className="w-2.5 bg-blue-500/35 rounded-sm" style={{ height: '85%' }} />
                                    <div className="w-2.5 bg-blue-500/30 rounded-sm" style={{ height: '60%' }} />
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT — Feature list with title + subtitle, each fades in */}
                        <div className="flex flex-col gap-4 pt-4">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    style={{ opacity: featOpacities[i] }}
                                    className="cursor-default"
                                >
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-blue-200/60 font-light leading-relaxed">
                                        {feature.subtitle}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoachPanelSection;

// Wave background — concentrated in the center content band
const WaveBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "-10%" });

    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;

    // Center band: 30% to 70% of viewport height
    const bandTop = viewBoxHeight * 0.3;
    const bandHeight = viewBoxHeight * 0.4;

    const waves = useMemo(() =>
        Array.from({ length: 18 }).map((_, i) => {
            const yOffset = bandTop + i * (bandHeight / 17);
            const distFromCenter = Math.abs(i - 8.5) / 8.5;
            return {
                key: i,
                yOffset,
                opacity: 0.12 + (1 - distFromCenter) * 0.32,
                strokeWidth: 0.5 + (1 - distFromCenter) * 0.8,
                duration: 11 + i * 0.35,
                delay: i * 0.08
            };
        }), []
    );

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.75 }}
        >
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                <defs>
                    <linearGradient id="coachWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                        stroke="url(#coachWaveGradient)"
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
        </div>
    );
};
