package com.wms.wms_backend.domain.shipping.repository;

import com.wms.wms_backend.domain.shipping.entity.ShippingDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShippingDetailRepository extends JpaRepository<ShippingDetail, Long> {

    boolean existsByShippingIdAndItemIdAndLocationId(Long shippingId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"shipping", "item", "location"})
    List<ShippingDetail> findAllByShippingIdOrderByIdAsc(Long shippingId);

    @EntityGraph(attributePaths = {"shipping", "item", "location"})
    List<ShippingDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"shipping", "item", "location"})
    @Query("SELECT d FROM ShippingDetail d WHERE d.shipping.account.topAccountId = :topAccountId ORDER BY d.id ASC")
    List<ShippingDetail> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
