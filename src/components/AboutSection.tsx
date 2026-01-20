import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, AnimatePresence } from 'motion/react';

// Story steps content (4 steps)
const storySteps = [
    {
        id: 1,
        label: "Why We Started",
        message: "Coaches were drowning in spreadsheets and scattered tools. We knew there had to be a better way.",
        highlight: "better way",
        boxPosition: 'top' as const,
    },
    {
        id: 2,
        label: "Our Motto",
        message: "Make gym operations feel calm, precise, and automated—so owners can focus on growth.",
        highlight: "focus on growth",
        boxPosition: 'bottom' as const,
    },
    {
        id: 3,
        label: "Value We Bring",
        message: "More retained clients. Cleaner operations. Faster decisions. Less stress.",
        highlight: "Less stress",
        boxPosition: 'top' as const,
    },
    {
        id: 4,
        label: "Our Mission",
        message: "To become the backbone of every gym—so owners can breathe, grow, and lead with confidence.",
        highlight: "breathe, grow, and lead",
        boxPosition: 'bottom' as const,
    },
];

// Character - Walking (bigger)
const WalkingCharacter = () => (
    <svg viewBox="0 0 70 120" className="w-[80px] h-[137px]">
        <defs>
            <linearGradient id="walkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(200,210,225,0.9)" />
                <stop offset="100%" stopColor="rgba(140,155,175,0.8)" />
            </linearGradient>
        </defs>
        <circle cx="35" cy="16" r="13" fill="url(#walkGrad)" />
        <line x1="35" y1="29" x2="35" y2="65" stroke="url(#walkGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="35" y1="38" x2="20" y2="54" stroke="url(#walkGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1="35" y1="38" x2="50" y2="50" stroke="url(#walkGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1="35" y1="65" x2="22" y2="98" stroke="url(#walkGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="35" y1="65" x2="48" y2="94" stroke="url(#walkGrad)" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

// Character - Lifting
const LiftingCharacter = () => (
    <svg viewBox="0 0 90 120" className="w-[103px] h-[137px]">
        <defs>
            <linearGradient id="liftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(200,210,225,0.9)" />
                <stop offset="100%" stopColor="rgba(140,155,175,0.8)" />
            </linearGradient>
        </defs>
        <circle cx="45" cy="18" r="13" fill="url(#liftGrad)" />
        <line x1="45" y1="31" x2="45" y2="68" stroke="url(#liftGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="45" y1="40" x2="20" y2="22" stroke="url(#liftGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1="45" y1="40" x2="70" y2="22" stroke="url(#liftGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1="12" y1="20" x2="78" y2="20" stroke="url(#liftGrad)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="12" cy="20" r="8" fill="url(#liftGrad)" />
        <circle cx="78" cy="20" r="8" fill="url(#liftGrad)" />
        <line x1="45" y1="68" x2="32" y2="98" stroke="url(#liftGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="45" y1="68" x2="58" y2="98" stroke="url(#liftGrad)" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

// Character - Cycling
const CyclingCharacter = () => (
    <svg viewBox="0 0 90 120" className="w-[103px] h-[137px]">
        <defs>
            <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(200,210,225,0.9)" />
                <stop offset="100%" stopColor="rgba(140,155,175,0.8)" />
            </linearGradient>
        </defs>
        <circle cx="18" cy="85" r="16" stroke="url(#cycleGrad)" strokeWidth="3" fill="none" />
        <circle cx="72" cy="85" r="16" stroke="url(#cycleGrad)" strokeWidth="3" fill="none" />
        <path d="M18 85 L45 55 L72 85 M45 55 L45 38" stroke="url(#cycleGrad)" strokeWidth="3" fill="none" />
        <circle cx="45" cy="22" r="12" fill="url(#cycleGrad)" />
        <line x1="45" y1="34" x2="45" y2="52" stroke="url(#cycleGrad)" strokeWidth="5" strokeLinecap="round" />
        <path d="M45 42 Q60 44 64 56" stroke="url(#cycleGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M45 52 L32 70 L22 85" stroke="url(#cycleGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
);

// Character - Skipping Rope
const SkippingCharacter = () => (
    <svg viewBox="0 0 80 120" className="w-[91px] h-[137px]">
        <defs>
            <linearGradient id="skipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(200,210,225,0.9)" />
                <stop offset="100%" stopColor="rgba(140,155,175,0.8)" />
            </linearGradient>
        </defs>
        <path d="M12 55 Q40 95 68 55" stroke="url(#skipGrad)" strokeWidth="2" fill="none" strokeDasharray="4 3" />
        <circle cx="40" cy="18" r="13" fill="url(#skipGrad)" />
        <line x1="40" y1="31" x2="40" y2="62" stroke="url(#skipGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="40" y1="40" x2="16" y2="52" stroke="url(#skipGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="40" x2="64" y2="52" stroke="url(#skipGrad)" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="62" x2="32" y2="90" stroke="url(#skipGrad)" strokeWidth="6" strokeLinecap="round" />
        <line x1="40" y1="62" x2="48" y2="90" stroke="url(#skipGrad)" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

// Wave Road - Features section style (visible, animated)
const WaveRoad = () => {
    const viewBoxWidth = 1920;
    const viewBoxHeight = 200;
    const centerY = viewBoxHeight * 0.5;

    // Reduced wave lines (15 instead of 25)
    const waves = Array.from({ length: 15 }).map((_, i) => {
        const yOffset = centerY + (i - 7) * 9;
        const distFromCenter = Math.abs(i - 7) / 7;
        return {
            key: i,
            yOffset,
            opacity: 0.25 + (1 - distFromCenter) * 0.35, // Moderate opacity
            strokeWidth: 0.6 + (1 - distFromCenter) * 0.6,
            duration: 14 + i * 0.5,
            delay: i * 0.12
        };
    });

    return (
        <div className="absolute left-0 right-0 z-[5]" style={{ bottom: '16%', height: '180px' }}>
            <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full"
            >
                <defs>
                    {/* Left has some color, center brightest, right subtle fade */}
                    <linearGradient id="aboutWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(140,180,220,0.05)" />
                        <stop offset="12%" stopColor="rgba(145,185,225,0.18)" />
                        <stop offset="28%" stopColor="rgba(155,195,235,0.32)" />
                        <stop offset="45%" stopColor="rgba(170,210,250,0.5)" />
                        <stop offset="55%" stopColor="rgba(170,210,250,0.5)" />
                        <stop offset="72%" stopColor="rgba(150,190,230,0.22)" />
                        <stop offset="88%" stopColor="rgba(140,180,220,0.06)" />
                        <stop offset="100%" stopColor="rgba(140,180,220,0)" />
                    </linearGradient>
                </defs>

                {waves.map(w => (
                    <motion.path
                        key={w.key}
                        fill="none"
                        stroke="url(#aboutWaveGradient)"
                        strokeWidth={w.strokeWidth}
                        opacity={w.opacity}
                        d={`M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 12} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`}
                        animate={{
                            d: [
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 15} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset - 15} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 15} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                            ]
                        }}
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

// Glass message box
const GlassBox = ({
    step,
    isActive,
    position
}: {
    step: typeof storySteps[0];
    isActive: boolean;
    position: 'top' | 'bottom';
}) => {
    const posClass = position === 'top'
        ? 'bottom-full mb-5 -translate-x-[15%]'
        : 'top-full mt-5 translate-x-[8%]';

    const slideY = position === 'top' ? 14 : -14;

    const renderMessage = () => {
        const parts = step.message.split(step.highlight);
        if (parts.length === 2) {
            return <>{parts[0]}<span className="text-white/85 font-semibold">{step.highlight}</span>{parts[1]}</>;
        }
        return step.message;
    };

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    key={step.id}
                    className={`absolute ${posClass} z-40 w-[250px] md:w-[280px]`}
                    initial={{ opacity: 0, y: slideY, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: slideY / 2, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <div
                        className="px-5 py-4 rounded-xl"
                        style={{
                            background: 'rgba(18, 20, 26, 0.88)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
                        }}
                    >
                        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                            {step.label}
                        </p>
                        <p className="text-sm text-white/55 leading-relaxed">
                            {renderMessage()}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AboutSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showBox, setShowBox] = useState(false);

    // Detect when heading comes into view (for fade-in animation)
    // Trigger earlier for visible animation
    const isHeadingInView = useInView(headingRef, { once: true, margin: "0px" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setProgress(latest);

        // Show box after heading is in view AND scroll started
        if (latest > 0.04 && isHeadingInView && !showBox) {
            setShowBox(true);
        }

        // Determine current step (4 steps)
        if (latest < 0.25) setCurrentStep(0);
        else if (latest < 0.5) setCurrentStep(1);
        else if (latest < 0.75) setCurrentStep(2);
        else setCurrentStep(3);
    });

    // Character X position - starts more left (28%), moves to right slowly
    const characterXProgress = useTransform(scrollYProgress, [0, 1], [0.28, 0.72]);
    const characterXPercent = useTransform(characterXProgress, v => `${v * 100}%`);

    const getCharacter = () => {
        if (currentStep === 0) return <WalkingCharacter />;
        if (currentStep === 1) return <LiftingCharacter />;
        if (currentStep === 2) return <CyclingCharacter />;
        return <SkippingCharacter />;
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative bg-[#07080C]"
            style={{ height: '280vh' }}
        >
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* Vignette only - NO fabric/noise effect */}
                <div
                    className="absolute inset-0 pointer-events-none z-[1]"
                    style={{
                        background: `radial-gradient(ellipse 100% 100% at 50% 50%,
                            transparent 35%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.18) 100%)`
                    }}
                />

                {/* Wave Road - Features section style at character feet */}
                <WaveRoad />

                {/* ===== LEFT CONTENT ===== */}
                <div
                    ref={headingRef}
                    className="absolute z-20 max-w-[360px]"
                    style={{
                        top: '14vh',
                        left: 'clamp(24px, 7vw, 80px)'
                    }}
                >
                    {/* Pill label - SLOWER fade in for attention */}
                    <motion.span
                        className="inline-block px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-white/40 bg-white/[0.03] border border-white/[0.05] rounded-full"
                        style={{ marginBottom: '14px' }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
                    >
                        About Coach OS
                    </motion.span>

                    {/* Heading - SLOWER fade in for maximum attention */}
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.05]"
                        style={{ marginBottom: '16px' }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    >
                        Our Story
                    </motion.h2>

                    {/* Company line - slower */}
                    <motion.p
                        className="text-sm text-white/40 leading-relaxed"
                        style={{ marginBottom: '12px' }}
                        initial={{ opacity: 0, y: 25 }}
                        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.0, ease: "easeOut", delay: 0.6 }}
                    >
                        Coach OS helps gym owners run operations, retain clients, and grow revenue—without chaos.
                    </motion.p>

                    {/* What we do - slower */}
                    <motion.p
                        className="text-xs text-white/25"
                        style={{ marginBottom: '28px' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.85 }}
                    >
                        Training • Client Progress • Payments • Insights • Automation
                    </motion.p>

                    {/* Progress indicator - slower */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={isHeadingInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        <div className="flex items-center gap-1.5">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 ${currentStep >= i ? 'w-5 bg-white/45' : 'w-2.5 bg-white/12'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] text-white/25 uppercase tracking-wider">
                            {currentStep + 1} / 4
                        </span>
                    </motion.div>

                    {/* Scroll hint - slower */}
                    <motion.div
                        className="mt-10 flex items-center gap-2 text-white/18"
                        initial={{ opacity: 0 }}
                        animate={isHeadingInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.7, delay: 1.4 }}
                    >
                        <motion.svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            animate={{ y: [0, 4, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                        >
                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </motion.svg>
                        <span className="text-[10px] uppercase tracking-wider">Scroll to discover</span>
                    </motion.div>
                </div>

                {/* ===== CHARACTER + BOX ===== */}
                <motion.div
                    className="absolute z-30"
                    style={{
                        left: characterXPercent,
                        bottom: '18%',
                        x: '-50%',
                    }}
                >
                    <motion.div
                        className="relative"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {getCharacter()}

                        {/* Shadow */}
                        <div
                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-[50%] opacity-30"
                            style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)' }}
                        />
                    </motion.div>

                    {/* Glass box */}
                    <GlassBox
                        step={storySteps[currentStep]}
                        isActive={showBox}
                        position={storySteps[currentStep].boxPosition}
                    />
                </motion.div>

                {/* Next section hint */}
                <AnimatePresence>
                    {progress > 0.92 && (
                        <motion.a
                            href="#contact"
                            className="absolute bottom-8 right-10 flex items-center gap-2 text-xs text-white/28 hover:text-white/55 transition-colors z-40"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            Next: Contact
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.a>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default AboutSection;
