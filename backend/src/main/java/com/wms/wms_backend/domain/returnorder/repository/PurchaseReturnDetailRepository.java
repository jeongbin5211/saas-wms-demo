package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturnDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseReturnDetailRepository extends JpaRepository<PurchaseReturnDetail, Long> {

    boolean existsByPurchaseReturnIdAndItemIdAndLocationId(Long purchaseReturnId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"purchaseReturn", "item", "location"})
    List<PurchaseReturnDetail> findAllByOrderByIdAsc();
}
