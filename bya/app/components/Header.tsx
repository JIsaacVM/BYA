// components/Header.tsx
'use client';
import React, { useEffect } from 'react';

export default function Header() {
    useEffect(() => {
        const navLinks = document.querySelectorAll('.nav-link');

        const handleClick = (e: Event) => {
            e.preventDefault();
            const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
            if (!targetId) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        navLinks.forEach(link => link.addEventListener('click', handleClick));

        return () => {
            navLinks.forEach(link => link.removeEventListener('click', handleClick));
        };
    }, []);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <nav className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-lg">
                <ul className="flex items-center justify-center gap-6 px-8 py-3 text-sm font-light">
                    <li><a href="#hero" className="nav-link hover:text-blue-400 transition-colors">Inicio</a></li>
                    <li><a href="#conversar" className="nav-link hover:text-blue-400 transition-colors">Conversar</a></li>
                    <li><a href="#" className="nav-link hover:text-blue-400 transition-colors">Proyecto</a></li>
                </ul>
            </nav>
        </header>
    );
}