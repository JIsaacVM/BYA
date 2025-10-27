"use client"; // Asumo que este también es un Client Component

import React, { useState, useCallback } from 'react';
import Image from 'next/image'; // Asumiendo que aún necesitas Image para las fotos reales
import TeamOrb from './TeamOrb'; // Asegúrate de que este path sea correcto para tu estructura

// Iconos (SVG simples, si no usas una librería como react-icons)
const IconGitHub = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.09.682-.218.682-.484 0-.238-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.645 0 0 .84-.27 2.75 1.025A9.547 9.547 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.375.201 2.392.1 2.645.64.698 1.03 1.592 1.03 2.682 0 3.842-2.338 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.338-.012 2.419-.012 2.746 0 .268.18.578.688.48C19.135 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);

const IconLinkedIn = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.5A1.5 1.5 0 118 5a1.5 1.5 0 01-1.5 1.5zM19 19h-3v-5.5c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93V19h-3V8h2.88v1.32h.04c.4-.76 1.37-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6v5.63z" />
    </svg>
);

type TeamMember = {
    id: number;
    orbColors: string;
    nombre: string;
    puesto: string;
    foto: string;
    foto2: string;
    descripcion: string;
    socials: {
        linkedin?: string;
        github?: string;
    };
};

interface TeamCardProps {
    member: TeamMember;
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = useCallback(() => {
        setIsFlipped((s) => !s);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped((s) => !s);
        }
    }, []);

    return (
        // CAMBIO 1: Añadido [perspective:1000px] aquí
        <div className="relative bg-transparent group h-80 w-60 cursor-pointer [perspective:1000px]">
            {/* Usamos un elemento interactivo para accesibilidad */}
            <button
                type="button"
                aria-pressed={isFlipped}
                aria-label={isFlipped ? `Cerrar tarjeta de ${member.nombre}` : `Abrir tarjeta de ${member.nombre}`}
                onClick={handleFlip}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent p-0 border-0 text-left"
            >
                {/* CAMBIO 2: Clases de transformación homologadas */}
                <div
                    className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                    {/* Cara frontal */}
                    {/* CAMBIO 3: Homologado backface-hidden */}
                    <div className="absolute inset-0 [backface-visibility:hidden] bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-between p-6 transition-all duration-500 hover:scale-105 hover:shadow-blue-500/50">
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-700/30 to-transparent z-0"></div>
                        <div className="flex items-center justify-center mb-4 mt-6 z-10">

                            <TeamOrb color={member.orbColors} size={100} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-50 mt-4 group-hover:text-blue-300 transition-colors duration-300">
                            {member.nombre}
                        </h3>
                        <p className="text-md font-semibold text-blue-400 mb-4">
                            {member.puesto}
                        </p>
                        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700 w-full flex justify-center gap-6">
                            {member.socials.github && (
                                <a
                                    href={member.socials.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="text-gray-400 hover:text-white transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={(e) => e.stopPropagation()} // Previene que la tarjeta se voltee al hacer click en el icono
                                >
                                    <IconGitHub />
                                </a>
                            )}
                            {member.socials.linkedin && (
                                <a
                                    href={member.socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="text-gray-400 hover:text-blue-500 transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={(e) => e.stopPropagation()} // Previene que la tarjeta se voltee al hacer click en el icono
                                >
                                    <IconLinkedIn />
                                </a>
                            )}
                        </div>
                        _             </div>

                    {/* Cara trasera */}
                    {/* CAMBIO 4: Homologado backface-hidden y transform */}
                    <div className="absolute inset-1 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">
                        <div className="group relative w-fit h-64 mb-4 flex items-center justify-center">
                            <Image
                                src={member.foto}
                                alt={member.nombre}
                                width={100}
                                height={100}
                                className="rounded-lg object-cover w-fit h-48"
                            />
                            <Image
                                src={member.foto2}
                                alt={member.nombre}
                                width={100}
                                height={300}
                                className="rounded-lg object-cover w-fit h-48 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                            />
                        </div>
                        <p className="text-xl font-bold text-indigo-600 mb-1">
                            BYA TEAM
                        </p>
                        <p className="text-2xl font-bold text-gray-50 mb-4">
                            {member.nombre}
                        </p>

                    </div>
                </div>
            </button>
        </div>
    );
};

export default TeamCard;