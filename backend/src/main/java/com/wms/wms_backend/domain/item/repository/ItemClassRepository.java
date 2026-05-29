package com.wms.wms_backend.domain.item.repository;

import com.wms.wms_backend.domain.item.entity.ItemClass;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemClassRepository extends JpaRepository<ItemClass, Long> {

    Optional<ItemClass> findByItemClassCode(String itemClassCode);

    @EntityGraph(attributePaths = "itemMaster")
    List<ItemClass> findAllByUseYnOrderByIdAsc(String useYn);
}
