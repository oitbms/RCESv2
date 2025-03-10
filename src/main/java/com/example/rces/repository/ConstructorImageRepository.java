//репозитории изображении конструктора
package com.example.rces.repository;

import com.example.rces.models.ImageConstructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConstructorImageRepository extends JpaRepository <ImageConstructor, UUID> {
}
