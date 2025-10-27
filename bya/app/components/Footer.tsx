// Importa los íconos que necesites, por ejemplo, de Font Awesome
import Image from 'next/image';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-stone-950 text-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 text-3xl font-extrabold">
                <Image src="/bya-team/paolo-bya.png" alt="Logotipo de BYA" width={50} height={50} />
                <p>BYA</p>
            </div>
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">

                {/* Copyright */}
                <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-400">
                        © 2025 BYA. All rights reserved.
                    </p>
                </div>

                {/* Enlaces de navegación */}
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <a
                        href="/about"
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Nosotros
                    </a>
                    <a
                        href="/privacy"
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Privacidad
                    </a>
                    <a
                        href="/terms"
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Términos
                    </a>
                    <a
                        href="/contact"
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Contacto
                    </a>
                </nav>

                {/* Íconos de Redes Sociales */}
                <div className="flex justify-center space-x-6">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <FaTwitter size={20} />
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <FaGithub size={20} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <FaLinkedin size={20} />
                    </a>
                </div>

            </div>
        </footer>
    );
}