package com.example.rces.configuration;

import com.example.rces.deserialize.CustomerOrderDeserialize;
import com.example.rces.models.CustomerOrder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.SpringHandlerInstantiator;

@Configuration
public class JsonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer(CustomerOrderDeserialize deserializer) {
        return builder -> {
            builder.modules(
                    new JavaTimeModule(),
                    new SimpleModule().addDeserializer(CustomerOrder.class, deserializer)
            );
        };
    }
}
