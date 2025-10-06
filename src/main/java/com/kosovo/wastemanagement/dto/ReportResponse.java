package com.kosovo.wastemanagement.dto;

import com.kosovo.wastemanagement.model.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private String title;
    private String description;
    private Report.ReportType type;
    private Report.ReportStatus status;
    private Report.ReportPriority priority;
    private Double latitude;
    private Double longitude;
    private String address;
    private UserResponse reporter;
    private UserResponse assignedWorker;
    private AreaResponse area;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private List<ReportImageResponse> images;
    private List<ReportCommentResponse> comments;
}






