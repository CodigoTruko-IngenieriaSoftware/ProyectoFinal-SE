package org.example.apitaller4.domain.dtos.record;

import lombok.Data;

@Data
public class RecordUpdateRequestDTO {
    private String recordId;
    private String reason;
}
