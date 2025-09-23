package com.example.rces.service;

import com.example.rces.models.Inconsistency;

import java.util.List;

public interface InconsistenciesService {

   List<Inconsistency> findAllInconsistencies();

   Inconsistency createInconsistency(String name, String controlType);

}
