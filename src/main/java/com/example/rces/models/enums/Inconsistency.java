package com.example.rces.models.enums;

import com.example.rces.controller.payload.InconsistencyPayload;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public enum Inconsistency {

    Inconsistency1("1"),
    Inconsistency2("2"),
    Inconsistency3("3"),
    Inconsistency4("4"),
    Inconsistency5("5"),
    Inconsistency6("6"),
    Inconsistency7("7");

    private final String name;

    Inconsistency(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static Set<Inconsistency> fromField(Object field) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InconsistencyPayload[] inconsistencies = mapper.readValue((String) field, InconsistencyPayload[].class);
            return Arrays.stream(inconsistencies)
                    .map(payload -> Arrays.stream(Inconsistency.values())
                            .filter(inc -> inc.getName().equals(payload.name()))
                            .findFirst()
                            .orElse(null))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            return null;
        }
    }
}


