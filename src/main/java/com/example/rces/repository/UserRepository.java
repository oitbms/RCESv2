package com.example.rces.repository;

import com.example.rces.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    public User findByUsername(String username);
}
