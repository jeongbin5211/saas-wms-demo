package com.wms.wms_backend.domain.shipping.repository;

import com.wms.wms_backend.domain.shipping.entity.Shipping;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShippingRepository extends JpaRepository<Shipping, Long> {

    Optional<Shipping> findByShippingNo(String shippingNo);

    @EntityGraph(attributePaths = {"account", "salesOrder"})
    List<Shipping> findAllByOrderByIdAsc();
}
