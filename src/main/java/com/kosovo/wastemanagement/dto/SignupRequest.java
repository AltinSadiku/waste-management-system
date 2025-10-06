package com.kosovo.wastemanagement.dto;

import com.kosovo.wastemanagement.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "User registration request")
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    @Schema(description = "Username", example = "john.doe")
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    @Schema(description = "Password", example = "password123")
    private String password;

    @NotBlank
    @Size(max = 50)
    @Schema(description = "First name", example = "John")
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Schema(description = "Last name", example = "Doe")
    private String lastName;

    @Size(max = 20)
    @Schema(description = "Phone number", example = "+1234567890")
    private String phoneNumber;

    @Schema(description = "User role", example = "CITIZEN")
    private User.Role role = User.Role.CITIZEN;

    // Citizen specific fields
    @Size(max = 200)
    @Schema(description = "Address", example = "123 Main St, City")
    private String address;

    @Schema(description = "Latitude", example = "42.6629")
    private Double latitude;
    
    @Schema(description = "Longitude", example = "21.1655")
    private Double longitude;

    // Worker specific fields
    @Schema(description = "Assigned area ID (for workers)", example = "1")
    private Long assignedAreaId;
}





