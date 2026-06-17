package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Warehouse;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    Optional<Warehouse> findByWarehouseCode(String warehouseCode);

    boolean existsByWarehouseCode(String warehouseCode);

    boolean existsByWarehouseCodeAndIdNot(String warehouseCode, Long id);

    boolean existsByTopAccountIdAndWarehouseCode(Long topAccountId, String warehouseCode);

    boolean existsByTopAccountIdAndWarehouseCodeAndIdNot(Long topAccountId, String warehouseCode, Long id);

    @EntityGraph(attributePaths = {"account", "address"})
    List<Warehouse> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = {"account", "address"})
    List<Warehouse> findAllByTopAccountIdAndUseYnOrderByIdAsc(Long topAccountId, String useYn);

    @EntityGraph(attributePaths = {"account", "address"})
    List<Warehouse> findAllByTopAccountIdOrderByIdAsc(Long topAccountId);
}
