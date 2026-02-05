package com.example.rces.web.pages;

import com.codeborne.selenide.Selenide;
import io.qameta.allure.Step;
import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selenide.$;

public class LoginPage extends PageBase {

    private static final String loginField = "#username";
    private static final String loginButton = "#loginButton";

    public LoginPage() {
        $(".login-card").shouldBe(visible);
    }

    @Step("Открыть страницу авторизации")
    public static LoginPage openLoginPage() {
        Selenide.open("login");
        return new LoginPage();
    }

    @Step("Успешная авторизация")
    public MainPage successAuth(String key) {
        $(loginField).setValue(key);
        $(loginButton).click();
        return new MainPage();
    }

    @Step("Не успешная авторизация")
    public void failedAuth() {
        $(loginField).setValue("Не существующий ключ");
        $(loginButton).click();
    }

}
