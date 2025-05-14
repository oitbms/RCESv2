package com.example.rces;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RcesApplication {

    public static void main(String[] args) {
        SpringApplication.run(RcesApplication.class, args);
    }

//    @Bean
//    public TelegramBotsApi telegramBotsApi(TelegramService bot) throws TelegramApiException {
//        TelegramBotsApi api = new TelegramBotsApi(DefaultBotSession.class);
//        api.registerBot(bot);
//        return api;
//    }
}
