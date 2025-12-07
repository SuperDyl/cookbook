import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends unknown[]>(delayMs: number, callback: (...args: T) => void | Promise<void>): (...args: T) => Promise<void> {

    const lockedRef = useRef<boolean>(false);
    const queuedRef = useRef<null | ((...args:T) => (void | Promise<void>))>(null);
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
        async (...args: T) => {
            if (lockedRef.current) {
                queuedRef.current = callback;
                queuedArgsRef.current = args;
                return;
            }

            lockedRef.current = true;
            const result = callback(...args);
            if (result instanceof Promise) {
                await result;
            }

            timeoutRef.current = setTimeout(
                () => {
                    async function callQueued() {
                        if (queuedRef.current !== null && queuedArgsRef.current !== null) {
                            const result = queuedRef.current(...(queuedArgsRef.current));
                            if (result instanceof Promise) {
                                await result;
                            }
                        }

                        queuedRef.current = null;
                        queuedArgsRef.current = null;
                        lockedRef.current = false;
                    }

                    callQueued();
                },
                delayMs);
        },
        [callback, delayMs]);
}
