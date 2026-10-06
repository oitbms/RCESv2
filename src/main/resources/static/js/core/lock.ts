/** Prevents concurrent execution of the same named async function */
export function createAsyncLock() {
    const locks = new Map<string, boolean>();
    return <T extends (...args: unknown[]) => Promise<unknown>>(fn: T): T => {
        const wrapped = (async (...args: unknown[]) => {
            const key = fn.name || 'anonymous';
            if (locks.get(key)) return;
            locks.set(key, true);
            try {
                return await fn(...args);
            } finally {
                locks.set(key, false);
            }
        }) as T;
        return wrapped;
    };
}
