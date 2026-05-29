package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Location;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    boolean existsByLocationCode(String locationCode);

    @EntityGraph(attributePaths = "zone")
    List<Location> findAllByUseYnOrderByIdAsc(String useYn);
}
