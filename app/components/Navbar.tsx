'use client';

import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm h-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">

                        <div className="flex-shrink-0 h-full flex items-center">
                            <img
                                src="/porsche-1-logo-black-and-white.png"
                                alt="Porsche logo"
                                className="h-full w-auto object-contain"
                            />
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <a href="#" className="text-black hover:text-gray-600 transition">Models</a>
                            <a href="#" className="text-black hover:text-gray-600 transition">Configurator</a>
                            <a href="#" className="text-black hover:text-gray-600 transition">Service</a>
                            <a href="#" className="text-black hover:text-gray-600 transition">Contact</a>
                        </div>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center group"
                        >
                            <div className="relative w-6 h-5">
                                <span className={`absolute w-6 h-0.5 bg-black rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 top-2' : 'top-0'
                                    }`}></span>
                                <span className={`absolute w-6 h-0.5 bg-black rounded-full transition-all duration-300 top-2 ${isOpen ? 'opacity-0' : ''
                                    }`}></span>
                                <span className={`absolute w-6 h-0.5 bg-black rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 top-2' : 'top-4'
                                    }`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className={`md:hidden transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-md shadow-lg ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-4 pt-2 pb-6 space-y-3">
                        <a href="#" className="block text-black hover:text-gray-600 py-2 transition">Models</a>
                        <a href="#" className="block text-black hover:text-gray-600 py-2 transition">Configurator</a>
                        <a href="#" className="block text-black hover:text-gray-600 py-2 transition">Service</a>
                        <a href="#" className="block text-black hover:text-gray-600 py-2 transition">Contact</a>
                    </div>
                </div>
            </nav>
        </>
    );
}