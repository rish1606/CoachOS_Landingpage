import { useState, type FormEvent } from 'react';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        businessType: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        console.log('Form submitted:', formData);
    };

    const businessTypes = [
        { value: '', label: 'Select your business type' },
        { value: 'gym', label: 'Gym / Fitness Center' },
        { value: 'yoga', label: 'Yoga Studio' },
        { value: 'crossfit', label: 'CrossFit Box' },
        { value: 'personal', label: 'Personal Trainer' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <section className="py-20 px-4 bg-matt-black relative z-10">
            <div className="max-w-md mx-auto">
                {/* Signup Card */}
                <div className="bg-gradient-to-b from-matt-elevated to-matt-dark border border-white/5 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase text-white/60 bg-white/5 rounded-full mb-4">
                            Start Free Trial
                        </span>
                        <h2 className="text-display text-2xl md:text-3xl mb-3 text-white">
                            Transform Your <span className="text-white/80">Fitness Business</span>
                        </h2>
                        <p className="text-sm text-white/50">
                            Join thousands of coaches delivering premium experiences
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-xs font-medium text-white/60 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                className="input"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="input"
                                placeholder="you@yourbusiness.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="input"
                                placeholder="Create a secure password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label htmlFor="businessType" className="block text-xs font-medium text-white/60 mb-2">
                                Business Type
                            </label>
                            <select
                                id="businessType"
                                className="input appearance-none cursor-pointer"
                                value={formData.businessType}
                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                required
                            >
                                {businessTypes.map((type) => (
                                    <option key={type.value} value={type.value} className="bg-matt-dark">
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 px-6 bg-white text-matt-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-matt-black/20 border-t-matt-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Get Started Free
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-white/40">or continue with</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-matt-dark border border-white/5 rounded-lg text-sm text-white/70 transition-all hover:bg-matt-elevated hover:border-white/10">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-matt-dark border border-white/5 rounded-lg text-sm text-white/70 transition-all hover:bg-matt-elevated hover:border-white/10">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-center text-white/40 mt-6">
                        By signing up, you agree to our{' '}
                        <a href="#terms" className="text-white/60 hover:text-white underline">Terms of Service</a> and{' '}
                        <a href="#privacy" className="text-white/60 hover:text-white underline">Privacy Policy</a>
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span>Bank-level Security</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        <span>14-day Free Trial</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>2,500+ Coaches</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignupForm;
