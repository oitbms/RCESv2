package com.example.rces.dto.report;

import com.example.rces.models.PartsDirectory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.example.rces.utils.DateUtil.formatedDate;

public class PdItem {

    private String employee;

    private String date;

    private List<Thermal> thermal = new ArrayList<>();

    private List<Locksmith> locksmith = new ArrayList<>();

    public PdItem(String employee, List<PartsDirectory> thermal, List<PartsDirectory> locksmith) {
        setEmployee(employee);
        setDate(formatedDate(LocalDate.now()) + "г.");
        thermal.forEach(t -> {
            Thermal model = new Thermal(t);
            this.thermal.add(model);
        });
        locksmith.forEach(l -> {
            Locksmith model = new Locksmith(l);
            this.locksmith.add(model);
        });
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<Thermal> getThermal() {
        return thermal;
    }

    public void setThermal(List<Thermal> thermal) {
        this.thermal = thermal;
    }

    public List<Locksmith> getLocksmith() {
        return locksmith;
    }

    public void setLocksmith(List<Locksmith> locksmith) {
        this.locksmith = locksmith;
    }

    public static class Thermal {

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Thermal(PartsDirectory pdi) {
            setCustomerOrder(pdi.getCustomerOrder().getName());
            setName(pdi.getName());
            setScheme(pdi.getScheme());
            setQty(pdi.getQty());
            setComment(pdi.getComment());
        }

        public String getCustomerOrder() {
            return customerOrder;
        }

        public void setCustomerOrder(String customerOrder) {
            this.customerOrder = customerOrder;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getScheme() {
            return scheme;
        }

        public void setScheme(String scheme) {
            this.scheme = scheme;
        }

        public Integer getQty() {
            return qty;
        }

        public void setQty(Integer qty) {
            this.qty = qty;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }

    public static class Locksmith {

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Locksmith(PartsDirectory pdi) {
            setCustomerOrder(pdi.getCustomerOrder().getName());
            setName(pdi.getName());
            setScheme(pdi.getScheme());
            setQty(pdi.getQty());
            setComment(pdi.getComment());
        }

        public String getCustomerOrder() {
            return customerOrder;
        }

        public void setCustomerOrder(String customerOrder) {
            this.customerOrder = customerOrder;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getScheme() {
            return scheme;
        }

        public void setScheme(String scheme) {
            this.scheme = scheme;
        }

        public Integer getQty() {
            return qty;
        }

        public void setQty(Integer qty) {
            this.qty = qty;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }
}
