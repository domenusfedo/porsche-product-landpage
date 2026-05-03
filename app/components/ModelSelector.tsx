'use client';

export default function ModelSelector() {
    const activeModel = 'Turbo Coupe';

    const models = ['Coupe', 'Turbo Coupe', 'GT'];

    return (
        <div className="w-full flex justify-center py-8">
            <div className="relative">
                <div className="flex gap-12">
                    {models.map((model) => (
                        <button
                            key={model}
                            className={`relative px-2 pb-4 text-base font-light tracking-wide transition-all duration-500 ${model === activeModel
                                ? 'text-black'
                                : 'text-gray-300 hover:text-gray-500'
                                }`}
                        >
                            {model}
                            {model === activeModel && (
                                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-black">
                                    <span className="absolute inset-0 bg-black scale-x-0 transition-transform duration-500 origin-left"></span>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}