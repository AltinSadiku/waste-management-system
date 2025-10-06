package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.security.JwtUtils;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtUtils jwtUtils;

    public JwtService(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    public String generateJwtToken(Authentication authentication) {
        return jwtUtils.generateJwtToken(authentication);
    }

    public String getUserNameFromJwtToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }

    public boolean validateJwtToken(String authToken) {
        return jwtUtils.validateJwtToken(authToken);
    }
}






