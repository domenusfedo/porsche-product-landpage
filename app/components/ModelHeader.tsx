'use client';

export default function ModelHeader() {
    return (
        <div className="w-full flex flex-col items-center justify-center space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-black">
                911 Turbo S
            </h1>

            <div className="flex gap-4">
                <div className="px-6 py-2 text-sm font-semibold" style={{ backgroundColor: '#EFFCEE', color: '#1A1A1A' }}>
                    New
                </div>
                <div className="px-6 py-2 text-sm font-semibold" style={{ backgroundColor: '#EEEFF2', color: '#1A1A1A' }}>
                    Gasoline
                </div>
            </div>

            <span className={`relative px-2 pb-4 text-center font-light tracking-wide transition-all duration-500 text-gray-600`}>Combined fuel consumption (for the model range): 10.4 – 9.9 l/100 km, Combined CO₂ emissions (for the model range): 237 – 226 g/km</span>
        </div>
    );
}