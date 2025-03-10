//репозиторий изображении отк
package com.example.rces.repository;

import com.example.rces.models.ImageOtk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OtkImageRepository extends JpaRepository <ImageOtk, UUID> {
}
