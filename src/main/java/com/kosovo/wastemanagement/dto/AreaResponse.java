package com.kosovo.wastemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaResponse {
    private Long id;
    private String name;
    private String description;
    private String municipality;
    private String neighborhood;
    private Double centerLatitude;
    private Double centerLongitude;
    private List<CollectionScheduleResponse> schedules;
}






