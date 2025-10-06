package com.kosovo.wastemanagement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "User login request")
public class LoginRequest {
    @NotBlank
    @Schema(description = "Username or email", example = "john.doe")
    private String username;

    @NotBlank
    @Schema(description = "User password", example = "password123")
    private String password;
}





