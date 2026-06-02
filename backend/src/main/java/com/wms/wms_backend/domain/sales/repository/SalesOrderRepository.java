package com.wms.wms_backend.domain.sales.repository;

import com.wms.wms_backend.domain.sales.entity.SalesOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    Optional<SalesOrder> findBySalesOrderNo(String salesOrderNo);

    @EntityGraph(attributePaths = {"account", "customerAccount"})
    List<SalesOrder> findAllByOrderByIdAsc();
}
