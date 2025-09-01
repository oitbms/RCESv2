package com.example.rces.service.impl;

import com.example.rces.configuration.AppProperties;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.service.TelegramService;
import com.example.rces.service.impl.telegram.ChatIdResolver;
import com.example.rces.service.impl.telegram.MessageBuilder;
import com.example.rces.service.impl.telegram.event.TelegramRegularEvent;
import com.example.rces.service.impl.telegram.event.TelegramRequestEvent;
import com.example.rces.service.impl.telegram.event.TelegramSgiEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextException;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import static com.example.rces.utils.ServiceUtil.colorCalculate;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class TelegramServiceImpl extends TelegramLongPollingBot implements TelegramService {

    private final MessageBuilder messageBuilder;
    private final String controlChatId;
    private final String testChatId;
    private final ServiceShit serviceShit;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Autowired
    public TelegramServiceImpl(
            @Value("${telegram.chat.constructor.id}") String constructorGroupChatId,
            @Value("${telegram.chat.technologist.id}") String technologistGroupChatId,
            @Value("${telegram.chat.control.id}") String controlChatId,
            @Value("${telegram.chat.test.id}") String testChatId,
            @Value("${url.mobile}") String urlMobile, ServiceShit serviceShit) {
        this.messageBuilder = new MessageBuilder(urlMobile, new ChatIdResolver(constructorGroupChatId, technologistGroupChatId));
        this.controlChatId = controlChatId;
        this.testChatId = testChatId;
        this.serviceShit = serviceShit;
    }

    @Override
    @EventListener
    public void sendMessageForSGI(TelegramSgiEvent sgiEvent) {
        SendMessage sendMessage = new SendMessage();
        messageBuilder.buildRequestMessage(sgiEvent.getSgi(), sgiEvent.getMessageType(), sendMessage);
        sendMessage.setChatId(controlChatId);
        try {
            execute(sendMessage);
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при отправке сообщения в ТГ - СГИ " + e.getMessage());
        }
    }

    @Override
    @EventListener
    public Message sendMessageForRequest(TelegramRequestEvent requestEvent) {
        SendMessage sendMessage = new SendMessage();
        Employee updaterEmployee = requestEvent.getUpdaterEmployee();
        Requests request = requestEvent.getRequest();
        messageBuilder.buildRequestMessage(request, requestEvent.getMessageType(), sendMessage, updaterEmployee);
        try {
            return execute(sendMessage);
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при отправке сообщения в ТГ - Request " + e.getMessage());
        }
    }

    @Override
    @EventListener
    public void sendRegularMessage(TelegramRegularEvent regularEvent) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(regularEvent.getChatId());
        sendMessage.setText(regularEvent.getMessage());
        try {
            execute(sendMessage);
        } catch (TelegramApiException e) {
            throw new ApplicationContextException(String.format("Ошибка при отправке регулярного сообщения: %s",
                    regularEvent.getEntity().getClass().getSimpleName()) + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = serviceShit.findAll();
        String requestsNumbers = buildExpiredRequestsString(sgiList, today);
        if (!requestsNumbers.isEmpty()) {
            AppProperties.setString(requestsNumbers);
            sendRegularMessage(new TelegramRegularEvent("Просрочен срок выполнения мероприятий: №%s", requestsNumbers, this.controlChatId));
        }
    }

    private String buildExpiredRequestsString(List<SGI> sgiList, LocalDate today) {
        StringBuilder requestsNumbers = new StringBuilder();
        for (SGI sgi : sgiList.stream().sorted(Comparator.comparing(SGI::getRequestNumber)).toList()) {
            sgi.setColor(colorCalculate(sgi, today));
            if (sgi.getColor().equals(SGI.ColorSGI.RED)) {
                if (!requestsNumbers.isEmpty()) {
                    requestsNumbers.append(", ");
                }
                requestsNumbers.append(String.format("%d (%s)", sgi.getRequestNumber(), sgi.getDepartment().getName()));
            }
        }
        return requestsNumbers.toString();
    }

    @Override
    public String getBotUsername() {
        return "BormashRequestBot";
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {

    }
}