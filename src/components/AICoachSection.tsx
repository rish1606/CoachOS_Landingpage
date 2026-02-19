import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import WaveOrb from './WaveOrb';

const AICoachSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Orb progress — draws from 0.05 to 0.65
    const orbProgress = useTransform(scrollYProgress, [0.05, 0.65], [0, 1]);

    // Title label + main heading at top
    const titleOpacity = useTransform(scrollYProgress, [0.02, 0.10], [0, 1]);
    const titleY = useTransform(scrollYProgress, [0.02, 0.10], [30, 0]);

    // Left column: heading + description
    const leftOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
    const leftY = useTransform(scrollYProgress, [0.12, 0.22], [20, 0]);

    // Right column: features fade in one by one
    const feat0Opacity = useTransform(scrollYProgress, [0.30, 0.40], [0, 1]);
    const feat0Y = useTransform(scrollYProgress, [0.30, 0.40], [15, 0]);

    const feat1Opacity = useTransform(scrollYProgress, [0.40, 0.50], [0, 1]);
    const feat1Y = useTransform(scrollYProgress, [0.40, 0.50], [15, 0]);

    const feat2Opacity = useTransform(scrollYProgress, [0.50, 0.60], [0, 1]);
    const feat2Y = useTransform(scrollYProgress, [0.50, 0.60], [15, 0]);

    const feat3Opacity = useTransform(scrollYProgress, [0.60, 0.70], [0, 1]);
    const feat3Y = useTransform(scrollYProgress, [0.60, 0.70], [15, 0]);

    // Exit fade
    const exitOpacity = useTransform(scrollYProgress, [0.82, 0.92], [1, 0]);

    const features = [
        {
            title: "Auto-generated workout plans",
            desc: "Structured programs built from goals, body metrics, and training history."
        },
        {
            title: "Personalised meal plans",
            desc: "Diet plans generated from client data, adjusted automatically from food logs."
        },
        {
            title: "Progressive adaptation",
            desc: "Plans evolve using logged performance and nutrition data — always current."
        },
        {
            title: "Always-on support",
            desc: "Clients get guidance around the clock without adding hours to your team."
        }
    ];

    const featOpacities = [feat0Opacity, feat1Opacity, feat2Opacity, feat3Opacity];
    const featYs = [feat0Y, feat1Y, feat2Y, feat3Y];

    return (
        <section ref={containerRef} className="relative bg-[#07080C]" style={{ height: '300vh' }}>
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0"
                        style={{
                            background: `
                                radial-gradient(ellipse 40% 30% at 50% 50%, rgba(100,140,180,0.04) 0%, transparent 70%),
                                radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,40,55,0.03) 0%, transparent 100%)
                            `
                        }}
                    />
                    <div className="absolute inset-0"
                        style={{
                            background: `radial-gradient(ellipse 100% 100% at 50% 50%,
                                transparent 35%,
                                rgba(0,0,0,0.08) 60%,
                                rgba(0,0,0,0.15) 80%,
                                rgba(0,0,0,0.22) 100%
                            )`
                        }}
                    />
                </div>

                {/* Top & bottom vignette */}
                <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-20"
                    style={{ background: 'linear-gradient(to bottom, #07080C, transparent)' }}
                />
                <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-20"
                    style={{ background: 'linear-gradient(to top, #07080C, transparent)' }}
                />

                <motion.div
                    style={{ opacity: exitOpacity }}
                    className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col h-full"
                >
                    {/* TOP — Title label + main heading (centered, matching other pages) */}
                    <motion.div
                        style={{ opacity: titleOpacity, y: titleY }}
                        className="text-center pt-32 md:pt-40 mb-16"
                    >
                        <p className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-medium">
                            AI Coach
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Intelligent Plans,{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Zero Manual Work.
                            </span>
                        </h2>
                    </motion.div>

                    {/* THREE COLUMN LAYOUT: Left (heading+desc) | Center (orb) | Right (features) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-center flex-1">

                        {/* LEFT — Heading + description */}
                        <motion.div
                            style={{ opacity: leftOpacity, y: leftY }}
                            className="flex flex-col justify-center"
                        >
                            <h3 className="text-3xl md:text-4xl font-semibold text-white leading-snug mb-5">
                                Coaching that<br />scales itself.
                            </h3>
                            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-sm">
                                The AI engine builds workout and meal plans from each client's body data and goals,
                                then adapts continuously as they log progress — giving every member a personalised
                                experience without adding to your workload.
                            </p>
                        </motion.div>

                        {/* CENTER — Wave Orb */}
                        <div className="flex justify-center items-center min-h-[350px]">
                            <div className="w-[350px] h-[350px]">
                                <OrbWrapper scrollProgress={orbProgress} />
                            </div>
                        </div>

                        {/* RIGHT — Features, each fades in */}
                        <div className="flex flex-col gap-5 pl-4 lg:pl-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    style={{ opacity: featOpacities[i], y: featYs[i] }}
                                    className="cursor-default"
                                >
                                    <h4 className="text-xl md:text-2xl font-bold text-white mb-1">
                                        {feature.title}
                                    </h4>
                                    <p className="text-sm text-blue-200/60 font-light leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Wrapper to bridge Framer Motion value → WaveOrb progress prop
const OrbWrapper = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const unsubscribe = scrollProgress.on("change", (v) => {
            setProgress(Math.max(0, Math.min(1, v)));
        });
        return unsubscribe;
    }, [scrollProgress]);

    return <WaveOrb progress={progress} />;
};

export default AICoachSection;
