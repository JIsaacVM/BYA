import React, { useRef, useEffect, useState } from "react";

interface Proyecto {
    id: number;
    titulo: string;
    descripcion: string;
    video: string;
    poster?: string;
}

const proyectos: Proyecto[] = [
    { id: 1, titulo: "Proyecto Uno", descripcion: "Descripción del Proyecto Uno.", video: "/videos/feature-1.mp4", poster: "/videos/lumina.webp" },
    { id: 2, titulo: "Proyecto Dos", descripcion: "Descripción del Proyecto Dos.", video: "/videos/feature-2.mp4", poster: "/videos/core.webp" },
    { id: 3, titulo: "Proyecto Tres", descripcion: "Descripción del Proyecto Tres.", video: "/videos/feature-3.mp4", poster: "/videos/academy.webp" },
    { id: 4, titulo: "Proyecto Cuatro", descripcion: "Descripción del Proyecto Cuatro.", video: "/videos/feature-4.mp4", poster: "/videos/byaweb.webp" },
    { id: 5, titulo: "Proyecto Cinco", descripcion: "Descripción del Proyecto Cinco.", video: "/videos/feature-5.mp4", poster: "/videos/byaweb.webp" },
    { id: 6, titulo: "Proyecto Seis", descripcion: "Descripción del Proyecto Seis.", video: "/videos/feature-6.mp4", poster: "/videos/byaweb.webp" },
];

// Componente para la Tarjeta (mantenida para integridad)
const ProyectoCard = ({ proyecto, activeId, setActiveId }: { proyecto: Proyecto, activeId: number | null, setActiveId: (id: number | null) => void }) => {
    const isActive = activeId === proyecto.id;
    return (
        <React.Fragment key={proyecto.id}>
            {/* Card */}
            <div
                className="m-8 mr-0 group relative min-w-[350px] h-[350px] rounded-l-2xl overflow-hidden shadow-xl cursor-pointer bg-gray-700 flex items-center justify-center"
                onClick={() => setActiveId(isActive ? null : proyecto.id)}
            >
                <video
                    src={proyecto.video}
                    width={100}
                    height={100}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={proyecto.poster}
                    className={`w-full h-full object-cover transition-all duration-300 ${isActive ? "blur-[2px] brightness-75" : ""
                        }`}
                />
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-[2rem] font-bold pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ opacity: isActive ? 0 : undefined }}
                >
                    <span>{proyecto.titulo}</span>
                </div>
            </div>

            {/* Drawer */}
            <div
                className="flex-shrink-0 h-[350px] overflow-hidden rounded-r-2xl bg-gray-700 text-white flex items-center transition-[width] duration-350 ease-in-out"
                aria-hidden={!isActive}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: isActive ? "400px" : "0px",
                }}
            >
                <div
                    className={`p-6 pl-0 w-full box-border transition-all duration-350 ease-in-out ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[10px]"
                        }`}
                >
                    <h3 className="mb-2 text-xl">{proyecto.titulo}</h3>
                    <p className="m-0 text-gray-300">{proyecto.descripcion}</p>
                    <button
                        onClick={() => setActiveId(null)}
                        className="mt-4 bg-transparent text-white border border-white/20 py-[0.4rem] px-[0.6rem] rounded-md cursor-pointer transition-colors hover:bg-white/10"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

// ---

export default function Trayectoria() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number | null>(null);

    // Nota: eliminada la referencia rAF para simplificar el comportamiento de scroll

    // (IntersectionObserver eliminado — el scroll se maneja mientras el componente esté montado)

    // Control simple y robusto del scroll horizontal a partir del wheel vertical
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            // Normalizar deltaY
            const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;

            // Si no hay overflow horizontal, permitir el scroll vertical de la página
            if (container.scrollWidth <= container.clientWidth) return;

            const atStart = container.scrollLeft <= 0;
            const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

            const goingDown = delta > 0;
            const goingUp = delta < 0;

            // Si estamos en el extremo y el usuario intenta seguir en esa dirección, dejar que la página haga scroll
            if ((goingDown && atEnd) || (goingUp && atStart)) {
                return;
            }

            // Prevenir el scroll vertical y desplazar horizontalmente
            e.preventDefault();
            container.scrollLeft += delta;
        };

        container.addEventListener("wheel", onWheel, { passive: false });
        return () => container.removeEventListener("wheel", onWheel);
    }, []);

    // ---

    return (
        <section
            ref={containerRef}
            // Eliminamos scroll-smooth para evitar conflictos con la animación rAF
            className="trayectoria-container flex overflow-x-auto overflow-y-hidden py-8 h-[400px] items-center relative"
        >
            {proyectos.map((proyecto) => (
                <ProyectoCard
                    key={proyecto.id}
                    proyecto={proyecto}
                    activeId={activeId}
                    setActiveId={setActiveId}
                />
            ))}

            <style jsx>{`
                .trayectoria-container {
                    /* Ocultar scrollbar */
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    /* Permitir gestos táctiles verticales por defecto */
                    touch-action: pan-y;
                }
                .trayectoria-container::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}