package com.example.rces.services.telegram;

import com.example.rces.models.SGI;

class ThreadIdResolver {
    public static Integer resolve(String department) {
        return switch (department) {
            case "ОГЭ" -> 6;
            case "ОТиПК" -> 4;
            case "ОРС" -> 3;
            case "ОГМ" -> 2;
            default -> null;
        };
    }
}