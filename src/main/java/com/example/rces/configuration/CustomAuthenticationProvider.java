package com.example.rces.configuration;

import com.example.rces.models.Employee;
import com.example.rces.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final EmployeeService userDetailsService;

    @Autowired
    public CustomAuthenticationProvider(EmployeeService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        if (username == null || username.isBlank()) {
            throw new BadCredentialsException("Username is required");
        }

        Employee userDetails = userDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }
        if (!userDetails.isEnabled()) {
            throw new BadCredentialsException("User is disabled");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
