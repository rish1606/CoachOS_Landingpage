"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const MacbookScroll = ({
    src,
    showGradient: _showGradient,
    title,
    badge: _badge,
}: {
    src?: string;
    showGradient?: boolean;
    title?: string | React.ReactNode;
    badge?: React.ReactNode;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (window && window.innerWidth < 768) {
            setIsMobile(true);
        }
    }, []);

    const scaleX = useTransform(
        scrollYProgress,
        [0, 0.3],
        [1.2, isMobile ? 1 : 1.5]
    );
    const scaleY = useTransform(
        scrollYProgress,
        [0, 0.3],
        [0.6, isMobile ? 1 : 1.5]
    );
    const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
    const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
    const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div
            ref={ref}
            className="macbook-scroll-container"
        >
            <motion.h2
                style={{
                    translateY: textTransform,
                    opacity: textOpacity,
                }}
                className="macbook-title"
            >
                {title || (
                    <span>
                        Your Intelligent <br /> Coaching System
                    </span>
                )}
            </motion.h2>
            {/* Lid */}
            <Lid
                src={src}
                scaleX={scaleX}
                scaleY={scaleY}
                rotate={rotate}
                translate={translate}
            />
            {/* Base area */}
            <div className="macbook-base-container">
                <div className="macbook-base">
                    <div className="macbook-base-top" />
                </div>
                <div className="macbook-base-bottom">
                    <div className="macbook-notch">
                        <div className="macbook-notch-inner">
                            <div className="macbook-notch-shine" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Lid = ({
    scaleX,
    scaleY,
    rotate,
    translate,
    src,
}: {
    scaleX: any;
    scaleY: any;
    rotate: any;
    translate: any;
    src?: string;
}) => {
    return (
        <div className="lid-container">
            <div className="lid-perspective">
                <motion.div
                    style={{
                        scaleX: scaleX,
                        scaleY: scaleY,
                        rotateX: rotate,
                        translateY: translate,
                        transformStyle: "preserve-3d",
                        transformOrigin: "top",
                    }}
                    className="lid-inner"
                >
                    <div className="lid-frame">
                        <span className="lid-bezel" />
                        <span className="lid-bezel-right" />
                        <span className="lid-bezel-bottom" />
                        <span className="lid-bezel-left" />
                    </div>
                    <div className="lid-screen">
                        {src ? (
                            <img
                                src={src}
                                alt="macbook screen"
                                className="screen-image"
                            />
                        ) : (
                            <div className="screen-placeholder">
                                <DashboardMockup />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const DashboardMockup = () => {
    return (
        <div className="dashboard-mockup">
            {/* Sidebar */}
            <div className="mockup-sidebar">
                <div className="mockup-logo" />
                <div className="mockup-nav">
                    <div className="mockup-nav-item active" />
                    <div className="mockup-nav-item" />
                    <div className="mockup-nav-item" />
                    <div className="mockup-nav-item" />
                </div>
            </div>
            {/* Main Content */}
            <div className="mockup-main">
                <div className="mockup-header">
                    <div className="mockup-search" />
                    <div className="mockup-avatar" />
                </div>
                <div className="mockup-content">
                    <div className="mockup-card large">
                        <div className="mockup-card-title" />
                        <div className="mockup-chart" />
                    </div>
                    <div className="mockup-stats">
                        <div className="mockup-stat" />
                        <div className="mockup-stat" />
                        <div className="mockup-stat" />
                    </div>
                </div>
            </div>
        </div>
    );
};
