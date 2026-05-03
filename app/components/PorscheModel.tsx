'use client';

import { useState, useEffect, useRef } from 'react';

export default function PorscheModel() {
    const [imageIndex, setImageIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const photosToShow = [0, 1, 2, 4, 6, 8, 11, 14, 16, 18, 19, 22, 24, 26, 28, 30, 33, 34, 36, 38, 40, 41, 44, 46, 48, 50, 52, 55, 56, 58, 60];

    const images = photosToShow.map((i) => {
        const num = i.toString().padStart(4, '0');
        return `/porsche-static-model-2/model_${num}.png`;
    });

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            setIsMobile(isMobileDevice);

            if (isMobileDevice) {
                setImageIndex(images.length - 1);
                setHasCompleted(true);
            }
        };

        checkMobile();
    }, [images.length]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsReady(true);
        }
    }, []);

    useEffect(() => {
        if (!isReady || hasCompleted || isMobile) return;

        const handleWheel = (e: WheelEvent) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

            if (isInView && imageIndex < images.length - 1) {
                if (e.deltaY > 0) {
                    e.preventDefault();
                    setImageIndex(prev => Math.min(prev + 1, images.length - 1));
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => window.removeEventListener('wheel', handleWheel);
    }, [isReady, hasCompleted, imageIndex, images.length, isMobile]);

    useEffect(() => {
        if (imageIndex === images.length - 1) {
            setHasCompleted(true);
        }
    }, [imageIndex, images.length]);

    const getHeight = () => {
        if (windowWidth < 640) return '250px';
        if (windowWidth < 768) return '300px';
        return '400px';
    };

    const getOffset = () => {
        if (windowWidth < 640) return '60px';
        if (windowWidth < 768) return '70px';
        return '80px';
    };

    const getFontSize = () => {
        if (windowWidth < 640) return '60px';
        if (windowWidth < 768) return '100px';
        if (windowWidth < 1024) return '140px';
        return '220px';
    };

    if (!isReady) {
        return (
            <div ref={containerRef} className="w-full flex flex-col items-center justify-start relative">
                <div className="w-full h-[400px] relative overflow-visible" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 80px, #0D0D0D 80px, #161619 66%, #27272A 100%)' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-bold text-white/5 select-none text-[120px] md:text-[180px] lg:text-[220px]">911</span>
                    </div>
                </div>
                <div className="w-full h-[50px] bg-transparent"></div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full flex flex-col items-center justify-start relative">
            <div
                className="w-full relative overflow-visible"
                style={{
                    height: getHeight(),
                    background: `linear-gradient(180deg, #FFFFFF 0%, #FFFFFF ${getOffset()}, #0D0D0D ${getOffset()}, #161619 66%, #27272A 100%)`
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className="font-bold text-white/5 select-none"
                        style={{ fontSize: getFontSize() }}
                    >
                        911
                    </span>
                </div>

                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        transform: `translateY(${getOffset()})`,
                        bottom: `-${getOffset()}`,
                        zIndex: 2
                    }}
                >
                    <img
                        src={images[imageIndex]}
                        alt="Porsche 911 model"
                        className="w-full h-full object-contain"
                        draggable={false}
                    />
                </div>
            </div>
            <div className="w-full h-[50px] bg-transparent"></div>
        </div>
    );
}