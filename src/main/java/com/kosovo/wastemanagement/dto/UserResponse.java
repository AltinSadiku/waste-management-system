package com.kosovo.wastemanagement.dto;

import com.kosovo.wastemanagement.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private User.Role role;
    private String address;
    private Double latitude;
    private Double longitude;
    private AreaResponse assignedArea;
}






