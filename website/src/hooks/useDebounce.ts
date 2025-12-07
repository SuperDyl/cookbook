import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends unknown[]>(delayMs: number, callback: (...args: T) => void | Promise<void>): (...args: T) => void {

    const lockedRef = useRef<boolean>(false);
    const queuedRef = useRef<null | ((...args:T) => void)>(null);
    const queuedArgsRef = useRef<T | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(
        () => {
            return () => {
                if (timeoutRef.current !== null) {
                    clearTimeout(timeoutRef.current);
                }
            }
        },
        []);

    return useCallback(
        (...args: T) => {
            if (lockedRef.current) {
                queuedRef.current = callback;
                queuedArgsRef.current = args;
                return;
            }

            lockedRef.current = true;
            callback(...args);

            timeoutRef.current = setTimeout(
                () => {
                    if (queuedRef.current !== null && queuedArgsRef.current !== null) {
                        queuedRef.current(...(queuedArgsRef.current));
                    }

                    queuedRef.current = null;
                    queuedArgsRef.current = null;
                    lockedRef.current = false;
                },
                delayMs);
        },
        [callback, delayMs]);
}
