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
                    <div className='flex'>
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

                {/* MAPA */}
                <div className="flex-col justify-center space-x-6">

                    <div>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.223329742806!2d-101.6460927909198!3d21.103660680483365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbe438df80b67%3A0xaa0177abe90bb4a6!2sBlvr.%20Mariano%20Escobedo%20Pte.%20%234502-int%20401%20b%2C%20San%20Isidro%20de%20Jerez%2C%2037685%20Le%C3%B3n%20de%20los%20Aldama%2C%20Gto.!5e0!3m2!1ses-419!2smx!4v1761581989595!5m2!1ses-419!2smx" width="250" height="120" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
                </div>

            </div>
        </footer>
    );
}