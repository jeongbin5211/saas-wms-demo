package com.wms.wms_backend.domain.billing.repository;

import com.wms.wms_backend.domain.billing.entity.BillDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillDetailRepository extends JpaRepository<BillDetail, Long> {

    boolean existsByBillIdAndItemId(Long billId, Long itemId);

    @EntityGraph(attributePaths = {"bill", "item"})
    List<BillDetail> findAllByOrderByIdAsc();
}
