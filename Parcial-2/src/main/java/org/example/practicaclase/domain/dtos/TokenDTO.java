package org.example.practicaclase.domain.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.practicaclase.domain.entities.Token;

@Data
@NoArgsConstructor
public class TokenDTO {
    private String token;

    public TokenDTO(Token token){
        this.token = token.getContent();
    }
}
