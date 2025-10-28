import React, { useRef, useEffect } from "react";

interface TeamOrbProps {
    color: string; // CSS color
    size?: number; // px
}

export default function TeamOrb({ color, size = 48 }: TeamOrbProps) {
    const orbRef = useRef<HTMLDivElement>(null);
    const leftEyeRef = useRef<HTMLDivElement>(null);
    const rightEyeRef = useRef<HTMLDivElement>(null);
    const blinkTimeout = useRef<NodeJS.Timeout | null>(null);

    // Parpadeo ocasional
    useEffect(() => {
        function blink() {
            if (!orbRef.current) return;
            orbRef.current.classList.add("blink");
            setTimeout(() => {
                orbRef.current?.classList.remove("blink");
                blinkTimeout.current = setTimeout(blink, 2000 + Math.random() * 3000);
            }, 120 + Math.random() * 80);
        }
        blinkTimeout.current = setTimeout(blink, 2000 + Math.random() * 3000);
        return () => {
            if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
        };
    }, []);

    // Ojos siguen el cursor
    useEffect(() => {
        function onPointerMove(event: PointerEvent) {
            if (!orbRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
            const orbRect = orbRef.current.getBoundingClientRect();
            const orbCenterX = orbRect.left + orbRect.width / 2;
            const orbCenterY = orbRect.top + orbRect.height / 2;
            const angle = Math.atan2(event.clientY - orbCenterY, event.clientX - orbCenterX);
            const maxEyeDistance = orbRect.width / 7;
            const x = Math.cos(angle) * maxEyeDistance;
            const y = Math.sin(angle) * maxEyeDistance;
            leftEyeRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            rightEyeRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        }
        window.addEventListener('pointermove', onPointerMove);
        return () => window.removeEventListener('pointermove', onPointerMove);
    }, []);



    // Fondo degradado blanco al color base
    return (
        <div
            ref={orbRef}
            className="team-orb"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: `linear-gradient(to bottom left,#fff 15%,   ${color} 75%)`, position: "relative",
                margin: "0 auto",
                cursor: "pointer",
                transition: "box-shadow 0.2s, opacity 0.2s"
            }}
            aria-label="Team member orb"
            tabIndex={0}
        >
            {/* Ojo izquierdo */}
            <div
                ref={leftEyeRef}
                className="eye"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "38%",
                    width: size * 0.12,
                    height: size * 0.28,
                    background: "#000000",
                    borderRadius: "50%",
                    boxShadow: "0 0 2px #0002",
                    transform: "translate(-50%, -50%)",
                    // AÑADIMOS LA TRANSICIÓN AQUÍ
                    transition: "width 0.15s ease, height 0.15s ease"
                }}
                aria-hidden="true"
            />
            {/* Ojo derecho */}
            <div
                ref={rightEyeRef}
                className="eye"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "62%",
                    width: size * 0.12,
                    height: size * 0.28,
                    background: "#000000",
                    boxShadow: "0 0 2px #0002",
                    transform: "translate(-50%, -50%)",
                    // AÑADIMOS LA TRANSICIÓN AQUÍ
                    transition: "width 0.15s ease, height 0.15s ease"
                }}
                aria-hidden="true"
            />
            {/* Parpadeo y risa: oscurece los ojos y orb */}
            <style>{`
         
                  .team-orb.laugh {
                       
                        filter: brightness(1.1) saturate(1.1);
                  }
                  .team-orb.laugh .eye {
                        background: #000000;
                        width: ${size * 0.12}px;
                        height: ${size * 0.22}px !important;
                        /* QUITAMOS LA TRANSICIÓN DE AQUÍ */
                        /* transition: all 0.15s; */ 
                        transform: translate(-50%, -50%);
                  }
            `}</style>
        </div>
    );
}