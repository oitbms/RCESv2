package com.example.rces.service;

import com.example.rces.service.impl.telegram.event.TelegramRegularEvent;
import com.example.rces.service.impl.telegram.event.TelegramRequestEvent;
import com.example.rces.service.impl.telegram.event.TelegramSgiEvent;
import com.example.rces.models.Employee;
import com.example.rces.service.impl.telegram.MessageType;
import org.springframework.context.ApplicationContextException;
import org.telegram.telegrambots.meta.api.objects.Message;

public interface TelegramService {

    void sendMessageForSGI(TelegramSgiEvent sgiEvent) throws ApplicationContextException;

    Message sendMessageForRequest(TelegramRequestEvent requestEvent);

    void sendRegularMessage(TelegramRegularEvent regularEvent);

}
