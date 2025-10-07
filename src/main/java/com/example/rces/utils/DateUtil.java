package com.example.rces.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;

@Component
public class DateUtil {

    private final Clock clock;

    @Autowired
    public DateUtil(Clock clock) {
        this.clock = clock;
    }

    public Instant now() {
        return clock.instant();
    }

    public static String formatedDate(Instant date) {
        if (date == null) {
            return "-";
        }
        return date.atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));
    }

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
