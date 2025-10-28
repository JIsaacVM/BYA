"use client";
import React, { useEffect, useRef } from 'react';

export default function InteractiveBg() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const pointer = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; vx: number; vy: number; size: number; hue: number }[] = [];

        const spawnParticle = (x: number, y: number) => {
            // fewer, more elegant particles with controlled speed and hue
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.6 + Math.random() * 0.8;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed * 0.6,
                vy: Math.sin(angle) * speed * 0.6,
                size: 1.2 + Math.random() * 2.2,
                hue: 190 + Math.random() * 60, // cyan-magenta range
            });
            // keep particle count bounded
            if (particles.length > 140) particles.splice(0, particles.length - 140);
        };

        const onMove = (e: PointerEvent) => {
            pointer.current.x = e.clientX;
            pointer.current.y = e.clientY;
            // spawn a single elegant particle per move event (low spawn rate for finesse)
            spawnParticle(e.clientX, e.clientY);
        };

        const onLeave = () => {
            pointer.current.x = -9999; pointer.current.y = -9999;
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerout', onLeave);
        window.addEventListener('resize', onResize);

        function onResize() {
            if (!canvas) return;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function draw() {
            if (!ctx) return;
            // soft trail for elegant persistence
            ctx.fillStyle = 'rgba(2,4,10,0.12)';
            ctx.fillRect(0, 0, width, height);

            const time = performance.now() * 0.0006;

            // draw particles with additive blending for neon look
            ctx.globalCompositeOperation = 'lighter';
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                // subtle flow-field influence for futuristic motion
                const flowX = Math.sin((p.y * 0.002) + time) * 0.12;
                const flowY = Math.cos((p.x * 0.002) - time) * 0.12;
                p.vx += flowX * 0.08;
                p.vy += flowY * 0.08;

                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.985; p.vy *= 0.985;
                p.size *= 0.996;

                // gentle attraction to pointer
                const dx = pointer.current.x - p.x;
                const dy = pointer.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                if (dist < 140) {
                    const force = (140 - dist) * 0.0015;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // glow using shadowBlur for smooth neon
                ctx.save();
                ctx.shadowBlur = Math.max(8, p.size * 8);
                ctx.shadowColor = `hsla(${p.hue},100%,65%,0.9)`;
                ctx.fillStyle = `hsla(${p.hue},95%,60%,0.85)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.4, p.size * 0.7), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                if (p.size < 0.45 || p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) particles.splice(i, 1);
            }

            // refined connective lines
            ctx.lineWidth = 0.6;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length && b < a + 10; b++) {
                    const pa = particles[a]; const pb = particles[b];
                    const dx = pa.x - pb.x; const dy = pa.y - pb.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const alpha = (100 - dist) / 180;
                        // gradient between the two particle hues
                        ctx.strokeStyle = `rgba(160,220,255,${alpha * 0.9})`;
                        ctx.beginPath();
                        ctx.moveTo(pa.x, pa.y);
                        ctx.lineTo(pb.x, pb.y);
                        ctx.stroke();
                    }
                }
            }

            // restore composite for any other drawing
            ctx.globalCompositeOperation = 'source-over';

            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerout', onLeave);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-screen z-[-10] pointer-events-none"
            style={{ display: 'block' }}
        />
    );
}
