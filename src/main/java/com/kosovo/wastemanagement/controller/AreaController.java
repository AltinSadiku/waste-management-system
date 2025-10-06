package com.kosovo.wastemanagement.controller;

import com.kosovo.wastemanagement.dto.AreaResponse;
import com.kosovo.wastemanagement.model.Area;
import com.kosovo.wastemanagement.service.AreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public ResponseEntity<List<AreaResponse>> getAllAreas() {
        List<AreaResponse> areas = areaService.getAllAreas();
        return ResponseEntity.ok(areas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaResponse> getAreaById(@PathVariable Long id) {
        AreaResponse area = areaService.getAreaById(id);
        return ResponseEntity.ok(area);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AreaResponse> createArea(@RequestBody Area area) {
        AreaResponse response = areaService.createArea(area);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AreaResponse> updateArea(@PathVariable Long id, @RequestBody Area area) {
        AreaResponse response = areaService.updateArea(id, area);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArea(@PathVariable Long id) {
        areaService.deleteArea(id);
        return ResponseEntity.ok().build();
    }
}






