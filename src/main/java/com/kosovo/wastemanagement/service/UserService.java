package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.dto.UserResponse;
import com.kosovo.wastemanagement.model.Area;
import com.kosovo.wastemanagement.model.User;
import com.kosovo.wastemanagement.repository.AreaRepository;
import com.kosovo.wastemanagement.repository.UserRepository;
import com.kosovo.wastemanagement.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final AreaRepository areaRepository;

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getWorkers() {
        List<User> workers = userRepository.findActiveWorkers();
        return workers.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setAddress(userDetails.getAddress());
        user.setLatitude(userDetails.getLatitude());
        user.setLongitude(userDetails.getLongitude());

        // Update assigned area if provided and user is a worker
        if (user.getRole() == User.Role.WORKER && userDetails.getAssignedArea() != null) {
            Area area = areaRepository.findById(userDetails.getAssignedArea().getId())
                    .orElseThrow(() -> new RuntimeException("Area not found"));
            user.setAssignedArea(area);
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(false);
        userRepository.save(user);
    }

    public boolean isCurrentUser(Long userId, Authentication authentication) {
        if (authentication == null) return false;
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userPrincipal.getId().equals(userId);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .address(user.getAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .assignedArea(user.getAssignedArea() != null ? 
                    mapToAreaResponse(user.getAssignedArea()) : null)
                .build();
    }

    private com.kosovo.wastemanagement.dto.AreaResponse mapToAreaResponse(Area area) {
        return com.kosovo.wastemanagement.dto.AreaResponse.builder()
                .id(area.getId())
                .name(area.getName())
                .description(area.getDescription())
                .municipality(area.getMunicipality())
                .neighborhood(area.getNeighborhood())
                .centerLatitude(area.getCenterLatitude())
                .centerLongitude(area.getCenterLongitude())
                .build();
    }
}






