// components/HeroSection.tsx
'use client';
import React from 'react';
import InteractiveOrb from './InteractiveOrb';

export default function HeroSection() {
    return (
        <section id="hero" className="min-h-screen snap-start flex items-center">
            <div className="hero-text-container w-full h-fit px-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left">
                <div className="w-full md:w-1/3 text-center md:text-right md:pr-12 lg:pr-24 mb-4 md:mb-0">
                    <h2 className="font-mono text-xl md:text-6xl text-blue-400">Hola</h2>
                    <p className="font-roboto text-lg md:text-4xl font-light">Bienvenido a</p>
                </div>

                {/* Center column: orb */}
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <InteractiveOrb />
                </div>

                {/* Right column */}
                <div className="w-full md:w-1/3 text-center md:text-left md:pl-12 lg:pl-24 mt-4 md:mt-0">
                    <h1 className="font-playfair text-4xl md:text-8xl font-extrabold">BYA</h1>
                    <p className="font-roboto text-base md:text-lg font-light mt-2">Interactúa para descubrir.</p>
                </div>
            </div>
        </section>
    );
}