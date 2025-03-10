//репозиторий изображении технолога
package com.example.rces.repository;

import com.example.rces.models.ImageTechnologist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TechnologistImageRepository extends JpaRepository <ImageTechnologist, UUID> {
}
