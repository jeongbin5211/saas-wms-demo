package com.wms.wms_backend.domain.sales.repository;

import com.wms.wms_backend.domain.sales.entity.SalesOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    boolean existsBySalesOrderNo(String salesOrderNo);

    boolean existsBySalesOrderNoAndIdNot(String salesOrderNo, Long id);

    Optional<SalesOrder> findBySalesOrderNo(String salesOrderNo);

    @EntityGraph(attributePaths = {"account", "customerAccount"})
    List<SalesOrder> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"account", "customerAccount"})
    @Query("SELECT o FROM SalesOrder o WHERE o.account.topAccountId = :topAccountId ORDER BY o.id ASC")
    List<SalesOrder> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
