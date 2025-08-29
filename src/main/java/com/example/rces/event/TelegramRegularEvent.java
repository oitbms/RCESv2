package com.example.rces.event;

import com.example.rces.service.impl.telegram.MessageType;

public class TelegramRegularEvent extends TelegramEvent {
    private final String message;

    public TelegramRegularEvent(Object source, String message) {
        super(source, null, null, MessageType.REGULAR);
        this.message = message;
    }

    public TelegramRegularEvent(String message) {
        this(null, message);
    }

    public String getMessage() {
        return message;
    }
}
