package com.example.rces.service;

import com.example.rces.models.Employee;
import com.example.rces.models.SGI;
import com.example.rces.models.SgiLog;

import java.util.List;

public interface SgiLogService {

    List<SgiLog> createLog(SGI oldSgi, SGI newSGI, Employee updaterUser);

}
