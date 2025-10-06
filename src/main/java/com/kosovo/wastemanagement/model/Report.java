package com.kosovo.wastemanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 200)
    private String title;
    
    @NotBlank
    @Size(max = 1000)
    private String description;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private ReportType type;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private ReportStatus status;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private ReportPriority priority;
    
    @NotNull
    private Double latitude;
    
    @NotNull
    private Double longitude;
    
    @Size(max = 200)
    private String address;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_worker_id")
    private User assignedWorker;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private Area area;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportImage> images;
    
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReportComment> comments;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ReportType {
        OVERFLOWING_BIN,
        MISSING_BIN,
        ILLEGAL_DUMP,
        DAMAGED_BIN,
        MISSED_COLLECTION,
        OTHER
    }
    
    public enum ReportStatus {
        PENDING,
        IN_PROGRESS,
        RESOLVED,
        CLOSED
    }
    
    public enum ReportPriority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }
}






