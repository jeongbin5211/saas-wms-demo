package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturnDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseReturnDetailRepository extends JpaRepository<PurchaseReturnDetail, Long> {

    boolean existsByPurchaseReturnIdAndItemIdAndLocationId(Long purchaseReturnId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"purchaseReturn", "item", "location"})
    List<PurchaseReturnDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"item", "location"})
    List<PurchaseReturnDetail> findAllByPurchaseReturnIdOrderByIdAsc(Long purchaseReturnId);

    @EntityGraph(attributePaths = {"purchaseReturn", "item", "location"})
    @Query("SELECT d FROM PurchaseReturnDetail d WHERE d.purchaseReturn.account.topAccountId = :topAccountId ORDER BY d.id ASC")
    List<PurchaseReturnDetail> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
