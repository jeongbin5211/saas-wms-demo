package com.wms.wms_backend.domain.billing.repository;

import com.wms.wms_backend.domain.billing.entity.BillDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillDetailRepository extends JpaRepository<BillDetail, Long> {

    boolean existsByBillIdAndItemId(Long billId, Long itemId);

    @EntityGraph(attributePaths = {"bill", "item"})
    List<BillDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"bill", "item"})
    @Query("SELECT d FROM BillDetail d WHERE d.bill.account.topAccountId = :topAccountId ORDER BY d.id ASC")
    List<BillDetail> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
