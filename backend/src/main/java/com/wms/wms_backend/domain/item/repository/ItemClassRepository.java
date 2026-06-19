package com.wms.wms_backend.domain.item.repository;

import com.wms.wms_backend.domain.item.entity.ItemClass;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemClassRepository extends JpaRepository<ItemClass, Long> {

    Optional<ItemClass> findByItemClassCode(String itemClassCode);

    boolean existsByItemClassCode(String itemClassCode);

    @EntityGraph(attributePaths = "itemMaster")
    List<ItemClass> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = "itemMaster")
    @Query("SELECT ic FROM ItemClass ic WHERE ic.account.topAccountId = :topAccountId AND ic.useYn = 'Y' ORDER BY ic.id ASC")
    List<ItemClass> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);

    @EntityGraph(attributePaths = "itemMaster")
    @Query("SELECT ic FROM ItemClass ic WHERE ic.account.topAccountId = :topAccountId AND ic.useYn = :useYn ORDER BY ic.id ASC")
    List<ItemClass> findAllByTopAccountIdAndUseYn(@Param("topAccountId") Long topAccountId, @Param("useYn") String useYn);
}
