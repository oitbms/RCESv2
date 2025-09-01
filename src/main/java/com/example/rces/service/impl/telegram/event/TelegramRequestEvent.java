package com.example.rces.service.impl.telegram.event;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.service.impl.telegram.MessageType;

public class TelegramRequestEvent extends TelegramEvent {

    private final Requests request;

    public TelegramRequestEvent(Object source, Requests request, Employee updaterEmployee, MessageType messageType) {
        super(source, request, updaterEmployee, messageType);
        this.request = request;
    }

    public TelegramRequestEvent(Requests request, Employee updaterEmployee, MessageType messageType) {
        this(null, request, updaterEmployee, messageType);
    }

    public Requests getRequest() {
        return request;
    }

    @Override
    public Requests getEntity() {
        return request;
    }
}
