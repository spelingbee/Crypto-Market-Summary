import {logger} from "../logger.ts";

interface PollingOptions<T> {
    validate?: (result: T) => boolean,
    intervalMs: number,
    onError?: (error: unknown) => void,
    maxRetries?: number;
}

export function poll<T>(
    apiFn: () => Promise<T>,
    cb: (data: T) => void,
    pollingOptions: PollingOptions<T> = { intervalMs: 5000, maxRetries: 10 }
): { stop: () => void; restart: () => void } {
    let attempts = 0;
    let needToStopPolling = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let currentRequestId = 0;

    const cleanup = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    const poll = async () => {
        if (needToStopPolling) return;
        
        const requestId = ++currentRequestId;
        
        try {
            const result = await apiFn();
            
            if (requestId !== currentRequestId || needToStopPolling) {
                return;
            }
            
            cb(result);
            attempts = 0;
        } catch (error) {
            if (requestId !== currentRequestId || needToStopPolling) {
                return;
            }
            
            attempts++
            pollingOptions.onError?.(error)
            logger.error("Polling error:", error);
            
            if (attempts >= (pollingOptions.maxRetries || 10)) {
                logger.error("Max polling retries reached, stopping");
                return;
            }
        }
        
        if (needToStopPolling) return;
        
        timeoutId = setTimeout(poll, pollingOptions.intervalMs);
    };

    poll();

    const stopFunction = () => {
        needToStopPolling = true;
        cleanup();
        currentRequestId++;
    };

    const restartFunction = () => {
        stopFunction();
        needToStopPolling = false;
        attempts = 0;
        poll();
    };

    return {
        stop: stopFunction,
        restart: restartFunction
    }
}