package com.wms.wms_backend.domain.receiving.repository;

import com.wms.wms_backend.domain.receiving.entity.Receiving;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReceivingRepository extends JpaRepository<Receiving, Long> {

    Optional<Receiving> findByReceivingNo(String receivingNo);

    @EntityGraph(attributePaths = {"account", "purchaseOrder"})
    List<Receiving> findAllByOrderByIdAsc();
}
