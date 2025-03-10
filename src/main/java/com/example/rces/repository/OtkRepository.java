//репозиторий отк
package com.example.rces.repository;

import com.example.rces.models.Otk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OtkRepository extends JpaRepository <Otk, UUID> {

    //Что б номер заявки был ++ ключевыми словами Spring
    Integer findTopByOrderByRequestNumberDesc();

}
