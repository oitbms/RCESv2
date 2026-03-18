package com.example.rces.service.impl;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.NotificationApp;
import com.example.rces.models.enums.Status;
import com.example.rces.service.TelegramService;
import com.example.rces.service.VkNotificationService;
import com.example.rces.utils.telegram.MessageType;
import com.example.rces.utils.telegram.event.TelegramRequestEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationService {

    private final TelegramService telegramService;
    private final VkNotificationService vkNotificationService;
    private final MaxNotificationService maxNotificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessage(Requests requests) {
        NotificationApp app = getNotificationApp(requests);

        switch (app) {
            case TELEGRAM -> sendTelegram(requests);
            case VK -> vkNotificationService.sendMessageForRequest(requests);
            case MAX -> maxNotificationService.sendNotification(requests);
        }
    }

    public void sendMessageRedirect(Requests requests) {
        NotificationApp app = requests.getEmployee().getNotificationApp();

        switch (app) {
            case TELEGRAM ->
                    telegramService.sendMessageForRequest(new TelegramRequestEvent(this, requests, requests.getEmployee(), MessageType.REDIRECT));
            case VK -> vkNotificationService.sendRedirectNotification(requests);
            case MAX -> maxNotificationService.sendRedirectNotification(requests);
        }
    }

    private void sendTelegram(Requests requests) {
        MessageType type = switch (requests.getStatus()) {
            case New -> MessageType.CREATE;
            case InWork -> MessageType.WORK;
            case Rejected -> MessageType.CANCEL;
            case Completed, Closed -> MessageType.CLOSE;
            case UnderRework, Cancel -> null;
        };

        Employee user = requests.getStatus() == Status.New
                ? requests.getEmployee()
                : requests.getCreatedBy();

        telegramService.sendMessageForRequest(new TelegramRequestEvent(this, requests, user, type));
    }

    private NotificationApp getNotificationApp(Requests requests) {
        return switch (requests.getStatus()) {
            case New -> requests.getEmployee().getNotificationApp();
            case InWork, Rejected, Completed, Closed, Cancel, UnderRework -> requests.getCreatedBy().getNotificationApp();
        };
    }

    @Autowired
    public NotificationService(TelegramService telegramService, VkNotificationService vkNotificationService, MaxNotificationService maxNotificationService, SimpMessagingTemplate messagingTemplate) {
        this.telegramService = telegramService;
        this.vkNotificationService = vkNotificationService;
        this.maxNotificationService = maxNotificationService;
        this.messagingTemplate = messagingTemplate;
    }

    public void sendPrivateNotification(String username, String message, String link, String status) {
        Map<String, String> payload = Map.of(
                "message", message,
                "link", link,
                "status", status
        );

        messagingTemplate.convertAndSendToUser(
                username,
                "queue/notifications",
                payload
        );
    }
}
