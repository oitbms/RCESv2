package com.example.rces.spm.services.service;

import com.example.rces.spm.models.SPMCustomerOrder;
import com.example.rces.spm.services.SPMRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
public class CustomerOrderService {
    private final SPMRepository spmRepository;

    public CustomerOrderService(SPMRepository spmRepository) {
        this.spmRepository = spmRepository;
    }

    public List<SPMCustomerOrder> getFirst10BurningCustomerOrder() {
        List<SPMCustomerOrder> allOrders = spmRepository.findAll(SPMCustomerOrder.class);
        return allOrders.stream()
               .filter(co -> co.getDateDue()!=null)
               .sorted(Comparator.comparingLong(co -> Math.abs(ChronoUnit.DAYS.between(co.getDateDue(), LocalDateTime.now()))))
               .limit(10)
               .toList();
    }

}
