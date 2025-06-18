package com.example.rces.services.telegram;

import com.example.rces.configuration.AppProperties;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.services.CustomUserDetailsService;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
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

import static com.example.rces.services.ServiceUtil.colorCalculate;

@Component
public class TelegramService extends TelegramLongPollingBot {

    private final UniversalService service;
    private final CustomUserDetailsService userDetailsService;
    private final RestTemplate restTemplate;
    private final MessageBuilder messageBuilder;
    //    private final TelegramUrlBuilder urlBuilder;
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
//        this.urlBuilder = new TelegramUrlBuilder();
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

    public void sendMessage(Object entity, Employee updaterEmployee, MessageType messageType) {
        SendMessage sendMessage = new SendMessage();
        if (entity instanceof Requests request) {
            sendMessage.setText(messageBuilder.buildRequestMessage(request, messageType));
            if (messageType.equals(MessageType.CREATE) || messageType.equals(MessageType.UPDATE)) {
                if (updaterEmployee.getRole().equals("CONSTRUCTOR")) {
                    sendMessage.setMessageThreadId(2343);
                    sendMessage.setChatId(chatIdResolver.resolveGroupId(request.getTypeRequest()));
                } else {
                    sendMessage.setChatId(updaterEmployee.getChatId());
                }
            } else if (messageType.equals(MessageType.COMPLETED)) {
                sendMessage.setChatId(request.getCreatedBy().getChatId());
            } else if (messageType.equals(MessageType.CANCEL) || messageType.equals(MessageType.CLOSE) || messageType.equals(MessageType.WORK)) {
                sendMessage.setChatId(updaterEmployee.getChatId());
            }
        } else if (entity instanceof SGI sgi) {
            sendMessage.setText(messageBuilder.buildRequestMessage(sgi, messageType));
            sendMessage.setChatId(this.controlChatId);
            sendMessage.setMessageThreadId(ThreadIdResolver.resolve(sgi.getDepartment() != null ? sgi.getDepartment().getName() : ""));
            sendMessage.setText(messageBuilder.buildRequestMessage(sgi, messageType));
        }
        try {
            Message message = execute(sendMessage);
            if ((messageType.equals(MessageType.CLOSE) || messageType.equals(MessageType.CANCEL)) && entity instanceof Requests request) {
                request.setCloseDate(LocalDateTime.now());
                request.setClosedEmployee(updaterEmployee);
                request.setChatId(message.getChatId());
                request.setMessageId(message.getMessageId());
                sendMessage.setChatId(request.getEmployee().getChatId());
                execute(sendMessage);
                service.save(request);
            }
        } catch (TelegramApiException e) {
            throw new RuntimeException(String.format("Ошибка при отправке сообщения в ТГ - %s\n%s", sendMessage.getText(), e.getMessage()));
        }
    }

//    public void sendNoAgreed(Requests request) {
//        String message = "Заявка №" + request.getRequestNumber() + " Не согласована + \n" +
//                "Ссылка на заявку: http://web.bormash.ru:2005/view/" + request.getRequestNumber();
//        String url = urlBuilder.buildUrl(request.getEmployee(), botToken,
//                request.getEmployee().getChatId().toString(), message);
//        restTemplate.getForObject(url, String.class);
//    }

//    public void sendCheckBid(Requests requests) {
//        Long chatId;
//        String message = "Заявка №" + requests.getRequestNumber() + " не была обработана в течении двух часов!!! + \n" +
//                "Ссылка на заявку: http://web.bormash.ru:2005/view/" + requests.getRequestNumber();
//        String url = urlBuilder.buildUrl(requests.getEmployee(), botToken,
//                chatId.toString(), message);
//        restTemplate.getForObject(url, String.class);
//    }

//    private void sendScoreIsSave(Requests request) {
//        String message = "Оценка сохранена";
//        String url = urlBuilder.buildUrl(request.getEmployee(), botToken,
//                request.getChatId().toString(), message);
//        restTemplate.getForObject(url, String.class);
//    }

    @Override
    @Transactional
    public void onUpdateReceived(Update update) {
//        if (update.hasMessage() && update.getMessage().hasText() && update.getMessage().isReply()) {
//            handleReplyMessage(update);
//        }
    }

//    private void handleReplyMessage(Update update) {
//        Employee employee = service.findSingleByField(Employee.class, "chatId", update.getMessage().getChatId());
//        String messageText = update.getMessage().getText();
//        if (messageText.matches("[1-5]")) {
//            processRating(employee, messageText, update.getMessage().getReplyToMessage().getMessageId());
//        }
//    }

//    private void processRating(Employee employee, String rating, Integer replyToMessageId) {
//        Appraisal score = Appraisal.fromId(Integer.parseInt(rating));
//        Requests request = service.findSingleByField(Requests.class, "messageId", replyToMessageId);
//        request.setScore(score);
//
//        setSecurityContext(employee);
//        service.save(request);
//        sendScoreIsSave(request);
//    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = service.findAll(SGI.class);
        String requestsNumbers = buildExpiredRequestsString(sgiList, today);
        if (!requestsNumbers.isEmpty()) {
            AppProperties.setString(requestsNumbers);
            sendMessage(new SGI(), null, MessageType.REGULAR);
        }
    }

//    @Scheduled(cron = "0 0 8-17/2 * * 1-5")
//    public void checkBid() {
//        List<Requests> filteredRequests = service.findAll(Requests.class).stream()
//                .filter(requests -> requests.getStatus().equals(Status.New))
//                .filter(requests -> Duration.between(requests.getCreateDate(),LocalDateTime.now()).toHours() >= 2)
//                .toList();
//
//        if (!filteredRequests.isEmpty()) {
//            for (Requests requests : filteredRequests) {
//                sendCheckBid(requests);
//            }
//        }
//    }

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