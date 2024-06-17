package org.example.apitaller4.domain.dtos.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.apitaller4.domain.entities.Token;

@Data
@NoArgsConstructor
public class TokenDTO {
    private String token;

    public TokenDTO(Token token){
        this.token = token.getContent();
    }
}
