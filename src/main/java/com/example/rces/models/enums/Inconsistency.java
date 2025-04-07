package com.example.rces.models.enums;

public enum Inconsistency {

    Inconsistency1("Несоответствие1"),
    Inconsistency2("Несоответствие2"),
    Inconsistency3("Несоответствие3"),
    Inconsistency4("Несоответствие4"),
    Inconsistency5("Несоответствие5"),
    Inconsistency6("Несоответствие6"),
    Inconsistency7("Несоответствие7");

    private final String name;

    Inconsistency(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static Inconsistency fromField(Object field) {
        if (field.equals("")) {
            return null;
        }
        try {
            String name = field.toString().split("\"")[3];
            for (Inconsistency inconsistency : Inconsistency.values()) {
                if (inconsistency.getName().equals(name)) {
                    return inconsistency;
                }
            }
        } catch (Exception e) {
            for (Inconsistency inconsistency : Inconsistency.values()) {
                if (inconsistency.name().equals(field.toString())) {
                    return inconsistency;
                }
            }
        }
        throw new RuntimeException("Неизвестное несоответствие: " + field);
    }

}
