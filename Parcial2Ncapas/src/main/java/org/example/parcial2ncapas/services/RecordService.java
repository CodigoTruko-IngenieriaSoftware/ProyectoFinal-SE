package org.example.parcial2ncapas.services;

import org.example.parcial2ncapas.domain.entities.Record;
import org.example.parcial2ncapas.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface RecordService {
    Record create(Record record);
    Record findById(UUID id);
    List<Record> findAll();
    void delete(UUID id);
    List<Record> findByUser(User user);
    void updateRecordDetails(UUID recordId, String newDetails);
}