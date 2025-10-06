package com.kosovo.wastemanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 120)
    private String name;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @Size(max = 200)
    private String address;

    @Enumerated(EnumType.STRING)
    private BinType type;

    // Optional: user-estimated fill level [0,1]
    private Double fillLevel;

    public enum BinType {
        GENERAL,
        GLASS,
        PAPER,
        PLASTIC,
        METAL,
        ORGANIC
    }
}








