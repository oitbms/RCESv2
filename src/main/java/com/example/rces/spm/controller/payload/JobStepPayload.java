package com.example.rces.spm.controller.payload;

import com.example.rces.spm.models.JobStep;

import java.math.BigDecimal;
import java.time.LocalDate;

public record JobStepPayload(Long id, String name, String mlmNode, String description, BigDecimal qty, BigDecimal qtyFinished, BigDecimal resourceTime,
                                  LocalDate dateStart, LocalDate dateEnd, LocalDate dateCalcStart, LocalDate dateCalcEnd) {

    public JobStepPayload(JobStep jobStep) {
        this(
                jobStep.getId(),
                String.format("%s: %s",jobStep.getJobcomponent().getItem().getName(), jobStep.getNumber()),
                jobStep.getMlmNode().getName(),
                jobStep.getDescription(),
                jobStep.getQtyProduction(),
                jobStep.getQtyFinished(),
                jobStep.getResourceTime(),
                jobStep.getDateStart().toLocalDate(),
                jobStep.getDateEnd().toLocalDate(),
                jobStep.getDateCalcStart().toLocalDate(),
                jobStep.getDateCalcEnd().toLocalDate()
        );
    }
}
