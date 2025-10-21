// app/page.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ChatIntro from './components/ChatIntro';

export default function Page() {
  const orbRef = useRef<HTMLDivElement>(null);
  // Lógica para la transición suave del orbe con el scroll
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      // El progreso va de 0 (top) a 1 (inicio de la sección de chat)
      const progress = Math.min(scrollY / (heroHeight * 0.7), 1);

      // -- Actualizar Body Class --
      // Activa el modo chat un poco antes de llegar para que la transición sea suave
      const active = progress > 0.1;
      document.body.classList.toggle('chat-active', active);
      const heroText = document.querySelector('#hero .hero-text-container') as HTMLElement;
      if (heroText) {
        heroText.style.opacity = `${1 - progress * 2}`;
      }

      // -- Interpolar propiedades del Orbe --
      // Tamaños (de grande a pequeño)
      const initialSize = 300;
      const finalSizeDesktop = 150;
      const currentSize = initialSize - (initialSize - finalSizeDesktop) * progress;

      // Posiciones (de centro a la izquierda)
      const initialTop = 50; // 50%
      const finalTop = 50; // 50%
      const initialLeft = 50; // 50%
      const finalLeft = 15; // 15%
      const currentTop = initialTop - (initialTop - finalTop) * progress;
      const currentLeft = initialLeft - (initialLeft - finalLeft) * progress;

      // Aplicar estilos directamente para una animación fluida con el scroll
      orb.style.width = `${currentSize}px`;
      orb.style.height = `${currentSize}px`;
      orb.style.top = `${currentTop}%`;
      orb.style.left = `${currentLeft}%`;
      orb.style.transform = `translate(-50%, -50%)`; // Mantenemos solo la corrección del centrado
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecutar una vez al inicio

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-roboto">
      <Header />
      <main>
        <HeroSection />
        <ChatIntro />

      </main>
    </div>
  );
}