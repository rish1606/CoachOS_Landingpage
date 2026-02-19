import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, type PanInfo, AnimatePresence } from 'framer-motion';

const SlideForm = () => {
    // Steps: 0 = Idle, 1 = Email, 2 = Gym Name, 3 = Success
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [gymName, setGymName] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Dimensions
    const CONTAINER_WIDTH = 420; // Fixed width for simpler drag logic
    const BTN_SIZE = 48; // Button size
    const PADDING = 6;
    const DRAG_RANGE = CONTAINER_WIDTH - BTN_SIZE - (PADDING * 2);

    // Drag Motion Value
    // We'll reset this on each step change to simplify mapping
    // But for a continuous feel, we might want a single value.
    // Let's stick to "relative to current step state".
    // Actually, distinct states with specific drag constraints is improved.

    // x represents the button position relative to its "start" for the current move?
    // No, let's make x absolute within the container.
    // Left position = 0 (technically PADDING).
    // Right position = DRAG_RANGE (technically CONTAINER_WIDTH - BTN_SIZE - PADDING).

    const x = useMotionValue(0);
    const controls = useAnimation();

    // Determine target positions based on step
    // Step 0 (Idle): Arrow at Left (0). Target Right (DRAG_RANGE).
    // Step 1 (Email): Arrow at Right (DRAG_RANGE). Target Left (0).
    // Step 2 (Gym): Arrow at Left (0). Target Right (DRAG_RANGE).
    // Step 3 (Success): Arrow at Right. Fixed.

    const isLeft = step === 0 || step === 2;
    // If isLeft, startX = 0.
    // If !isLeft, startX = DRAG_RANGE.

    // Sync x with Step changes
    useEffect(() => {
        if (step === 0) x.set(0);
        if (step === 1) x.set(DRAG_RANGE);
        if (step === 2) x.set(0);
        if (step === 3) x.set(DRAG_RANGE);

        // Auto-focus logic
        if (step === 1 || step === 2) {
            setTimeout(() => inputRef.current?.focus(), 400);
        }
    }, [step, DRAG_RANGE]);

    // Drag Constraints
    // If Step 0: can drag 0 -> DRAG_RANGE.
    // If Step 1: can drag 0 <- DRAG_RANGE.
    // If Step 2: can drag 0 -> DRAG_RANGE.


    const handleDragEnd = (_: any, info: PanInfo) => {
        const currentX = x.get();
        const velocity = info.velocity.x;
        const threshold = DRAG_RANGE / 2;

        if (isLeft) {
            // Moving Right
            // Trigger if dragged past halfway OR flicked fast enough
            if (currentX > threshold || velocity > 200) {
                moveToNext();
            } else {
                snapBack();
            }
        } else {
            // Moving Left
            // Trigger if dragged past halfway (towards 0) OR flicked left
            if (currentX < threshold || velocity < -200) {
                moveToNext();
            } else {
                snapBack();
            }
        }
    };

    const moveToNext = async (e?: React.FormEvent) => {
        e?.preventDefault();

        // Validation check before moving (only for inputs)
        if (step === 1 && !email) { snapBack(); return; }
        if (step === 2 && !gymName) { snapBack(); return; }

        // Animate to Target
        const target = isLeft ? DRAG_RANGE : 0;

        await controls.start({
            x: target,
            transition: { type: "spring", stiffness: 300, damping: 28 }
        });

        // Update State
        if (step === 0) setStep(1);
        else if (step === 1) setStep(2);
        else if (step === 2) setStep(3);
    };

    const snapBack = () => {
        // Return to origin of current step
        const origin = isLeft ? 0 : DRAG_RANGE;
        controls.start({
            x: origin,
            transition: { type: "spring", stiffness: 400, damping: 25 }
        });
    };

    // Click handler for the container (when idle) or button (when input)
    // If Step 0, clicking container triggers slide.
    // If Step > 0, clipping the BUTTON triggers slide.
    const handleContainerClick = () => {
        if (step === 0) moveToNext();
    };

    return (
        <div className="relative w-full max-w-[420px] mt-8 z-30">
            {/* Box Container */}
            <div
                className="relative h-[60px] w-full rounded-full border border-blue-200/10 bg-[#07080C] overflow-hidden shadow-[0_0_20px_rgba(160,190,255,0.05)]"
                onClick={handleContainerClick}
                ref={containerRef}
            >
                {/* 
                  DRAGGABLE ARROW / WIPER
                */}
                <motion.div
                    className="absolute top-[6px] bottom-[6px] z-20 flex items-center justify-center rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 touch-none"
                    style={{
                        x,
                        width: BTN_SIZE,
                        height: BTN_SIZE,
                        left: PADDING // Base offset
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: DRAG_RANGE }}
                    dragElastic={0.05}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    onClick={(e) => {
                        e.stopPropagation();
                        // If it's a button (step > 0), click triggers move
                        // If step 0, container click handles it, but clicking arrow works too
                        moveToNext();
                    }}
                >
                    <AnimatePresence mode="wait">
                        {step === 3 ? (
                            <motion.svg key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>
                        ) : (
                            <motion.svg
                                key="arrow"
                                className="w-5 h-5"
                                fill="none" viewBox="0 0 24 24"
                                stroke="currentColor"
                                // Rotate arrow based on direction?
                                // If at Left (going Right) -> Point Right
                                // If at Right (going Left) -> Point Left
                                animate={{ rotate: isLeft ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* 
                  CONTENT LAYERS 
                  We need to animate content IN/OUT based on direction.
                  It's a bit tricky to "wipe" perfectly with the circle, but simple fade/slide works well.
                */}
                <div className="absolute inset-0 px-16 flex items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="text-white/80 font-medium text-sm whitespace-nowrap"
                            >
                                Click to book a demo
                            </motion.span>
                        )}
                        {step === 1 && (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                                className="w-full h-full flex items-center pointer-events-auto"
                            >
                                <input
                                    ref={inputRef}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    // Prevent dragging when interacting with input
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.key === 'Enter' && moveToNext()}
                                    placeholder="Enter your email"
                                    className="w-full bg-transparent border-none outline-none text-white text-center placeholder-white/30 text-sm h-full"
                                />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div
                                key="gym"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                                className="w-full h-full flex items-center pointer-events-auto"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={gymName}
                                    onChange={(e) => setGymName(e.target.value)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.key === 'Enter' && moveToNext()}
                                    placeholder="Gym Name"
                                    className="w-full bg-transparent border-none outline-none text-white text-center placeholder-white/30 text-sm h-full"
                                />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.span
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-green-400 font-medium text-sm ml-[-30px]" // Offset for button
                            >
                                Request Received
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SlideForm;
