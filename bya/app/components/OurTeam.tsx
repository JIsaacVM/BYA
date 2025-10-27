import TeamCard from '../components/TeamCard'; // Ajusta la ruta según donde guardes TeamCard.tsx

// --- 1. Definición de Tipos (TypeScript) ---
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

const teamData: TeamMember[] = [
    {
        id: 1,
        orbColors: "#44A9E9",
        nombre: 'Paolo Coronel',
        puesto: 'Director BYA',
        foto: '/ntp/men1-snbg.webp',
        foto2: '/ntp/men1-cnbg.webp',
        descripcion: 'Especialista en React y Next.js, apasionado por crear interfaces fluidas y accesibles.',
        socials: {
            linkedin: 'https://linkedin.com/in/ana-lopez',
            github: 'https://github.com/ana-lopez',
        },
    },
    {
        id: 2,
        orbColors: "#03F5EF",
        nombre: 'Cesar Bernal',
        puesto: 'Fullstack Developer',
        foto: '/ntp/men1-snbg.webp',
        foto2: '/ntp/men1-cnbg.webp',
        descripcion: 'Experto en Node.js, microservicios y bases de datos. Garantiza que todo funcione bajo el capó.',
        socials: {
            github: 'https://github.com/carlos-martinez',
        },
    },
    {
        id: 3,
        orbColors: "#000000",
        nombre: 'Joel Briones',
        puesto: 'Fullstack Developer',
        foto: '/ntp/men1-snbg.webp',
        foto2: '/ntp/men1-cnbg.webp',
        descripcion: 'Transforma ideas complejas en diseños intuitivos y elegantes. Amante del minimalismo.',
        socials: {
            linkedin: 'https://linkedin.com/in/sofia-gomez',
        },
    },
    {
        id: 4,
        orbColors: "#370607",
        nombre: 'Carlos Padilla',
        puesto: 'Fullstack Developer',
        foto: '/ntp/men1-snbg.webp',
        foto2: '/ntp/men1-cnbg.webp',
        descripcion: 'Experto en React, Next.js y Tailwind CSS. Garantiza que todo funcione bajo el capó.',
        socials: {
            github: 'https://github.com/juan-carlos-martinez',
        },
    },
    {
        id: 5,
        orbColors: "#01256B",
        nombre: 'Isaaac Velazquez',
        puesto: 'Fullstack Developer',
        foto: '/ntp/men1-snbg.webp',
        foto2: '/ntp/men1-cnbg.webp',
        descripcion: 'Experto en Node.js, microservicios y bases de datos. Garantiza que todo funcione bajo el capó.',
        socials: {
            github: 'https://github.com/carlos-martinez',
        },
    },
    {
        id: 6,
        orbColors: "#411974",
        nombre: 'Uriel Zavala',
        puesto: 'Fullstack Developer',
        foto: '/ntp/men1-snbg.webp',
        foto2: '/ntp/men1-cnbg.webp',
        descripcion: 'Transforma ideas complejas en diseños intuitivos y elegantes. Amante del minimalismo.',
        socials: {
            linkedin: 'https://linkedin.com/in/sofia-gomez',
        },
    },
];

export default function EquipoPage() {
    return (
        <div className="min-h-screen text-gray-100 py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Conoce a Nuestro Equipo Estelar
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
                    {teamData.map((member) => (
                        <TeamCard key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );
}