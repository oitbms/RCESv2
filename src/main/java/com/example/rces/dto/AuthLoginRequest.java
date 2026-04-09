package com.example.rces.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthLoginRequest {

    @NotBlank
    private String username;
}
