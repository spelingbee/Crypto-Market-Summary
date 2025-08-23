export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    function debouncedFn (this: ThisParameterType<T>, ...args: Parameters<T>) {
        cleanup();
        timeout = setTimeout(() => {
            func.apply(this, args);
            timeout = null;
        }, delay);
    };

    return debouncedFn;
}
