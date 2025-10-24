import React, { useRef, useEffect, useState } from "react";

interface Proyecto {
    id: number;
    titulo: string;
    descripcion: string;
    video: string;
}

const proyectos: Proyecto[] = [
    { id: 1, titulo: "Proyecto Uno", descripcion: "Descripción del Proyecto Uno.", video: "/videos/feature-1.mp4" },
    { id: 2, titulo: "Proyecto Dos", descripcion: "Descripción del Proyecto Dos.", video: "/videos/feature-2.mp4" },
    { id: 3, titulo: "Proyecto Tres", descripcion: "Descripción del Proyecto Tres.", video: "/videos/feature-3.mp4" },
    { id: 4, titulo: "Proyecto Cuatro", descripcion: "Descripción del Proyecto Cuatro.", video: "/videos/feature-4.mp4" },
    { id: 5, titulo: "Proyecto Cinco", descripcion: "Descripción del Proyecto Cinco.", video: "/videos/feature-5.mp4" }
];

export default function Trayectoria() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number | null>(null);

    // Convert vertical wheel to horizontal scroll (sin cambios)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        };

        container.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            container.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="trayectoria-container flex overflow-x-auto overflow-y-hidden scroll-smooth  py-8 h-[400px] items-center"
        >
            {proyectos.map((proyecto) => (
                <React.Fragment key={proyecto.id}>
                    {/* Card */}
                    <div
                        // Añadimos 'group' para que 'group-hover' funcione en el título
                        className="m-8 mr-0 group relative min-w-[350px] h-[350px] rounded-l-2xl overflow-hidden shadow-xl cursor-pointer bg-gray-700 flex items-center justify-center"
                        onClick={() => setActiveId(activeId === proyecto.id ? null : proyecto.id)}
                    >
                        <video
                            src={proyecto.video}
                            width={100} // 'width' y 'height' aquí son para la optimización de Next/Image
                            height={100}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`
                                w-full h-full object-cover transition-all duration-300
                                ${activeId === proyecto.id ? "blur-[2px] brightness-75" : ""}
                            `}
                        />

                        {/* Título Overlay */}
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-[2rem] font-bold pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            // El estilo en línea se usa para anular el hover cuando la tarjeta está activa
                            style={{ opacity: activeId === proyecto.id ? 0 : undefined }}
                        >
                            <span>{proyecto.titulo}</span>
                        </div>
                    </div>

                    {/* Drawer: se expande con 'width' dinámico */}
                    <div
                        className="flex-shrink-0 h-[350px] overflow-hidden rounded-r-2xl bg-gray-700 text-white flex items-center transition-[width] duration-350 ease-in-out"
                        aria-hidden={activeId !== proyecto.id}
                        onClick={(e) => e.stopPropagation()}
                        // El 'width' dinámico se mantiene en el 'style' prop
                        style={{
                            width: activeId === proyecto.id ? "400px" : "0px",
                        }}
                    >
                        {/* Contenido del Drawer */}
                        <div
                            className={`
                                p-6 pl-0 w-full box-border transition-all duration-350 ease-in-out
                                ${activeId === proyecto.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[10px]"}
                            `}
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
            ))}

            {/* Dejamos solo las reglas para ocultar el scrollbar en <style jsx> */}
            <style jsx>{`
                .trayectoria-container {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }

                .trayectoria-container::-webkit-scrollbar {
                    display: none; /* WebKit */
                }
            `}</style>
        </div>
    );
}