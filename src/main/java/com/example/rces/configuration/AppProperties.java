package com.example.rces.configuration;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class AppProperties  {
    private static AppProperties  instance;

    private String string;

    @PostConstruct
    private void init() {
        instance = this;
    }

    private static AppProperties  getInstance() {
        return instance;
    }

    public static String getString() {
        String string = getInstance().string;
        setString(null);
        return string;
    }

    public static void setString(String string) {
        getInstance().string = string;
    }
}