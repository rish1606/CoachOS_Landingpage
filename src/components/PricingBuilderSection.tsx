import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA MODEL ---

type CategoryId = 'core' | 'client' | 'coach' | 'growth' | 'ops';

interface Module {
    id: string;
    categoryId: CategoryId;
    name: string;
    desc: string;
    price: number;
    isCore?: boolean; // If true, included by default and maybe not removable in basic plan
}

interface Category {
    id: CategoryId;
    label: string;
    count: number;
}

const CATEGORIES: Category[] = [
    { id: 'core', label: 'Core Platform', count: 1 },
    { id: 'client', label: 'Client App', count: 4 },
    { id: 'coach', label: 'Coach Tools', count: 3 },
    { id: 'growth', label: 'Growth & Marketing', count: 3 },
    { id: 'ops', label: 'Operations', count: 2 },
];

const MODULES: Module[] = [
    // Core
    { id: 'dashboard', categoryId: 'core', name: 'Coach Dashboard', desc: 'Client management + programming tools', price: 29, isCore: true },

    // Client App
    { id: 'mobile_basic', categoryId: 'client', name: 'Client Mobile App', desc: 'Workout, nutrition, streaks & goals', price: 19 },
    { id: 'smart_plans', categoryId: 'client', name: 'AI Smart Plans', desc: 'Adaptive training plans for each client', price: 29 },
    { id: 'macros', categoryId: 'client', name: 'Macro + Food Logging', desc: 'Targets, recipes, barcode, analytics', price: 15 },
    { id: 'photos', categoryId: 'client', name: 'Progress Photos', desc: 'Timeline, side-by-side, comparison tools', price: 12 },

    // Coach Tools
    { id: 'checkins', categoryId: 'coach', name: 'Check-in Forms', desc: 'Weekly check-ins & feedback loops', price: 15 },
    { id: 'library', categoryId: 'coach', name: 'Exercise Library', desc: '1000+ videos or upload your own', price: 9 },
    { id: 'builder', categoryId: 'coach', name: 'Program Builder', desc: 'Drag & drop block creation', price: 19 },

    // Growth
    { id: 'website', categoryId: 'growth', name: 'Website Builder', desc: 'SEO-ready landing pages', price: 25 },
    { id: 'automations', categoryId: 'growth', name: 'Automations', desc: 'Reminders, tasks, onboarding flows', price: 29 },
    { id: 'reviews', categoryId: 'growth', name: 'Review Collector', desc: 'Automated testimonial gathering', price: 15 },

    // Ops
    { id: 'payments', categoryId: 'ops', name: 'Payments & Billing', desc: 'Plans, renewals, invoices (1% fee)', price: 19 },
    { id: 'contracts', categoryId: 'ops', name: 'Digital Contracts', desc: 'E-signatures and waivers', price: 12 },
];

// --- COMPONENT ---

const PricingBuilderSection = () => {
    // State
    const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(['dashboard']));
    const [activeCategory, setActiveCategory] = useState<CategoryId>('core');
    const [coachCount, setCoachCount] = useState(1);
    const [clientTier, setClientTier] = useState<number>(50); // 50, 150, 300, 500


    // Derived State
    const activeModules = useMemo(() => MODULES.filter(m => m.categoryId === activeCategory), [activeCategory]);

    // Logic
    const toggleModule = (id: string, isCore?: boolean) => {
        if (isCore) return; // Cannot toggle core
        const next = new Set(selectedModules);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedModules(next);
    };

    // Calculation
    const totalMonthly = useMemo(() => {
        let sum = 0;
        MODULES.forEach(m => {
            if (selectedModules.has(m.id)) {
                sum += m.price;
            }
        });

        // Tier Multipliers (Dummy logic for now)
        const tierMultiplier = clientTier <= 50 ? 1 : clientTier <= 150 ? 1.5 : 2.5;

        // Coach Seats
        const seatCost = (coachCount - 1) * 29;

        let total = (sum * tierMultiplier) + seatCost;

        return Math.round(total);
    }, [selectedModules, clientTier, coachCount]);


    return (
        <section id="pricing" className="relative py-32 bg-[#07080C] min-h-screen flex items-center justify-center overflow-hidden">

            {/* Background Effects (Subtle) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#13151a] via-[#07080C] to-[#07080C] opacity-60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-[1280px] px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-medium">Pricing</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">Build your plan</h2>
                    <p className="text-[#94A3B8]">Select the modules you need. Pay only for what you use.</p>
                </div>

                {/* --- DESKTOP APP WINDOW --- */}
                <div className="mx-auto w-full max-w-6xl h-[700px] flex bg-[#0c0c11] rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm ring-1 ring-white/5">

                    {/* 1. SIDEBAR (Categories) */}
                    <div className="w-[240px] bg-[#09090b]/80 border-r border-white/5 flex flex-col p-4 backdrop-blur-md">
                        <div className="text-xs font-semibold text-white/30 uppercase tracking-widest px-3 mb-4 mt-2">Modules</div>
                        <div className="flex flex-col gap-1">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.id
                                        ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span>{cat.label}</span>
                                    {cat.count > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'
                                            }`}>
                                            {cat.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. MIDDLE PANEL (Module List) */}
                    <div className="flex-1 bg-gradient-to-b from-[#0c0c11] to-[#0a0a0e] flex flex-col relative">
                        {/* Top Bar (Presets or Breadcrumbs) */}
                        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8">
                            <div className="text-white font-medium">Select Modules</div>
                            <div className="flex gap-2">
                                {/* Preset buttons can go here */}
                            </div>
                        </div>

                        {/* Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <AnimatePresence mode='popLayout'>
                                <div className="flex flex-col gap-3">
                                    {activeModules.map(module => {
                                        const isSelected = selectedModules.has(module.id);
                                        return (
                                            <motion.div
                                                key={module.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                onClick={() => toggleModule(module.id, module.isCore)}
                                                className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                                                    ? 'bg-white/[0.03] border-white/10 shadow-lg'
                                                    : 'bg-transparent border-white/5 hover:bg-white/[0.015] hover:border-white/10'
                                                    }`}
                                            >
                                                {/* Active Indicator Line */}
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        className="absolute left-0 top-3 bottom-3 w-[3px] bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                                    />
                                                )}

                                                <div className="flex items-center gap-4">
                                                    {/* Checkbox */}
                                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected
                                                        ? 'bg-blue-500 border-blue-500 text-white'
                                                        : 'border-white/20 bg-transparent group-hover:border-white/30'
                                                        }`}>
                                                        {isSelected && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} fill="none"><path d="M5 13l4 4L19 7" /></svg>}
                                                    </div>

                                                    <div>
                                                        <div className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-white/70'}`}>
                                                            {module.name}
                                                            {module.isCore && <span className="ml-2 text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">CORE</span>}
                                                        </div>
                                                        <div className="text-sm text-white/30 font-light">{module.desc}</div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className={`font-medium ${isSelected ? 'text-white' : 'text-white/40'}`}>
                                                        ${module.price}<span className="text-xs text-white/20">/mo</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 3. RIGHT PANEL (Summary) */}
                    <div className="w-[320px] bg-[#08080a] border-l border-white/5 flex flex-col p-6 shadow-2xl z-20">
                        <div className="mb-8">
                            <h3 className="text-white font-medium mb-1">Your Estimate</h3>
                            <p className="text-xs text-white/30">Monthly billing • Cancel anytime</p>
                        </div>

                        {/* Settings */}
                        <div className="space-y-6 mb-8">
                            {/* Clients Tier */}
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-2">
                                    <span>Active Clients</span>
                                    <span className="text-white">{clientTier} clients</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="3" step="1"
                                    value={clientTier === 50 ? 0 : clientTier === 150 ? 1 : clientTier === 300 ? 2 : 3}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value);
                                        setClientTier(v === 0 ? 50 : v === 1 ? 150 : v === 2 ? 300 : 500);
                                    }}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                                />
                                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                                    <span>50</span><span>500+</span>
                                </div>
                            </div>

                            {/* Coaches */}
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-2">
                                    <span>Team Seats</span>
                                    <span className="text-white">{coachCount} coaches</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                                    <button onClick={() => setCoachCount(Math.max(1, coachCount - 1))} className="w-8 h-8 flex items-center justify-center text-white/50 hover:bg-white/10 rounded">-</button>
                                    <div className="flex-1 text-center text-sm font-medium text-white">{coachCount}</div>
                                    <button onClick={() => setCoachCount(Math.max(1, coachCount + 1))} className="w-8 h-8 flex items-center justify-center text-white/50 hover:bg-white/10 rounded">+</button>
                                </div>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Total */}
                        <div className="relative pt-6 border-t border-white/10">
                            <div className="flex items-end gap-1 mb-1">
                                <span className="text-4xl font-bold text-white tracking-tight">${totalMonthly}</span>
                                <span className="text-sm text-white/40 mb-1.5">/mo</span>
                            </div>
                            <p className="text-xs text-white/30 mb-6">Billed monthly</p>

                            <button className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Book a Demo
                            </button>
                            <button className="w-full py-3 mt-2 text-white/40 text-xs hover:text-white transition-colors">
                                Download PDF Quote
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Next section hint */}
            <a
                href="#about"
                className="absolute bottom-8 right-10 flex items-center gap-2 text-xs text-white/28 hover:text-white/55 transition-colors z-40"
            >
                Next: About
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>
        </section>
    );
};

export default PricingBuilderSection;
