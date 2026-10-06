import { showNotification } from './notifications';
import { NotificationType, type ErrorResponse } from './types';

export async function requestToApi(
    url: string,
    method: string,
    body?: object | FormData
): Promise<unknown> {
    return $.ajax({
        url,
        method,
        contentType: body instanceof FormData ? false : 'application/json',
        processData: !(body instanceof FormData),
        data: body instanceof FormData ? body : JSON.stringify(body)
    }).catch((xhr: JQuery.jqXHR) => {
        const errorResponse = xhr.responseJSON as ErrorResponse | undefined;
        const message = errorResponse?.message ?? xhr.statusText ?? 'Ошибка запроса';
        const notificationType = errorResponse?.notificationType ?? NotificationType.ERROR;
        showNotification(message, notificationType);
        throw xhr;
    });
}
