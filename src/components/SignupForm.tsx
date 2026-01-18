import { useState, type FormEvent } from 'react';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        location: '',
        businessName: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        console.log('Form submitted:', formData);
    };



    return (
        <section id="contact" className="py-20 px-4 bg-[#07080C] relative overflow-hidden">
            {/* Background gradient - same as Hero for consistency */}
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

            <div className="max-w-4xl mx-auto relative z-10">
                {/* CTA Divider */}
                <div className="text-center mb-24 px-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                        Ready to transform your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            clientele gym experience?
                        </span>
                    </h2>
                    <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto">
                        Create high-quality fitness experiences and manage your business in a quick and engaging way.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 items-start gap-12 p-8 bg-[#0B0B0F] border border-white/10 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.5)]">
                    <div>
                        <h2 className="text-white text-3xl font-bold">Let's Connect</h2>
                        <p className="text-[15px] text-white/60 mt-4 leading-relaxed">
                            If you are looking forward to premiumize your gym we will help you end to end to achieve this ultimate goal. Place an inquiry and our sales team will reach you out with an update.
                        </p>
                        <div className="mt-12">
                            <h2 className="text-white text-base font-semibold">Email</h2>
                            <ul className="mt-4">
                                <li className="flex items-center">
                                    <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" className="text-white" viewBox="0 0 479.058 479.058">
                                            <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                                        </svg>
                                    </div>
                                    <a href="mailto:info@coachos.com" className="text-sm ml-4 hover:opacity-80 transition-opacity">
                                        <small className="block text-white">Mail</small>
                                        <span className="text-blue-500 font-medium">info@coachos.com</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type='text'
                            placeholder='Name'
                            className="w-full text-white bg-white/5 rounded-md py-2.5 px-4 border border-white/10 text-sm outline-0 focus:border-blue-500 focus:bg-white/10 transition-colors"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                        <input
                            type='email'
                            placeholder='Email'
                            className="w-full text-white bg-white/5 rounded-md py-2.5 px-4 border border-white/10 text-sm outline-0 focus:border-blue-500 focus:bg-white/10 transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <input
                            type='text'
                            placeholder='Location'
                            className="w-full text-white bg-white/5 rounded-md py-2.5 px-4 border border-white/10 text-sm outline-0 focus:border-blue-500 focus:bg-white/10 transition-colors"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <input
                            type='text'
                            placeholder='Business / Gym Name'
                            className="w-full text-white bg-white/5 rounded-md py-2.5 px-4 border border-white/10 text-sm outline-0 focus:border-blue-500 focus:bg-white/10 transition-colors"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        />
                        <button
                            type='submit'
                            className="text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium px-4 py-2.5 w-full cursor-pointer border-0 mt-2 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Place Inquiry'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Back to Top hint */}
            <a
                href="#home"
                className="absolute bottom-6 right-8 flex items-center gap-2 text-xs text-white/20 hover:text-white/50 transition-colors z-40 hidden md:flex"
            >
                Back to Top
                <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </a>
        </section>
    );
};

export default SignupForm;
