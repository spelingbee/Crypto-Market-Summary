import {z} from "zod";

export interface NormalizedError {
    message: string;
    originalError: unknown;
}

export function normalizeError(error: unknown): NormalizedError {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        if (response?.data?.message) {
            return {
                message: response.data.message,
                originalError: error,
            };
        }
    }

    if (error instanceof z.ZodError) {
        const validationIssues = (error as any).issues;
        const message = validationIssues.map((issue: any) => issue.message).join('. ');
        return {
            message: `Ошибка валидации: ${message}`,
            originalError: error,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            originalError: error,
        };
    }

    if (typeof error === 'string') {
        return {
            message: error,
            originalError: error,
        };
    }

    return {
        message: 'Произошла непредвиденная ошибка',
        originalError: error,
    };
}