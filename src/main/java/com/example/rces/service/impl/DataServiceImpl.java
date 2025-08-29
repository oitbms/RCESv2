//package com.example.rces.services;
//
//import com.example.rces.models.TaskInfo;
//import com.jayway.jsonpath.JsonPath;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClientException;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.stream.IntStream;
////ВОЗМОЖНО НУЖНО БУДЕТ ПОТОМ!
//@Service
//public class DataService {
//
//   @Value("${api.url}")
//    private String apiUrl;
//
//   @Autowired
//   UniversalService universalService;
//
//    public List<String> getData(String currentModule, String entity, String accessToken, String jsonData) {
//        RestTemplate restTemplate = new RestTemplate();
//        String url = String.format("%sapi/stormcrud/data/%s/%s", apiUrl, currentModule, entity);
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
//
//                List<Long> primaryDemand = JsonPath.read(jsonResponse, "$[*].scmo_jm.JobComponent_stormentities[*].primarydemand_id");
//                List<Long> jobStep = JsonPath.read(jsonResponse, "$.data[*].jobstep_id");
//                List<Long> item = JsonPath.read(jsonResponse, "$.data[*].item_id");
//
//                for (int i = 0; i < primaryDemand.size(); i++) {
//                    TaskInfo taskInfo = new TaskInfo();
//                    taskInfo.setPrimarydemand_id(primaryDemand.get(i));
//                    taskInfo.setJobstep_id(jobStep.get(i));
//                    taskInfo.setItem_id(item.get(i));
//
//                    universalService.save(taskInfo);
//                }
//
//                return Collections.emptyList();
//            } else {
//                throw new RuntimeException("Ошибка API: " + response.getStatusCode());
//            }
//        } catch (RestClientException e) {
//            e.printStackTrace();
//            throw new RuntimeException("Ошибка при получении данных: " + e.getMessage());
//        }
//    }
//}