package com.kosovo.wastemanagement.controller;

import com.kosovo.wastemanagement.model.CollectionSchedule;
import com.kosovo.wastemanagement.service.CollectionScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Collection Schedules", description = "Waste collection schedule management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CollectionScheduleController {

    private final CollectionScheduleService scheduleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create collection schedule", description = "Create a new waste collection schedule (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Schedule created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    })
    public ResponseEntity<?> createSchedule(@Valid @RequestBody CreateScheduleRequest request) {
        try {
            CollectionSchedule schedule = scheduleService.createSchedule(
                request.getAreaId(),
                request.getWasteType(),
                request.getDayOfWeek(),
                request.getCollectionTime()
            );
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            log.error("Error creating schedule", e);
            return ResponseEntity.badRequest().body("Error creating schedule: " + e.getMessage());
        }
    }

    @GetMapping("/area/{areaId}")
    @Operation(summary = "Get schedules by area", description = "Retrieve collection schedules for a specific area")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Schedules retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Area not found")
    })
    public ResponseEntity<?> getSchedulesByArea(
            @Parameter(description = "Area ID", required = true)
            @PathVariable Long areaId) {
        try {
            List<CollectionSchedule> schedules = scheduleService.getSchedulesByArea(areaId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            log.error("Error fetching schedules for area", e);
            return ResponseEntity.badRequest().body("Error fetching schedules: " + e.getMessage());
        }
    }

    @GetMapping("/day/{dayOfWeek}")
    public ResponseEntity<?> getSchedulesByDay(@PathVariable DayOfWeek dayOfWeek) {
        try {
            List<CollectionSchedule> schedules = scheduleService.getSchedulesByDay(dayOfWeek);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            log.error("Error fetching schedules for day", e);
            return ResponseEntity.badRequest().body("Error fetching schedules: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSchedules() {
        try {
            List<CollectionSchedule> schedules = scheduleService.getAllActiveSchedules();
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            log.error("Error fetching all schedules", e);
            return ResponseEntity.badRequest().body("Error fetching schedules: " + e.getMessage());
        }
    }

    @PutMapping("/{scheduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSchedule(@PathVariable Long scheduleId, 
                                          @Valid @RequestBody UpdateScheduleRequest request) {
        try {
            CollectionSchedule schedule = scheduleService.updateSchedule(
                scheduleId,
                request.getDayOfWeek(),
                request.getCollectionTime()
            );
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            log.error("Error updating schedule", e);
            return ResponseEntity.badRequest().body("Error updating schedule: " + e.getMessage());
        }
    }

    @DeleteMapping("/{scheduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            return ResponseEntity.ok("Schedule deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting schedule", e);
            return ResponseEntity.badRequest().body("Error deleting schedule: " + e.getMessage());
        }
    }

    // DTOs for request/response
    public static class CreateScheduleRequest {
        private Long areaId;
        private CollectionSchedule.WasteType wasteType;
        private DayOfWeek dayOfWeek;
        private LocalTime collectionTime;

        // Getters and setters
        public Long getAreaId() { return areaId; }
        public void setAreaId(Long areaId) { this.areaId = areaId; }
        
        public CollectionSchedule.WasteType getWasteType() { return wasteType; }
        public void setWasteType(CollectionSchedule.WasteType wasteType) { this.wasteType = wasteType; }
        
        public DayOfWeek getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        
        public LocalTime getCollectionTime() { return collectionTime; }
        public void setCollectionTime(LocalTime collectionTime) { this.collectionTime = collectionTime; }
    }

    public static class UpdateScheduleRequest {
        private DayOfWeek dayOfWeek;
        private LocalTime collectionTime;

        // Getters and setters
        public DayOfWeek getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        
        public LocalTime getCollectionTime() { return collectionTime; }
        public void setCollectionTime(LocalTime collectionTime) { this.collectionTime = collectionTime; }
    }
}
