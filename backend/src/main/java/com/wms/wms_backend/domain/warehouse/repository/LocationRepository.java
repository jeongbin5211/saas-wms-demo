package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Location;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    boolean existsByLocationCode(String locationCode);

    Optional<Location> findByLocationCode(String locationCode);

    @EntityGraph(attributePaths = "zone")
    List<Location> findAllByUseYnOrderByIdAsc(String useYn);
}
