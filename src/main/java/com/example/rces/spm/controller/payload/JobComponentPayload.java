package com.example.rces.spm.controller.payload;

import com.example.rces.spm.models.JobComponent;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public record JobComponentPayload(Long id, Long parentId, String name, BigDecimal qty,
                                  BigDecimal qtyFinished, LocalDate dateStart, LocalDate dateEnd) {
    public JobComponentPayload(JobComponent jobComponent) {
        this(jobComponent.getId(), jobComponent.getParentJobComponent()!=null ? jobComponent.getParentJobComponent().getId() : null,
                jobComponent.getItem().getName(),
                jobComponent.getQtyDemand().setScale(3, RoundingMode.DOWN), jobComponent.getQtyFinished().setScale(3, RoundingMode.DOWN),
                jobComponent.getDateStart().toLocalDate(),
                jobComponent.getDateCalcEnd()!=null ? jobComponent.getDateCalcEnd().toLocalDate() : null);
    }
}
