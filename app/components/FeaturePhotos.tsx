'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TwoStackedPhotoProps {
    title: string;
    description?: string;
    imageLeft: string;
    imageRight: string;
    altLeft?: string;
    altRight?: string;
    reverse?: boolean;
}

interface OneBigPhotoProps {
    title?: string;
    description?: string;
    image: string;
    alt?: string;
    imagePosition?: 'top' | 'bottom';
}

export function TwoStackedPhoto({
    title,
    description,
    imageLeft,
    imageRight,
    altLeft = "Image left",
    altRight = "Image right",
    reverse = false
}: TwoStackedPhotoProps) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">{title}</h3>
                {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
            </div>

            <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8`}>
                <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                        <img
                            src={imageLeft}
                            alt={altLeft}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                        <img
                            src={imageRight}
                            alt={altRight}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function OneBigPhoto({
    title,
    description,
    image,
    alt = "Image",
    imagePosition = "bottom"
}: OneBigPhotoProps) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-10">
            <div className={`flex flex-col ${imagePosition === 'top' ? 'space-y-8' : 'space-y-8'}`}>
                {imagePosition === 'top' && (
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                        <img
                            src={image}
                            alt={alt}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {title && <div className={`text-center ${imagePosition === 'top' ? 'mt-8' : 'mb-8'}`}>
                    <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">{title}</h3>
                    {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
                </div>}



                {imagePosition === 'bottom' && (
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                        <img
                            src={image}
                            alt={alt}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}