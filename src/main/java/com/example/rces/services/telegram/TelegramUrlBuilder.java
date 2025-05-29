package com.example.rces.services.telegram;

import com.example.rces.models.Employee;

public class TelegramUrlBuilder {
    private static final String BASE_MESSAGE_URL = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";
    private static final String CONSTRUCTOR_MESSAGE_URL = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&message_thread_id=2343&text=%s";

    public String buildUrl(Employee employee, String botToken, String chatId, String message) {
        String baseUrl = getBaseUrlForEmployee(employee);
        return String.format(baseUrl, botToken, chatId, message);
    }

    private String getBaseUrlForEmployee(Employee employee) {
        if ("CONSTRUCTOR".equals(employee.getRole())) {
            return CONSTRUCTOR_MESSAGE_URL;
        } else if ("CONTROL".equals(employee.getRole()) || "EVENT".equals(employee.getRole())) {
            return "";
        }
        return BASE_MESSAGE_URL;
    }
}