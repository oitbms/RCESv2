package com.example.rces.services;

import com.example.rces.models.Images;
import com.example.rces.models.Requests;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ServiceUtil {

    // Сохранение коллекции изображений
    public static List<Images> saveFiles(MultipartFile[] files, Requests requests) {
        List<Images> images = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                Images imageEntity = new Images();
                imageEntity.setFileName(file.getOriginalFilename());
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
            toRemove.removeIf(img -> newImages.contains(img));
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
        return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
    }

    public static boolean isJson(Object value) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            objectMapper.readTree(value.toString());
            return true;
        } catch (Exception e) {
            return false;
        }

    }
}
