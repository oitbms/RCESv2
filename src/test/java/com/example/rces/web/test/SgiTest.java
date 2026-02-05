package com.example.rces.web.test;

import com.example.rces.data.Sgi;
import com.example.rces.web.pages.MainPage;
import com.example.rces.web.pages.SgiPage;
import io.qameta.allure.Feature;
import io.qameta.allure.Owner;
import io.qameta.allure.Severity;
import io.qameta.allure.Story;
import org.junit.jupiter.api.*;

import java.time.LocalDate;

import static com.example.rces.web.pages.LoginPage.openLoginPage;
import static io.qameta.allure.SeverityLevel.BLOCKER;

@Feature("Web")
@Story("Мероприятия")
@Tags({@Tag("Sgi"), @Tag("Web")})
public class SgiTest extends BaseTest {

    private final String createText = "Создано новое мероприятие";

    @BeforeEach
    public void auth() {
        openLoginPage().successAuth("admin");
    }

    @Test
    @DisplayName("Открытие страницы мероприятий")
    @Owner("ByteCodeAPAA")
    @Severity(BLOCKER)
    public void test01() {
        new MainPage()
                .openSgiPage().ifPresent(SgiPage::logout);
    }

    @Test
    @DisplayName("Создание тестового мероприятия")
    @Owner("ByteCodeAPAA")
    @Severity(BLOCKER)
    public void test02() {
        new MainPage()
                .openSgiPage()
                .ifPresent((sgi) -> sgi.openCreateSgiDialog()
                        .fillCreateDialogSgi(Sgi.createDTO)
                        .clickOnCreateNewSgiButton()
                        .haveNotification(createText)
                        .logout());
    }

    @Test
    @DisplayName("Удаление мероприятия по индексу строки")
    @Owner("ByteCodeAPAA")
    @Severity(BLOCKER)
    public void test03() {
        new MainPage()
                .openSgiPage()
                .ifPresent((sgi) -> sgi.deleteSgiByIndex(
                                sgi.findIndexSgiByEventName("Тестовое мероприятие" + LocalDate.now())
                        )
                        .haveNotification("Мероприятие успешно удалено")
                        .logout());
    }

}
