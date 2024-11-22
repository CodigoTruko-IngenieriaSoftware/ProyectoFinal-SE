package org.example.apitaller4.domain.dtos.user;

import lombok.Data;
import org.example.apitaller4.domain.entities.Role;

import java.util.List;

@Data
public class UserInfoResponseDTO {
    private String username;
    private String email;
    private Integer avatar;
    private List<Role> role;
}
