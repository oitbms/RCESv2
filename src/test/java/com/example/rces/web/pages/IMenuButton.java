package com.example.rces.web.pages;

import io.qameta.allure.Step;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

public interface IMenuButton {

    String menuButton = "#menu-button";

    default MainPage openMenu() {
        if ($(menuButton).isDisplayed()) {
            $(menuButton).click();
        } else {
            performOpenMenu();
        }
        return new MainPage();
    }

    @Step("Выполнить переход в меню через URL /menu")
    default void performOpenMenu() {
        open("/menu");
    }

}
