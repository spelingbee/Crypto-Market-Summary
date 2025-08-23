interface Logger {
    log(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}

class AppLogger implements Logger {
    log(message: string, ...args: any[]): void {
        if (import.meta.env.DEV) {
            console.debug(`[LOG] ${message}`, ...args);
        }
    }

    error(message: string, ...args: any[]): void {
        console.error(`[ERROR] ${message}`, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`[WARN] ${message}`, ...args);
    }

    debug(message: string, ...args: any[]): void {
        if (import.meta.env.DEV) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
}

export const logger = new AppLogger();