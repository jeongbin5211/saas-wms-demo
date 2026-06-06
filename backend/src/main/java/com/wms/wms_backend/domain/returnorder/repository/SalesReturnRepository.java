package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.SalesReturn;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SalesReturnRepository extends JpaRepository<SalesReturn, Long> {

    Optional<SalesReturn> findBySalesReturnNo(String salesReturnNo);

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    List<SalesReturn> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    @Query("SELECT r FROM SalesReturn r WHERE r.account.topAccountId = :topAccountId ORDER BY r.id ASC")
    List<SalesReturn> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
