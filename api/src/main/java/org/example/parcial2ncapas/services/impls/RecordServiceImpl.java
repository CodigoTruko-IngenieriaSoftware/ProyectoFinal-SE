package org.example.parcial2ncapas.services.impls;

import jakarta.transaction.Transactional;
import org.example.parcial2ncapas.domain.dtos.record.RecordCreateRequestDTO;
import org.example.parcial2ncapas.domain.entities.Record;
import org.example.parcial2ncapas.domain.entities.User;
import org.example.parcial2ncapas.repositories.RecordRepository;
import org.example.parcial2ncapas.services.RecordService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;

    public RecordServiceImpl(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @Override
    public Record create(User user, RecordCreateRequestDTO info) {
        Record record = new Record();
        record.setUser(user);
        record.setReason(info.getReason());
        record.setCreationDate(LocalDate.now());
        return recordRepository.save(record);
    }

    @Override
    public Record findById(UUID id) {
        return recordRepository.findById(id).orElse(null);
    }

    @Override
    public List<Record> findAll() {
        return recordRepository.findAll();
    }

    @Override
    public void delete(UUID id) {
        recordRepository.deleteById(id);
    }

    @Override
    public List<Record> findByUser(User user) {
        return recordRepository.findByUser(user);
    }

    @Override
    public List<Record> findByUserRangDate(User user, String startDate, String endDate) {
        return recordRepository.findByUserAndDateBetween(user, LocalDate.parse(startDate), LocalDate.parse(endDate));
    }

    @Override
    @Transactional
    public void updateRecordDetails(UUID recordId, String newDetails) {
        Record record = findById(recordId);
        if (record != null) {
            record.setReason(newDetails);
            recordRepository.save(record);
        }
    }


}
