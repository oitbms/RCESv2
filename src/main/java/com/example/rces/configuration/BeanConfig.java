package com.example.rces.configuration;

import com.example.rces.models.base.EntityBaseListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig {

    @Bean
    public EntityBaseListener entityBaseListener() {
        return new EntityBaseListener();
    }
}

