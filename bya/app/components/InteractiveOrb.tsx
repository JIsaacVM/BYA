// components/InteractiveOrb.tsx
'use client';

import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import './InteractiveOrb.css';

interface InteractiveOrbProps {
    size?: number;
    tickleDuration?: number;
    followCursor?: boolean;
    onInteract?: () => void;
}

export interface InteractiveOrbHandle {
    triggerTickle: () => void;
}

const InteractiveOrb = forwardRef<InteractiveOrbHandle, InteractiveOrbProps>(
    ({ size = 300, tickleDuration = 500, followCursor = true, onInteract }, ref: React.Ref<InteractiveOrbHandle>) => {
        const localRef = useRef<HTMLDivElement | null>(null);
        const tickleTimeoutRef = useRef<number | null>(null);

        // --- REFs PARA EL EFECTO SKEW ---
        const lastPointerPos = useRef({ x: 0, y: 0 });
        const lastPointerTime = useRef(Date.now());
        const pointerVelocity = useRef({ x: 0, y: 0 });
        const skewTimeoutRef = useRef<number | null>(null);
        // ---

        useImperativeHandle(ref, () => ({
            triggerTickle: () => {
                const orb = localRef.current;
                if (!orb) return;
                if (orb.classList.contains('tickle')) return;
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

            // Ojos que siguen al cursor Y CÁLCULO DE VELOCIDAD
            let onPointerMove: ((e: PointerEvent) => void) | null = null;
            if (followCursor && !prefersReduced) {
                onPointerMove = (event: PointerEvent) => {
                    // --- Lógica de los ojos (sin cambios) ---
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

                    // --- LÓGICA: CALCULAR VELOCIDAD ---
                    const now = Date.now();
                    const dt = now - lastPointerTime.current;
                    if (dt > 16) {
                        const dx = event.clientX - lastPointerPos.current.x;
                        const dy = event.clientY - lastPointerPos.current.y;

                        pointerVelocity.current = { x: dx / dt, y: dy / dt };

                        lastPointerPos.current = { x: event.clientX, y: event.clientY };
                        lastPointerTime.current = now;
                    }
                };
                window.addEventListener('pointermove', onPointerMove as EventListener);
            }

            // EL handlePointerEnter AHORA ESTÁ VACÍO Y PUEDE SER ELIMINADO
            // const handlePointerEnter = () => {};

            const handlePointerLeave = () => {
                if (prefersReduced) return;

                // --- LÓGICA: APLICAR SKEW ---
                const velocity = pointerVelocity.current;
                const skewAmount = 4;
                const maxSkew = 30;

                let skewX = velocity.x * skewAmount;
                let skewY = velocity.y * skewAmount * 0.5;

                skewX = Math.min(Math.max(skewX, -maxSkew), maxSkew);
                skewY = Math.min(Math.max(skewY, -maxSkew), maxSkew);

                orb.style.transform = `skew(${skewX}deg, ${skewY}deg)`;

                if (skewTimeoutRef.current) {
                    window.clearTimeout(skewTimeoutRef.current);
                }

                skewTimeoutRef.current = window.setTimeout(() => {
                    orb.style.transform = '';
                    skewTimeoutRef.current = null;
                }, 700);
            };

            orb.addEventListener('click', handleOrbInteraction);
            orb.addEventListener('keydown', onOrbKeyDown);
            // orb.addEventListener('pointerenter', handlePointerEnter); // Ya no es necesario
            orb.addEventListener('pointerleave', handlePointerLeave);

            // Cleanup
            return () => {
                orb.removeEventListener('click', handleOrbInteraction);
                orb.removeEventListener('keydown', onOrbKeyDown);
                // orb.removeEventListener('pointerenter', handlePointerEnter);
                orb.removeEventListener('pointerleave', handlePointerLeave);
                if (onPointerMove) window.removeEventListener('pointermove', onPointerMove as EventListener);

                if (tickleTimeoutRef.current !== null) window.clearTimeout(tickleTimeoutRef.current);
                if (skewTimeoutRef.current !== null) window.clearTimeout(skewTimeoutRef.current);
            };
        }, [followCursor, tickleDuration, onInteract]);

        return (
            <>
                {/* El SVG del filtro ha sido eliminado */}

                <div
                    ref={localRef}
                    id="character-orb"
                    role="button"
                    tabIndex={0}
                    aria-label="Personaje interactivo, haz clic o pulsa Enter para interactuar"
                    style={{ width: size, height: size }}
                >
                    <div className="orb-aura" aria-hidden="true"></div>
                    <div id="eye-left" className="eye" aria-hidden="true"></div>
                    <div id="eye-right" className="eye" aria-hidden="true"></div>
                </div>
            </>
        );
    }
);

InteractiveOrb.displayName = 'InteractiveOrb';
export default InteractiveOrb;