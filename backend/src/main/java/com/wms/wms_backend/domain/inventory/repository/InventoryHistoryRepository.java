package com.wms.wms_backend.domain.inventory.repository;

import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {

    boolean existsByItemIdAndLocationIdAndHistoryTypeSubCode(Long itemId, Long locationId, String historyTypeSubCode);

    @EntityGraph(attributePaths = {"item", "location"})
    List<InventoryHistory> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"item", "location"})
    @Query("SELECT h FROM InventoryHistory h WHERE h.account.topAccountId = :topAccountId ORDER BY h.id ASC")
    List<InventoryHistory> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
