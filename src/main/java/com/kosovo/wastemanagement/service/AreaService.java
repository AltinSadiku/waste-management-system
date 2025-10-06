package com.kosovo.wastemanagement.service;

import com.kosovo.wastemanagement.dto.AreaResponse;
import com.kosovo.wastemanagement.model.Area;
import com.kosovo.wastemanagement.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AreaService {

    private final AreaRepository areaRepository;

    public List<AreaResponse> getAllAreas() {
        List<Area> areas = areaRepository.findByIsActiveTrue();
        return areas.stream()
                .map(this::mapToAreaResponse)
                .collect(Collectors.toList());
    }

    public AreaResponse getAreaById(Long id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Area not found"));
        return mapToAreaResponse(area);
    }

    public AreaResponse createArea(Area area) {
        area.setIsActive(true);
        Area savedArea = areaRepository.save(area);
        return mapToAreaResponse(savedArea);
    }

    public AreaResponse updateArea(Long id, Area areaDetails) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Area not found"));

        area.setName(areaDetails.getName());
        area.setDescription(areaDetails.getDescription());
        area.setMunicipality(areaDetails.getMunicipality());
        area.setNeighborhood(areaDetails.getNeighborhood());
        area.setCenterLatitude(areaDetails.getCenterLatitude());
        area.setCenterLongitude(areaDetails.getCenterLongitude());

        Area updatedArea = areaRepository.save(area);
        return mapToAreaResponse(updatedArea);
    }

    public void deleteArea(Long id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Area not found"));
        
        area.setIsActive(false);
        areaRepository.save(area);
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
}






