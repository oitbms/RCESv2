package com.example.rces.spm.controller.payload;

import com.example.rces.spm.models.JobComponent;

import java.math.BigDecimal;
import java.time.LocalDate;

public record JobComponentPayload(Long id, String item, BigDecimal qtyDemand,
                                  BigDecimal qtyFinished, LocalDate dateStart, LocalDate dateEnd) {
    public JobComponentPayload(JobComponent jobComponent) {
        this(jobComponent.getId(), jobComponent.getItem().getName(),
                jobComponent.getQtyDemand(), jobComponent.getQtyFinished(),
                jobComponent.getDateStart().toLocalDate(), jobComponent.getDateCalcEnd().toLocalDate());
    }
}
