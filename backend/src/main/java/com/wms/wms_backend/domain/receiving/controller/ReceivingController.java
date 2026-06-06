package com.wms.wms_backend.domain.receiving.controller;

import com.wms.wms_backend.domain.receiving.entity.Receiving;
import com.wms.wms_backend.domain.receiving.entity.ReceivingDetail;
import com.wms.wms_backend.domain.receiving.repository.ReceivingDetailRepository;
import com.wms.wms_backend.domain.receiving.repository.ReceivingRepository;
import com.wms.wms_backend.domain.receiving.service.ReceivingProcessService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ReceivingController {

    private final ReceivingRepository receivingRepository;
    private final ReceivingDetailRepository receivingDetailRepository;
    private final ReceivingProcessService receivingProcessService;

    @GetMapping("/api/receivings")
    public List<ReceivingResponse> findReceivings(
            @RequestParam(required = false) String receivingNo,
            @RequestParam(required = false) String receivingStatusSubCode
    ) {
        return receivingRepository.findAllByOrderByIdAsc().stream()
                .filter(r -> receivingNo == null || r.getReceivingNo().contains(receivingNo))
                .filter(r -> receivingStatusSubCode == null || r.getReceivingStatusSubCode().equals(receivingStatusSubCode))
                .map(ReceivingResponse::from)
                .toList();
    }

    @GetMapping("/api/receiving-details")
    public List<ReceivingDetailResponse> findReceivingDetails() {
        return receivingDetailRepository.findAllByOrderByIdAsc().stream()
                .map(ReceivingDetailResponse::from)
                .toList();
    }

    @PostMapping("/api/receivings/{receivingId}/confirm")
    public ReceivingProcessService.ReceivingConfirmResult confirmReceiving(@PathVariable Long receivingId) {
        return receivingProcessService.confirmReceiving(receivingId);
    }

    public record ReceivingResponse(
            Long id,
            Long accountId,
            Long purchaseOrderId,
            String purchaseOrderNo,
            String receivingNo,
            String receivingStatusSubCode,
            LocalDate receivingDate
    ) {
        public static ReceivingResponse from(Receiving receiving) {
            return new ReceivingResponse(
                    receiving.getId(),
                    receiving.getAccount().getId(),
                    receiving.getPurchaseOrder().getId(),
                    receiving.getPurchaseOrder().getPurchaseOrderNo(),
                    receiving.getReceivingNo(),
                    receiving.getReceivingStatusSubCode(),
                    receiving.getReceivingDate()
            );
        }
    }

    public record ReceivingDetailResponse(
            Long id,
            Long receivingId,
            String receivingNo,
            Long itemId,
            String itemCode,
            String itemName,
            Long locationId,
            String locationCode,
            Integer receivedQuantity
    ) {
        public static ReceivingDetailResponse from(ReceivingDetail detail) {
            return new ReceivingDetailResponse(
                    detail.getId(),
                    detail.getReceiving().getId(),
                    detail.getReceiving().getReceivingNo(),
                    detail.getItem().getId(),
                    detail.getItem().getItemCode(),
                    detail.getItem().getItemName(),
                    detail.getLocation().getId(),
                    detail.getLocation().getLocationCode(),
                    detail.getReceivedQuantity()
            );
        }
    }
}
