package com.wms.wms_backend.domain.receiving.repository;

import com.wms.wms_backend.domain.receiving.entity.ReceivingDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReceivingDetailRepository extends JpaRepository<ReceivingDetail, Long> {

    boolean existsByReceivingIdAndItemIdAndLocationId(Long receivingId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"receiving", "item", "location"})
    List<ReceivingDetail> findAllByReceivingIdOrderByIdAsc(Long receivingId);

    @EntityGraph(attributePaths = {"receiving", "item", "location"})
    List<ReceivingDetail> findAllByOrderByIdAsc();

    @EntityGraph(attributePaths = {"receiving", "item", "location"})
    @Query("SELECT d FROM ReceivingDetail d WHERE d.receiving.account.topAccountId = :topAccountId ORDER BY d.id ASC")
    List<ReceivingDetail> findAllByTopAccountId(@Param("topAccountId") Long topAccountId);
}
