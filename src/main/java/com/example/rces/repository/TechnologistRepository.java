//репозиторий технолога
package com.example.rces.repository;

import com.example.rces.models.Technologist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TechnologistRepository extends JpaRepository <Technologist, UUID> {
}
