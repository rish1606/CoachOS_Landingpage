import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

// Pricing tiers data
const pricingTiers = [
    {
        id: 'base',
        name: 'Base',
        price: '$49',
        period: '/month',
        description: 'Perfect for solo coaches starting out',
        features: [
            'Up to 25 clients',
            'Basic scheduling',
            'Progress tracking',
            'Email support',
        ],
        modules: [],
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$99',
        period: '/month',
        description: 'For growing coaching businesses',
        features: [
            'Up to 100 clients',
            'Advanced scheduling',
            'AI-powered insights',
            'Custom branding',
            'Priority support',
        ],
        modules: ['Analytics Dashboard', 'Client Portal'],
        popular: true,
    },
    {
        id: 'advance',
        name: 'Advance',
        price: '$199',
        period: '/month',
        description: 'Enterprise-grade for large teams',
        features: [
            'Unlimited clients',
            'Team management',
            'White-label solution',
            'API access',
            'Dedicated account manager',
        ],
        modules: ['Multi-location', 'Custom Integrations', 'Advanced Reports'],
        popular: false,
    },
];

// Connector line SVG between cards
// ConnectorLine component removed as it is replaced by Gemini effect

// Individual pricing card
const PricingCard = ({
    tier,
    index,
    isInView,
    hoveredIndex,
    setHoveredIndex
}: {
    tier: typeof pricingTiers[0];
    index: number;
    isInView: boolean;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
}) => {
    const isHovered = hoveredIndex === index;
    const isAnyHovered = hoveredIndex !== null;
    const isOtherHovered = isAnyHovered && !isHovered;

    return (
        <motion.div
            className={`relative flex flex-col ${tier.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: isOtherHovered ? 0.5 : 1, // Dim others
                scale: isHovered ? 1.05 : (isOtherHovered ? 0.95 : 1), // Scale up hovered, scale down others
                y: isInView ? 0 : 30,
                filter: isOtherHovered ? 'blur(2px)' : 'blur(0px)', // Blur others
            }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ zIndex: isHovered ? 20 : 10 }}
        >
            {/* Popular badge */}
            {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/80 backdrop-blur-sm z-10">
                    Most Popular
                </div>
            )}

            {/* Card */}
            <div
                className={`relative flex flex-col h-full p-6 md:p-8 rounded-2xl transition-all duration-300 hover:translate-y-[-2px] ${tier.popular
                    ? 'bg-[#16171B] border-white/20' // Solid opaque background to hide lines
                    : 'bg-[#0A0B0E] border-white/10' // Solid opaque background
                    }`}
                style={{
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `1px solid ${tier.popular ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: tier.popular
                        ? '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 8px 32px rgba(0,0,0,0.2)'
                }}
            >
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                    <p className="text-sm text-white/45">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <span className="text-4xl md:text-5xl font-bold text-white">{tier.price}</span>
                    <span className="text-white/40 text-sm">{tier.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                    {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                            <svg className="w-4 h-4 mt-0.5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Modules (add-ons) */}
                {tier.modules.length > 0 && (
                    <div className="mb-6 pt-4 border-t border-white/[0.06]">
                        <p className="text-xs text-white/35 uppercase tracking-wider mb-3">Included Modules</p>
                        <div className="flex flex-wrap gap-2">
                            {tier.modules.map((module, i) => (
                                <span
                                    key={i}
                                    className="px-2.5 py-1 text-xs text-white/50 bg-white/[0.04] border border-white/[0.06] rounded-full"
                                >
                                    {module}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Button */}
                <button
                    className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${tier.popular
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-white/[0.08] text-white/80 border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15]'
                        }`}
                >
                    {tier.popular ? 'Get Started' : 'Choose Plan'}
                </button>
            </div>
        </motion.div >
    );
};

const PricingSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section
            id="pricing"
            ref={sectionRef}
            className="relative py-24 md:py-32 bg-[#07080C] overflow-hidden"
        >
            {/* Background gradient - same as Hero */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 28% 18% at 70% 55%, rgba(120,150,190,0.06) 0%, transparent 65%),
                        radial-gradient(ellipse 40% 30% at 70% 55%, rgba(100, 130, 170, 0.04) 0%, transparent 70%),
                        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30, 40, 55, 0.03) 0%, transparent 100%)
                    `
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 100% 100% at 50% 50%, 
                            transparent 40%, 
                            rgba(0, 0, 0, 0.1) 70%, 
                            rgba(0, 0, 0, 0.2) 100%
                        )
                    `
                }}
            />



            <div className="relative z-10 max-w-6xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.span
                        className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase text-white/50 bg-white/5 rounded-full mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        Simple Pricing
                    </motion.span>

                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        Choose your plan
                    </motion.h2>

                    <motion.p
                        className="text-base text-white/45 max-w-md mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Scale as you grow. Cancel anytime.
                    </motion.p>
                </div>

                {/* Pricing cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 items-stretch">
                    {pricingTiers.map((tier, index) => (
                        <PricingCard
                            key={tier.id}
                            tier={tier}
                            index={index}
                            isInView={isInView}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                        />
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p
                    className="text-center text-sm text-white/35 mt-12"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    All plans include 14-day free trial • No credit card required
                </motion.p>
            </div>

            {/* Next section hint */}
            <motion.a
                href="#about"
                className="absolute bottom-8 right-10 flex items-center gap-2 text-xs text-white/28 hover:text-white/55 transition-colors z-40 hidden md:flex"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.0 }}
            >
                Next: About
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </motion.a>
        </section>
    );
};

export default PricingSection;
