package com.wms.wms_backend.domain.item.repository;

import com.wms.wms_backend.domain.item.entity.ItemMaster;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemMasterRepository extends JpaRepository<ItemMaster, Long> {

    Optional<ItemMaster> findByItemMasterCode(String itemMasterCode);

    @EntityGraph(attributePaths = "account")
    List<ItemMaster> findAllByUseYnOrderByIdAsc(String useYn);
}
