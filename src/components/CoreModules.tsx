import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

// --- DATA ---
const MODULES = [
    {
        id: "gym",
        title: "Gym Management",
        shortDesc: "Members, billing, scheduling, staff.",
        detail: {
            title: "Gym Management",
            desc: "Run daily ops without chaos.",
            bullets: ["Member CRM & attendance", "Billing, plans & renewals", "Scheduling & staff roles"]
        },
        icon: (active: boolean) => (
            <svg viewBox="0 0 40 40" fill="none" className={`w-8 h-8 transition-colors duration-500 ${active ? 'text-white' : 'text-white/40'}`}>
                {/* Chalk-style building */}
                <path d="M4 36H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 36V16L20 8L32 16V36" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 36V22H26V36" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M18 22V36" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        )
    },
    {
        id: "mobile",
        title: "Client Tracking",
        shortDesc: "Food, workouts, progress, habits.",
        detail: {
            title: "Client Tracking",
            desc: "Keep clients consistent.",
            bullets: ["Food logging & macros", "Workout tracking & sets", "Progress photos & habits"]
        },
        icon: (active: boolean) => (
            <svg viewBox="0 0 40 40" fill="none" className={`w-8 h-8 transition-colors duration-500 ${active ? 'text-white' : 'text-white/40'}`}>
                {/* Chalk-style phone */}
                <rect x="10" y="6" width="20" height="30" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M18 32H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 12H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3" />
            </svg>
        )
    },
    {
        id: "coach",
        title: "Coach Panel",
        shortDesc: "Plans, chats, updates, delivery.",
        detail: {
            title: "Coach Panel",
            desc: "Coach at scale.",
            bullets: ["Coach + client messaging", "Plan building & updates", "Check-ins & feedback loops"]
        },
        icon: (active: boolean) => (
            <svg viewBox="0 0 40 40" fill="none" className={`w-8 h-8 transition-colors duration-500 ${active ? 'text-white' : 'text-white/40'}`}>
                {/* Chalk-style dashboard */}
                <rect x="4" y="8" width="14" height="10" stroke="currentColor" strokeWidth="1.5" />
                <rect x="22" y="8" width="14" height="10" stroke="currentColor" strokeWidth="1.5" />
                <rect x="4" y="22" width="32" height="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        )
    },
    {
        id: "ai",
        title: "AI Coach",
        shortDesc: "Automation, insights, smart follow-ups.",
        detail: {
            title: "AI Coach",
            desc: "Less manual work.",
            bullets: ["Auto reminders & nudges", "Smart insights & trends", "Behavior-based suggestions"]
        },
        icon: (active: boolean) => (
            <svg viewBox="0 0 40 40" fill="none" className={`w-8 h-8 transition-colors duration-500 ${active ? 'text-white' : 'text-white/40'}`}>
                {/* Chalk-style AI orb */}
                <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 14V8M20 32V26M14 20H8M32 20H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className={active ? "animate-[spin_10s_linear_infinite]" : ""} />
            </svg>
        )
    }
];

const CoreModules = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [activeIdx, setActiveIdx] = useState(0);

    // Map scroll to module index (0 to 3)
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const idx = Math.min(Math.floor(latest * 4), 3); // 4 steps
        if (idx !== activeIdx) setActiveIdx(idx);
    });

    return (
        <section
            id="ecosystem-modules"
            ref={containerRef}
            className="relative h-[250vh] bg-[#07080C]" // Increased height for scrolling space
        >
            {/* Background noise/grain (matches Hero) */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    mixBlendMode: 'overlay'
                }}
            />
            {/* Dark Gradient Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(30, 40, 55, 0.05) 0%, transparent 100%)
                    `
                }}
            />


            {/* STICKY CONTAINER */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 md:px-12 py-20">
                <div className="w-full max-w-[1400px] h-full flex flex-col">

                    {/* -- TOP HEADER -- */}
                    <div className="mb-12 shrink-0">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-semibold tracking-widest text-white/60 mb-6 uppercase inline-block">
                            The Ecosystem
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 font-display">
                            Four Core Modules of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">CoachOS</span>
                        </h2>
                        <p className="text-[#94A3B8] text-sm md:text-base max-w-xl">
                            One system for gym operations, client experience, coaching, and intelligence.
                        </p>
                    </div>

                    {/* -- MAIN STAGE (2 COLUMNS) -- */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-4 min-h-0">

                        {/* LEFT: BLUEPRINT BOARD (8 Cols) */}
                        <div className="md:col-span-8 h-full flex items-center relative">
                            {/* The Board Frame */}
                            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] border border-white/10 bg-[#0A0B10] rounded-sm p-8 group">
                                {/* Faint Grid Texture */}
                                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                                />

                                {/* Chalk Border Effect */}
                                <div className="absolute inset-0 border border-white/20 opacity-30 rounded-sm pointer-events-none mix-blend-overlay" />

                                {/* 4 ZONES GRID */}
                                <div className="grid grid-cols-2 grid-rows-2 h-full gap-4 relative z-10">
                                    {MODULES.map((mod, i) => {
                                        const isActive = i === activeIdx;
                                        return (
                                            <div
                                                key={mod.id}
                                                className={`relative border transition-all duration-700 p-6 flex flex-col justify-between group/zone
                                                    ${isActive ? 'border-blue-400/30 bg-blue-500/[0.02]' : 'border-white/5 bg-transparent opacity-40'}
                                                `}
                                                // Imperfect tilt for sketch feel (alternating slight rotations)
                                                style={{
                                                    transform: i % 2 === 0 ? 'rotate(-0.5deg)' : 'rotate(0.5deg)',
                                                }}
                                            >
                                                {/* Active Stroke Animation (The "Draw" effect) */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeStroke"
                                                        className="absolute inset-0 border-2 border-blue-400/50 rounded-sm pointer-events-none"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        {/* Glow */}
                                                        <div className="absolute inset-0 shadow-[0_0_20px_rgba(59,130,246,0.15)]" />
                                                    </motion.div>
                                                )}

                                                {/* Content */}
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className={`p-2 rounded-lg border ${isActive ? 'border-white/20 bg-white/5' : 'border-transparent'}`}>
                                                            {mod.icon(isActive)}
                                                        </div>
                                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                                    </div>

                                                    <div>
                                                        <h3 className={`text-lg font-bold transition-colors duration-500 font-display ${isActive ? 'text-white' : 'text-white/60'}`}>
                                                            {mod.title}
                                                        </h3>
                                                        <div className="h-px w-8 bg-white/10 my-3" />
                                                        <p className="text-xs md:text-sm text-white/40 leading-relaxed font-primary">
                                                            {mod.shortDesc}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Sketch marks */}
                                                <div className="mt-auto flex gap-1 opacity-20">
                                                    <div className="w-0.5 h-3 bg-white" />
                                                    <div className="w-0.5 h-3 bg-white" />
                                                    <div className="w-0.5 h-3 bg-white" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: DETAIL PANEL (4 Cols) */}
                        <div className="md:col-span-4 h-full flex flex-col justify-center relative pl-0 md:pl-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIdx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-full glass border border-blue-400/20 rounded-xl p-8 relative overflow-hidden"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        backdropFilter: 'blur(16px)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {/* Subtle blue glow */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="text-[10px] uppercase tracking-widest text-blue-300 mb-4 font-semibold">
                                            Module 0{activeIdx + 1} Details
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-6">
                                            {MODULES[activeIdx].detail.title}
                                        </h3>

                                        <ul className="space-y-4 mb-8">
                                            {MODULES[activeIdx].detail.bullets.map((bullet, i) => (
                                                <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                                                    <span className="text-blue-400 mt-1">›</span>
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-6 border-t border-white/10">
                                            <p className="text-white font-medium text-sm">
                                                Outcome: <span className="text-blue-200 opacity-90">{MODULES[activeIdx].detail.desc}</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                    {/* End Main Stage */}

                </div>
            </div>
        </section>
    );
};

export default CoreModules;
