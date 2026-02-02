package com.example.rces.web.pages;

import com.example.rces.web.data.Sgi;
import io.qameta.allure.Step;

import static com.codeborne.selenide.Selenide.$;

public class SgiPage implements IMenuButton, IBase {

    private final String createButton = "#create-button";
    private final String filterButton = "#filter-button";
//    private

    @Step("Открыть диалог создания мероприятия")
    public SgiPage openCreateSgiDialog() {
        $(createButton).click();
        return this;
    }

    @Step("Заполнение данных создания мероприятия")
    public SgiPage fillSgi(Sgi sgi) {
        $("[name]='workcenter'").setValue(sgi.getSubDivision());
        $("[name]='event'").setValue(sgi.getEvent());
        $("[name]='actions'").setValue(sgi.getActions());
        $("[name='department']").selectOption("builder");

        addToSaveMassive("employee", sgi.getEmployee());
        $("[name]='employee'").setValue(sgi.getEmployee().getName());

        $("[name='desiredDate']").setValue(sgi.getDesiredDate().toString());
        $("[name]='note'").setValue(sgi.getNote());
        return this;
    }

    @Step("Открыть диалог фильтров")
    public SgiPage openFilterDialog() {
        $(filterButton).click();
        return this;
    }

}
