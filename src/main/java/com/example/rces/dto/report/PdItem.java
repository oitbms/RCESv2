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

    private List<Baikal> baikal = new ArrayList<>();

    private List<Shearingpunching> shearingpunching = new ArrayList<>();

    private List<Drilling> drilling = new ArrayList<>();

    private List<Bending> bending = new ArrayList<>();

    private List<Pressing> pressing = new ArrayList<>();

    public PdItem(String employee, List<PartsDirectory> thermal, List<PartsDirectory> locksmith, List<PartsDirectory> baikal,
                  List<PartsDirectory> shearingpunching, List<PartsDirectory> drilling, List<PartsDirectory> bending, List<PartsDirectory> pressing) {
        setEmployee(employee);
        setDate(formatedDate(LocalDate.now()) + " г.");
        thermal.forEach(t -> {
            Thermal model = new Thermal(t);
            this.thermal.add(model);
        });
        locksmith.forEach(l -> {
            Locksmith model = new Locksmith(l);
            this.locksmith.add(model);
        });

        baikal.forEach(l -> {
            Baikal model = new Baikal(l);
            this.baikal.add(model);
        });
        shearingpunching.forEach(l -> {
            Shearingpunching model = new Shearingpunching(l);
            this.shearingpunching.add(model);
        });
        drilling.forEach(l -> {
            Drilling model = new Drilling(l);
            this.drilling.add(model);
        });
        bending.forEach(l -> {
            Bending model = new Bending(l);
            this.bending.add(model);
        });
        pressing.forEach(l -> {
            Pressing model = new Pressing(l);
            this.pressing.add(model);
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

    public List<Baikal> getBaikal() {
        return baikal;
    }

    public void setBaikal(List<Baikal> baikal) {
        this.baikal = baikal;
    }

    public List<Shearingpunching> getShearingpunching() {
        return shearingpunching;
    }

    public void setShearingpunching(List<Shearingpunching> shearingpunching) {
        this.shearingpunching = shearingpunching;
    }

    public List<Drilling> getDrilling() {
        return drilling;
    }

    public void setDrilling(List<Drilling> drilling) {
        this.drilling = drilling;
    }

    public List<Bending> getBending() {
        return bending;
    }

    public void setBending(List<Bending> bending) {
        this.bending = bending;
    }

    public List<Pressing> getPressing() {
        return pressing;
    }

    public void setPressing(List<Pressing> pressing) {
        this.pressing = pressing;
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
    public static class Baikal {

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Baikal(PartsDirectory pdi) {
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
    public static class Shearingpunching{

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Shearingpunching(PartsDirectory pdi) {
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
    public static class Drilling{

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Drilling(PartsDirectory pdi) {
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
    public static class Bending{

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Bending(PartsDirectory pdi) {
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
    public static class Pressing{

        private String customerOrder;

        private String name;

        private String scheme;

        private Integer qty;

        private String comment;

        public Pressing(PartsDirectory pdi) {
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
