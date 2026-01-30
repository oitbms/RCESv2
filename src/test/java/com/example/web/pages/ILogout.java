package com.example.web.pages;

import io.qameta.allure.Step;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

public interface ILogout {

    String logoutButton = "#logoutButton";

    @Step("Выйти из учётной записи")
    default LoginPage logout() {
        if ($(logoutButton).isDisplayed()) {
            $(logoutButton).click();
        } else {
            performLogout();
        }
        return new LoginPage();
    }

    @Step("Выполнить выход через URL /logout")
    default void performLogout() {
        open("/logout");
    }

}
