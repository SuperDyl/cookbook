import { useCallback, useEffect } from "react";


export default function useStopPageClose(preventClose: boolean) {
    const preventPageUnload = useCallback(
    (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = true;
    },
    []);

    useEffect(
    () => {
        if (preventClose) {
        window.addEventListener('beforeunload', preventPageUnload);
        return () => window.removeEventListener('beforeunload', preventPageUnload);
        }
    },
    [preventPageUnload, preventClose]);
}
