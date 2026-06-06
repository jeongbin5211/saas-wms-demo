package com.wms.wms_backend.domain.billing.repository;

import com.wms.wms_backend.domain.billing.entity.Bill;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByBillNo(String billNo);

    Optional<Bill> findBySalesOrderId(Long salesOrderId);

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    List<Bill> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    @Query("SELECT b FROM Bill b WHERE b.account.topAccountId = :topAccountId ORDER BY b.id ASC")
    List<Bill> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
