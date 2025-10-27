// components/HeroSection.tsx
'use client';
import React from 'react';
import InteractiveOrb from './InteractiveOrb';
import TypewriterText from './TypewriterText';

export default function HeroSection() {
    return (
        <section id="hero" className="min-h-screen snap-start flex items-center mb-4">
            <div className="hero-text-container w-full h-fit px-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left">



                <div className="w-full md:w-1/3 flex flex-col justify-center items-center">
                    <InteractiveOrb />
                    <p className='mt-5 font-extrabold text-4xl'>
                        <TypewriterText
                            text={"BYA"}
                            isVisible={true}
                            speed={150}
                        />
                    </p>
                </div>


            </div>
        </section>
    );
}