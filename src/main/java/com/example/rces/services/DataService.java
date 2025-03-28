//package com.example.rces.services;
//
//import com.example.rces.models.CustomerOrder;
//import com.jayway.jsonpath.JsonPath;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClientException;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.stream.IntStream;
//ВОЗМОЖНО НУЖНО БУДЕТ ПОТОМ!
//@Service
//public class DataService {
//
//    @Value("${api.url}")
//    private String apiUrl;
//
//    public CustomerOrder getData(String module, String entity, String accessToken, String jsonData) {
//        RestTemplate restTemplate = new RestTemplate();
//        String url = String.format("%s/api/stormcrud/data/%s/%s", apiUrl, module, entity);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
//        headers.set("Authorization", "Bearer " + accessToken);
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<String> requestEntity = new HttpEntity<>(jsonData, headers);
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
//            if (response.getStatusCode() == HttpStatus.OK) {
//                String jsonResponse = response.getBody();
//                //Парсил через JsonPath это на будущее
//                List<String> friendsLastnames = JsonPath.read(jsonResponse, "$.data[*].name");
//                List<String> strCodes = JsonPath.read(jsonResponse, "$.data[*].str_code");
//                IntStream.range(0, friendsLastnames.size())
//                        .forEach(i -> System.out.println("Фамилия: " + friendsLastnames.get(i) + ", Код: " + strCodes.get(i)));
//                CustomerOrder customerOrder = new CustomerOrder();
//                return customerOrder;
//            } else {
//                throw new RuntimeException("Ошибка API: " + response.getStatusCode());
//            }
//        } catch (RestClientException e) {
//            e.printStackTrace();
//            throw new RuntimeException("Ошибка при получении данных: " + e.getMessage());
//        }
//    }
//}