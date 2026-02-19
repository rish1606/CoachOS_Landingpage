import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Separate component for clarity
const FeatureListReversed = ({
    features
}: {
    features: { title: string; desc: string }[];
}) => {
    return (
        <div className="flex flex-col gap-8 md:gap-10 items-start text-left w-full max-w-[420px]">
            {features.map((feature, i) => (
                <div
                    key={i}
                    className="flex flex-col gap-1.5 w-full"
                >
                    <h3 className="text-white font-display font-bold text-xl md:text-2xl tracking-tight leading-none">{feature.title}</h3>
                    <p className="text-[#94A3B8] text-sm md:text-[15px] leading-relaxed font-light font-primary">
                        {feature.desc}
                    </p>
                </div>
            ))}
        </div>
    );
};

const MobileAppSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    // We increase track height slightly to ensure smooth scroll, but visual content is locked.
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 45,
        damping: 15,
        restDelta: 0.001
    });

    // --- ANIMATION VALUES (Updated for smaller phone constraints) ---

    // 1. Phone Translation: From Right -> Left
    // 220px was okay, but with smaller phone, maybe 180px is enough? 
    // Keeping 220px to be safe visually.
    const phoneX = useTransform(smoothProgress, [0, 1], ["220px", "0px"]);

    // 2. Phone Rotation: +55 -> -25
    const rotateY = useTransform(smoothProgress, [0, 1], [55, -25]);

    // 3. Bullet Reveal
    const bulletOpacity = useTransform(smoothProgress, [0.70, 0.80], [0, 1]);
    const bulletY = useTransform(smoothProgress, [0.70, 0.80], [20, 0]);

    // 4. Integration strip: appears after bullets
    const integrationsOpacity = useTransform(smoothProgress, [0.82, 0.90], [0, 1]);
    const integrationsY = useTransform(smoothProgress, [0.82, 0.90], [12, 0]);

    // Wave intensity linked to scroll
    const waveIntensity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.8, 0.3]);

    const INTEGRATION_ICONS: Record<string, React.ReactNode> = {
        mfp: (
            <svg className="w-full h-full" viewBox="0 0 90 90" fill="none">
                <path d="M50.302 35.21c1.67-.344 2.968-1.544 4.26-1.888.862-.229 1.81-.229 2.842 0l2.786-.484c.534-.027 1.146-.164 1.834-.41 1.031-.372.517-.254 1.935-.946 1.417-.691 1.855-1.025 2.835-1.383.98-.36.768-.157 2.133-.436 1.366-.279 2.079-.468 2.732-.558.653-.09.708-.103 1.338 0 .63.103.803-.056 1.198.416.395.471.273.92.202 1.256-.07.337.044.47-.59.584-.634.115-.988-.206-1.498-.206s-.025-.233-1.008.206c-.982.44-1.147.778-1.836 1.066-.69.288-.31.07-1.54.345-1.232.275-1.327.224-2.463.55-1.135.326-.663.238-2.2.787l-3.072 1.1c-1.161.52-2.163.921-3.004 1.202-1.262.421-.933-.537-2.623.675-1.69 1.212-1.999 1.947-2.65 3.106-.651 1.158-.09 1.098-.52 2.532-.432 1.434-.949 2.327-1.091 2.832a1.933 1.933 0 0 0 0 1.039l1.611 2.466c.233.522.473 1.07.72 1.646.37.864.063 1.097.728 1.731.443.423 1.11.715 2.003.876l1.822.915 1.488.99 1.516 1.123 2.058 1.65 1.877 1.323 2.107.664 2.306.883 3.12.931 2.149 1.048 1.57.67 1.29.907 1.218.76 1.355.724 1.48.583 1.295.504h2.177l.818.23.694.65.271.597v1.152l-.68.2-1.103-.362h-.903l-.806-.285h-2.3l-.943-.25-1.154-.77-1.26-.666-1.449-.496-.98-.504-1.4-.237-1.338-.588-2.194-.652-.927-.21-1.744-.658-2.092-.63-2.454-.67-2.058-.799-2.394-.928-2.432-.964-2.003-.586-.975-.248h-2.532l-2.474-.339-1.064.339-.844.248-.977.586-2.371 1.474-1.976 1.218-1.134.34-1.766.762-1.597.628-1.485.758-1.223.919-1.28.74-1.013.497-1.358.981-1.392.456-1.257.25-1.553.446-1.585.502-1.005.281-1.022.27h-1.555l-.856.2h-1.994l-.643.294-.632.349-.462.303-.856.584-.454.671-.44.758-.514.524-.522.251h-1.024l-.394-.251-.421-.211-.24-.313-.48-.24h-.383l-.51.24h-.652l-.737.313H6.585l-.661-.162s-.615.088-.615-.151c0-.16.205-.488.615-.987l1.034-.442 1.039-.32 1.611-.916.863-.494 1.055-.55 1.024-.302 1.311-.201.881-.447 1.056-.25.805-.239 1.173-.53 1.29-.283 2.697-1.384c1.677-.77 2.576-1.156 2.696-1.156.12 0 .472-.177 1.057-.531l2.384-1.616.9-.913 1.558-.646 1.305-1.115 2.123-1.193 2.13-1.494 2.11-1.199 2.122-.908.413-2.4.332-2.157.218-1.91v-1.41l.303-1.242a144.387 144.387 0 0 0-.521-3.217c-.126-.673-.137-.6-.332-1.337-.196-.737-.413-.655-.413-1.471 0-.817.152-1.098.413-1.636.26-.538.695-.255.853-.977.157-.723-.163-.637-.303-1.546-.141-.91.071-1.13-.218-1.824-.29-.694.277.61-1.072-1.265a79.615 79.615 0 0 1-2.573-3.801l-2.08-3.002-1.958-3.01a65.673 65.673 0 0 1-1.547-2.219c-.854-1.274-1.424-2.26-1.662-2.566-.238-.306-.24-.141-.709-.484-.47-.343-.673-.511-.917-.703-.243-.192-.243 0-.724-.538-.481-.537-.376-1.36-.348-1.587.029-.227-.08-.307.227-.43.308-.125.633 0 .845 0h.917s.33.29.467.43.076.12.242.298c.166.178.108.205.22.538.111.333.083.325.137.528.054.203.34.577.472.761.132.185.58.703.58.703l2.556 3.05 1.202 1.372 2.08 2.497c.88 1.054 1.636 1.954 2.266 2.702.945 1.12 1.385 1.615 1.9 2.238.514.622.577.758.99 1.262.414.504.483.52.86.994.378.473.434.693.707.967.273.274.576.394.708.452.131.058.113 0 .321 0 .208 0 .458-.121.642-.21.185-.087.094-.014.305-.242.211-.227.195-.245.369-.484s.248-.212.334-.483c.086-.271 0-.362 0-.572 0-.211.1-.12 0-.422s-.175-.349-.334-.584c-.16-.235-.199-.215-.369-.451-.17-.236-.212-.329-.305-.486-.093-.157-.117-.04-.17-.32-.053-.279-.17-.326 0-.573.17-.246.411-.262.654-.38.243-.117.295-.189.524-.189.23 0 .612-.148.922-.255.31-.106.364-.122.587-.262.223-.14.108-.114.373-.342.265-.229.204-.262.545-.448.34-.187.424-.145.777-.277.354-.132.305-.204.7-.275.395-.07.442-.069.838 0 .396.069.364.135.75.275.384.14.529.171.77.277.243.105.117.007.449.254.331.248.345.14.61.536.267.395.256.48.334.868.078.388 0 .164 0 .792s.056.948 0 1.256c-.056.309-.105.186-.333.584-.228.398-.108.411-.457.796-.35.385-.613.453-.882.681-.269.228-.092.283-.492.484s-.452.003-.956.243c-.505.24-.65.2-.883.632-.233.433-1.67 1.355 0 1.012Z" fill="currentColor" />
            </svg>
        ),
        apple: (
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" opacity="0.3" /><circle cx="12" cy="12" r="10" strokeDasharray="60 100" strokeDashoffset="20" />
                <circle cx="12" cy="12" r="6.5" opacity="0.3" /><circle cx="12" cy="12" r="6.5" strokeDasharray="40 100" strokeDashoffset="60" />
                <circle cx="12" cy="12" r="3" opacity="0.3" /><circle cx="12" cy="12" r="3" strokeDasharray="20 100" strokeDashoffset="10" />
            </svg>
        ),
        samsung: (
            <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
                <g fill="currentColor">
                    <path d="M42,10v28c0,1.1-0.45,2.1-1.17,2.83C40.1,41.55,39.1,42,38,42H10c-2.21,0-4-1.79-4-4V10c0-1.1,0.45-2.1,1.17-2.83C7.9,6.45,8.9,6,10,6h28C40.21,6,42,7.79,42,10z" />
                    <path d="M42,10v2l-6-6h2C40.21,6,42,7.79,42,10z" /><polygon points="42,12 42,18 30,6 36,6" /><polygon points="42,18 42,24 24,6 30,6" />
                    <polygon points="42,24 42,30 18,6 24,6" /><polygon points="42,30 42,36 12,6 18,6" />
                    <path d="M42,36v2c0,1.1-0.45,2.1-1.17,2.83L7.17,7.17C7.9,6.45,8.9,6,10,6h2L42,36z" />
                    <path d="M40.83,40.83C40.1,41.55,39.1,42,38,42h-2L6,12v-2c0-1.1,0.45-2.1,1.17-2.83L40.83,40.83z" />
                    <polygon points="36,42 30,42 6,18 6,12" /><polygon points="30,42 24,42 6,24 6,18" /><polygon points="24,42 18,42 6,30 6,24" />
                    <polygon points="18,42 12,42 6,36 6,30" /><path d="M12,42h-2c-2.21,0-4-1.79-4-4v-2L12,42z" />
                </g>
                <path fill="#07080C" d="M24.43,37c-1.457,0-3.279-0.182-4.736-1.093c-1.457-0.911-5.282-3.825-5.829-4.189c-0.546-0.364-1.639-1.457,0-3.096c1.639-1.639,5.282-5.646,5.829-6.193s1.457-1.093,3.096-0.729c0.182-0.729,0.182-2.55-0.729-3.643c-1.093,0.729-2.732,4.007-4.554,4.007c-1.457,0-2.368-0.911-2.732-1.457c0.546,0.182,1.093,0,2.004-1.093c0.911-1.093,2.004-2.004,4.918-1.821c-0.546-1.093-0.546-1.821-0.546-2.55c0-0.729,0.911-3.643,4.007-3.643c2.732,0,4.007,2.186,4.007,2.914c0,0.729,0,2.004,0,2.186c0,0.182,0.364,0.182,0.364,0.546c0,0.364,0,1.639-0.364,2.368c-0.182,0.364-0.546,0.546-0.911,0.546s-0.911,0-0.911,0l-0.546,3.096c0,0,2.368,1.639,2.368,3.643s0,5.829,0,5.829l3.643-2.732c-0.182-0.364-0.729-1.639-0.182-2.368c0.546-0.729,1.275-0.911,1.639-0.911c0.364,0,0.729,0.364,0.729,0.911s0,2.004,0,2.368c0,0.364,0,0.546-0.364,0.911c-0.364,0.364-4.007,4.189-4.736,4.736S27.162,37,24.43,37z M20.423,33.357l-1.093-5.464l-2.55,2.004L20.423,33.357z" />
            </svg>
        ),
        google_fit: (
            <svg className="w-full h-full" viewBox="0 0 236.2 200" fill="currentColor">
                <path d="M22.6 105.8l11.9 11.9 25.7-25.6-11.8-11.9-5.4-5.4c-4.3-4.3-6.6-9.9-6.6-16 0-5.3 1.8-10.1 4.9-13.9 4.2-5.3 10.6-8.7 17.8-8.7 6.1 0 11.7 2.4 16.1 6.7l5.3 5.1 11.9 12 25.8-25.6-12-11.9-5.4-5.2C90.1 6.6 75.4 0 59.1 0 26.4 0 0 26.4 0 58.9 0 67 1.6 74.7 4.6 81.8c3 7.1 7.3 13.4 12.7 18.7l5.3 5.3" />
                <path d="M81.5,122.2 118.2,85.7 92.4,60 60.2,92.1 60.2,92.1 34.5,117.7 48.3,131.6 60.2,143.4 72.6,131" />
                <path d="M143.8,175.6 201.8,117.7 176,92.1 118.1,149.9 85.9,117.8 60.2,143.4 92.4,175.6 92.3,175.7 118.1,200 118.1,200 118.1,200 143.9,175.6 143.9,175.6" />
                <path d="M218.9 100.5c12-12 18.9-30.4 17-49-2.8-28.2-26.2-49.4-54.6-51.3C163.4-1 147 5.7 135.4 17.3L92.4 60l25.7 25.7 43-42.8c5.2-5.1 12.4-7.5 19.8-6.3 9.6 1.5 17.4 9.4 18.7 19 1 7.2-1.4 14.2-6.5 19.3L176 92.1l25.8 25.6 17.1-17.2z" />
            </svg>
        ),
        healthify: (
            <svg className="w-full h-full" viewBox="20 20 152 152" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                <g transform="translate(-.81 28.14)"><circle cx="96.811" cy="67.86" r="74" /><path d="M125.963 117.782V17.938m-58.304 0v99.844m0-49.922h58.304m0-24.961h40.281M67.659 92.821H27.377" /></g>
            </svg>
        ),
        strong: (
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M17,2H7C4.2,2,2,4.2,2,7v2c0,2.8,2.2,5,5,5h6v3H4v2h9c2.8,0,5-2.2,5-5v-2c0-2.8-2.2-5-5-5H7V7h10V2z" /></svg>
        ),
    };

    const integrations = [
        { id: 'mfp', label: 'MyFitnessPal' },
        { id: 'apple', label: 'Apple Health' },
        { id: 'samsung', label: 'Samsung Health' },
        { id: 'google_fit', label: 'Google Fit' },
        { id: 'healthify', label: 'HealthifyMe' },
        { id: 'strong', label: 'Strong' },
    ];

    return (
        // Height: 300vh track for animation
        <section ref={sectionRef} className="relative h-[350vh] bg-[#07080C]">

            {/* STICKY CONTAINER - Contains EVERYTHING (Background + Content) */}
            {/* Using h-screen to pin, but allowing flex content to center nicely */}
            {/* Added overflow-x-hidden to prevent horizontal scrollbar from phone movement */}
            <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">

                {/* --- BACKGROUND LAYERS (Now Contained) --- */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0"
                        style={{
                            background: `
                            radial-gradient(ellipse 28% 18% at 70% 55%, rgba(120,150,190,0.06) 0%, transparent 65%),
                            radial-gradient(ellipse 40% 30% at 70% 55%, rgba(100, 130, 170, 0.04) 0%, transparent 70%),
                            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30, 40, 55, 0.03) 0%, transparent 100%)
                        `
                        }}
                    />
                    <div className="absolute inset-0"
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

                    {/* Background Waves */}
                    <WaveBackground intensity={waveIntensity} />

                    {/* Grain Removed */}
                </div>


                {/* --- CONTENT --- */}
                <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 h-full flex flex-col justify-center">

                    {/* HEADER */}
                    <div className="w-full flex flex-col items-center text-center z-20 pointer-events-none shrink-0 pt-6 md:pt-10 lg:pt-14 mb-4 md:mb-6">
                        <p className="text-blue-400 text-sm tracking-widest uppercase mb-3 md:mb-4 font-medium">
                            Mobile App
                        </p>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight leading-[1.1]">
                            Everything your clients need — in one app.
                        </h2>
                        <p className="text-[#94A3B8] text-sm md:text-base md:max-w-xl font-light">
                            Training, nutrition, progress, and insights — all connected.
                        </p>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="flex-1 flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-4 md:gap-[clamp(24px,4vw,56px)] w-full min-h-0">

                        {/* LEFT COL: Phone Destination */}
                        <div className="relative w-full flex items-center justify-center md:justify-end perspective-[1400px]">

                            {/* PHONE WRAPPER */}
                            <motion.div
                                style={{
                                    x: phoneX,
                                    rotateY: rotateY,
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: 'center center',
                                    width: 'clamp(220px, 22vw, 290px)',
                                    height: 'clamp(340px, 40vh, 420px)',
                                }}
                                className="relative shrink-0"
                            >
                                {/* Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[70%] bg-[#4B5EAA]/15 blur-[80px] rounded-full pointer-events-none opacity-60" />
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-5 bg-black/60 blur-xl rounded-[100%]" />

                                {/* PLACEHOLDER BLOCK */}
                                <div className="relative w-full h-full bg-[#0c0c10] border-[5px] border-[#1e1e24] rounded-[clamp(32px,4vw,48px)] shadow-2xl flex flex-col items-center justify-center overflow-hidden backface-visible">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1e] to-[#07080C]" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none rounded-[inherit]" />

                                    <div className="relative z-10 text-center opacity-70 scale-90">
                                        <div className="w-10 h-10 mx-auto rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                            <div className="w-1 h-1 bg-white/50 rounded-full" />
                                        </div>
                                        <div className="text-white/30 text-[9px] uppercase tracking-widest font-semibold">Preview</div>
                                        <div className="text-white font-bold text-base tracking-tight">App Interface</div>
                                    </div>
                                </div>

                                {/* Depth Side */}
                                <div
                                    className="absolute right-0 top-[16px] bottom-[16px] w-[12px] bg-[#2a2a30] rounded-r-[6px] origin-left"
                                    style={{
                                        transform: 'translateX(100%) rotateY(90deg)'
                                    }}
                                />

                            </motion.div>
                        </div>

                        {/* RIGHT COL: Bullets */}
                        <div className="relative w-full flex flex-col items-start justify-center pl-4 md:pl-0">
                            <motion.div
                                style={{
                                    opacity: bulletOpacity,
                                    y: bulletY
                                }}
                            >
                                <FeatureListReversed
                                    features={[
                                        { title: "Smart Plans", desc: "Weekly adaptive training built for results." },
                                        { title: "Macro Tracking", desc: "Fast logging with targets & visual breakdowns." },
                                        { title: "Progress Photos", desc: "Secure visual timeline with comparison tools." },
                                        { title: "Sleep & Recovery", desc: "Wearables-ready recovery insights." },
                                        { title: "Insights", desc: "Actionable trends, not raw data." },
                                    ]}
                                />
                            </motion.div>
                        </div>

                    </div>

                    {/* INTEGRATION STRIP — in flow, below the grid */}
                    <motion.div
                        style={{ opacity: integrationsOpacity, y: integrationsY }}
                        className="w-full flex flex-col items-center shrink-0 py-4 md:py-5"
                    >
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium mb-3">
                            All the power of these apps, built right in
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-5 md:gap-7">
                            {integrations.map((item) => (
                                <div key={item.id} className="flex flex-col items-center gap-1.5">
                                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/60 bg-white/5 rounded-xl border border-white/10">
                                        <div className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]">{INTEGRATION_ICONS[item.id]}</div>
                                    </div>
                                    <span className="text-[8px] md:text-[9px] font-medium tracking-wider uppercase text-white/40">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Next section hint */}
            <a
                href="#pricing"
                className="absolute bottom-8 right-10 flex items-center gap-2 text-xs text-white/28 hover:text-white/55 transition-colors z-40"
            >
                Next: Pricing
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>
        </section >
    );
};

// Wave Background Component (Adapted from UsesSection)
const WaveBackground = ({ intensity }: { intensity: any }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "-10%" });

    const viewBoxWidth = 1920;
    const viewBoxHeight = 1080;
    const centerY = viewBoxHeight * 0.5;

    // Waves with visible color
    const waves = React.useMemo(() =>
        Array.from({ length: 15 }).map((_, i) => {
            const yOffset = centerY + (i - 7) * 22;
            const distFromCenter = Math.abs(i - 7) / 7;
            return {
                key: i,
                yOffset,
                opacity: 0.15 + (1 - distFromCenter) * 0.28, // More visible
                strokeWidth: 0.6 + (1 - distFromCenter) * 0.7,
                duration: 12 + i * 0.4,
                delay: i * 0.1
            };
        }), [centerY]
    );

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 z-0"
            style={{
                opacity: intensity,
                willChange: 'opacity'
            }}
        >
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                <defs>
                    {/* Brighter blue wave gradient - slightly enhanced */}
                    <linearGradient id="mobileAppWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(100,160,240,0)" />
                        <stop offset="25%" stopColor="rgba(120,180,240,0.28)" />
                        <stop offset="50%" stopColor="rgba(160,210,255,0.48)" />
                        <stop offset="75%" stopColor="rgba(120,180,240,0.28)" />
                        <stop offset="100%" stopColor="rgba(100,160,240,0)" />
                    </linearGradient>
                </defs>

                {waves.map(w => (
                    <motion.path
                        key={w.key}
                        fill="none"
                        stroke="url(#mobileAppWaveGradient)"
                        strokeWidth={w.strokeWidth}
                        opacity={w.opacity}
                        d={`M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 15} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`}
                        animate={isInView ? {
                            d: [
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 18} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset - 18} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                                `M0 ${w.yOffset} Q${viewBoxWidth * 0.25} ${w.yOffset + 18} ${viewBoxWidth * 0.5} ${w.yOffset} T${viewBoxWidth} ${w.yOffset}`,
                            ]
                        } : undefined}
                        transition={{
                            duration: w.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: w.delay
                        }}
                    />
                ))}
            </svg>
        </motion.div>
    );
};

export default MobileAppSection;
