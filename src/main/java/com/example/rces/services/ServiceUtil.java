package com.example.rces.services;

import com.example.rces.models.Employee;
import com.example.rces.models.Images;
import com.example.rces.models.RequestLog;
import com.example.rces.models.Requests;
import com.example.rces.models.enums.Status;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.context.ApplicationContextException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class ServiceUtil {

    // Сохранение коллекции изображений
    public static List<Images> saveFiles(MultipartFile[] files, Requests requests) {
        List<Images> images = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                Images imageEntity = new Images();
                imageEntity.setName(file.getOriginalFilename());
                try {
                    imageEntity.setData(file.getBytes());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                imageEntity.setRequest(requests);
                images.add(imageEntity);
            }
        }
        return images;
    }

    //Изменение коллекции изображений
    public static void handleImageCollection(Requests request, List<?> newImages) {
        List<Images> currentImages = request.getImages();
        List<Images> toRemove = new ArrayList<>(currentImages);
        if (newImages != null) {
            toRemove.removeIf(newImages::contains);
        }
        toRemove.forEach(img -> img.setRequest(null));
        currentImages.removeAll(toRemove);
        if (newImages != null) {
            for (Object img : newImages) {
                Images image = (Images) img;
                if (!currentImages.contains(image)) {
                    image.setRequest(request);
                    currentImages.add(image);
                }
            }
        }
    }

    public static String formatedDate(LocalDateTime date) {
        if (date == null) {
            return "-";
        }
        return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
    }

    public static boolean isJson(Object value) {
        if (value == null) {
            return false;
        }
        String str;
        try {
            str = value.toString();
        } catch (Exception e) {
            return false;
        }
        str = str.trim();
        if (!str.startsWith("{") && !str.startsWith("[")) {
            return false;
        }
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode node = mapper.readTree(str);
            return node.isObject() || node.isArray();
        } catch (Exception e) {
            return false;
        }
    }

    public static List<Requests> filterRequestsByCurrentMonth(List<Requests> requests, LocalDate now) {
        return requests.stream()
                .filter(req -> req.getCreateDate().getMonth() == now.getMonth() &&
                        req.getCreateDate().getYear() == now.getYear())
                .toList();
    }

    public static int[] countDailyRequests(List<Requests> requests) {
        int daysInMonth = LocalDate.now().getDayOfMonth();
        int[] dailyCounts = new int[daysInMonth];

        for (Requests req : requests) {
            int day = req.getCreateDate().getDayOfMonth();
            dailyCounts[day - 1]++;
        }
        return dailyCounts;
    }

    //Вычисление среднего времени обработки заявки в часах
    public static Map<String, Double> averageTimeRequests(List<Requests> requests) {
        Map<String, Double> mapAverageTime = new HashMap<>();

        for (String key : Arrays.stream(Requests.Type.values()).map(Enum::name).toList()) {
            long requestsCount = 0;
            long time = 0;

            Requests.Type type = Requests.Type.valueOf(key);

            for (Requests req : requests) {
                if (req.getDateWork() != null && req.getTypeRequest().equals(type)) {
                    Duration duration = Duration.between(req.getCreateDate(), req.getDateWork());
                    time += duration.toMinutes();
                    requestsCount++;
                }
            }

            Double averageTime = (requestsCount > 0) ? (double) (time / requestsCount) / 60 : 0.0;
            mapAverageTime.put(key, averageTime);
        }

        return mapAverageTime;
    }

    //Вычисление среднего времени закрытия заявки в часах
    public static Map<String, Double> averageClosedRequests(List<Requests> requests) {
        Map<String, Double> mapAverageClosed = new HashMap<>();

        for (String key : Arrays.stream(Requests.Type.values()).map(Enum::name).toList()) {
            long requestsCount = 0;
            long time = 0;
            Requests.Type type = Requests.Type.valueOf(key);

            for (Requests req : requests) {
                if (req.getDateWork() != null && req.getTypeRequest().equals(type)) {
                    Duration duration = Duration.between(req.getDateWork(), req.getCloseDate());
                    time += duration.toMinutes();
                    requestsCount++;
                }
            }
            double averageTimeRequest = (requestsCount > 0) ? (double) (time / requestsCount) / 60 : 0.0;
            mapAverageClosed.put(key, averageTimeRequest);
        }
        return mapAverageClosed;
    }

    public static Map<String, List<Integer>> getCountDays(List<Requests> requests) {
        Map<String, List<Integer>> map = new HashMap<>();
        for (String type : Arrays.stream(Requests.Type.values()).map(Enum::name).toList()) {
            List<Requests> requestsOfType = requests
                    .stream()
                    .filter(r -> r.getTypeRequest().equals(Requests.Type.valueOf(type)))
                    .toList();
            List<Requests> filterRequests = filterRequestsByCurrentMonth(requestsOfType, LocalDate.now());
            int[] dailyCounts = countDailyRequests(filterRequests);
            map.put(type, Arrays.stream(dailyCounts).boxed().toList());
        }
        return map;
    }

    public static List<Integer> countDailyRequestsList(List<Requests> filteredRequests) {
        int[] dailyCounts = countDailyRequests(filteredRequests);
        return Arrays.stream(dailyCounts).boxed().toList();
    }

    public static Map<String, Integer> countRequest(List<Requests> filteredRequests) {
        Map<String, Integer> qtuRequests = new HashMap<>();
        List<Requests> requsets;
        for (String type : Arrays.stream(Requests.Type.values()).map(Enum::name).toList()) {
            Requests.Type reqType = Requests.Type.valueOf(type);
            requsets = filteredRequests.stream()
                    .filter(requests -> requests.getTypeRequest() == reqType)
                    .toList();
            qtuRequests.put(type, requsets.size());
        }
        return qtuRequests;
    }

    public static boolean allowedCreateOrUpdate(Object entity, Employee updaterEmployee, Boolean create) {
        if (!(entity instanceof Requests request)) {
            return true;
        }
        if (create && (updaterEmployee.getRole().equals("ADMIN") || updaterEmployee.getRole().equals("MASTER"))) {
            return true;
        }
        //у ОТК может закрывать только отк и редактировать после принятие в работу только отк
        else if(request.getTypeRequest().equals(Requests.Type.otk) &&
                updaterEmployee.getRole().equals("MASTER") && (request.getStatus().equals(Status.Closed) || request.getStatus().equals(Status.InWork)) || request.getStatus().equals(Status.Completed)) {
            throw new ForbiddenException();
        } else if (!request.getEmployee().getId().equals(updaterEmployee.getId()) && (!updaterEmployee.getRole().equals("ADMIN") && !updaterEmployee.getRole().equals("MASTER"))) {
            throw new ForbiddenException();
        } else if ((request.getStatus().equals(Status.Closed) || request.getStatus().equals(Status.Cancel)) && !request.getCreatedBy().equals(updaterEmployee) && !updaterEmployee.getRole().equals("ADMIN")) {
            throw new ForbiddenException();
        }
        else return true;
    }

    public static void createLog(Requests oldRequest, Requests newRequest, Employee updaterUser, UniversalService service) {
        try {
            Map<String, String> metadata = new HashMap<>();
            Class<?> clazz = oldRequest.getClass();

            for (Field field : clazz.getDeclaredFields()) {
                switch (field.getName()) {
                    case "version", "updateBy", "updateDate", "log" -> {
                        continue;
                    }
                }

                field.setAccessible(true);
                String fieldName = field.getName();
                String oldStr = field.get(oldRequest) == null ? "null" :
                        (field.getType().isAnnotationPresent(Entity.class) ?
                                getEntityFieldValue(field.get(oldRequest)) :
                                field.get(oldRequest).toString());
                String newStr = field.get(newRequest) == null ? "null" :
                        (field.getType().isAnnotationPresent(Entity.class) ?
                                getEntityFieldValue(field.get(newRequest)) :
                                field.get(newRequest).toString());

                if (!Objects.equals(oldStr, newStr)) {
                    metadata.put(fieldName, oldStr + "->" + newStr);
                }
            }

            if (!metadata.isEmpty()) {
                service.save(new RequestLog(newRequest, updaterUser, metadata));
            }
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при создании лога", e);
        }
    }

    private static String getEntityFieldValue(Object entity) {
        try {
            Field nameField = entity.getClass().getDeclaredField("name");
            nameField.setAccessible(true);
            Object value = nameField.get(entity);
            return value != null ? value.toString() : "null";
        } catch (Exception e) {
            return entity.toString();
        }
    }
}
