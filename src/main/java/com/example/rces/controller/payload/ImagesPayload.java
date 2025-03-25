package com.example.rces.controller.payload;

import java.util.UUID;

public record ImagesPayload (UUID id, String name, String data, UUID mainlink){
}
