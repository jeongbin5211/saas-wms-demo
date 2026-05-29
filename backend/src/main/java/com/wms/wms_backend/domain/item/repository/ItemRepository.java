package com.wms.wms_backend.domain.item.repository;

import com.wms.wms_backend.domain.item.entity.Item;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    boolean existsByItemCode(String itemCode);

    @EntityGraph(attributePaths = "itemClass")
    List<Item> findAllByUseYnOrderByIdAsc(String useYn);
}
