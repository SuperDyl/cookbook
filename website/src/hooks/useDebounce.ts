import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Describes what debouncer's states for a specific debounced function.
 *
 * WAITING -> RUNNING -> LOCKED
 *
 * RUNNING -> LOCKED
 *
 * LOCKED -> QUEUED_WAITING & WAITING
 *
 * QUEUED_WAITING -> QUEUED_RUNNING -> WAITING
 *
 * WAITING & LOCKED & QUEUED_WAITING -> CANCELED
 */
export enum DebounceStates {
    WAITING = 'WAITING',
    RUNNING = 'RUNNING',
    LOCKED = 'LOCKED',
    QUEUED_WAITING = 'QUEUED_WAITING',
    QUEUED_RUNNING = 'QUEUED_RUNNING',
    CANCELED = 'CANCELED',
}

/**
 * Debounces requests, allowing one extra request which be queued while waiting.
 * If multiple requests are made during cooldown, the final one is queued.
 * @param delayMs The time after a request where requests will be queued.
 * @param callback The function which is being debounced.
 * @param onChange A function called by the debouncer to inform the subscriber to its state.
 * @returns A wrapper around `callback` which debounces calls.
 */
export function useDebounce<T extends unknown[]>(
    delayMs: number,
    callback: (...args: T) => void | Promise<void>,
    onChange: ((newState: DebounceStates) => void) = () => {},
): (...args: T) => Promise<void> {

    const [debounceState, setDebounceState] = useState<DebounceStates>(DebounceStates.WAITING);

    const lockedRef = useRef<boolean>(false);
    const queuedRef = useRef<null | ((...args: T) => (void | Promise<void>))>(null);
    const queuedArgsRef = useRef<T | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(
        () => {
            return () => {
                if (timeoutRef.current !== null) {
                    clearTimeout(timeoutRef.current);
                }
                setDebounceState(DebounceStates.CANCELED);
            }
        },
        []);

    useEffect(
        () => {
            onChange(debounceState);
        },
        [onChange, debounceState]
    )

    return useCallback(
        async (...args: T) => {
            if (lockedRef.current) {
                queuedRef.current = callback;
                queuedArgsRef.current = args;
                setDebounceState(DebounceStates.QUEUED_WAITING);
                return;
            }

            lockedRef.current = true;
            setDebounceState(DebounceStates.RUNNING);
            const result = callback(...args);
            if (result instanceof Promise) {
                await result;
            }

            timeoutRef.current = setTimeout(
                () => {
                    async function callQueued() {
                        if (queuedRef.current !== null && queuedArgsRef.current !== null) {
                            setDebounceState(DebounceStates.QUEUED_RUNNING);
                            const result = queuedRef.current(...(queuedArgsRef.current));
                            if (result instanceof Promise) {
                                await result;
                            }
                        }

                        queuedRef.current = null;
                        queuedArgsRef.current = null;
                        lockedRef.current = false;
                        setDebounceState(DebounceStates.WAITING);
                    }

                    callQueued();
                },
                delayMs);
            setDebounceState(DebounceStates.LOCKED);
        },
        [callback, delayMs]);
}
