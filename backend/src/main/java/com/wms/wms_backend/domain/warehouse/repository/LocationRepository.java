package com.wms.wms_backend.domain.warehouse.repository;

import com.wms.wms_backend.domain.warehouse.entity.Location;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    boolean existsByLocationCode(String locationCode);

    boolean existsByLocationCodeAndIdNot(String locationCode, Long id);

    Optional<Location> findByLocationCode(String locationCode);

    @EntityGraph(attributePaths = "zone")
    List<Location> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = "zone")
    @Query("SELECT l FROM Location l WHERE l.account.topAccountId = :topAccountId AND l.useYn = 'Y' ORDER BY l.id ASC")
    List<Location> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
