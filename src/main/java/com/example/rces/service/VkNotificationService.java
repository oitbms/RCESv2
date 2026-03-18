package com.example.rces.service;

import com.example.rces.models.Requests;

public interface VkNotificationService {

    void sendMessageForRequest(Requests requests);

    void sendMessageForRequestClone(Requests requests);

    void sendRedirectNotification(Requests requests);
}
