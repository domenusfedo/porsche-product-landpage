'use client';

import { useState, useEffect, useRef } from 'react';

export default function TechnicalSpecs() {
    const [counters, setCounters] = useState({
        acceleration: 0,
        power: 0,
        hp: 0,
        speed: 0
    });
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        startAnimation();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [hasAnimated]);

    const startAnimation = () => {
        const duration = 1500;
        const startTime = performance.now();

        const targets = {
            acceleration: 2.5,
            power: 523,
            hp: 711,
            speed: 322
        };

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setCounters({
                acceleration: progress * targets.acceleration,
                power: Math.floor(progress * targets.power),
                hp: Math.floor(progress * targets.hp),
                speed: Math.floor(progress * targets.speed)
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div ref={sectionRef} className="w-full flex flex-col md:flex-row max-w-7xl mx-auto min-h-[500px]">
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 space-y-12">

                <div className="space-y-1">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-4xl md:text-6xl font-bold text-black tabular-nums">
                            {counters.acceleration.toFixed(1)}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-500">s</span>
                    </div>
                    <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
                        Acceleration 0-100 km/h
                    </p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-4xl md:text-6xl font-bold text-black tabular-nums">
                            {counters.power}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-500">kW /</span>
                        <span className="text-4xl md:text-6xl font-bold text-black tabular-nums">
                            {counters.hp}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-500">KM</span>
                    </div>
                    <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
                        Power output
                    </p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-4xl md:text-6xl font-bold text-black tabular-nums">
                            {counters.speed}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-500">km/h</span>
                    </div>
                    <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
                        Top speed
                    </p>
                </div>

                <button className="w-fit px-8 py-3 bg-black text-white text-xs uppercase tracking-widest font-bold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                    Technical Specs
                </button>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                <div className="relative w-full h-[300px] md:h-[500px]">
                    <img
                        src="/product/back.png"
                        alt="Porsche 911 GT3 RS"
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
}