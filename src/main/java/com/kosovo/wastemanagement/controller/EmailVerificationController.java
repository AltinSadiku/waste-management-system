package com.kosovo.wastemanagement.controller;

import com.kosovo.wastemanagement.service.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Email Verification", description = "Email verification endpoints")
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user email with verification token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    public ResponseEntity<?> verifyEmail(
            @Parameter(description = "Verification token from email", required = true)
            @RequestParam String token) {
        try {
            boolean verified = emailVerificationService.verifyEmail(token);
            if (verified) {
                return ResponseEntity.ok("Email verified successfully! You can now log in.");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired verification token.");
            }
        } catch (Exception e) {
            log.error("Error verifying email", e);
            return ResponseEntity.badRequest().body("Error verifying email: " + e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend verification email", description = "Resend verification email to user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Verification email sent successfully"),
            @ApiResponse(responseCode = "400", description = "User not found or already verified")
    })
    public ResponseEntity<?> resendVerificationEmail(
            @Parameter(description = "User email address", required = true)
            @RequestParam String email) {
        try {
            emailVerificationService.resendVerificationEmail(email);
            return ResponseEntity.ok("Verification email sent successfully!");
        } catch (Exception e) {
            log.error("Error resending verification email", e);
            return ResponseEntity.badRequest().body("Error resending verification email: " + e.getMessage());
        }
    }
}
