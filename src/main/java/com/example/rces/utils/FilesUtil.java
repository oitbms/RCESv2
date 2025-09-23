package com.example.rces.utils;

import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.Images;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class FilesUtil {

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

    public static List<Images> saveFiles(MultipartFile[] files, FactExecutionSGI sgi) {
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
                imageEntity.setSgi(sgi);
                images.add(imageEntity);
            }
        }
        return images;
    }

    public static List<Images> saveFiles(MultipartFile[] files, SGI sgi) {
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
                imageEntity.setSgim(sgi);
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

    public static byte[] getBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при получении байт: " + file.getOriginalFilename(), e);
        }
    }

}
