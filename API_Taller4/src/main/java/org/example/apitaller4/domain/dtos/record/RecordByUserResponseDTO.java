package org.example.apitaller4.domain.dtos.record;

import lombok.Data;
import org.example.apitaller4.domain.entities.Record;

import java.util.List;

@Data
public class RecordByUserResponseDTO {
    private String username;
    private List<Record> records;
}
