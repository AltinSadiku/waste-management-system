package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.dto.*;
import com.kosovo.wastemanagement.model.*;
import com.kosovo.wastemanagement.repository.AreaRepository;
import com.kosovo.wastemanagement.repository.ReportRepository;
import com.kosovo.wastemanagement.repository.UserRepository;
import com.kosovo.wastemanagement.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AreaRepository areaRepository;
    private final FileStorageService fileStorageService;

    private static final String UPLOAD_DIR = "uploads/reports/";

    public ReportResponse createReport(ReportRequest reportRequest, List<MultipartFile> images) {
        UserPrincipal userPrincipal = getCurrentUser();
        User reporter = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = Report.builder()
                .title(reportRequest.getTitle())
                .description(reportRequest.getDescription())
                .type(reportRequest.getType())
                .priority(reportRequest.getPriority())
                .status(Report.ReportStatus.PENDING)
                .latitude(reportRequest.getLatitude())
                .longitude(reportRequest.getLongitude())
                .address(reportRequest.getAddress())
                .reporter(reporter)
                .build();

        // Find the area based on coordinates (simplified - in real app, use spatial queries)
        Area area = findAreaByCoordinates(reportRequest.getLatitude(), reportRequest.getLongitude());
        if (area != null) {
            report.setArea(area);
        }

        Report savedReport = reportRepository.save(report);

        // Handle image uploads
        if (images != null && !images.isEmpty()) {
            List<ReportImage> reportImages = images.stream()
                    .map(image -> saveReportImage(savedReport, image))
                    .collect(Collectors.toList());
            savedReport.setImages(reportImages);
        }

        return mapToReportResponse(savedReport);
    }

    public Page<ReportResponse> getReports(Report.ReportStatus status, Long areaId, 
                                          Report.ReportPriority priority, Pageable pageable) {
        Page<Report> reports = reportRepository.findReportsWithFilters(status, areaId, priority, pageable);
        return reports.map(this::mapToReportResponse);
    }

    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return mapToReportResponse(report);
    }

    public List<ReportResponse> getReportsByUser(Long userId) {
        List<Report> reports = reportRepository.findByReporterId(userId);
        return reports.stream()
                .map(this::mapToReportResponse)
                .collect(Collectors.toList());
    }

    public ReportResponse updateReportStatus(Long reportId, Report.ReportStatus status, Long assignedWorkerId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        report.setUpdatedAt(LocalDateTime.now());

        if (status == Report.ReportStatus.RESOLVED || status == Report.ReportStatus.CLOSED) {
            report.setResolvedAt(LocalDateTime.now());
        }

        if (assignedWorkerId != null) {
            User worker = userRepository.findById(assignedWorkerId)
                    .orElseThrow(() -> new RuntimeException("Worker not found"));
            report.setAssignedWorker(worker);
        }

        Report updatedReport = reportRepository.save(report);
        return mapToReportResponse(updatedReport);
    }

    public List<ReportResponse> getReportsNearLocation(Double latitude, Double longitude, Double radiusKm) {
        List<Report> reports = reportRepository.findReportsNearLocation(latitude, longitude, radiusKm);
        return reports.stream()
                .map(this::mapToReportResponse)
                .collect(Collectors.toList());
    }

    private ReportImage saveReportImage(Report report, MultipartFile image) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            String filePath = fileStorageService.storeFile(image, UPLOAD_DIR, fileName);

            return ReportImage.builder()
                    .fileName(fileName)
                    .filePath(filePath)
                    .contentType(image.getContentType())
                    .fileSize(image.getSize())
                    .report(report)
                    .build();
        } catch (IOException e) {
            log.error("Error saving report image: {}", e.getMessage());
            throw new RuntimeException("Error saving image");
        }
    }

    private Area findAreaByCoordinates(Double latitude, Double longitude) {
        // Simplified area finding - in real app, use spatial queries
        List<Area> areas = areaRepository.findAll();
        return areas.stream()
                .filter(area -> area.getCenterLatitude() != null && area.getCenterLongitude() != null)
                .filter(area -> isWithinRadius(latitude, longitude, area.getCenterLatitude(), area.getCenterLongitude(), 5.0)) // 5km radius
                .findFirst()
                .orElse(null);
    }

    private boolean isWithinRadius(Double lat1, Double lon1, Double lat2, Double lon2, Double radiusKm) {
        // Simplified distance calculation - in real app, use proper geographic calculations
        double distance = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111; // rough conversion to km
        return distance <= radiusKm;
    }

    private ReportResponse mapToReportResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .title(report.getTitle())
                .description(report.getDescription())
                .type(report.getType())
                .status(report.getStatus())
                .priority(report.getPriority())
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .address(report.getAddress())
                .reporter(mapToUserResponse(report.getReporter()))
                .assignedWorker(report.getAssignedWorker() != null ? mapToUserResponse(report.getAssignedWorker()) : null)
                .area(report.getArea() != null ? mapToAreaResponse(report.getArea()) : null)
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .resolvedAt(report.getResolvedAt())
                .images(report.getImages() != null ? report.getImages().stream()
                        .map(this::mapToReportImageResponse)
                        .collect(Collectors.toList()) : null)
                .build();
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
                .assignedArea(user.getAssignedArea() != null ? mapToAreaResponse(user.getAssignedArea()) : null)
                .build();
    }

    private AreaResponse mapToAreaResponse(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .name(area.getName())
                .description(area.getDescription())
                .municipality(area.getMunicipality())
                .neighborhood(area.getNeighborhood())
                .centerLatitude(area.getCenterLatitude())
                .centerLongitude(area.getCenterLongitude())
                .build();
    }

    private ReportImageResponse mapToReportImageResponse(ReportImage image) {
        return ReportImageResponse.builder()
                .id(image.getId())
                .fileName(image.getFileName())
                .filePath(image.getFilePath())
                .contentType(image.getContentType())
                .fileSize(image.getFileSize())
                .build();
    }

    private UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }

    // Used in @PreAuthorize SpEL: @reportService.isReportOwner(#userId, authentication)
    public boolean isReportOwner(Long userId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserPrincipal)) {
            return false;
        }
        UserPrincipal userPrincipal = (UserPrincipal) principal;
        return userPrincipal.getId() != null && userPrincipal.getId().equals(userId);
    }
}
