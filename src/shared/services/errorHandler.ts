import {logger} from "./logger.ts";

export const ErrorType = {
    NETWORK: 'NETWORK',
    VALIDATION: 'VALIDATION',
    MAPPING: 'MAPPING',
    UNKNOWN: 'UNKNOWN',
    API: 'API'
}
export type ErrorType = typeof ErrorType[keyof typeof ErrorType]
export interface AppError {
    type: ErrorType;
    message: string;
    originalError?: unknown;
    timestamp: Date;
}
export const CriticalErrorType = {
    AUTHENTICATION: 'AUTHENTICATION',
    NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
    SERVER_ERROR: 'SERVER_ERROR'
}
export type CriticalErrorType = typeof CriticalErrorType[keyof typeof CriticalErrorType]

export interface CriticalError {
    type: CriticalErrorType;
    message: string;
    timestamp: Date;
}

class GlobalErrorHandler {
    private static instance: GlobalErrorHandler;

    private constructor() {}
    static getInstance(): GlobalErrorHandler {
        if (!GlobalErrorHandler.instance) {
            GlobalErrorHandler.instance = new GlobalErrorHandler();
        }
        return GlobalErrorHandler.instance;
    }

    public logError(error: unknown, context?: Record<string, any>) {
        // Example, Sentry.captureException(error, { extra: context });

        logger.warn('Global error logged:', { error, context });
    }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();