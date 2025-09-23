package com.example.rces.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    public static String formatedDate(LocalDateTime date) {
        if (date == null) {
            return "-";
        }
        return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
    }

    public static String formatedDate(LocalDate date) {
        if (date == null) {
            return "-";
        }
        return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
    }

}
