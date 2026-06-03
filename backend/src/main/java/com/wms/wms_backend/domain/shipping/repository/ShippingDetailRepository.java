package com.wms.wms_backend.domain.shipping.repository;

import com.wms.wms_backend.domain.shipping.entity.ShippingDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShippingDetailRepository extends JpaRepository<ShippingDetail, Long> {

    boolean existsByShippingIdAndItemIdAndLocationId(Long shippingId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"shipping", "item", "location"})
    List<ShippingDetail> findAllByShippingIdOrderByIdAsc(Long shippingId);

    @EntityGraph(attributePaths = {"shipping", "item", "location"})
    List<ShippingDetail> findAllByOrderByIdAsc();
}
