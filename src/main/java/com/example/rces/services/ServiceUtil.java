package com.example.rces.services;

import com.example.rces.models.Images;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ServiceUtil {

    //Все методы
    public static List<Field> getAllDeclaredFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        while (clazz != null) {
            Field[] declaredFields = clazz.getDeclaredFields();
            Collections.addAll(fields, declaredFields);
            clazz = clazz.getSuperclass();
        }
        return fields;
    }

    public static Object getMethod(Class<?> clazz, Object entity, String methodName) {
        List<Method> methods = new ArrayList<>();
        while (clazz != null) {
            Method[] declaredMethods = clazz.getDeclaredMethods();
            Collections.addAll(methods, declaredMethods);
            clazz = clazz.getSuperclass();
        }
        for (Method method : methods) {
            if (method.getName().equals(methodName)) {
                try {
                    return method.invoke(entity);
                } catch (IllegalAccessException | InvocationTargetException e) {
                    throw new RuntimeException(e);
                }
            }
        }
        return null;
    }


    //Глубокое копирование объекта
    public static <T> T deepCopy(Object original, Class<?> clazz) {
        try {
            T copy = (T) clazz.getDeclaredConstructor().newInstance();
            for (Field field : getAllDeclaredFields(clazz)) {
                field.setAccessible(true);
                field.set(copy, field.get(original));
            }
            return copy;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при копировании объекта", e);
        }
    }

    public static List<Images> saveFiles(MultipartFile[] files, Object entity) {
        List<Images> images = new ArrayList<>();
        Class<?> clazz = entity.getClass();
        String methodName = "set" + clazz.getSimpleName();

        try {
            Method setter = Images.class.getMethod(methodName, clazz);

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    Images imageEntity = new Images();
                    imageEntity.setFileName(file.getOriginalFilename());
                    imageEntity.setData(file.getBytes());

                    setter.invoke(imageEntity, entity);
                    images.add(imageEntity);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return images;
    }


}
