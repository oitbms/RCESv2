import { showNotification } from './notifications';
import { NotificationType } from './types';
export async function requestToApi(url, method, body) {
    return $.ajax({
        url,
        method,
        contentType: body instanceof FormData ? false : 'application/json',
        processData: !(body instanceof FormData),
        data: body instanceof FormData ? body : JSON.stringify(body)
    }).catch((xhr) => {
        var _a, _b, _c;
        const errorResponse = xhr.responseJSON;
        const message = (_b = (_a = errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.message) !== null && _a !== void 0 ? _a : xhr.statusText) !== null && _b !== void 0 ? _b : 'Ошибка запроса';
        const notificationType = (_c = errorResponse === null || errorResponse === void 0 ? void 0 : errorResponse.notificationType) !== null && _c !== void 0 ? _c : NotificationType.ERROR;
        showNotification(message, notificationType);
        throw xhr;
    });
}
//# sourceMappingURL=api.js.map