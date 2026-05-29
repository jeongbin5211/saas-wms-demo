package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Area;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, Long> {

    Optional<Area> findByAreaCode(String areaCode);

    @EntityGraph(attributePaths = "warehouse")
    List<Area> findAllByUseYnOrderByIdAsc(String useYn);
}
