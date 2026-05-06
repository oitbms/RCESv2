package com.example.rces.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public class PartsDirectoryFrom1C {

    @JsonProperty("Запрос")
    private List<Response> response;

    public List<Response> getResponse() {
        return response;
    }

    public void setResponse(List<Response> response) {
        this.response = response;
    }

    public static class Response {

        @JsonProperty("НаименованиеПодзаказа")
        private String customerOrder;

        @JsonProperty("Чертеж")
        private String item;

        @JsonProperty("Деталь")
        private String scheme;

        @JsonProperty("КоличествоДеталей")
        private String name;

        @JsonProperty("Размер")
        private String thickness;

        @JsonProperty("Сталь")
        private String steel;

        @JsonProperty("КоличествоСтали")
        private BigDecimal qty;


        public String getCustomerOrder() {
            return customerOrder;
        }

        public void setCustomerOrder(String customerOrder) {
            this.customerOrder = customerOrder;
        }

        public String getItem() {
            return item;
        }

        public void setItem(String item) {
            this.item = item;
        }

        public String getScheme() {
            return scheme;
        }

        public void setScheme(String scheme) {
            this.scheme = scheme;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getThickness() {
            return thickness;
        }

        public void setThickness(String thickness) {
            this.thickness = thickness;
        }

        public String getSteel() {
            return steel;
        }

        public void setSteel(String steel) {
            this.steel = steel;
        }

        public BigDecimal getQty() {
            return qty;
        }

        public void setQty(BigDecimal qty) {
            this.qty = qty;
        }
    }

}
