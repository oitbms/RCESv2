/** Prevents concurrent execution of the same named async function */
export function createAsyncLock() {
    const locks = new Map();
    return (fn) => {
        const wrapped = (async (...args) => {
            const key = fn.name || 'anonymous';
            if (locks.get(key))
                return;
            locks.set(key, true);
            try {
                return await fn(...args);
            }
            finally {
                locks.set(key, false);
            }
        });
        return wrapped;
    };
}
//# sourceMappingURL=lock.js.map