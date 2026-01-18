import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const OrbitCoreSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Rotation: 0 to 25 degrees over the course of the section scroll
    // Using spring for smoother feel if scroll stops abruptly, though direct transform is often more precise for "scroll-driven"
    const rotateRaw = useTransform(scrollYProgress, [0, 1], [0, 25]);
    const rotate = useSpring(rotateRaw, { stiffness: 100, damping: 30, mass: 1 });

    // Parallax background movement (subtle)
    const bgY = useTransform(scrollYProgress, [0, 1], [0, 50]);

    const cards = [
        { title: "AI COACH", desc: "Personalized plans that adapt weekly" },
        { title: "MACRO + CALORIE TRACKER", desc: "Fast logging, smart daily targets" },
        { title: "WORKOUT GENERATOR", desc: "Auto workouts for home + gym" },
        { title: "MEAL PLANS + RECIPES", desc: "Goal-based meals with easy swaps" },
        { title: "PROGRESS DASHBOARD", desc: "Photos, measurements, streaks" },
        { title: "WEARABLE SYNC", desc: "Sleep, steps, HR in one view" }
    ];

    /**
     * Helper to position cards in a circle
     * @param index Card index
     * @param total Total cards
     * @param radius Radius in px
     */
    const getCardPosition = (index: number, total: number, radius: number) => {
        const angle = (index / total) * 360; // Spread evenly
        const rad = (angle * Math.PI) / 180;
        // -90 deg offset to start top (if needed), but strict clock positions are fine.
        // Let's align 0 deg to Right (standard math).
        // 0: Right, 90: Bottom, 180: Left, 270: Top.
        // Let's distribute them.
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return { x, y, angle };
    };

    return (
        <section
            id="orbit"
            ref={sectionRef}
            className="relative min-h-[100vh] py-24 md:py-32 overflow-hidden bg-[#07080C] flex flex-col justify-center"
        >
            {/* Background Texture (Hero Style) - Cleaned up */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: bgY }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full h-full flex flex-col">

                {/* 1) Heading Block (Fade in + Slide) - Locked to Top Left */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="relative z-20 max-w-md w-full mb-12 md:mb-0 md:absolute md:top-0 md:left-0 lg:left-0 pt-12"
                >
                    <span className="inline-block px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-white/40 bg-white/[0.03] border border-white/[0.05] rounded-full mb-4">
                        COACH OS APP
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                        Everything in one <br /> health system.
                    </h2>
                    <p className="text-white/50 text-sm md:text-base leading-relaxed">
                        Top-tier tracking, workouts, nutrition, and insights — unified.
                    </p>
                </motion.div>

                {/* 2) Centerpiece + Orbit (Desktop) - Pushed down and expanded */}
                <div className="hidden md:flex flex-1 items-center justify-center relative min-h-[600px] mt-24">

                    {/* Core Glow Centerpiece */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center justify-center w-52 h-52 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_0_60px_rgba(255,255,255,0.02)]"
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Inner subtle glow */}
                        <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-2xl" />

                        <div className="text-center relative z-20">
                            <h3 className="text-lg font-bold text-white tracking-tight mb-1">
                                Coach OS Core
                            </h3>
                            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
                                All features connected
                            </p>
                        </div>
                    </motion.div>

                    {/* Orbit Ring */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ rotate }}
                    >
                        {/* The Ring Visual (Optional, faint line) */}
                        <div className="absolute w-[520px] h-[520px] rounded-full border border-white/[0.03] border-dashed" />

                        {cards.map((card, i) => {
                            const { x, y } = getCardPosition(i, cards.length, 260); // 260px radius

                            return (
                                <motion.div
                                    key={i}
                                    className="absolute w-[170px] pointer-events-auto"
                                    style={{
                                        x,
                                        y,
                                    }}
                                >
                                    <div className="p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-300 shadow-lg">
                                        <h4 className="text-[9px] uppercase font-bold text-blue-200/80 mb-2 tracking-wider">
                                            {card.title}
                                        </h4>
                                        <p className="text-[11px] text-white/70 font-medium leading-snug">
                                            {card.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* 3) Mobile Carousel (MD Hidden) */}
                <div className="md:hidden mt-8 relative">
                    {/* Core Mobile Header */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="w-48 h-48 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl" />
                            <h3 className="text-lg font-bold text-white relative z-10">Coach OS Core</h3>
                            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest relative z-10">All features connected</p>
                        </div>
                    </div>

                    {/* Swipe Carousel */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 px-4 scrollbar-hide">
                        {cards.map((card, i) => (
                            <div key={i} className="snap-center shrink-0 w-[240px]">
                                <div className="h-full p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex flex-col justify-center">
                                    <h4 className="text-[10px] uppercase font-bold text-blue-200/80 mb-3 tracking-wider">
                                        {card.title}
                                    </h4>
                                    <p className="text-sm text-white/70 font-medium leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4) Bottom Divider */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </section>
    );
};

export default OrbitCoreSection;
