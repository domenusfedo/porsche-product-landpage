'use client';

import { lazy, Suspense, useState } from 'react';

const ThreeModelCore = lazy(() => import('./ThreeModelCore'));

interface ThreeModelProps {
    isNight: boolean;
    setIsNight: (value: boolean) => void;
}

const LoadingFallback = () => (
    <div className="relative w-full flex justify-center items-center">
        <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
            <div className="w-full h-full relative bg-gradient-to-br from-gray-900/20 to-gray-800/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Loading 3D Model...</p>
                </div>
            </div>
        </div>
    </div>
);

export default function ThreeModelLazy(props: ThreeModelProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="relative w-full flex justify-center items-center">
                <div className="relative w-full max-w-[1000px]">
                    <div className="w-full aspect-square relative bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-600 dark:text-red-400 text-sm">
                                Failed to load 3D model
                            </p>
                            <button
                                onClick={() => {
                                    setHasError(false);
                                    window.location.reload();
                                }}
                                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<LoadingFallback />}>
            <ThreeModelCore
                {...props}
                onError={() => setHasError(true)}
            />
        </Suspense>
    );
}