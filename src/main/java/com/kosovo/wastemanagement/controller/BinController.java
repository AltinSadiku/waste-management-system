package com.kosovo.wastemanagement.controller;

import com.kosovo.wastemanagement.model.Bin;
import com.kosovo.wastemanagement.repository.BinRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bins")
@CrossOrigin(origins = "*")
public class BinController {

    private final BinRepository binRepository;

    public BinController(BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    @GetMapping
    public ResponseEntity<List<Bin>> getAll() {
        return ResponseEntity.ok(binRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Bin> create(@Valid @RequestBody Bin bin) {
        Bin saved = binRepository.save(bin);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/nearest")
    public ResponseEntity<Bin> getNearest(
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam(value = "maxFill", required = false, defaultValue = "0.7") double maxFill
    ) {
        List<Bin> all = binRepository.findAll();
        Optional<Bin> nearest = all.stream()
                .filter(b -> b.getFillLevel() == null || b.getFillLevel() <= maxFill)
                .min(Comparator.comparingDouble(a -> distanceMeters(latitude, longitude, a.getLatitude(), a.getLongitude())));

        return nearest.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    private static double distanceMeters(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula
        double R = 6371000.0; // meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}



