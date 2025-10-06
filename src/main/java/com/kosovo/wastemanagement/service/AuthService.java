package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.dto.JwtResponse;
import com.kosovo.wastemanagement.dto.LoginRequest;
import com.kosovo.wastemanagement.dto.SignupRequest;
import com.kosovo.wastemanagement.model.Area;
import com.kosovo.wastemanagement.model.User;
import com.kosovo.wastemanagement.repository.AreaRepository;
import com.kosovo.wastemanagement.repository.UserRepository;
import com.kosovo.wastemanagement.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtService.generateJwtToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<String> authorities = userPrincipal.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt, "Bearer", userPrincipal.getId(), userPrincipal.getUsername(),
                userPrincipal.getEmail(), userPrincipal.getUsername(), userPrincipal.getUsername(),
                userPrincipal.getRole().name(), authorities);
    }

    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .phoneNumber(signUpRequest.getPhoneNumber())
                .role(signUpRequest.getRole())
                .isActive(false) // User will be activated after email verification
                .emailVerified(false)
                .address(signUpRequest.getAddress())
                .latitude(signUpRequest.getLatitude())
                .longitude(signUpRequest.getLongitude())
                .build();

        // If user is a worker, assign them to an area
        if (signUpRequest.getRole() == User.Role.WORKER && signUpRequest.getAssignedAreaId() != null) {
            Area area = areaRepository.findById(signUpRequest.getAssignedAreaId())
                    .orElseThrow(() -> new RuntimeException("Error: Area not found!"));
            user.setAssignedArea(area);
        }

        user = userRepository.save(user);
        
        // Create and send verification email
        emailVerificationService.createVerificationToken(user);
        
        return user;
    }
}

