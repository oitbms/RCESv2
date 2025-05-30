package com.example.rces.services.telegram;

import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.Appraisal;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.rces.services.ServiceUtil.colorCalculate;

@Component
public class TelegramService extends TelegramLongPollingBot {

    private final UniversalService service;
    private final CustomUserDetailsService userDetailsService;
    private final RestTemplate restTemplate;
    private final MessageBuilder messageBuilder;
    private final TelegramUrlBuilder urlBuilder;
    private final ChatIdResolver chatIdResolver;
    private final String controlChatId;
    private final String testChatId;

    @Value("${telegram.bot.token}")
    private String botToken;

    @Autowired
    public TelegramService(UniversalService service,
                           CustomUserDetailsService userDetailsService,
                           @Value("${telegram.chat.constructor.id}") String constructorGroupChatId,
                           @Value("${telegram.chat.technologist.id}") String technologistGroupChatId,
                           @Value("${telegram.chat.control.id}") String controlChatId,
                           @Value("${telegram.chat.test.id}") String testChatId,
                           @Value("${url.mobile}") String urlMobile) {
        this.service = service;
        this.userDetailsService = userDetailsService;
        this.restTemplate = new RestTemplate();
        this.messageBuilder = new MessageBuilder(urlMobile);
        this.chatIdResolver = new ChatIdResolver(constructorGroupChatId, technologistGroupChatId);
        this.urlBuilder = new TelegramUrlBuilder();
        this.controlChatId = controlChatId;
        this.testChatId = testChatId;
    }
    @Override
    public String getBotUsername() {
        return "BormashRequestBot";
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    public void sendMessageToGroup(Requests request) {
        String message = messageBuilder.buildRequestMessage(request, MessageType.CREATE);
        String url = urlBuilder.buildUrl(request.getEmployee(), botToken,
                chatIdResolver.resolveGroupId(request.getTypeRequest()), message);
        restTemplate.getForObject(url, String.class);
    }

    public void sendUpdateMessageToGroup(Requests request) {
        String message = messageBuilder.buildRequestMessage(request, MessageType.UPDATE);
        String url = urlBuilder.buildUrl(request.getEmployee(), botToken,
                request.getCreatedBy().getChatId().toString(), message);
        restTemplate.getForObject(url, String.class);
    }

    public void sendMessageToUser(Requests request, Long chatId, MessageType messageType) {
        String message = messageBuilder.buildRequestMessage(request, messageType);
        String url = urlBuilder.buildUrl(request.getEmployee(), botToken, chatId.toString(), message);
        restTemplate.getForObject(url, String.class);
    }

    public void sendCompleted(Requests request) {
        String message = "Заявка №" + request.getRequestNumber() + " Выполнена";
        String url = urlBuilder.buildUrl(request.getEmployee(), botToken,
                request.getCreatedBy().getChatId().toString(), message);
        restTemplate.getForObject(url, String.class);
    }

    public void closeOrCanceledRequestMessage(Requests request, Employee updaterEmployee) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(updaterEmployee.getChatId());
        sendMessage.setText(String.format("Заявка № %d %s\nОписание: %s\nОцените работу сотрудника (от 1 до 5)",
                request.getRequestNumber(),
                request.getStatus().getName() + "a",
                request.getDescription()));

        try {
            Message message = execute(sendMessage);
            request.setCloseDate(LocalDateTime.now());
            request.setClosedEmployee(updaterEmployee);
            request.setChatId(message.getChatId());
            request.setMessageId(message.getMessageId());

            SendMessage completionMessage = new SendMessage();
            Employee employee = service.findById(Employee.class,request.getEmployee().getId());
            if (request.getTypeRequest().equals(Requests.Type.otk)){
                completionMessage.setChatId(employee.getChatId());
            } else {
                completionMessage.setChatId(chatIdResolver.resolveGroupId(request.getTypeRequest()));
            }
            completionMessage.setText(String.format("Заявка № %d %s",
                    request.getRequestNumber(),
                    request.getStatus().getName() + "а"));

            execute(completionMessage);

            service.save(request);
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendScoreIsSave(Requests request) {
        String message = "Оценка сохранена";
        String url = urlBuilder.buildUrl(request.getEmployee(), botToken,
                request.getChatId().toString(), message);
        restTemplate.getForObject(url, String.class);
    }

    public void sendMessageToControl(String text, String department) {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(this.controlChatId);
        if (department != null) {
            sendMessage.setMessageThreadId(ThreadIdResolver.resolve(department));
        }
        sendMessage.setText(text);
        try {
            execute(sendMessage);
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText() && update.getMessage().isReply()) {
            handleReplyMessage(update);
        }
    }

    private void handleReplyMessage(Update update) {
        Employee employee = service.findSingleByField(Employee.class, "chatId", update.getMessage().getChatId());
        String messageText = update.getMessage().getText();

        if (messageText.matches("[1-5]")) {
            processRating(employee, messageText, update.getMessage().getReplyToMessage().getMessageId());
        }
    }

    private void processRating(Employee employee, String rating, Integer replyToMessageId) {
        Appraisal score = Appraisal.fromId(Integer.parseInt(rating));
        Requests request = service.findSingleByField(Requests.class, "messageId", replyToMessageId);
        request.setScore(score);

        setSecurityContext(employee);
        service.save(request);
        sendScoreIsSave(request);
    }

    private void setSecurityContext(Employee employee) {
        Authentication anonymousAuth = new AnonymousAuthenticationToken(
                UUID.randomUUID().toString(),
                employee.getName(),
                List.of(new SimpleGrantedAuthority(employee.getRole())));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(anonymousAuth);
        SecurityContextHolder.setContext(context);
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = service.findAll(SGI.class);
        String requestsNumbers = buildExpiredRequestsString(sgiList, today);

        if (!requestsNumbers.isEmpty()) {
            sendMessageToControl("Срок выполнения мероприятий №" + requestsNumbers + " истекает через 2 дня", null);
        }
    }

    private String buildExpiredRequestsString(List<SGI> sgiList, LocalDate today) {
        StringBuilder requestsNumbers = new StringBuilder();
        for (SGI sgi : sgiList) {
            sgi.setColor(colorCalculate(sgi, today));
            if (sgi.getColor().equals(SGI.ColorSGI.RED)) {
                if (!requestsNumbers.isEmpty()) {
                    requestsNumbers.append(", ");
                }
                requestsNumbers.append(sgi.getRequestNumber());
            }
        }
        return requestsNumbers.toString();
    }
}