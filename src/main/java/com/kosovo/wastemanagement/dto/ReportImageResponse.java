package com.kosovo.wastemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportImageResponse {
    private Long id;
    private String fileName;
    private String filePath;
    private String contentType;
    private Long fileSize;
}






