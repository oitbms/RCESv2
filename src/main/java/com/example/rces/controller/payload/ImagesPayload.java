package com.example.rces.controller.payload;

import java.util.UUID;

public record ImagesPayload (UUID id, String name, byte[] data, UUID mainlink){
}
