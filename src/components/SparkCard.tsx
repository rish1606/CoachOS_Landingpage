import { motion } from 'framer-motion';
import CardWave from './CardWave';

interface SparkCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    keywords: string[];
    isActive: boolean;
    hue?: number;
}

const SparkCard = ({ title, desc, icon, keywords, isActive, hue = 210 }: SparkCardProps) => {
    return (
        <motion.div
            className={`relative rounded-3xl overflow-hidden border transition-colors duration-700 group h-full
                ${isActive
                    ? 'border-blue-400/40 bg-[#0F1014]/90 shadow-[0_0_40px_rgba(59,130,246,0.15)]'
                    : 'border-white/5 bg-[#0A0B10]/20 hover:border-white/10'
                }
            `}
            animate={{
                scale: isActive ? 1.02 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* 1. Spark Wave Background (Active Only) */}
            <div className="absolute inset-0 pointer-events-none opacity-80">
                <CardWave isActive={isActive} hue={hue} />
            </div>

            {/* 2. Glass Shine Overlay (Gradient) */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            )}

            {/* 3. Content */}
            <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500
                    ${isActive ? 'bg-blue-500/20 text-blue-200' : 'bg-white/5 text-white/40'}
                `}>
                    {icon}
                </div>

                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {title}
                </h3>

                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-grow">
                    {desc}
                </p>

                {/* Keywords Pill Row */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {keywords.map((kw, i) => (
                        <span key={i} className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border transition-colors duration-500
                            ${isActive
                                ? 'bg-blue-500/10 border-blue-400/20 text-blue-200'
                                : 'bg-white/5 border-transparent text-white/20'
                            }
                        `}>
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SparkCard;
