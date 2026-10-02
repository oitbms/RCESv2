package com.example.rces.configuration;

import com.example.rces.service.impl.WebSecurityService;
import com.example.rces.utils.AppUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    public static final String[] MACHINE_EDITOR_ROLES = {"ADMIN", "CONTROL"};

    public static boolean isMachineEditor(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(Arrays.asList(MACHINE_EDITOR_ROLES)::contains);
    }

    private final WebSecurityService webSecurityService;
    private final CustomAuthenticationProvider customAuthenticationProvider;
    private final AppUtil appUtil;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public WebSecurityConfig(WebSecurityService webSecurityService,
                             CustomAuthenticationProvider customAuthenticationProvider,
                             AppUtil appUtil,
                             JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.webSecurityService = webSecurityService;
        this.customAuthenticationProvider = customAuthenticationProvider;
        this.appUtil = appUtil;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/css/modern.css","/css/bootstrap/bootstrap.min.css", "/js/dist/machines.js",
                                "/js/dist/sub-division.js", "/js/bootstrap/bootstrap.bundle.min.js", "/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/machines/{number:\\d+}",
                                "/api/v1/machines/{number:\\d+}", "/api/v1/machines/documents/*").permitAll()
                        .requestMatchers("/machines/new", "/machines/*/edit").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.POST, "/api/v1/machines/**").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.PUT, "/api/v1/machines/**").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/machines/**").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.GET, "/sub-division/{id:\\d+}",
                                "/api/v1/sub-division/{id:\\d+}", "/api/v1/sub-division/documents/*").permitAll()
                        .requestMatchers("/sub-division/new", "/sub-division/*/edit").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.POST, "/api/v1/sub-division/**").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.PUT, "/api/v1/sub-division/**").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/sub-division/**").hasAnyAuthority(MACHINE_EDITOR_ROLES)
                        .requestMatchers("/get-data/**", "/login", "/ws/**", "/api/auth/login").permitAll()
                        .requestMatchers("/home").hasAnyAuthority("TECHNOLOGIST", "OTK", "CONSTRUCTOR", "ADMIN", "MASTER")
                        .requestMatchers("/admin", "/registration").hasAuthority("ADMIN")
                        .requestMatchers("/create", "/requestslist/**")
                        .hasAnyAuthority("MASTER", "ADMIN", "CONSTRUCTOR", "TECHNOLOGIST", "OTK", "CONTROL")
                        .requestMatchers("/sgi/**").hasAnyAuthority("ADMIN", "CONTROL", "EVENT")
                        .requestMatchers("/team/**").hasAnyAuthority("ADMIN", "CONTROL", "EVENT")
                        .requestMatchers(new TypeBasedRequestMatcher(webSecurityService)).authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                )
                .httpBasic(withDefaults())
                .logout(logout -> logout
                        .addLogoutHandler(appUtil)
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(customAuthenticationProvider);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(30))
                .build();
    }
}
