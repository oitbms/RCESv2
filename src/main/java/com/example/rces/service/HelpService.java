package com.example.rces.service;


import com.example.rces.models.ApplicationInfo;
import com.example.rces.models.Feature;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class HelpService {


    public ApplicationInfo getApplicationInfo() {
        ApplicationInfo info = new ApplicationInfo();
        info.setTitle("Система управления заявками");
        info.setDocumentationUrl("/api/docs");

        info.setFeatures(getFeaturesFromConfig());

        return info;
    }

    private List<Feature> getFeaturesFromConfig() {

        return Arrays.asList(
                new Feature("Создание заявок", "Возможность создания новых заявок", true, "main"),
                new Feature("Просмотр и поиск заявок", "Поиск,фильтрация и отслеживание заявок", true, "main"),
                new Feature("Изменение статуса заявки", "Функционал изменения заявок", true, "main")
        );
    }
}