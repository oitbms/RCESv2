//репозиторий отк
package com.example.rces.repository;

import com.example.rces.models.OtkBid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OtkRepository extends JpaRepository <OtkBid, UUID> {
    List<OtkBid> findByNaimdetail(String naimdetail);
}
