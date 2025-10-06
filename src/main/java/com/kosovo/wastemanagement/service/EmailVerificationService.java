package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.model.EmailVerificationToken;
import com.kosovo.wastemanagement.model.User;
import com.kosovo.wastemanagement.repository.EmailVerificationTokenRepository;
import com.kosovo.wastemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    private static final int TOKEN_EXPIRATION_HOURS = 24;

    public void createVerificationToken(User user) {
        // Delete any existing tokens for this user
        tokenRepository.deleteByUserId(user.getId());
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(TOKEN_EXPIRATION_HOURS);
        
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(expiresAt)
                .build();
        
        tokenRepository.save(verificationToken);
        
        // Send verification email
        emailService.sendVerificationEmail(user, token);
        
        log.info("Verification token created for user: {}", user.getEmail());
    }

    public boolean verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElse(null);
        
        if (verificationToken == null) {
            log.warn("Invalid verification token: {}", token);
            return false;
        }
        
        if (verificationToken.isExpired()) {
            log.warn("Expired verification token: {}", token);
            tokenRepository.delete(verificationToken);
            return false;
        }
        
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        user.setIsActive(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        
        userRepository.save(user);
        tokenRepository.delete(verificationToken);
        
        // Send welcome email
        emailService.sendWelcomeEmail(user);
        
        log.info("Email verified successfully for user: {}", user.getEmail());
        return true;
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        if (user.getEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }
        
        createVerificationToken(user);
        log.info("Verification email resent to: {}", email);
    }
}

