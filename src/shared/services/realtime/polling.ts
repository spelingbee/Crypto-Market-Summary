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

    const options: Required<PollingOptions<T>> = {
        intervalMs: Math.max(0, pollingOptions.intervalMs ?? 5000),
        maxRetries: pollingOptions.maxRetries ?? 10,
        validate: pollingOptions.validate ?? (() => true),
        onError: pollingOptions.onError ?? (() => {})
    };


    const cleanup = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    const tick = async () => {
        if (needToStopPolling) return;
        
        const requestId = ++currentRequestId;
        
        try {
            const result = await apiFn();

            if (requestId !== currentRequestId || needToStopPolling) {
                return;
            }

            if (!options.validate(result)) {
                attempts++;
                logger.warn("Polling validation failed");
                if (attempts >= options.maxRetries) {
                    logger.error("Max polling retries reached, stopping");
                    needToStopPolling = true;
                    cleanup();
                    return;
                }
            } else {
                cb(result);
                attempts = 0;
            }

        } catch (error) {
            if (requestId !== currentRequestId || needToStopPolling) {
                return;
            }

            attempts++;
            try {
                options.onError(error);
            } catch (hookErr) {
                logger.error("Polling onError hook failed:", hookErr);
            }
            logger.error("Polling error:", error);

            if (attempts >= options.maxRetries) {
                logger.error("Max polling retries reached, stopping");
                needToStopPolling = true;
                cleanup();
                return;
            }

        }
        
        if (needToStopPolling) return;
        
        timeoutId = setTimeout(tick, pollingOptions.intervalMs);
    };

    tick();

    const stopFunction = () => {
        needToStopPolling = true;
        cleanup();
        currentRequestId++;
    };

    const restartFunction = () => {
        stopFunction();
        needToStopPolling = false;
        attempts = 0;
        tick();
    };

    return {
        stop: stopFunction,
        restart: restartFunction
    }
}