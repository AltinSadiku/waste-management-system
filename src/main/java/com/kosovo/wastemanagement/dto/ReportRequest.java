package com.kosovo.wastemanagement.dto;

import com.kosovo.wastemanagement.model.Report;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ReportRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @NotNull
    private Report.ReportType type;

    @NotNull
    private Report.ReportPriority priority;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @Size(max = 200)
    private String address;

    private List<String> imageBase64Strings;
}






