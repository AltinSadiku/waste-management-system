package com.kosovo.wastemanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "collection_schedules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private WasteType wasteType;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;
    
    @NotNull
    private LocalTime collectionTime;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum WasteType {
        GENERAL_WASTE,
        RECYCLABLE,
        ORGANIC,
        BULKY_ITEMS
    }
}






