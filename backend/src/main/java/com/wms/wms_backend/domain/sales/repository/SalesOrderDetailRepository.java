package com.wms.wms_backend.domain.sales.repository;

import com.wms.wms_backend.domain.sales.entity.SalesOrderDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SalesOrderDetailRepository extends JpaRepository<SalesOrderDetail, Long> {

    boolean existsBySalesOrderIdAndItemId(Long salesOrderId, Long itemId);

    @EntityGraph(attributePaths = {"salesOrder", "item"})
    List<SalesOrderDetail> findAllBySalesOrderIdOrderByIdAsc(Long salesOrderId);

    @EntityGraph(attributePaths = {"salesOrder", "item"})
    List<SalesOrderDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"salesOrder", "item"})
    @Query("SELECT d FROM SalesOrderDetail d WHERE d.salesOrder.account.topAccountId = :topAccountId ORDER BY d.id ASC")
    List<SalesOrderDetail> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
