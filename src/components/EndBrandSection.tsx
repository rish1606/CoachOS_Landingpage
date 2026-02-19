import { motion } from 'framer-motion';
import { CoachOSLogo } from './ui/coach-os-logo';

const EndBrandSection = () => {
    return (
        <section className="relative w-full py-32 md:py-48 flex flex-col items-center justify-center bg-[#07080C] overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a2e]/10 to-[#07080C]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">

                {/* 'Transform' Copy (Moved from TransformSection) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 md:mb-16 max-w-4xl mx-auto"
                >
                    <p className="text-blue-400 text-xs md:text-sm tracking-widest uppercase mb-4 font-medium">
                        Integrations
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
                        Ready to transform your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500">clientele gym experience?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
                        Join the elite circle of coaches redefining the industry. Elevate your brand, captivate your clients, and build your legacy with the ultimate operating system for success.
                    </p>
                </motion.div>

                {/* Connector Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-sm md:text-base text-blue-500 font-medium tracking-[0.2em] uppercase mb-8"
                >
                    Experience
                </motion.p>

                {/* Main Brand Title - Animated SVG */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-[90vw] md:max-w-[75vw] xl:max-w-[65vw]"
                >
                    <CoachOSLogo />
                </motion.div>

            </div>
        </section>
    );
};

export default EndBrandSection;
