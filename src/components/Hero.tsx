import { motion } from 'framer-motion';
import SpectrumWaves from './SpectrumWaves';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#07080C]">
            {/* Gaussian curve waves background - positioned on right, fades on left */}
            <SpectrumWaves />

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
