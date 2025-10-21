// components/InteractiveOrb.tsx
'use client';

import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';

interface InteractiveOrbProps {
    size?: number; // px (ancho/alto) - usado por estilos si se necesita
    tickleDuration?: number; // ms
    followCursor?: boolean; // si los ojos siguen el cursor
    onInteract?: () => void; // callback cuando se interactúa
}

export interface InteractiveOrbHandle {
    triggerTickle: () => void;
}

const InteractiveOrb = forwardRef<InteractiveOrbHandle, InteractiveOrbProps>(
    ({ size = 300, tickleDuration = 500, followCursor = true, onInteract }, ref: React.Ref<InteractiveOrbHandle>) => {
        const localRef = useRef<HTMLDivElement | null>(null);
        const tickleTimeoutRef = useRef<number | null>(null);

        // Exponer métodos al ref externo
        useImperativeHandle(ref, () => ({
            triggerTickle: () => {
                const orb = localRef.current;
                if (!orb) return;
                if (orb.classList.contains('tickle')) return;
                // clear any existing timeout before starting a new one
                if (tickleTimeoutRef.current !== null) {
                    window.clearTimeout(tickleTimeoutRef.current);
                    tickleTimeoutRef.current = null;
                }
                orb.classList.add('tickle', 'laugh');
                tickleTimeoutRef.current = window.setTimeout(() => {
                    orb.classList.remove('tickle', 'laugh');
                    tickleTimeoutRef.current = null;
                }, tickleDuration);
            },
        }));

        useEffect(() => {
            const orb = localRef.current;
            if (!orb) return;

            const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            const handleOrbInteraction = () => {
                if (orb.classList.contains('tickle')) return;
                // clear any existing timeout before starting a new one
                if (tickleTimeoutRef.current !== null) {
                    window.clearTimeout(tickleTimeoutRef.current);
                    tickleTimeoutRef.current = null;
                }
                orb.classList.add('tickle', 'laugh');
                if (onInteract) onInteract();
                tickleTimeoutRef.current = window.setTimeout(() => {
                    orb.classList.remove('tickle', 'laugh');
                    tickleTimeoutRef.current = null;
                }, tickleDuration);
            };

            const onOrbKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOrbInteraction();
                }
            };

            // Ojos que siguen al cursor: solo si está activado y no se pidió reducir movimiento
            let onPointerMove: ((e: PointerEvent) => void) | null = null;
            if (followCursor && !prefersReduced) {
                onPointerMove = (event: PointerEvent) => {
                    const eyes = orb.querySelectorAll('.eye');
                    const orbRect = orb.getBoundingClientRect();
                    const orbCenterX = orbRect.left + orbRect.width / 2;
                    const orbCenterY = orbRect.top + orbRect.height / 2;
                    const angle = Math.atan2(event.clientY - orbCenterY, event.clientX - orbCenterX);
                    const maxEyeDistance = orbRect.width / 7;

                    eyes.forEach((eye) => {
                        const x = Math.cos(angle) * maxEyeDistance;
                        const y = Math.sin(angle) * maxEyeDistance;
                        (eye as HTMLElement).style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                    });
                };
                window.addEventListener('pointermove', onPointerMove as EventListener);
            }

            orb.addEventListener('click', handleOrbInteraction);
            orb.addEventListener('keydown', onOrbKeyDown);

            // Cleanup
            return () => {
                orb.removeEventListener('click', handleOrbInteraction);
                orb.removeEventListener('keydown', onOrbKeyDown);
                if (onPointerMove) window.removeEventListener('pointermove', onPointerMove as EventListener);
                if (tickleTimeoutRef.current !== null) {
                    window.clearTimeout(tickleTimeoutRef.current);
                    tickleTimeoutRef.current = null;
                }
            };
        }, [followCursor, tickleDuration, onInteract]);

        return (
            <div
                ref={localRef}
                id="character-orb"
                role="button"
                tabIndex={0}
                aria-label="Personaje interactivo, haz clic o pulsa Enter para interactuar"
                style={{ width: size, height: size }}
            >
                <div id="eye-left" className="eye" aria-hidden="true"></div>
                <div id="eye-right" className="eye" aria-hidden="true"></div>
            </div>
        );
    }
);

InteractiveOrb.displayName = 'InteractiveOrb';
export default InteractiveOrb;