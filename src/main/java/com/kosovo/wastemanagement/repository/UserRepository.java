package com.kosovo.wastemanagement.repository;

import com.kosovo.wastemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    @Query("SELECT u FROM User u WHERE u.assignedArea.id = :areaId AND u.role = 'WORKER'")
    List<User> findWorkersByArea(@Param("areaId") Long areaId);
    
    @Query("SELECT u FROM User u WHERE u.role = 'WORKER' AND u.isActive = true")
    List<User> findActiveWorkers();
    
    @Query("SELECT u FROM User u WHERE u.role = 'CITIZEN' AND u.emailVerified = true AND u.isActive = true")
    List<User> findActiveVerifiedCitizens();
    
    @Query("SELECT u FROM User u, Area a WHERE u.role = 'CITIZEN' AND u.emailVerified = true AND u.isActive = true " +
           "AND a.id = :areaId AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL " +
           "AND (6371 * acos(cos(radians(a.centerLatitude)) * cos(radians(u.latitude)) * " +
           "cos(radians(u.longitude) - radians(a.centerLongitude)) + " +
           "sin(radians(a.centerLatitude)) * sin(radians(u.latitude)))) <= 5")
    List<User> findActiveVerifiedCitizensByArea(@Param("areaId") Long areaId);
}





