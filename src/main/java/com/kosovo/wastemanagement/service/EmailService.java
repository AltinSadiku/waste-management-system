package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    
    @Value("${app.mail.from:noreply@wastemanagement.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    public void sendVerificationEmail(User user, String verificationToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Verify Your Email - Waste Management System");
            
            Context context = new Context();
            context.setVariable("user", user);
            context.setVariable("verificationUrl", backendUrl + "/api/auth/verify-email?token=" + verificationToken);
            context.setVariable("frontendUrl", frontendUrl);
            
            String htmlContent = templateEngine.process("email/verification", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendCollectionReminderEmail(User user, Map<String, Object> scheduleData) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Waste Collection Reminder - Tomorrow");
            
            Context context = new Context();
            context.setVariable("user", user);
            context.setVariable("schedule", scheduleData);
            context.setVariable("frontendUrl", frontendUrl);
            
            String htmlContent = templateEngine.process("email/collection-reminder", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Collection reminder email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send collection reminder email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send collection reminder email", e);
        }
    }

    public void sendWelcomeEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to Waste Management System");
            
            Context context = new Context();
            context.setVariable("user", user);
            context.setVariable("frontendUrl", frontendUrl);
            
            String htmlContent = templateEngine.process("email/welcome", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }
}
