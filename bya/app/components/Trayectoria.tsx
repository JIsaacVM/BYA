import React, { useState } from "react";
import Marquee from "../components/magicui/marquee"; // Ajusta la ruta según donde guardaste el archivo del paso 3

interface Proyecto {
    id: number;
    titulo: string;
    descripcion: string;
    video: string;
    poster?: string;
}

const proyectos: Proyecto[] = [
    {
        id: 1,
        titulo: "LUMINA",
        descripcion: "Lumina es nuestro asistente virtual entrenado con herramientas y datos del grupo. Apoya al equipo en tareas administrativas, análisis de datos, respuestas operativas, generación de documentación y más. Es una herramienta viva que aprende y se adapta continuamente.",
        video: "/videos/feature-1.mp4",
        poster: "/videos/lumina.webp"
    },
    {
        id: 2,
        titulo: "CORE",
        descripcion: "Core es la columna vertebral tecnológica de BYA. Integra diversos sistemas como CRM, administración, marketing, atención al cliente, gestión de usuarios y más. Diseñado desde cero para adaptarse a las operaciones del grupo, ofrece flexibilidad, escalabilidad y una interfaz modular que evoluciona junto con las necesidades del negocio.",
        video: "/videos/feature-2.mp4",
        poster: "/videos/core.webp"
    },
    {
        id: 3,
        titulo: "ACADEMY",
        descripcion: "Academy está enfocada en la gestión de contenidos educativos, capacitación interna y formación de aliados externos. Permite estructurar cursos, administrar usuarios, evaluar progresos y generar reportes, todo desde una plataforma accesible y profesional.",
        video: "/videos/feature-3.mp4",
        poster: "/videos/academy.webp"
    },
];

// Componente Tarjeta (Sin cambios mayores, solo ajuste de márgenes)
const ProyectoCard = ({ proyecto, activeId, setActiveId }: { proyecto: Proyecto, activeId: number | null, setActiveId: (id: number | null) => void }) => {
    const isActive = activeId === proyecto.id;
    return (
        <React.Fragment>
            <div
                id="proyectos"
                className="group relative min-w-[350px] h-[350px] rounded-l-2xl overflow-hidden shadow-xl cursor-pointer flex items-center justify-center transition-all duration-300"
                // Eliminamos el margen m-8 para dejar que el Marquee controle el gap
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
                {/* Overlay hover */}
                <div
                    className="absolute inset-0 flex items-center justify-center text-[2rem] font-bold pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ opacity: isActive ? 0 : undefined }}
                >
                    {/* Puedes poner un icono o texto aquí si quieres */}
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
                    <p className="mb-2 text-xl font-extrabold">{proyecto.titulo}</p>
                    <p className="m-2 text-gray-300 text-sm">{proyecto.descripcion}</p>
                </div>
            </div>
        </React.Fragment>
    );
};

// --- Componente Principal ---

export default function Trayectoria() {
    const [activeId, setActiveId] = useState<number | null>(null);

    return (
        <section className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-black py-8">

            {/* Magic UI Marquee */}
            <Marquee pauseOnHover className="[--duration:40s] [--gap:2rem]">
                {proyectos.map((proyecto) => (
                    <div key={proyecto.id} className="flex items-center">
                        {/* Envolvemos en un div simple para mantener Card+Drawer juntos en el flujo flex */}
                        <ProyectoCard
                            proyecto={proyecto}
                            activeId={activeId}
                            setActiveId={setActiveId}
                        />
                    </div>
                ))}
            </Marquee>

            {/* Degradado lateral izquierdo (Efecto visual opcional recomendado por Magic UI) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black to-transparent dark:from-background"></div>

            {/* Degradado lateral derecho */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black to-transparent dark:from-background"></div>
        </section>
    );
}