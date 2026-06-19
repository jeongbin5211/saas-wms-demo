package com.wms.wms_backend.domain.item.repository;

import com.wms.wms_backend.domain.item.entity.Item;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    boolean existsByItemCode(String itemCode);

    boolean existsByItemCodeAndIdNot(String itemCode, Long id);

    boolean existsByBarcodeAndIdNot(String barcode, Long id);

    Optional<Item> findByItemCode(String itemCode);

    @EntityGraph(attributePaths = "itemClass")
    List<Item> findAllByUseYnOrderByIdAsc(String useYn);

    @EntityGraph(attributePaths = {"itemClass", "itemClass.itemMaster", "supplier"})
    @Query("SELECT i FROM Item i WHERE i.account.topAccountId = :topAccountId AND i.useYn = 'Y' ORDER BY i.id ASC")
    List<Item> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);

    @EntityGraph(attributePaths = {"itemClass", "itemClass.itemMaster", "supplier"})
    @Query("SELECT i FROM Item i WHERE i.account.topAccountId = :topAccountId AND i.useYn = :useYn ORDER BY i.id ASC")
    List<Item> findAllByTopAccountIdAndUseYn(@Param("topAccountId") Long topAccountId, @Param("useYn") String useYn);
}
