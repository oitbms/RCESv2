package com.example.rces.api.test;

import com.example.rces.dto.SgiDTO;
import io.qameta.allure.Feature;
import io.qameta.allure.Owner;
import io.qameta.allure.Severity;
import io.qameta.allure.Story;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Tags;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.example.rces.api.steps.SgiControllerSteps.getSgiList;
import static io.qameta.allure.SeverityLevel.NORMAL;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Feature("Api")
@Story("Манипуляции с мероприятиями")
@Tags({@Tag("SgiController"), @Tag("Api")})
public class SgiControllerTest {

//    @Test
//    @DisplayName("Получение списка мероприятий")
//    @Owner("ByteCodeAPAA")
//    @Severity(NORMAL)
//    public void sgiList() {
//        List<SgiDTO> commentsList = getSgiList(1, 100);
//
//        assertEquals(100, commentsList.size());
//        assertEquals(1, commentsList.getPage());
//    }


}
