package com.kosovo.wastemanagement.dto;

import com.kosovo.wastemanagement.model.CollectionSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionScheduleResponse {
    private Long id;
    private Long areaId;
    private CollectionSchedule.WasteType wasteType;
    private DayOfWeek dayOfWeek;
    private LocalTime collectionTime;
    private String areaName;
}






