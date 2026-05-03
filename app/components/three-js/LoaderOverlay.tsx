'use client';

export default function LoaderOverlay() {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-4">

                <div className="w-12 h-12 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                <div className="text-black text-2xl md:text-3xl font-light tracking-[0.2em] uppercase animate-pulse">
                    fueling your dream…
                </div>

            </div>
        </div>
    );
}