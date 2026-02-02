package com.example.rces.web.test;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.logevents.SelenideLogger;
import io.qameta.allure.selenide.AllureSelenide;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;

import static com.codeborne.selenide.Selenide.closeWebDriver;
import static com.example.rces.config.Properties.PROPERTIES;

public abstract class BaseTest {

    @BeforeAll
    public static void setUp() {
        SelenideLogger.addListener("allure", new AllureSelenide());
        Configuration.baseUrl = PROPERTIES.getBaseUrl();
        Configuration.browser = PROPERTIES.getBrowserName();
        Configuration.browserVersion = PROPERTIES.getBrowserVersion();
        Configuration.browserSize = PROPERTIES.getBrowserSize();
        Configuration.pageLoadTimeout = PROPERTIES.getPageLoadTimeout();
        Configuration.timeout = PROPERTIES.getTimeout();
        Configuration.headless = PROPERTIES.isHeadless();
    }

    @AfterEach
    public void tearDown() {
        closeWebDriver();
    }

}
