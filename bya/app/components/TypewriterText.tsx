'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
    text: string;
    /** * Prop para iniciar la animación. 
     * En nuestro nuevo chat, esto siempre será 'true'
     * en cuanto el mensaje se añada al DOM.
     */
    isVisible: boolean;
    speed?: number;
    /** * Callback opcional que se ejecuta cuando el 
     * texto termina de escribirse.
     */
    onTypingComplete?: () => void;
}

/**
 * Componente que "escribe" un texto carácter por carácter UNA SOLA VEZ
 * cuando se vuelve visible.
 */
const TypewriterText: React.FC<TypewriterProps> = ({
    text,
    isVisible,
    speed = 40,
    onTypingComplete
}) => {
    const [displayedText, setDisplayedText] = useState('');
    // **CLAVE:** Estado interno para saber si ya terminó de escribirse.
    const [hasTypedOnce, setHasTypedOnce] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Limpiar cualquier intervalo anterior
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isVisible && !hasTypedOnce) {
            // 1. Si es visible y NO ha escrito antes: Iniciar animación
            let index = 0;
            setDisplayedText(''); // Empezar desde vacío

            intervalRef.current = setInterval(() => {
                if (index < text.length) {
                    setDisplayedText(text.substring(0, index + 1));
                    index++;
                } else {
                    // Animación completada
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    setHasTypedOnce(true); // ¡Marcar como completado!
                    if (onTypingComplete) {
                        onTypingComplete();
                    }
                }
            }, speed);

        } else if (isVisible && hasTypedOnce) {
            // 2. Si es visible y YA ha escrito: Mostrar texto completo al instante
            setDisplayedText(text);

        } else if (!isVisible) {
            // 3. Si NO es visible: Resetear todo
            setDisplayedText('');
            setHasTypedOnce(false);
        }

        // Función de limpieza
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
        // 'hasTypedOnce' se añade para manejar el caso 2
    }, [isVisible, text, speed, hasTypedOnce, onTypingComplete]);

    // Renderiza un espacio "invisible" si el texto está vacío
    // para evitar que la burbuja del chat colapse (salto de altura).
    return <>{displayedText || <>&nbsp;</>}</>;
};

export default TypewriterText;