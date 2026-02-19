import { motion } from "framer-motion";

export const CoachOSLogo = () => {
    const duration = 5; // Loop duration in seconds

    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 100" // Adjusted viewBox for aspect ratio
            xmlns="http://www.w3.org/2000/svg"
            className="select-none overflow-visible w-full h-auto"
        >
            <defs>
                {/* Colorful Gradient for the Reveal */}
                <linearGradient
                    id="brandGradient"
                    gradientUnits="userSpaceOnUse"
                    x1="0%" y1="0%" x2="100%" y2="0%"
                >
                    <stop offset="0%" stopColor="#60A5FA" />   {/* Blue-400 */}
                    <stop offset="50%" stopColor="#FFFFFF" />   {/* White highlight */}
                    <stop offset="100%" stopColor="#60A5FA" />  {/* Blue-400 */}
                </linearGradient>

                {/* Looping Reveal Mask */}
                <motion.radialGradient
                    id="loopMask"
                    gradientUnits="userSpaceOnUse"
                    r="40%" // Radius of the spotlight
                    animate={{
                        cx: ["-20%", "120%"], // Sweep across
                        cy: "50%"
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.5
                    }}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </motion.radialGradient>

                <mask id="logoMask">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#loopMask)"
                    />
                </mask>
            </defs>

            {/* --- LAYER 1: Base Stroke (Ghost) --- */}
            {/* Visible when not highlighted */}
            {/* --- LAYER 1: Base Stroke (Ghost - Breathable) --- */}
            {/* Visible when not highlighted */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.8"
                style={{ fontFamily: '"Bodoni Moda", serif' }}
                className="fill-transparent stroke-white/20 font-black text-[60px] tracking-[-0.05em]"
            >
                COACH OS
            </text>

            {/* --- LAYER 2: Animated Overlay (Fill Reveal) --- */}
            {/* Revealed by the moving mask */}
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="url(#brandGradient)" // Blue-White-Blue gradient
                strokeWidth="0"
                mask="url(#logoMask)"
                style={{ fontFamily: '"Bodoni Moda", serif', filter: 'drop-shadow(0px 0px 8px rgba(96, 165, 250, 0.8))' }}
                className="font-black text-[60px] tracking-[-0.05em]"
            >
                COACH OS
            </text>

            {/* --- LAYER 3: The Spinning Star --- */}
            {/* 'COACH OS' center is 200. 'O' approx 300-330. 'O' top-right edge ~324, 14 */}
            <motion.g
                initial={{ x: 324, y: 14 }}
                animate={{
                    rotate: [0, 0, 180, 180],
                    scale: [1, 1.5, 1, 1],
                    opacity: [0.3, 1, 0.3, 0.3]
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.6, 0.8, 1],
                    repeatDelay: 0.5
                }}
            >
                <path
                    d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                    fill="#60A5FA"
                    transform="scale(0.8) translate(-12, -12)" // Center the path around 0,0
                />
            </motion.g>

            {/* --- Trademark Symbol --- */}
            {/* Moved to end of string approx 375 */}
            <text
                x="375"
                y="25"
                className="fill-white/40 text-[10px] font-sans font-medium"
            >
                ®
            </text>

        </svg>
    );
};
