//репозиторий конструктора
package com.example.rces.repository;

import com.example.rces.models.Constructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConstructorRepository extends JpaRepository <Constructor, UUID> {

    //Что б номер заявки был ++ ключевыми словами Spring
    Integer findTopByOrderByRequestNumberDesc();

}
