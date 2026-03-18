package com.example.rces.configuration;

import com.vk.api.sdk.client.TransportClient;
import com.vk.api.sdk.client.VkApiClient;
import com.vk.api.sdk.client.actors.GroupActor;
import com.vk.api.sdk.httpclient.HttpTransportClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VkConfig {

    @Value("${vk.api.group.id}")
    private Long groupId;

    @Value("${vk.api.token}")
    private String accessToken;

    @Bean
    public TransportClient transportClient() {
        return new HttpTransportClient();
    }

    @Bean
    public VkApiClient vkApiClient(TransportClient transportClient) {
        return new VkApiClient(transportClient);
    }

    @Bean
    public GroupActor groupActor() {
        return new GroupActor(groupId, accessToken);
    }
}
