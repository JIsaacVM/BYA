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

        // Grid of nodes (square aesthetic). Nodes are off by default and light up when pointer is nearby.
        const spacing = Math.max(38, Math.floor(Math.min(width, height) / 20));
        let cols = Math.ceil(width / spacing) + 1;
        let rows = Math.ceil(height / spacing) + 1;

        type Node = { x: number; y: number; i: number }; // i = intensity 0..1
        let nodes: Node[] = [];

        function buildGrid() {
            nodes = [];
            cols = Math.ceil(width / spacing) + 1;
            rows = Math.ceil(height / spacing) + 1;
            const offsetX = (width - (cols - 1) * spacing) / 2;
            const offsetY = (height - (rows - 1) * spacing) / 2;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    nodes.push({ x: offsetX + c * spacing, y: offsetY + r * spacing, i: 0 });
                }
            }
        }

        buildGrid();

        const radius = spacing * 0.9; // influence radius

        const onMoveGrid = (e: PointerEvent) => {
            pointer.current.x = e.clientX;
            pointer.current.y = e.clientY;
            // light up nearby nodes
            for (const n of nodes) {
                const dx = n.x - e.clientX;
                const dy = n.y - e.clientY;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < radius) {
                    const val = 1 - d / radius;
                    // boost intensity smoothly
                    if (val > n.i) n.i = val;
                }
            }
        };

        const onLeaveGrid = () => {
            pointer.current.x = -9999; pointer.current.y = -9999;
        };

        window.addEventListener('pointermove', onMoveGrid, { passive: true });
        window.addEventListener('pointerout', onLeaveGrid);
        window.addEventListener('resize', onResize);

        function onResizeGrid() {
            if (!canvas) return;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            buildGrid();
        }

        // draw function for grid
        function drawGrid() {
            if (!ctx) return;

            // --- INICIO DE LA CORRECCIÓN ---
            // Borra el canvas completamente con el color de fondo opaco.
            // Cambiado a negro puro (rgb(0,0,0))
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, width, height);
            // --- FIN DE LA CORRECCIÓN ---

            // draw nodes as soft squares
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                // decay intensity
                n.i *= 0.90;
                if (n.i < 0.003) { n.i = 0; continue; }

                const intensity = Math.min(1, n.i);
                const size = spacing * 0.26 + intensity * spacing * 0.36;

                // neon color base
                const hue = 195; // cyan-blue
                const alpha = 0.12 + intensity * 0.9;

                // glow
                ctx.save();
                ctx.shadowBlur = 14 * intensity;
                ctx.shadowColor = `hsla(${hue},100%,65%,${0.9 * intensity})`;
                ctx.fillStyle = `hsla(${hue},95%,60%,${alpha})`;
                // draw rounded rect (approx using arc corners)
                const x = n.x - size / 2;
                const y = n.y - size / 2;
                const r = Math.max(2, size * 0.18);
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + size - r, y);
                ctx.quadraticCurveTo(x + size, y, x + size, y + r);
                ctx.lineTo(x + size, y + size - r);
                ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
                ctx.lineTo(x + r, y + size);
                ctx.quadraticCurveTo(x, y + size, x, y + size - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // optional faint grid lines where nodes lit
            ctx.strokeStyle = 'rgba(100,170,255)';
            ctx.lineWidth = 1;
            for (let r = 0; r < rows; r++) {
                const base = r * cols;
                for (let c = 0; c < cols - 1; c++) {
                    const n = nodes[base + c];
                    const m = nodes[base + c + 1];
                    const w = (n.i + m.i) * 0.5;
                    if (w > 0.02) {
                        ctx.strokeStyle = `rgba(140,170,255,${w * 0.06})`;
                        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
                    }
                }
            }

            rafRef.current = requestAnimationFrame(drawGrid);
        }

        // wire up resize handler to grid-specific
        function onResize() { onResizeGrid(); }

        rafRef.current = requestAnimationFrame(drawGrid);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('pointermove', onMoveGrid);
            window.removeEventListener('pointerout', onLeaveGrid);
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