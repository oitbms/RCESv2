package com.example.rces.controller.payload;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.models.GeneralReason;
import com.example.rces.models.ImageTechnologist;

    public record TechnologistPayload(
            Employee employee,
            ImageTechnologist image,
            GeneralReason.Technologist reason,
            CustomerOrder customerOrder
    ) {
    }
