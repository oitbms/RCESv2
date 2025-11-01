package com.example.rces.init;

import com.example.rces.service.SpeService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Init implements CommandLineRunner {

    @PersistenceContext
    private EntityManager entityManager;
    private final SpeService speService;

    @Autowired
    public Init(SpeService speService) {
        this.speService = speService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("------------------------------ВСЕ ЧТО НИЖЕ НАДО ЗАМЕНИТЬ НА СОЗДАНИЯ ЛОГА------------------------------");
        System.out.println("------------------------------Перерасчет дат метрологии------------------------------");
        speService.calculateDateVerification();
        System.out.println("------------------------------Успех------------------------------");
    }

}
