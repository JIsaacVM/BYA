// Importa los íconos que necesites, por ejemplo, de Font Awesome
import Image from 'next/image';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-indigo-900 via-stone-950 to-black text-gray-50 py-8 px-2 sm:px-6 lg:px-8 border-t border-stone-800 shadow-inner">
            <div className="container m-auto flex flex-col gap-4">
                {/* Logo y nombre */}
                <div className="flex items-center gap-4 text-3xl font-extrabold justify-center sm:justify-start">
                    <Image src="/bya-team/paolo-bya.png" alt="Logotipo de BYA" width={50} height={50} className="rounded-full border-2 border-stone-700" />
                    <span className="tracking-wide">BYA</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                    {/* Social y contacto */}
                    <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
                        <div className="flex gap-4 mb-2">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="text-gray-400 hover:text-gray-100 transition-colors duration-300 hover:scale-110"
                            >
                                <FaGithub size={24} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110"
                            >
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                        <div className="text-xs text-gray-400">
                            <span className="block">Correo: <a href="mailto:contacto@bya.com" className="hover:underline text-gray-300">contacto@bya.com</a></span>
                            <span className="block">Tel: <a href="tel:+524771234567" className="hover:underline text-gray-300">+52 477 123 4567</a></span>
                        </div>
                    </div>

                    {/* Separador vertical en desktop */}
                    <div className="hidden md:block w-px bg-stone-800 mx-8" style={{ minHeight: '120px' }}></div>

                    {/* Enlaces de navegación */}
                    <nav className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 md:w-1/3">
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
                            href="/contact"
                            className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            Contacto
                        </a>
                    </nav>

                    {/* Separador vertical en desktop */}
                    <div className="hidden md:block w-px bg-stone-800 mx-8" style={{ minHeight: '120px' }}></div>

                    {/* Mapa */}
                    <div className="flex flex-col items-center md:w-1/3">
                        <iframe
                            title='mapa de bya'
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.223329742806!2d-101.6460927909198!3d21.103660680483365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bbe438df80b67%3A0xaa0177abe90bb4a6!2sBlvr.%20Mariano%20Escobedo%20Pte.%20%234502-int%20401%20b%2C%20San%20Isidro%20de%20Jerez%2C%2037685%20Le%C3%B3n%20de%20los%20Aldama%2C%20Gto.!5e0!3m2!1ses-419!2smx!4v1761581989595!5m2!1ses-419!2smx"
                            width="250"
                            height="120"
                            style={{ border: 0, borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <span className="text-xs text-gray-400 mt-2 text-center">Blvr. Mariano Escobedo Pte. #4502-int 401b, León, Gto.</span>
                    </div>
                </div>

                {/* Separador horizontal */}
                <div className="border-t border-stone-800 my-2"></div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        © 2025 BYA. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}