import { ref, computed } from 'vue';
    import { ErrorType, type AppError } from '../services';

export function useLocalErrors() {
    const currentError = ref<AppError | null>(null);
    const isLoading = ref(false);

    const setError = (error: unknown, customMessage?: string) => {
        const timestamp = new Date();

        if (error instanceof Error) {
            currentError.value = {
                type: error.name === 'ZodError' ? ErrorType.VALIDATION : ErrorType.UNKNOWN,
                message: customMessage || error.message,
                originalError: error,
                timestamp
            };
        } else {
            currentError.value = {
                type: ErrorType.UNKNOWN,
                message: customMessage || 'An unexpected error occurred',
                originalError: error,
                timestamp
            };
        }
    };

    const clearError = () => {
        currentError.value = null;
    };

    const executeWithErrorHandling = async <T>(
        asyncFn: () => Promise<T>,
        errorMessage?: string
    ): Promise<T | null> => {
        try {
            isLoading.value = true;
            clearError();
            return await asyncFn();
        } catch (error) {
            setError(error, errorMessage);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        currentError,
        isLoading,
        hasError: computed(() => currentError.value !== null),
        setError,
        clearError,
        executeWithErrorHandling
    };
}