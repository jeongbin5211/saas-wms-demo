package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturn;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseReturnRepository extends JpaRepository<PurchaseReturn, Long> {

    Optional<PurchaseReturn> findByPurchaseReturnNo(String purchaseReturnNo);

    @EntityGraph(attributePaths = {"account", "purchaseOrder"})
    List<PurchaseReturn> findAllByOrderByIdAsc();
}
