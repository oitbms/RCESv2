//репозиторий технолога
package com.example.rces.repository;

import com.example.rces.models.Technologist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface TechnologistRepository extends JpaRepository <Technologist, UUID> {

    //Что б номер заявки был ++ ключевыми словами Spring
    Integer findTopByOrderByRequestNumberDesc();

}
