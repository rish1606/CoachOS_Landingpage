import { motion, AnimatePresence } from 'framer-motion';
import CardWave from './CardWave';
import { forwardRef } from 'react';


interface ModuleCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    keywords: string[];
    isActive: boolean;
    isRevealed: boolean;
    hue?: number;
}

const ModuleCard = forwardRef<HTMLDivElement, ModuleCardProps>(({ title, desc, icon, keywords, isActive, isRevealed, hue = 210 }, ref) => {
    return (
        <motion.div
            ref={ref}
            className="relative w-full group overflow-hidden"
            animate={{
                height: isActive ? 200 : 48,
                borderRadius: isActive ? 20 : 14,
                opacity: isRevealed ? 1 : 0,
                y: isRevealed ? 0 : 20,
            }}
            transition={{
                height: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
                borderRadius: { duration: 0.5, ease: "easeInOut" },
                opacity: { duration: 0.7, ease: "easeOut" },
                y: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            }}
            style={{
                background: isActive
                    ? 'rgba(6, 8, 14, 0.85)'
                    : 'rgba(8, 10, 16, 0.5)',
                pointerEvents: isRevealed ? 'auto' : 'none',
            }}
        >
            {/* ═══ 3D SUNKEN HOLE EFFECT ═══ */}
            {/* Layer 1: Deep inset shadow — the "pressed in" depth */}
            <div
                className="absolute inset-0 pointer-events-none z-10 transition-all duration-700"
                style={{
                    borderRadius: 'inherit',
                    boxShadow: isActive
                        ? `
                            inset 0 4px 16px rgba(0,0,0,0.7),
                            inset 0 2px 4px rgba(0,0,0,0.5),
                            inset 0 -1px 2px rgba(140,180,220,0.06),
                            0 -1px 0 rgba(255,255,255,0.03)
                        `
                        : `
                            inset 0 2px 8px rgba(0,0,0,0.5),
                            inset 0 1px 2px rgba(0,0,0,0.3)
                        `,
                }}
            />

            {/* Layer 2: Subtle inner rim light — ambient bounce from below */}
            <div
                className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-700"
                style={{
                    opacity: isActive ? 1 : 0,
                    borderRadius: 'inherit',
                    background: `
                        linear-gradient(to bottom,
                            rgba(0,0,0,0.15) 0%,
                            transparent 25%,
                            transparent 80%,
                            rgba(100,160,220,0.04) 100%
                        )
                    `,
                }}
            />

            {/* ═══ WAVE + AURORA ═══ */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{ borderRadius: 'inherit' }}
            >
                <CardWave isActive={isActive} hue={hue} />
            </div>

            {/* Fog overlay — deeper fog for 3D depth */}
            <div
                className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-700"
                style={{
                    opacity: isActive ? 1 : 0,
                    borderRadius: 'inherit',
                    background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(80,130,180,0.04), transparent)',
                    filter: 'blur(20px)',
                }}
            />

            {/* Heavy vignette — darkens edges for recessed cavity feel */}
            <div className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                    borderRadius: 'inherit',
                    boxShadow: isActive
                        ? 'inset 0 0 60px rgba(0,0,0,0.55), inset 0 0 120px rgba(0,0,0,0.2)'
                        : 'inset 0 0 30px rgba(0,0,0,0.4)',
                }}
            />

            {/* ═══ CONTENT ═══ */}
            <div className="relative z-20 h-full">

                {/* HEADER BAR */}
                <div className={`flex items-center gap-3 px-5 transition-all duration-500
                    ${isActive ? 'pt-5 pb-2' : 'py-3'}
                `}>
                    <div className={`shrink-0 flex items-center justify-center rounded-lg transition-all duration-500
                        ${isActive
                            ? 'w-10 h-10 bg-white/5 border border-white/10 text-white/80'
                            : 'w-7 h-7 text-white/25'
                        }
                    `}>
                        <div className={`transition-all duration-500 ${isActive ? 'w-5 h-5' : 'w-4 h-4'}`}>
                            {icon}
                        </div>
                    </div>

                    <h3 className={`font-semibold transition-all duration-500
                        ${isActive
                            ? 'text-base md:text-lg text-white'
                            : 'text-sm text-white/35'
                        }
                    `}>
                        {title}
                    </h3>
                </div>

                {/* EXPANDED CONTENT */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.4, delay: 0.12 }}
                            className="px-5 pb-5"
                        >
                            <p className="text-sm leading-relaxed mb-3 text-white/55 pl-[52px]">
                                {desc}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pl-[52px]">
                                {keywords.map((kw, i) => (
                                    <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-white/50">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
});

export default ModuleCard;
