package com.example.rces.spm.services.service;

import com.example.rces.spm.models.SPMCustomerOrder;
import com.example.rces.spm.services.SPMRepository;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class CustomerOrderService {
    private final SPMRepository spmRepository;

    public CustomerOrderService(SPMRepository spmRepository) {
        this.spmRepository = spmRepository;
    }

    public Map<List<SPMCustomerOrder>, List<SPMCustomerOrder>> getFirst10BurningCustomerOrderAndAll() {
        List<SPMCustomerOrder> allOrders = spmRepository.findAll(SPMCustomerOrder.class);
        List<SPMCustomerOrder> burningOrders = allOrders.stream()
               .filter(co -> co.getDateDue()!=null)
               .sorted(Comparator.comparingLong(co -> Math.abs(ChronoUnit.DAYS.between(co.getDateDue(), LocalDateTime.now()))))
               .limit(10)
               .toList();
        return Map.of(burningOrders, allOrders);
    }

}
