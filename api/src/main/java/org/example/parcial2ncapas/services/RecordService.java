package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.dtos.record.RecordCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Record;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface RecordService {
    Record create(User user, RecordCreateRequestDTO record);
    Record findById(UUID id);
    List<Record> findAll();
    void delete(UUID id);
    List<Record> findByUser(User user);
    List<Record> findByUserRangDate(User user, String startDate, String endDate);
    void updateRecordDetails(UUID recordId, String newDetails);


}