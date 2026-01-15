import { motion } from 'framer-motion';
import SpectrumWaves from './SpectrumWaves';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#07080C]">
            {/* BACK LAYER: Faint blue cast + soft radial glow at core zone (70% width) */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 40% 30% at 70% 55%, rgba(100, 130, 170, 0.06) 0%, transparent 70%),
                        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30, 40, 55, 0.04) 0%, transparent 100%)
                    `
                }}
            />

            {/* MID LAYER: Spectrum wave band */}
            <SpectrumWaves />

            {/* FRONT LAYER: Soft core glow (concentrated around the 70% core zone) */}
            <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                    background: 'radial-gradient(ellipse 35% 25% at 70% 55%, rgba(140, 160, 190, 0.04) 0%, transparent 60%)'
                }}
            />

            {/* FRONT LAYER: Vignette - darkens edges 8-12% */}
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

            {/* FRONT LAYER: Film grain texture (2-4% monochrome noise) */}
            <div
                className="absolute inset-0 pointer-events-none z-[6] opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    mixBlendMode: 'overlay'
                }}
            />

            {/* Main content - LEFT aligned */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
                <div className="max-w-lg">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Your Intelligent<br />
                        Coaching System
                    </motion.h1>

                    <motion.p
                        className="text-sm md:text-base text-white/40 mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        Seamlessly manage client progress with AI-driven insights. The future of fitness coaching is calm, precise, and powerful.
                    </motion.p>

                    <motion.div
                        className="flex flex-row gap-3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.button
                            className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-slate-100 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Book a Demo
                        </motion.button>
                        <motion.button
                            className="px-5 py-2.5 bg-transparent text-white/60 text-sm font-medium rounded-full border border-white/20 hover:bg-white/5 hover:text-white transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            See Features
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
