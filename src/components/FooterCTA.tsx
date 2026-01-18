import { useMemo } from 'react';
import { motion } from 'framer-motion';

const FooterCTA = () => {
    const viewBoxWidth = 1920;
    const viewBoxHeight = 400;
    const centerY = viewBoxHeight * 0.5;

    const waves = useMemo(() =>
        Array.from({ length: 8 }).map((_, i) => {
            const yOffset = centerY + (i - 4) * 20;
            const distFromCenter = Math.abs(4 - i) / 4;
            return {
                key: i,
                yOffset,
                opacity: 0.3 + (1 - distFromCenter) * 0.3,
                duration: 10 + i * 0.3,
                delay: i * 0.2
            };
        }), [centerY]
    );

    return (
        <section id="pricing" className="relative py-32 bg-[#07080C] overflow-hidden">
            {/* Subtle wave background */}
            <div className="absolute inset-0 opacity-20">
                <svg
                    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                    preserveAspectRatio="xMidYMid slice"
                    className="w-full h-full"
                >
                    <defs>
                        <linearGradient id="footerWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(100,160,255,0)" />
                            <stop offset="50%" stopColor="rgba(160,200,255,0.3)" />
                            <stop offset="100%" stopColor="rgba(100,160,255,0)" />
                        </linearGradient>
                    </defs>
                    {waves.map(w => (
                        <motion.path
                            key={w.key}
                            d={`M0 ${w.yOffset} Q${viewBoxWidth * 0.5} ${w.yOffset + 12} ${viewBoxWidth} ${w.yOffset}`}
                            fill="none"
                            stroke="url(#footerWaveGradient)"
                            strokeWidth={0.5}
                            opacity={w.opacity}
                            animate={{
                                d: [
                                    `M0 ${w.yOffset} Q${viewBoxWidth * 0.5} ${w.yOffset + 10} ${viewBoxWidth} ${w.yOffset}`,
                                    `M0 ${w.yOffset} Q${viewBoxWidth * 0.5} ${w.yOffset - 10} ${viewBoxWidth} ${w.yOffset}`,
                                    `M0 ${w.yOffset} Q${viewBoxWidth * 0.5} ${w.yOffset + 10} ${viewBoxWidth} ${w.yOffset}`,
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

            {/* Content */}
            <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
                <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Ready to transform your coaching business?
                </motion.h2>

                <motion.p
                    className="text-lg text-white/50 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Join thousands of coaches already using Coach OS.
                </motion.p>

                <motion.button
                    className="px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Get Started
                </motion.button>
            </div>
        </section>
    );
};

export default FooterCTA;
