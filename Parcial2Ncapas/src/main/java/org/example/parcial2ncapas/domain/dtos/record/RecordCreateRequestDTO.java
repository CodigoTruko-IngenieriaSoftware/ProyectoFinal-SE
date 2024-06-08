package org.example.parcial2ncapas.domain.dtos.record;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RecordCreateRequestDTO {
    private String description;
    private String username;
}
