import { NotificationType } from './types';

const CONTAINER_ID = 'notifications-container';

export function ensureNotificationContainer(): HTMLElement | null {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.setAttribute('popover', 'manual');
        document.body.appendChild(container);
    }
    return container;
}

export function showNotification(
    message: string,
    type: NotificationType,
    params?: Record<string, string>,
    error?: Error
): void {
    try {
        const text = params
            ? message.replace(/{(\w+)}/g, (_, key) => params[key] ?? '')
            : message;
        const container = ensureNotificationContainer();
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<div class="msg">${text}</div>`;
        container.appendChild(notification);

        if (!container.matches(':popover-open')) {
            container.showPopover();
        }
        if (error) console.error(error);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
                if (container.children.length === 0) {
                    container.hidePopover();
                }
            }, 350);
        }, 3000);
    } catch (e) {
        console.error(e);
    }
}
