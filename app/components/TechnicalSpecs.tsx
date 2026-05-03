'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
        const duration = 500;
        const startTime = performance.now();

        const targetAcceleration = 2.5;
        const targetPower = 523;
        const targetHp = 711;
        const targetSpeed = 322;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setCounters({
                acceleration: progress * targetAcceleration,
                power: Math.floor(progress * targetPower),
                hp: Math.floor(progress * targetHp),
                speed: Math.floor(progress * targetSpeed)
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div ref={sectionRef} className="w-full flex flex-col md:flex-row max-w-7xl mx-auto">
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 space-y-8">
                <div className="space-y-1">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-3xl md:text-4xl font-bold text-black">
                            {counters.acceleration.toFixed(1)}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-600">s</span>
                    </div>
                    <p className="text-xs text-gray-500">Acceleration 0-100 km/h</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-3xl md:text-4xl font-bold text-black">
                            {counters.power}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-600">kW /</span>
                        <span className="text-3xl md:text-4xl font-bold text-black">
                            {counters.hp}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-600">KM</span>
                    </div>
                    <p className="text-xs text-gray-500">Power (kW) / Power (HP)</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-3xl md:text-4xl font-bold text-black">
                            {counters.speed}
                        </span>
                        <span className="text-xl md:text-2xl font-medium text-gray-600">km/h</span>
                    </div>
                    <p className="text-xs text-gray-500">Maximum speed</p>
                </div>

                <button className="w-fit px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all duration-300">
                    Technical Specs
                </button>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                <div className="relative w-full h-[350px] md:h-[450px]">
                    <img
                        src="/product/back.png"
                        alt="Porsche back view"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}