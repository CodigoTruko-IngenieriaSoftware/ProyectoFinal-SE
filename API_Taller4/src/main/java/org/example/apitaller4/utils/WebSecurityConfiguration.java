package org.example.apitaller4.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.example.apitaller4.domain.entities.User;
import org.example.apitaller4.services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    private final JWTTokenFilter filter;

    public WebSecurityConfiguration(PasswordEncoder passwordEncoder, UserService userService, JWTTokenFilter filter) {
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.filter = filter;
    }


    @Bean
    AuthenticationManager authenticationManagerBean(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder managerBuilder
                = http.getSharedObject(AuthenticationManagerBuilder.class);

        managerBuilder
                .userDetailsService(identifier -> {
                    User user = userService.findByIdentifier(identifier);

                    if(user == null)
                        throw new UsernameNotFoundException("User: " + identifier + ", not found!");

                    return user;
                })
                .passwordEncoder(passwordEncoder);

        return managerBuilder.build();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //Http login and cors disabled
        http.httpBasic(Customizer.withDefaults()).csrf(csrf -> csrf.disable());

        //Route filter
        http.authorizeHttpRequests(auth ->
                auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/user/").hasAuthority("ROLE_SUDO")
                        .requestMatchers(HttpMethod.GET,"/api/user/record").hasAuthority("ROLE_PTNT")
                        .requestMatchers(HttpMethod.POST, "/api/user/record").hasAnyAuthority("ROLE_DCTR", "ROLE_ASST")
                        .requestMatchers("/api/user/all-patients").hasAnyAuthority("ROLE_DCTR", "ROLE_ASST")
                        .requestMatchers("/api/user/all-doctors").hasAnyAuthority("ROLE_DCTR", "ROLE_ASST")
                        .requestMatchers("/api/user/**").hasAnyAuthority("ROLE_SUDO", "ROLE_PTNT")
                        .requestMatchers("/api/config/**").hasAuthority("ROLE_SUDO")
                        .requestMatchers("/api/appointment/").hasAuthority("ROLE_SUDO")
                        .requestMatchers("/api/appointment/request").hasAuthority("ROLE_PTNT")
                        .requestMatchers("/api/appointment/own").hasAuthority("ROLE_PTNT")
                        .requestMatchers("/api/appointment/own-approve").hasAuthority("ROLE_PTNT")
                        .requestMatchers("/api/appointment/cancel").hasAuthority("ROLE_PTNT")
                        .requestMatchers("/api/appointment/finish").hasAuthority("ROLE_DCTR")
                        .requestMatchers("/api/appointment/{username}").hasAnyAuthority("ROLE_DCTR", "ROLE_ASST")
                        .requestMatchers("/api/appointment/**").hasAuthority("ROLE_ASST")
                        .requestMatchers("/api/specialty/").hasAuthority("ROLE_ASST")
                        .requestMatchers("/api/specialty/**").hasAuthority("ROLE_SUDO")
                        .requestMatchers("/api/attend/**").hasAuthority("ROLE_ASST")
                        .requestMatchers("/api/record/my").hasAnyAuthority("ROLE_PTNT", "ROLE_DCTR")
                        .requestMatchers("/api/record/**").hasAnyAuthority("ROLE_DCTR","ROLE_ASST")
                        .requestMatchers("/api/clinic/prescription/**").hasAuthority("ROLE_DCTR")
                        .anyRequest().authenticated()
        );


        //Statelessness
        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //UnAunthorized handler
        http.exceptionHandling(handling -> handling.authenticationEntryPoint((req, res, ex) -> {
            res.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Auth fail!"
            );
        }));

        //JWT filter
        http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}