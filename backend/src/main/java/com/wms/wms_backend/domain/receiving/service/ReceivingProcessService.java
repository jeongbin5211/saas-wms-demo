package com.wms.wms_backend.domain.receiving.service;

import com.wms.wms_backend.domain.inventory.entity.Inventory;
import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import com.wms.wms_backend.domain.inventory.repository.InventoryHistoryRepository;
import com.wms.wms_backend.domain.inventory.repository.InventoryRepository;
import com.wms.wms_backend.domain.receiving.entity.Receiving;
import com.wms.wms_backend.domain.receiving.entity.ReceivingDetail;
import com.wms.wms_backend.domain.receiving.repository.ReceivingDetailRepository;
import com.wms.wms_backend.domain.receiving.repository.ReceivingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ReceivingProcessService {

    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final InventoryRepository inventoryRepository;
    private final ReceivingDetailRepository receivingDetailRepository;
    private final ReceivingRepository receivingRepository;

    @Transactional
    public ReceivingConfirmResult confirmReceiving(Long receivingId) {
        Receiving receiving = receivingRepository.findById(receivingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "입고 정보를 찾을 수 없습니다."));

        if ("CONFIRMED".equals(receiving.getReceivingStatusSubCode())) {
            return new ReceivingConfirmResult(
                    receiving.getId(),
                    receiving.getReceivingNo(),
                    receiving.getReceivingStatusSubCode(),
                    0
            );
        }

        List<ReceivingDetail> details = receivingDetailRepository.findAllByReceivingIdOrderByIdAsc(receiving.getId());

        if (details.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "입고 상세가 없어 확정할 수 없습니다.");
        }

        int totalQuantity = 0;

        for (ReceivingDetail detail : details) {
            Inventory inventory = inventoryRepository.findByItemIdAndLocationId(
                            detail.getItem().getId(),
                            detail.getLocation().getId()
                    )
                    .orElseGet(() -> inventoryRepository.save(new Inventory(
                            receiving.getAccount(),
                            detail.getItem(),
                            detail.getLocation(),
                            0,
                            0
                    )));

            int beforeQuantity = inventory.getQuantity();
            inventory.increaseQuantity(detail.getReceivedQuantity());
            int afterQuantity = inventory.getQuantity();
            totalQuantity += detail.getReceivedQuantity();

            inventoryHistoryRepository.save(new InventoryHistory(
                    receiving.getAccount(),
                    detail.getItem(),
                    detail.getLocation(),
                    "INBOUND",
                    detail.getReceivedQuantity(),
                    beforeQuantity,
                    afterQuantity,
                    "Receiving confirmed: " + receiving.getReceivingNo()
            ));
        }

        receiving.confirm();
        receiving.getPurchaseOrder().completeReceiving();

        log.info("입고 확정 완료 | receivingId={} receivingNo={} totalQty={}", receiving.getId(), receiving.getReceivingNo(), totalQuantity);

        return new ReceivingConfirmResult(
                receiving.getId(),
                receiving.getReceivingNo(),
                receiving.getReceivingStatusSubCode(),
                totalQuantity
        );
    }

    public record ReceivingConfirmResult(
            Long receivingId,
            String receivingNo,
            String receivingStatusSubCode,
            Integer totalQuantity
    ) {
    }
}
