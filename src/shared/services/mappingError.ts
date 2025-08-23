export class MappingError extends Error {
    public readonly originalError?: unknown;

    constructor(message: string, originalError?: unknown) {
        super(message);
        this.name = 'MappingError';
        this.originalError = originalError;
    }
}