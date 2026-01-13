import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    {/* Left side - Text */}
                    <div className="hero-text">
                        <h1 className="hero-title text-display">
                            Your Intelligent<br />
                            Coaching System
                        </h1>
                        <p className="hero-description">
                            Seamlessly manage client progress,
                            personalize workouts, and optimize health
                            insights with the power of AI
                        </p>
                    </div>

                    {/* Right side - Laptop */}
                    <div className="hero-laptop">
                        <div className="laptop-wrapper">
                            <div className="laptop-screen">
                                <div className="screen-content">
                                    {/* Dashboard mockup */}
                                    <div className="dashboard-sidebar">
                                        <div className="sidebar-item active"></div>
                                        <div className="sidebar-item"></div>
                                        <div className="sidebar-item"></div>
                                        <div className="sidebar-item"></div>
                                    </div>
                                    <div className="dashboard-main">
                                        <div className="dashboard-header"></div>
                                        <div className="dashboard-cards">
                                            <div className="dash-card"></div>
                                            <div className="dash-card"></div>
                                        </div>
                                        <div className="dashboard-chart"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="laptop-base">
                                <div className="laptop-notch"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
