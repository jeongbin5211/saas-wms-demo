package com.wms.wms_backend.domain.receiving.repository;

import com.wms.wms_backend.domain.receiving.entity.ReceivingDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceivingDetailRepository extends JpaRepository<ReceivingDetail, Long> {

    boolean existsByReceivingIdAndItemIdAndLocationId(Long receivingId, Long itemId, Long locationId);

    @EntityGraph(attributePaths = {"receiving", "item", "location"})
    List<ReceivingDetail> findAllByOrderByIdAsc();
}
