package com.example.rces;

import com.example.rces.spm.models.Item;
import com.example.rces.spm.services.SPMService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.math.BigDecimal;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackages = {
        "com.example.rces.models",
        "com.example.rces.spm.models"
})
@EnableJpaRepositories(basePackages = {
        "com.example.rces.spm.services", "com.example.rces.services"
})
@EnableAsync
public class RcesApplication {

    private final SPMService service;

    @Autowired
    public RcesApplication(SPMService service) {
        this.service = service;
    }

//    @PostConstruct
//    public void fsas() {
//        BigDecimal item = service.getItemService().getTotalProductionForItem(service.findById(Item.class, 575086559L), BigDecimal.ONE);
//        String sas = "";
//    }

    public static void main(String[] args) {
        SpringApplication.run(RcesApplication.class, args);
    }

//    @Bean
//    public TelegramBotsApi telegramBotsApi(TelegramServiceImpl bot) throws TelegramApiException {
//        TelegramBotsApi api = new TelegramBotsApi(DefaultBotSession.class);
//        api.registerBot(bot);
//        return api;
//    }
}
