import { useEffect, useRef, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(callback: () => void): RefObject<T | null> {
    const ref = useRef<T>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [callback]);

    return ref;
}