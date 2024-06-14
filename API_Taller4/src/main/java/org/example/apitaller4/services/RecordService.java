package org.example.apitaller4.services;

import org.example.apitaller4.domain.dtos.record.RecordCreateRequestDTO;
import org.example.apitaller4.domain.entities.Record;
import org.example.apitaller4.domain.entities.User;

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