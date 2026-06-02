package com.wms.wms_backend.domain.inventory.repository;

import com.wms.wms_backend.domain.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    boolean existsByItemIdAndLocationId(Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"item", "location"})
    List<Inventory> findAllByUseYnOrderByIdAsc(String useYn);
}
