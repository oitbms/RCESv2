package com.example.rces.repository;

import com.example.rces.models.DocumentFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DocumentFilesRepository extends JpaRepository<DocumentFile, UUID> {

}
