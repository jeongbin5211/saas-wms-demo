package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Area;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AreaRepository extends JpaRepository<Area, Long> {

    Optional<Area> findByAreaCode(String areaCode);

    boolean existsByAreaCode(String areaCode);

    boolean existsByAreaCodeAndIdNot(String areaCode, Long id);

    @EntityGraph(attributePaths = {"account", "warehouse"})
    List<Area> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = {"account", "warehouse"})
    @Query("SELECT a FROM Area a WHERE a.account.topAccountId = :topAccountId AND a.useYn = 'Y' ORDER BY a.id ASC")
    List<Area> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
