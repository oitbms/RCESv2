package com.example.rces.service.impl.telegram.event;

import com.example.rces.models.Employee;
import com.example.rces.models.SGI;
import com.example.rces.service.impl.telegram.MessageType;

public class TelegramSgiEvent extends TelegramEvent {

    private final SGI sgi;

    public TelegramSgiEvent(Object source, SGI sgi, Employee updaterEmployee, MessageType messageType) {
        super(source, sgi, updaterEmployee, messageType);
        this.sgi = sgi;
    }

    public TelegramSgiEvent(SGI sgi, Employee updaterEmployee, MessageType messageType) {
        this(null, sgi, updaterEmployee, messageType);
    }

    public SGI getSgi() {
        return sgi;
    }

    @Override
    public SGI getEntity() {
        return sgi;
    }

}
