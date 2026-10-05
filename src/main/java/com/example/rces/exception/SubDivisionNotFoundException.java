package com.example.rces.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SubDivisionNotFoundException extends RuntimeException {
    public SubDivisionNotFoundException(Long id) {
        super("Подразделение не найдено (id " + id + ")");
    }
}
