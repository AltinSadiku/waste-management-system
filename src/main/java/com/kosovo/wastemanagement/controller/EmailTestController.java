package com.kosovo.wastemanagement.controller;

import com.kosovo.wastemanagement.service.EmailService;
import com.kosovo.wastemanagement.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Email Testing", description = "Test email functionality (Admin only)")
@SecurityRequirement(name = "bearerAuth")
public class EmailTestController {

    private final EmailService emailService;

    @PostMapping("/email/verification")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Test verification email", description = "Send a test verification email (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test email sent successfully"),
            @ApiResponse(responseCode = "400", description = "Error sending email"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    public ResponseEntity<?> testVerificationEmail(
            @Parameter(description = "Email address to send test to", required = true)
            @RequestParam String email) {
        try {
            // Create a test user object
            User testUser = User.builder()
                    .firstName("Test")
                    .lastName("User")
                    .email(email)
                    .username("testuser")
                    .build();
            
            String testToken = "test-token-12345";
            emailService.sendVerificationEmail(testUser, testToken);
            
            return ResponseEntity.ok("Verification email sent successfully to: " + email);
        } catch (Exception e) {
            log.error("Error sending test verification email", e);
            return ResponseEntity.badRequest().body("Error sending email: " + e.getMessage());
        }
    }

    @PostMapping("/email/welcome")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testWelcomeEmail(@RequestParam String email) {
        try {
            // Create a test user object
            User testUser = User.builder()
                    .firstName("Test")
                    .lastName("User")
                    .email(email)
                    .username("testuser")
                    .role(User.Role.CITIZEN)
                    .build();
            
            emailService.sendWelcomeEmail(testUser);
            
            return ResponseEntity.ok("Welcome email sent successfully to: " + email);
        } catch (Exception e) {
            log.error("Error sending test welcome email", e);
            return ResponseEntity.badRequest().body("Error sending email: " + e.getMessage());
        }
    }

    @PostMapping("/email/collection-reminder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testCollectionReminderEmail(@RequestParam String email) {
        try {
            // Create a test user object
            User testUser = User.builder()
                    .firstName("Test")
                    .lastName("User")
                    .email(email)
                    .username("testuser")
                    .build();
            
            // Create test schedule data
            Map<String, Object> scheduleData = new HashMap<>();
            scheduleData.put("wasteType", "GENERAL WASTE");
            scheduleData.put("time", "08:00");
            scheduleData.put("area", "Downtown");
            scheduleData.put("day", "MONDAY");
            
            emailService.sendCollectionReminderEmail(testUser, scheduleData);
            
            return ResponseEntity.ok("Collection reminder email sent successfully to: " + email);
        } catch (Exception e) {
            log.error("Error sending test collection reminder email", e);
            return ResponseEntity.badRequest().body("Error sending email: " + e.getMessage());
        }
    }
}
