package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.SalesReturnDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalesReturnDetailRepository extends JpaRepository<SalesReturnDetail, Long> {

    boolean existsBySalesReturnIdAndItemIdAndLocationId(Long salesReturnId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"salesReturn", "item", "location"})
    List<SalesReturnDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"item", "location"})
    List<SalesReturnDetail> findAllBySalesReturnIdOrderByIdAsc(Long salesReturnId);
}
