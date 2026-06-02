package com.wms.wms_backend.domain.sales.repository;

import com.wms.wms_backend.domain.sales.entity.SalesOrderDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesOrderDetailRepository extends JpaRepository<SalesOrderDetail, Long> {

    boolean existsBySalesOrderIdAndItemId(Long salesOrderId, Long itemId);

    @EntityGraph(attributePaths = {"salesOrder", "item"})
    List<SalesOrderDetail> findAllByOrderByIdAsc();
}
