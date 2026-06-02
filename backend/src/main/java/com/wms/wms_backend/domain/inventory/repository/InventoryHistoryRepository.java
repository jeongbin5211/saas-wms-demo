package com.wms.wms_backend.domain.inventory.repository;

import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {

    boolean existsByItemIdAndLocationIdAndHistoryTypeSubCode(Long itemId, Long locationId, String historyTypeSubCode);

    @EntityGraph(attributePaths = {"item", "location"})
    List<InventoryHistory> findAllByOrderByIdAsc();
}
