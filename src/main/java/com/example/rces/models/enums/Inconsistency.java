package com.example.rces.models.enums;

import com.example.rces.controller.payload.InconsistencyPayload;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public enum Inconsistency {

    Inconsistency1("Несоответствие геометрии","ВИК"),
    Inconsistency2("Наружный дефект; сварные соединения","ВИК"),
    Inconsistency3("Несоответствие чертежу","ВИК"),
    Inconsistency4("Несоответствие консервации","ВИК"),
    Inconsistency5("Несоответствие качеств уплотнительной поверхности","ВИК"),
    Inconsistency6("Несоответствие материала","ЛНК"),
    Inconsistency7("Дефекты сварочных соединений","ЛНК");

    private final String name;

    private final String controlType;

    Inconsistency(String name,String controlType) {
        this.name = name;
        this.controlType = controlType;
    }

    public String getName() {
        return name;
    }
    public String getControlType() {
        return controlType;
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


