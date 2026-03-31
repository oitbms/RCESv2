package com.example.rces.service.impl;

import com.example.rces.models.Requests;
import com.example.rces.service.VkNotificationService;
import com.vk.api.sdk.client.VkApiClient;
import com.vk.api.sdk.client.actors.GroupActor;
import com.vk.api.sdk.exceptions.ApiException;
import com.vk.api.sdk.exceptions.ClientException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class VkNotificationServiceImpl implements VkNotificationService {

    private final VkApiClient vk;
    private final GroupActor actor;
    private final Random random = new Random();

    @Value("${vk.api.group.id}")
    private Long groupId;

    @Value("${vk.api.token}")
    private String accessToken;

    public VkNotificationServiceImpl(VkApiClient vk, GroupActor actor) {
        this.vk = vk;
        this.actor = actor;
    }

    @Override
    public void sendMessageForRequest(Requests requests) {
        switch (requests.getStatus()) {
            case New -> {
                String message = String.format("""
                                Заявка с номером - %d успешно создана!
                                Ответственный - %s
                                Цех - %s
                                Тип ТМЦ - %s
                                Заказ клиента - %s
                                Причина - %s
                                Перейти к заявке -> http://web.bormash.ru:2005/view/%d
                                """, requests.getRequestNumber(), requests.getEmployee().getName(),
                        requests.getSubDivision().getName(), requests.getItem() == null ? "не указан" : requests.getItem().getName(), requests.getCustomerOrder().getName(),
                        requests.getReason() == null ? "не указана" : requests.getReason(), requests.getRequestNumber());
                sendMessage(requests.getEmployee().getChatId(), message);
            }
            case InWork -> {
                String message = "Заявка с номером " + requests.getRequestNumber() + " в работе";
                sendMessage(requests.getCreatedBy().getChatId(), message);
            }
            case Closed -> {
                String message = "Заявка с номером " + requests.getRequestNumber() + " завершена";
                sendMessage(requests.getCreatedBy().getChatId(), message);
            }
            case Rejected -> {
                String message = "Заявка с номером " + requests.getRequestNumber() + " забракована";
                sendMessage(requests.getCreatedBy().getChatId(), message);
            }
        }
    }

    @Override
    public void sendMessageForRequestClone(Requests requests) {
        String message = "Заявка с номером " + requests.getRequestNumber() + " продублирована с оставшимся количеством брака";
        sendMessage(requests.getCreatedBy().getId(), message);
    }

    public void sendRedirectNotification(Requests requests) {
        Long chatId = requests.getEmployee().getChatId();
        String message = String.format(
                "Заявка #%d перенаправлена на %s %n" +
                        "Перейти к заявке -> http://web.bormash.ru:2005/view/%d",
                requests.getRequestNumber(),
                requests.getEmployee().getName(),
                requests.getRequestNumber()
        );

        sendMessage(chatId, message);
    }


    private void sendMessage(Long userId, String message) {
        try {
            Integer randomId = random.nextInt(Integer.MAX_VALUE);

            vk.messages()
                    .sendUserIds(actor)
                    .userId(userId)
                    .randomId(randomId)
                    .message(message)
                    .execute();

        } catch (ApiException e) {

        } catch (ClientException e) {

        }
    }

}
