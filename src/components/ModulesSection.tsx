import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import ModuleCard from './ModuleCard';

// --- DATA ---
const MODULES = [
    {
        id: "gym",
        title: "Gym Management",
        desc: "Members, scheduling, payments, programs—without chaos.",
        keywords: ["Members", "Billing", "Scheduling"],
        hue: 200,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21H21" strokeLinecap="round" />
                <path d="M5 21V7L12 3L19 7V21" strokeLinejoin="round" />
                <path d="M9 21V10H15V21" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        id: "tracking",
        title: "Client Tracking",
        desc: "Nutrition, workouts, progress photos, habits—logged daily.",
        keywords: ["Calories", "Workouts", "Progress"],
        hue: 210,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <rect x="7" y="2" width="10" height="20" rx="2" />
                <path d="M12 18H12.01" strokeLinecap="round" strokeWidth="2.5" />
            </svg>
        )
    },
    {
        id: "coach",
        title: "Coach Panel",
        desc: "Plans, check-ins, messaging, and client status in one view.",
        keywords: ["Plans", "Chat", "Check-ins"],
        hue: 220,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" />
                <path d="M22 6L12 13L2 6" />
            </svg>
        )
    },
    {
        id: "ai",
        title: "AI Coach",
        desc: "Automations that guide clients and reduce manual coaching load.",
        keywords: ["Insights", "Automation", "Retention"],
        hue: 230,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8V16" />
                <path d="M8 12H16" />
            </svg>
        )
    }
];

const ModulesSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    // Track which cards have been revealed (once revealed, stay visible)
    const [revealedCount, setRevealedCount] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Scroll phases — everything starts hidden:
    // 0.00 - 0.08:  Top title fades in
    // 0.08 - 0.15:  Left heading fades in
    // 0.15 - 0.22:  Left paragraph fades in
    // 0.22 - 0.28:  "Scroll to explore" hint fades in
    // 0.28 - 1.00:  Cards appear one-by-one (each gets ~0.18 of scroll)
    const titleOpacity = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
    const titleY = useTransform(scrollYProgress, [0.02, 0.08], [40, 0]);

    const headingOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);
    const headingY = useTransform(scrollYProgress, [0.08, 0.15], [30, 0]);

    const paraOpacity = useTransform(scrollYProgress, [0.15, 0.22], [0, 1]);
    const paraY = useTransform(scrollYProgress, [0.15, 0.22], [25, 0]);

    const hintOpacity = useTransform(scrollYProgress, [0.22, 0.28], [0, 1]);

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (v < 0.28) {
            setActiveIndex(-1);
            setRevealedCount(0);
        } else {
            // Cards zone: 0.28 – 1.00
            const cardProgress = (v - 0.28) / 0.68;
            const idx = Math.min(Math.floor(cardProgress * MODULES.length), MODULES.length - 1);
            setActiveIndex(idx);
            setRevealedCount(idx + 1);
        }
    });

    return (
        <section ref={sectionRef} id="features" className="relative bg-[#07080C]"
            style={{ height: '500vh' }}
        >
            {/* STICKY INNER */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">

                    {/* TOP HEADER */}
                    <div className="text-center mb-14">
                        <motion.p
                            style={{ opacity: titleOpacity, y: titleY }}
                            className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-medium"
                        >
                            The Ecosystem
                        </motion.p>
                        <motion.h2
                            style={{ opacity: titleOpacity, y: titleY }}
                            className="text-3xl md:text-5xl font-bold text-white mb-3"
                        >
                            Four Core Modules
                        </motion.h2>
                        <motion.p
                            style={{ opacity: titleOpacity, y: titleY }}
                            className="text-[#94A3B8] text-sm md:text-base font-light"
                        >
                            Start with what you need. Add modules as you grow.
                        </motion.p>
                    </div>

                    {/* TWO-COLUMN LAYOUT */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                        {/* LEFT: Text Column */}
                        <div className="lg:w-4/12">
                            <motion.span
                                style={{ opacity: headingOpacity, y: headingY }}
                                className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold mb-5 block"
                            >
                                Modular By Design
                            </motion.span>
                            <motion.h3
                                style={{ opacity: headingOpacity, y: headingY }}
                                className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
                            >
                                Built as <br />modules.
                            </motion.h3>
                            <motion.p
                                style={{ opacity: paraOpacity, y: paraY }}
                                className="text-[#94A3B8] text-base leading-relaxed mb-6"
                            >
                                Coach OS is modular—pick only what you need today, then add more as your facility scales. Built for gyms, studios, and crossfit boxes alike. Every module plugs into one core, keeping your team and clients on a single connected experience.
                            </motion.p>
                            <motion.div
                                style={{ opacity: hintOpacity }}
                                className="flex items-center gap-2 text-white/30 text-xs font-medium uppercase tracking-wide"
                            >
                                <span className="animate-bounce">↓</span>
                                <span>Scroll to explore</span>
                            </motion.div>
                        </div>

                        {/* RIGHT: Cards Column */}
                        <div className="lg:w-7/12 w-full flex flex-col gap-2">
                            {MODULES.map((mod, i) => (
                                <ModuleCard
                                    key={mod.id}
                                    isActive={activeIndex === i}
                                    isRevealed={i < revealedCount}
                                    {...mod}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModulesSection;
