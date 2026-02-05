package com.example.rces.api.steps;

import com.example.rces.api.Specs;
import com.example.rces.dto.SgiCreateDTO;
import com.example.rces.dto.SgiDTO;
import io.qameta.allure.Step;

import java.util.List;
import java.util.UUID;

import static io.restassured.RestAssured.given;

public class SgiControllerSteps {

    @Step("Получить список всех мероприятий")
    public static List<SgiDTO> getSgiList(int page, int size) {
        return given()
                .spec(Specs.request())
                .basePath("/get-page-sgi")
                .param("page", page)
                .param("size", size)
                .get()
                .then().log().all()
                .statusCode(200)
                .extract().htmlPath().getList("", SgiDTO.class);
    }

    @Step("Создать мероприятие")
    public static SgiDTO createSGI(SgiCreateDTO newSGI) {
        return given()
                .spec(Specs.request())
                .basePath("/create-sgi")
                .body(newSGI)
                .post()
                .then().log().all()
                .statusCode(200)
                .extract().as(SgiDTO.class);
    }

    @Step("Удалить мероприятие по идентификатору")
    public static void deleteSgi(UUID id) {
        given()
                .spec(Specs.request())
                .basePath("/delete/{id}")
                .pathParam("id", id)
                .delete()
                .then().log().all()
                .statusCode(200);
    }

}
