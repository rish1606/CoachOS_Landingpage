import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import GymSketch from './GymSketch';

// Data for the Right Scroll List
const modules = [
    { title: "Gym Management", subtitle: "Member registration, membership tracking & renewals, attendance history, equipment & inventory, staff roster, and operational reporting." },
    { title: "Access & Entry", subtitle: "NFC, key tag & fingerprint-based entry, automatic logging, abnormal access detection, footfall tracking, and peak hour analysis." },
    { title: "Client Workout Logging", subtitle: "Task-based workout checklists, one-tap exercise logging, automatic history storage, and performance tracking over time." },
    { title: "Client Food Logging", subtitle: "Meal-based diet plan display, quantity-based food logging, and daily nutrition history tracking." },
];

const GymManagementSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll progress for the entire pinned section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    // Sync active module with scroll — features only cycle in the 0.30–0.85 range
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Features cycle between 0.30 and 0.85 of scroll
            const featureStart = 0.30;
            const featureEnd = 0.85;
            const featureProgress = Math.max(0, Math.min(1, (latest - featureStart) / (featureEnd - featureStart)));
            const index = Math.min(
                Math.floor(featureProgress * modules.length),
                modules.length - 1
            );
            setActiveModuleIndex(index);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    // Parallax for the sketch (subtle movement)
    const sketchY = useTransform(smoothProgress, [0, 1], [0, 50]);
    const sketchScale = useTransform(smoothProgress, [0, 1], [0.95, 1.05]);

    // Features list scrolls up only in the feature range (0.30–0.85)
    const featuresScroll = useTransform(smoothProgress, [0.30, 0.85], ["0%", "-40%"]);

    // Scroll hint — appears first, fades out before content
    const hintOpacity = useTransform(smoothProgress, [0, 0.05, 0.10, 0.18], [0, 1, 1, 0]);
    const hintY = useTransform(smoothProgress, [0, 0.18], [20, -20]);

    // Left column content — fades in after hint, stays visible
    const contentOpacity = useTransform(smoothProgress, [0.10, 0.25, 0.88, 0.95], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="relative h-[600vh]">
            {/* Shared Background Effects (Matched to Hero) */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#07080C]">

                {/* --- CREATIVE SCROLL INDICATOR --- */}
                <motion.div
                    className="absolute top-24 left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-none"
                    style={{ opacity: hintOpacity, y: hintY }}
                >
                    <span className="text-sm uppercase tracking-[0.3em] text-blue-400 font-semibold mb-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">Features</span>
                    <svg className="w-5 h-5 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>

                {/* Shared Background Effects (Matched to Hero - Inside Sticky Container) */}
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
                <div
                    className="absolute inset-0 pointer-events-none z-[2]"
                    style={{
                        background: 'radial-gradient(ellipse 35% 25% at 70% 55%, rgba(140, 160, 190, 0.04) 0%, transparent 60%)'
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none z-[5]"
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


                <motion.div
                    className="w-full max-w-[1400px] px-6 md:px-12 flex flex-col h-full relative z-10"
                    style={{ opacity: contentOpacity }}
                >

                    {/* --- TOP CENTERED TITLE + HEADING (like Coach Panel) --- */}
                    <div className="text-center mb-16 pt-32 md:pt-40">
                        <p className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-medium">
                            Core Operations Module
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                            The operating system<br />for your gym.
                        </h2>
                    </div>

                    {/* --- 3-COLUMN GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">

                        {/* --- LEFT COLUMN (25%) --- */}
                        <div className="md:col-span-3 flex flex-col justify-center h-full relative z-20">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-semibold text-white leading-snug mb-5">
                                    Your all-in-one<br />command center.
                                </h3>
                                <p className="text-[#94A3B8] text-sm leading-relaxed max-w-sm mb-6">
                                    Everything you need to run day-to-day operations — member handling, access control, client workout and food logging, all in one place.
                                </p>
                                <div className="flex flex-wrap gap-x-3 gap-y-2 text-[10px] text-white/30 uppercase tracking-widest font-medium">
                                    <span>Members</span>•<span>Access</span>•<span>Workouts</span>•<span>Nutrition</span>
                                </div>
                            </div>
                        </div>

                        {/* --- CENTER COLUMN (50%) - Sketch Visual --- */}
                        <div className="md:col-span-6 h-full flex items-center justify-center relative z-10">
                            <motion.div
                                style={{ y: sketchY, scale: sketchScale }}
                                className="w-full max-w-lg"
                            >
                                <GymSketch />
                            </motion.div>
                        </div>

                        {/* --- RIGHT COLUMN (25%) - Scroll List --- */}
                        <div className="md:col-span-3 flex flex-col justify-center h-full relative z-20 pl-6 md:pl-12 overflow-hidden">
                            {/* Pushed lower with mt-32, reduced gap to gap-5 for "in window" fit */}
                            <motion.div style={{ y: featuresScroll }} className="flex flex-col gap-5 mt-32">
                                {modules.map((mod, i) => {
                                    const isActive = i === activeModuleIndex;
                                    return (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                opacity: isActive ? 1 : 0.25,
                                                scale: isActive ? 1.05 : 1,
                                                x: isActive ? 0 : 10
                                            }}
                                            transition={{ duration: 0.4 }}
                                            className="cursor-default origin-left"
                                        >
                                            {/* Reduced text size: 3xl->2xl, 2xl->xl */}
                                            <h3 className={`text-xl md:text-2xl font-bold transition-colors ${isActive ? 'text-white' : 'text-white/50'}`}>
                                                {mod.title}
                                            </h3>
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: isActive ? 'auto' : 0,
                                                    opacity: isActive ? 1 : 0,
                                                    marginTop: isActive ? 4 : 0 // Reduced margin from 8
                                                }}
                                                className="overflow-hidden"
                                            >
                                                {/* Reduced subtitle size: base->sm */}
                                                <p className="text-sm text-blue-200/60 font-light leading-relaxed">
                                                    {mod.subtitle}
                                                </p>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GymManagementSection;
