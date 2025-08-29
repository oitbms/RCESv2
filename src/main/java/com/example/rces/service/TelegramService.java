package com.example.rces.service;

import com.example.rces.models.Employee;
import com.example.rces.service.impl.telegram.MessageType;
import org.springframework.context.ApplicationContextException;

public interface TelegramService {

    void sendMessage(Object entity, Employee updaterEmployee, MessageType messageType) throws ApplicationContextException;

}
