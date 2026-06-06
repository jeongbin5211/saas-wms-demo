package com.wms.wms_backend.domain.inventory.repository;

import com.wms.wms_backend.domain.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    boolean existsByItemIdAndLocationId(Long itemId, Long locationId);

    Optional<Inventory> findByItemIdAndLocationId(Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"item", "location"})
    List<Inventory> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = {"item", "location"})
    @Query("SELECT i FROM Inventory i WHERE i.account.topAccountId = :topAccountId AND i.useYn = 'Y' ORDER BY i.id ASC")
    List<Inventory> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
