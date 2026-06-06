package com.wms.wms_backend.domain.purchase.repository;

import com.wms.wms_backend.domain.purchase.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    boolean existsByPurchaseOrderNo(String purchaseOrderNo);

    boolean existsByPurchaseOrderNoAndIdNot(String purchaseOrderNo, Long id);

    Optional<PurchaseOrder> findByPurchaseOrderNo(String purchaseOrderNo);

    @EntityGraph(attributePaths = {"account", "supplierAccount"})
    List<PurchaseOrder> findAllByOrderByIdAsc();
}
