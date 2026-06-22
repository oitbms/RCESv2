export class CacheBormashImpl {
    constructor() {
        this.endpoints = {
            employee: '/api/employees',
            subDivision: '/api/sub-divisions',
            team: '/api/team/get-page',
        };
    }
    async get(key) {
        const cached = sessionStorage.getItem(key);
        if (cached) {
            return JSON.parse(cached);
        }
        const endpoint = this.endpoints[key];
        if (!endpoint) {
            throw new Error(`Такого api нет: ${key}`);
        }
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Возникла ошибка сервера: ${response.status}`);
        }
        const data = await response.json();
        this.set(key, data);
        return data;
    }
    set(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
        return this;
    }
}
//# sourceMappingURL=cache.js.map