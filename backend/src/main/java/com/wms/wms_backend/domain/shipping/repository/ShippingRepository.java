package com.wms.wms_backend.domain.shipping.repository;

import com.wms.wms_backend.domain.shipping.entity.Shipping;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShippingRepository extends JpaRepository<Shipping, Long> {

    Optional<Shipping> findByShippingNo(String shippingNo);

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    List<Shipping> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    @Query("SELECT s FROM Shipping s WHERE s.account.topAccountId = :topAccountId ORDER BY s.id ASC")
    List<Shipping> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
