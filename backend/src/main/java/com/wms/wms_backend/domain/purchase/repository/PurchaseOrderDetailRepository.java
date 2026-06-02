package com.wms.wms_backend.domain.purchase.repository;

import com.wms.wms_backend.domain.purchase.entity.PurchaseOrderDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseOrderDetailRepository extends JpaRepository<PurchaseOrderDetail, Long> {

    boolean existsByPurchaseOrderIdAndItemId(Long purchaseOrderId, Long itemId);

    @EntityGraph(attributePaths = {"purchaseOrder", "item"})
    List<PurchaseOrderDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"purchaseOrder", "item"})
    List<PurchaseOrderDetail> findByPurchaseOrderIdOrderByIdAsc(Long purchaseOrderId);
}
