package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Zone;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ZoneRepository extends JpaRepository<Zone, Long> {

    Optional<Zone> findByZoneCode(String zoneCode);

    boolean existsByZoneCode(String zoneCode);

    boolean existsByZoneCodeAndIdNot(String zoneCode, Long id);

    @EntityGraph(attributePaths = {"account", "warehouse", "area", "area.warehouse"})
    List<Zone> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = {"account", "warehouse", "area", "area.warehouse"})
    @Query("SELECT z FROM Zone z WHERE z.account.topAccountId = :topAccountId AND z.useYn = 'Y' ORDER BY z.id ASC")
    List<Zone> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
