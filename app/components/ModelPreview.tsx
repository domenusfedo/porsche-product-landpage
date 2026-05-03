'use client';

import { useState } from 'react';
import ThreeModelLazy from './three-js/ThreeModelLazy';

export default function ModelPreview() {
    const [isNight, setIsNight] = useState(false);

    return (
        <div className="w-full flex flex-col items-center justify-center py-10 space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black text-center">
                Touch the legend
            </h2>

            <div
                className="w-full rounded-2xl overflow-hidden relative transition-colors duration-250 ease-in-out"
                style={{
                    background: !isNight ? '#F3F4F6' : '#818181',
                    maxWidth: '1000px',
                    aspectRatio: '1 / 1'
                }}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <ThreeModelLazy isNight={isNight} setIsNight={setIsNight} />
                </div>

                <img
                    src="/icons/360-icon.svg"
                    alt="360 rotation"
                    className="absolute top-16 right-16 w-12 h-12 md:w-16 md:h-16 z-10 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                    style={{
                        filter: !isNight
                            ? 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) brightness(100%) contrast(100%)'
                            : 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) brightness(100%) contrast(100%)'
                    }}
                />
            </div>
        </div>
    );
}