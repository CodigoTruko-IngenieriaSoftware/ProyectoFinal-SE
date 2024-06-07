package org.example.parcial2ncapas.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Pagination {
    int totalPages;
    int pageSize;
}
