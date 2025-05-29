package com.example.rces.services.telegram;

class ThreadIdResolver {
    public static Integer resolve(String department) {
        switch (department) {
            case "ОГЭ": return 6;
            case "ОТиПК": return 4;
            case "ОРС": return 3;
            case "ОГМ": return 2;
            default: return null;
        }
    }
}