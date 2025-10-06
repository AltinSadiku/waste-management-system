package com.kosovo.wastemanagement.controller;

import com.kosovo.wastemanagement.dto.ReportRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosovo.wastemanagement.dto.ReportResponse;
import com.kosovo.wastemanagement.model.Report;
import com.kosovo.wastemanagement.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ReportResponse> createReport(
            @RequestPart("report") String reportJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ReportRequest reportRequest = mapper.readValue(reportJson, ReportRequest.class);

        ReportResponse response = reportService.createReport(reportRequest, images);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('WORKER')")
    public ResponseEntity<Page<ReportResponse>> getReports(
            @RequestParam(required = false) Report.ReportStatus status,
            @RequestParam(required = false) Long areaId,
            @RequestParam(required = false) Report.ReportPriority priority,
            Pageable pageable) {
        
        Page<ReportResponse> reports = reportService.getReports(status, areaId, priority, pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse report = reportService.getReportById(id);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @reportService.isReportOwner(#userId, authentication)")
    public ResponseEntity<List<ReportResponse>> getReportsByUser(@PathVariable Long userId) {
        List<ReportResponse> reports = reportService.getReportsByUser(userId);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WORKER')")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable Long id,
            @RequestParam Report.ReportStatus status,
            @RequestParam(required = false) Long assignedWorkerId) {
        
        ReportResponse response = reportService.updateReportStatus(id, status, assignedWorkerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ReportResponse>> getReportsNearLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5.0") Double radiusKm) {
        
        List<ReportResponse> reports = reportService.getReportsNearLocation(latitude, longitude, radiusKm);
        return ResponseEntity.ok(reports);
    }
}
