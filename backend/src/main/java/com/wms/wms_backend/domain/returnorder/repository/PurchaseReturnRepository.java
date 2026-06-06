package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturn;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PurchaseReturnRepository extends JpaRepository<PurchaseReturn, Long> {

    Optional<PurchaseReturn> findByPurchaseReturnNo(String purchaseReturnNo);

    @EntityGraph(attributePaths = {"account", "purchaseOrder"})
    List<PurchaseReturn> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"account", "purchaseOrder"})
    @Query("SELECT r FROM PurchaseReturn r WHERE r.account.topAccountId = :topAccountId ORDER BY r.id ASC")
    List<PurchaseReturn> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
