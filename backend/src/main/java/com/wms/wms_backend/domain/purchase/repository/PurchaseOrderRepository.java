package com.wms.wms_backend.domain.purchase.repository;

import com.wms.wms_backend.domain.purchase.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    boolean existsByPurchaseOrderNo(String purchaseOrderNo);

    boolean existsByPurchaseOrderNoAndIdNot(String purchaseOrderNo, Long id);

    Optional<PurchaseOrder> findByPurchaseOrderNo(String purchaseOrderNo);

    @EntityGraph(attributePaths = {"account", "supplierAccount"})
    List<PurchaseOrder> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"account", "supplierAccount"})
    @Query("SELECT o FROM PurchaseOrder o WHERE o.account.topAccountId = :topAccountId ORDER BY o.id ASC")
    List<PurchaseOrder> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
