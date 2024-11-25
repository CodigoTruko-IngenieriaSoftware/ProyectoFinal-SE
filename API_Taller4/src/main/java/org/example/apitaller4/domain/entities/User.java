package org.example.apitaller4.domain.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min=5, max = 20, message = "El nombre de usuario no debe estar entre 5 y 20 caracteres")
    private String username;

    @Email(message = "El correo electrónico debe tener un formato válido")
    private String email;

    @JsonIgnore
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Column(nullable = false, length = 64)
    private String password;

    @Column(insertable = false)
    @ColumnDefault(value = "1")
    private Integer avartar;

    @JsonIgnore
    @Column(insertable = false)
    @ColumnDefault(value = "true")
    private Boolean active;

    @Column(insertable = false)
    @ColumnDefault(value = "true")
    private Boolean available;


    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "permissions",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    List<Role> roles;

    @JsonIgnore
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Record> records;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Attend> attends;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Attend> appointments;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Token> tokens;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getId()))
                .collect(Collectors.toList());
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return this.active;
    }
}
