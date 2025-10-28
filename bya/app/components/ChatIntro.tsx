"use client";
import React, { useState, useEffect, useRef } from "react";
import TypewriterText from "./TypewriterText"; // Importamos el componente de máquina de escribir

// --- Definimos la estructura de nuestros datos ---

interface Message {
    id: number;
    speaker: "user" | "bot";
    text: string;
}

interface ChatOption {
    text: string;
    responseText: string;
    followUpOptions?: ChatOption[];
}

// --- Constantes de Configuración ---
const TASA_TECLEO_BOT = 15; // ms por caracter (debe coincidir con TypewriterText)
const TASA_TECLEO_USER = 20; // ms por caracter (para simulación)
const TIEMPO_PENSAMIENTO_BOT = 1000; // 1 segundo

// --- Definimos el "ÁRBOL" de la conversación ---

const initialBotResponse = "Hola, yo soy BYA, Byte Assistant. Nos dedicamos a integración de Inteligencia Artificial en el mundo cotidiano, hacer hiperautomatización de tareas, procesos y sistemas, y mejorar la experiencia de usuario.";

const conversationTree: ChatOption[] = [
    {
        text: "Háblame de Hiperautomatización",
        responseText: "¡Claro! La hiperautomatización usa IA y RPA para automatizar procesos complejos de principio a fin, optimizando la eficiencia.",
        followUpOptions: [
            { text: "Suena interesante", responseText: "Lo es. ¿Puedo ayudarte con algo más?" },
            { text: "Gracias, es todo", responseText: "¡Un placer! Estamos para ayudarte." }
        ]
    },
    {
        text: "Quiero mejorar mi UX",
        responseText: "Perfecto. Analizamos el flujo de tus usuarios y aplicamos IA para personalizar su experiencia, reducir la fricción y aumentar la retención.",
        followUpOptions: [
            { text: "Ok, ¿cómo empezamos?", responseText: "Podemos agendar una demo. ¿Te parece?" },
        ]
    },
    {
        text: "Solo estoy mirando",
        responseText: "¡Sin problema! Explora con calma. Si tienes alguna duda, solo pregunta.",
        followUpOptions: [
            { text: "Gracias", responseText: "¡A ti!" },
        ]
    }
];

export default function ScrollingChatOneByOne() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);

    // (MEJORA 2) Estado para el fade-in del primer mensaje
    const [isFirstMessageVisible, setIsFirstMessageVisible] = useState(false);

    // --- (CAMBIO 1) ---
    // Ref para el contenedor principal del chat
    const chatContainerRef = useRef<HTMLElement>(null); // <-- AÑADIR LÍNEA
    // Ref para almacenar la función de limpieza activa y evitar timers duplicados
    const currentCleanupRef = useRef<(() => void) | undefined>(undefined);

    // --- LÓGICA DE LA CONVERSACIÓN ---

    /**
     * Inicia o reinicia la conversación al estado inicial.
     */
    // startConversation now accepts an optional parameter `scrollTo`.
    // If scrollTo is true, it will scroll the chat into view (used by the manual reset button).
    // When started by the IntersectionObserver we call with scrollTo=false to avoid double-scrolling.
    const startConversation = (scrollTo = false) => {
        // Limpiar cualquier timers activos previos para evitar duplicados
        if (currentCleanupRef.current) {
            try { currentCleanupRef.current(); } catch { /* noop */ }
            currentCleanupRef.current = undefined;
        }

        // --- (CAMBIO 2) ---
        if (scrollTo) chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 1. Resetear estados
        setMessages([]);
        setCurrentOptions([]);
        setIsBotTyping(true);
        setIsFirstMessageVisible(false); // (MEJORA 2) Resetear visibilidad

        // 2. Añadir el primer mensaje del usuario
        const firstUserMessage: Message = { id: 0, speaker: "user", text: "¿Qué es BYA?" };
        setMessages([firstUserMessage]);

        // (MEJORA 2) Timer para el fade-in
        const fadeInTimer = setTimeout(() => {
            setIsFirstMessageVisible(true);
        }, 50); // Pequeño delay para asegurar que el DOM se pinte con opacidad 0

        // 3. Simular tiempo de "escritura" y "pensamiento"
        const userTypingTime = firstUserMessage.text.length * TASA_TECLEO_USER;
        const botResponseTime = initialBotResponse.length * TASA_TECLEO_BOT;
        const totalDelay = userTypingTime + TIEMPO_PENSAMIENTO_BOT;

        // 4. Timer para AÑADIR el mensaje del bot
        const addBotMessageTimer = setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: 1, speaker: "bot", text: initialBotResponse }
            ]);
        }, totalDelay);

        // 5. Timer para MOSTRAR opciones (después de que el bot termine de escribir)
        const showOptionsTimer = setTimeout(() => {
            setCurrentOptions(conversationTree);
            setIsBotTyping(false);
        }, totalDelay + botResponseTime);

        // Devolvemos los timers para que puedan ser limpiados si el componente se desmonta
        const cleanup = () => {
            clearTimeout(fadeInTimer); // (MEJORA 2) Limpiar timer de fade-in
            clearTimeout(addBotMessageTimer);
            clearTimeout(showOptionsTimer);
        };

        // Guardar cleanup para uso inmediato (reset manual, etc.)
        currentCleanupRef.current = cleanup;
        return cleanup;
    };

    /**
     * Maneja la selección de una opción por el usuario.
     */
    const handleOptionClick = (option: ChatOption) => {
        if (isBotTyping) return; // Evitar clics múltiples

        // 1. Ocultar opciones y activar "escribiendo..."
        setCurrentOptions([]);
        setIsBotTyping(true);

        // 2. Añadir el mensaje del usuario
        const userMessage: Message = {
            id: messages.length,
            speaker: "user",
            text: option.text,
        };
        setMessages((prev) => [...prev, userMessage]);

        // 3. Simular tiempo de escritura y pensamiento
        const userTypingTime = option.text.length * TASA_TECLEO_USER;
        const botResponseTime = option.responseText.length * TASA_TECLEO_BOT;
        const totalDelay = userTypingTime + TIEMPO_PENSAMIENTO_BOT;

        // 4. Timer para AÑADIR el mensaje del bot
        const addBotMessageTimer = setTimeout(() => {
            const botMessage: Message = {
                id: messages.length + 1,
                speaker: "bot",
                text: option.responseText,
            };
            setMessages((prev) => [...prev, botMessage]);
        }, totalDelay);

        // 5. Timer para MOSTRAR opciones (después de que el bot termine de escribir)
        const showOptionsTimer = setTimeout(() => {
            setCurrentOptions(option.followUpOptions || []);
            setIsBotTyping(false); // Desbloquear
        }, totalDelay + botResponseTime);

        // Devolvemos una función de limpieza por si acaso
        return () => {
            clearTimeout(addBotMessageTimer);
            clearTimeout(showOptionsTimer);
        };
    };

    // --- EFECTOS ---

    // EFECTO 1: Iniciar conversación solamente cuando el componente entre en pantalla
    useEffect(() => {
        const el = chatContainerRef.current;
        if (!el) return;

        let cleanupFn: (() => void) | undefined;

        if (typeof IntersectionObserver === 'undefined') {
            // Fallback: si no hay IntersectionObserver, usar un comprobador por scroll/resize
            const checkAndStart = () => {
                try {
                    const rect = el.getBoundingClientRect();
                    const vh = window.innerHeight || document.documentElement.clientHeight;
                    const visible = rect.top < vh * 0.75 && rect.bottom > vh * 0.05;
                    if (visible && !cleanupFn) {
                        cleanupFn = startConversation(false);
                        // una vez iniciado, ya no necesitamos los listeners
                        window.removeEventListener('scroll', checkAndStart);
                        window.removeEventListener('resize', checkAndStart);
                    }
                } catch {
                    // noop
                }
            };

            window.addEventListener('scroll', checkAndStart, { passive: true });
            window.addEventListener('resize', checkAndStart);
            checkAndStart();

            return () => {
                window.removeEventListener('scroll', checkAndStart);
                window.removeEventListener('resize', checkAndStart);
                if (cleanupFn) cleanupFn();
            };
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !cleanupFn) {

                    cleanupFn = startConversation(false);
                    try { observer.disconnect(); } catch { /* noop */ }
                }
            });
        }, { threshold: 0.25 });

        observer.observe(el);

        return () => {
            observer.disconnect();
            if (cleanupFn) cleanupFn();
        };
    }, []);
    useEffect(() => {
        // ... (todo tu código original del useEffect del 'ia-orb' y 'ia-flare') ...
        const ORB_SIZE = 140; const halfW = ORB_SIZE / 2; const halfH = ORB_SIZE / 2;
        let orbEl: HTMLElement | null = null; let lastX = 0, lastY = 0, targetX = 0, targetY = 0;
        let rafId: number | null = null, intervalId: number | null = null;
        const initOrb = () => {
            orbEl = document.getElementById('ia-orb'); if (!orbEl) return;
            orbEl.style.width = `${ORB_SIZE}px`; orbEl.style.height = `${ORB_SIZE}px`;
            const loop = () => {
                if (!orbEl) return; lastX += (targetX - lastX) * 0.14; lastY += (targetY - lastY) * 0.14;
                const dx = targetX - lastX, dy = targetY - lastY; const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.45;
                const proximity = Math.max(0, 1 - Math.min(dist / maxDist, 1));
                const scale = 1 + proximity * 0.22; const blur = Math.max(6, 32 - proximity * 18);
                const opacity = 0.45 + proximity * 0.4;
                const translateX = Math.round(lastX - halfW); const translateY = Math.round(lastY - halfH);
                orbEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
                orbEl.style.filter = `blur(${blur}px) saturate(${1 + proximity * 0.08})`;
                orbEl.style.opacity = `${opacity}`; rafId = requestAnimationFrame(loop);
            };
            if (rafId == null) rafId = requestAnimationFrame(loop);
        };
        const onMove = (e: PointerEvent) => {
            const vw = window.innerWidth, vh = window.innerHeight;
            targetX = Math.min(vw * 0.95, Math.max(vw * 0.05, e.clientX + vw * 0.04));
            targetY = Math.min(vh * 0.95, Math.max(vh * 0.05, e.clientY - vh * 0.08));
            if (!orbEl) initOrb();
        };
        const spawnFlare = () => {
            const container = document.getElementById('ia-flare'); if (!container) return;
            const flare = document.createElement('div'); flare.className = 'ia-flare-item';
            const top = Math.random() * 40 + 6; flare.style.position = 'absolute'; flare.style.top = `${top}vh`;
            flare.style.left = '0px'; flare.style.width = '1px'; flare.style.height = '1px';
            flare.style.background = 'white'; flare.style.borderRadius = '50%';
            flare.style.boxShadow = '0 0 4px 0 rgba(255,255,255,0.8), 0 0 1px 0 rgba(255,255,255,0.5)';
            flare.style.pointerEvents = 'none'; flare.style.willChange = 'transform, opacity';
            const startLeftVW = -20 + Math.random() * 10;
            flare.style.transform = `translate3d(${startLeftVW}vw, 0, 0)`;
            const duration = 900 + Math.random() * 900;
            flare.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.2,1), opacity ${duration}ms linear`;
            container.appendChild(flare);
            requestAnimationFrame(() => {
                flare.style.transform = `translate3d(${startLeftVW + 120}vw, 0, 0)`;
                flare.style.opacity = '0';
            });
            setTimeout(() => { flare.remove(); }, duration + 250);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        intervalId = window.setInterval(() => { if (Math.random() < 0.35) spawnFlare(); }, 2400 + Math.random() * 2000);
        initOrb();
        return () => {
            window.removeEventListener('pointermove', onMove);
            if (rafId != null) cancelAnimationFrame(rafId);
            if (intervalId != null) clearInterval(intervalId);
        };
    }, []);


    return (
        <main id="conversar" className="text-white min-h-screen font-sans flex flex-col">


            <section
                ref={chatContainerRef}
                aria-label="Conversación interactiva"
                className="w-full max-w-2xl mx-auto px-4 pt-24 pb-8 flex flex-col flex-grow"
            >

                <div
                    className="space-y-12 pr-2"
                >
                    {messages.map((message) => {
                        const isUser = message.speaker === "user";

                        return (
                            <div
                                key={message.id}

                                className={`
                                    flex items-start gap-3
                                    ${isUser ? "justify-end" : "justify-start"}
                                    ${message.id === 0 ? 'transition-opacity duration-700 ease-in' : ''}
                                    ${message.id === 0 && !isFirstMessageVisible ? 'opacity-0' : 'opacity-100'}
                                `}
                            >
                                {/* Avatar del Bot */}
                                {!isUser && (
                                    <div className="flex-shrink-0 mt-1">
                                        {/* (tu avatar de bot) */}
                                    </div>
                                )}

                                {/* Contenedor del Mensaje */}
                                <div className={`
                                    max-w-md px-4 py-3 rounded-2xl shadow-lg
                                    ${isUser ? "bg-[#0210a1]   text-gray-200  rounded-tr-none" : "rounded-none backdrop-blur-sm text-gray-300 "}
                                `}
                                >
                                    <div className="text-base md:text-lg leading-relaxed">
                                        <TypewriterText
                                            text={message.text}
                                            isVisible={true}
                                            speed={TASA_TECLEO_BOT}
                                        />
                                    </div>
                                </div>

                                {/* Avatar del Usuario */}
                                {isUser && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-9 h-9 rounded-full bg-[#0210a1] flex items-center justify-center text-sm font-bold shadow-lg">
                                            U
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* (MEJORA 1) Elemento invisible ELIMINADO */}
                    {/* <div ref={chatEndRef} /> */}
                </div>

                {/* Contenedor de Opciones (sin cambios) */}
                <div className="flex-shrink-0 pt-6">
                    {/* Indicador de "escribiendo..." */}
                    {isBotTyping && messages.length > 0 && (
                        <div className="text-gray-400 text-sm italic h-6 text-left mb-2 animate-pulse">
                            ...
                        </div>
                    )}
                    {/* Espacio reservado para el indicador */}
                    {!isBotTyping && messages.length > 0 && (
                        <div className="h-6 mb-2" />
                    )}

                    {/* Botones de Opciones */}
                    <div className="flex flex-wrap justify-end gap-3">
                        {currentOptions.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                disabled={isBotTyping}
                                className="
                                    bg-[#0210a1] backdrop-blur-sm text-gray-200
                                    px-4 py-2 rounded-lg
                                    
                                    transition-all duration-200
                                    hover:bg-indigo-500/90
                                    disabled:opacity-30 disabled:cursor-not-allowed
                                "
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>

                    {/* Botón de Reseteo */}
                    {!isBotTyping && currentOptions.length === 0 && messages.length > 1 && (
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => startConversation(true)} // Llama a la función de reseteo y hace scroll
                                className="
                                    bg-gray-700/50 backdrop-blur-sm text-gray-300
                                    px-4 py-2 rounded-lg
                                    border border-gray-600
                                    transition-all duration-200
                                    hover:bg-gray-600/90
                                "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>

                            </button>
                        </div>
                    )}

                </div>

                <div className="flex p-4 bg-black/2 rounded-lg  items-center gap-2">
                    <input disabled
                        type="text" className="  w-full border-2 border-stone-500 rounded-lg p-2" placeholder="Escribe aquí..." />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-stone-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>

                </div>

            </section>
        </main>
    );
}