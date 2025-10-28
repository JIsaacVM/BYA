// app/page.tsx
'use client';

// 1. 'Component' no se usaba, lo he eliminado.
import React, { useEffect, useRef } from 'react';
import InteractiveBg from './components/InteractiveBg';
import HeroSection from './components/HeroSection';
import ChatIntro from './components/ChatIntro';
import OurTeam from './components/OurTeam';
import Trayectoria from './components/Trayectoria';

export default function Page() {
  const orbRef = useRef<HTMLDivElement>(null);

  // Restaurar la posición de scroll al montar la página
  // La restauración/guardado de la posición se maneja globalmente por ScrollRestorer

  // Lógica del scroll (SIN CAMBIOS)
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(scrollY / (heroHeight * 0.7), 1);
      const active = progress > 0.1;
      document.body.classList.toggle('chat-active', active);
      const heroText = document.querySelector('#hero .hero-text-container') as HTMLElement;
      if (heroText) {
        heroText.style.opacity = `${1 - progress * 2}`;
      }
      const initialSize = 300;
      const finalSizeDesktop = 150;
      const currentSize = initialSize - (initialSize - finalSizeDesktop) * progress;
      const initialTop = 50;
      const finalTop = 50;
      const initialLeft = 50;
      const finalLeft = 15;
      const currentTop = initialTop - (initialTop - finalTop) * progress;
      const currentLeft = initialLeft - (initialLeft - finalLeft) * progress;
      orb.style.width = `${currentSize}px`;
      orb.style.height = `${currentSize}px`;
      orb.style.top = `${currentTop}%`;
      orb.style.left = `${currentLeft}%`;
      orb.style.transform = `translate(-50%, -50%)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    // Guardar la posición en sessionStorage cuando la página se descarga/oculta
    const savePosition = () => {
      try {
        const key = `scroll-pos:${location.pathname}`;
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        // noop
      }
    };

    // visibilitychange para capturar cambios de pestaña
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') savePosition();
    };

    window.addEventListener('beforeunload', savePosition);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', savePosition);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Evitar que al cargar la página con #conversar se haga scroll automático al chat.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && location.hash === '#conversar') {
        // Borrar el hash sin añadir entrada al history
        history.replaceState(null, '', location.pathname + location.search);
        // Forzar scroll al tope (Hero) para que la página comience ahí
        window.scrollTo({ top: 0, left: 0 });
      }
    } catch {
      // noop
    }
  }, []);

  return (
    <div className="font-roboto">
      <main>
        <div className=''>
          <div className="absolute inset-0 z-[-10] w-full h-screen flex items-center justify-center bg-[#07000D]">
            <InteractiveBg />
          </div>
          <HeroSection />
        </div>
        <ChatIntro />
        <OurTeam />
        <Trayectoria />
      </main >
    </div >
  );
}