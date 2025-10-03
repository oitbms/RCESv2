package com.example.rces.configuration;

import com.example.rces.models.BaseRevisionEntity;
import com.example.rces.service.EmployeeService;
import org.hibernate.envers.RevisionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuditRevisionListener implements RevisionListener {


    private final EmployeeService employeeService;

    @Autowired
    public AuditRevisionListener(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Override
    public void newRevision(Object revisionEntity) {
        BaseRevisionEntity revision = (BaseRevisionEntity) revisionEntity;
        revision.setChangedBy(employeeService.getCurrentUser());
    }
}
