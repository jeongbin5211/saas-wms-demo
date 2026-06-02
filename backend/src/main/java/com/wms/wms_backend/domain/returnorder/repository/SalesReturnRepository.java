package com.wms.wms_backend.domain.returnorder.repository;

import com.wms.wms_backend.domain.returnorder.entity.SalesReturn;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalesReturnRepository extends JpaRepository<SalesReturn, Long> {

    Optional<SalesReturn> findBySalesReturnNo(String salesReturnNo);

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    List<SalesReturn> findAllByOrderByIdAsc();
}
