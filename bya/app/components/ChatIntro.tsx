"use client";
import React, { useState, useEffect, useRef } from "react";

// El guion de la conversación no cambia
const conversationScript = [
    { speaker: "bot", text: "Hola, soy BYA." },
    { speaker: "user", text: "¿Qué es BYA?" },
    { speaker: "bot", text: "BYA es una solución integral para tus necesidades." },
    { speaker: "bot", text: "Nos dedicamos a crear experiencias digitales únicas y memorables." },
    { speaker: "bot", text: "Hacemos desarrollo web, marketing digital y consultoría estratégica." },
    { speaker: "user", text: "Interesante, ¿cómo puedo saber más?" },
    { speaker: "bot", text: "¿Te gustaría que agendemos una llamada para explorar cómo podemos ayudarte?" },
];


/**
 * Componente que revela una conversación uno por uno a medida que el usuario
 * hace scroll, con animaciones mejoradas.
 */
export default function ScrollingChatOneByOne() {
    // Empezamos con 1 mensaje visible para que el primero se muestre al inicio.
    const [visibleMessagesCount, setVisibleMessagesCount] = useState(1);
    const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const chatContainerRef = useRef<HTMLElement | null>(null);

    // Not auto-scrolling on mount to avoid unexpected jumps; visibility
    // of messages is handled by the IntersectionObserver below.


    // Efecto: mostrar/ocultar mensajes según la dirección del scroll
    // Strategy: en cada scroll (throttled con rAF) contamos cuántos mensajes
    // tienen su top por debajo de un umbral relativo a la ventana. Ese número
    // será el visibleMessagesCount. Al hacer scroll-down el conteo sube (muestra)
    // y al hacer scroll-up baja (oculta).
    useEffect(() => {
        const updateVisible = () => {
            if (!messageRefs.current || messageRefs.current.length === 0) return;

            const threshold = window.innerHeight * 0.8; // elemento considerado visible si su top < threshold
            let count = 0;

            for (let i = 0; i < conversationScript.length; i++) {
                const el = messageRefs.current[i];
                if (!el) break;
                const rect = el.getBoundingClientRect();
                if (rect.top < threshold) {
                    count = i + 1; // i es 0-based
                } else {
                    // si un elemento no cumple, los siguientes probablemente tampoco
                    break;
                }
            }

            // Always keep at least the first message visible
            count = Math.max(1, count);
            setVisibleMessagesCount((prev) => {
                if (prev === count) return prev;
                return count;
            });
        };

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(() => {
                    updateVisible();
                    ticking = false;
                });
            }
        };

        // initial measure (in case the page is loaded scrolled)
        updateVisible();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    // Interactive background (non-interfering): orb + occasional flares
    useEffect(() => {
        // constants
        const ORB_SIZE = 140;
        const halfW = ORB_SIZE / 2;
        const halfH = ORB_SIZE / 2;

        let orbEl: HTMLElement | null = null;
        let lastX = 0;
        let lastY = 0;
        let targetX = 0;
        let targetY = 0;
        let rafId: number | null = null;
        let intervalId: number | null = null;

        const initOrb = () => {
            orbEl = document.getElementById('ia-orb');
            if (!orbEl) return;
            orbEl.style.width = `${ORB_SIZE}px`;
            orbEl.style.height = `${ORB_SIZE}px`;
            orbEl.style.position = 'fixed';
            orbEl.style.left = '0px';
            orbEl.style.top = '0px';
            orbEl.style.pointerEvents = 'none';
            orbEl.style.willChange = 'transform, opacity, filter';

            const loop = () => {
                if (!orbEl) return;
                lastX += (targetX - lastX) * 0.14;
                lastY += (targetY - lastY) * 0.14;
                const dx = targetX - lastX;
                const dy = targetY - lastY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.45;
                const proximity = Math.max(0, 1 - Math.min(dist / maxDist, 1));

                const scale = 1 + proximity * 0.22;
                const blur = Math.max(6, 32 - proximity * 18); // keep blur moderate
                const opacity = 0.45 + proximity * 0.4;

                const translateX = Math.round(lastX - halfW);
                const translateY = Math.round(lastY - halfH);
                orbEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
                orbEl.style.filter = `blur(${blur}px) saturate(${1 + proximity * 0.08})`;
                orbEl.style.opacity = `${opacity}`;

                rafId = requestAnimationFrame(loop);
            };

            if (rafId == null) rafId = requestAnimationFrame(loop);
        };

        const onMove = (e: PointerEvent) => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            targetX = Math.min(vw * 0.95, Math.max(vw * 0.05, e.clientX + vw * 0.04));
            targetY = Math.min(vh * 0.95, Math.max(vh * 0.05, e.clientY - vh * 0.08));
            if (!orbEl) initOrb();
        };

        const spawnFlare = () => {
            const container = document.getElementById('ia-flare');
            if (!container) return;
            const flare = document.createElement('div');
            flare.className = 'ia-flare-item';
            const top = Math.random() * 40 + 6; // 6% - 46%
            flare.style.position = 'absolute';
            flare.style.top = `${top}vh`;
            flare.style.left = '0px';
            flare.style.pointerEvents = 'none';
            flare.style.willChange = 'transform, opacity';
            const startLeftVW = -20 + Math.random() * 10;
            flare.style.transform = `translate3d(${startLeftVW}vw, 0, 0)`;
            const duration = 900 + Math.random() * 900;
            flare.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.2,1), opacity ${duration}ms linear`;
            container.appendChild(flare);
            // trigger move (to the right) and fade
            requestAnimationFrame(() => {
                flare.style.transform = `translate3d(${startLeftVW + 120}vw, 0, 0)`;
                flare.style.opacity = '0';
            });
            setTimeout(() => { flare.remove(); }, duration + 250);
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        // occasional flares
        intervalId = window.setInterval(() => { if (Math.random() < 0.35) spawnFlare(); }, 2400 + Math.random() * 2000);
        // init once
        initOrb();

        return () => {
            window.removeEventListener('pointermove', onMove);
            if (rafId != null) cancelAnimationFrame(rafId);
            if (intervalId != null) clearInterval(intervalId);
        };
    }, []);

    return (
        <main id="conversar" className=" text-white min-h-screen font-sans flex flex-col justify-center">
            {/* Interactive background - non-interfering */}
            <div className="ia-bg" aria-hidden="true">
                <div className="ia-bg-content">

                </div>
            </div>
            <section
                ref={chatContainerRef}
                aria-label="Conversación automática"
                className="w-full max-w-2xl mx-auto py-24 px-4"
                // Añadimos altura mínima para garantizar que haya espacio para el scroll
                style={{ minHeight: "150vh" }}
            >
                <div className="space-y-12">
                    {conversationScript.map((message, index) => {
                        const isUser = message.speaker === "user";
                        const isVisible = index < visibleMessagesCount;

                        return (
                            <div
                                key={index}
                                ref={(el) => { messageRefs.current[index] = el; }}
                                className={`
                                    flex items-start gap-3
                                    ${isUser ? "justify-end" : "justify-start"}
                                    transition-all duration-500 ease-out
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                                `}
                            >
                                {/* Avatar del Bot */}
                                {!isUser && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="bot-orb w-9 h-9 flex items-center justify-center shadow-lg">
                                            <span className="eye left-eye" aria-hidden="true"></span>
                                            <span className="eye right-eye" aria-hidden="true"></span>
                                        </div>
                                    </div>
                                )}

                                {/* Contenedor del Mensaje */}
                                <div className={`
                                    max-w-md
                                    px-4 py-3
                                    rounded-2xl
                                    shadow-lg
                                    ${isUser ? "bg-indigo-600/80 backdrop-blur-sm text-white rounded-br-none" : "bg-gray-700/80 backdrop-blur-sm text-gray-200 rounded-bl-none"}
                                `}
                                    aria-hidden={!isVisible}
                                >
                                    <div className="text-base md:text-lg leading-relaxed">
                                        {message.text}
                                    </div>
                                </div>

                                {/* Avatar del Usuario */}
                                {isUser && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold shadow-lg">
                                            U
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}


