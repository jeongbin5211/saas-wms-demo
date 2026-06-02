package com.wms.wms_backend.domain.receiving.controller;

import com.wms.wms_backend.domain.receiving.entity.Receiving;
import com.wms.wms_backend.domain.receiving.entity.ReceivingDetail;
import com.wms.wms_backend.domain.receiving.repository.ReceivingDetailRepository;
import com.wms.wms_backend.domain.receiving.repository.ReceivingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ReceivingController {

    private final ReceivingRepository receivingRepository;
    private final ReceivingDetailRepository receivingDetailRepository;

    @GetMapping("/api/receivings")
    public List<ReceivingResponse> findReceivings() {
        List<Receiving> receivings = receivingRepository.findAllByOrderByIdAsc();
        List<ReceivingResponse> responses = new ArrayList<>();

        for (Receiving receiving : receivings) {
            responses.add(ReceivingResponse.from(receiving));
        }

        return responses;
    }

    @GetMapping("/api/receiving-details")
    public List<ReceivingDetailResponse> findReceivingDetails() {
        List<ReceivingDetail> details = receivingDetailRepository.findAllByOrderByIdAsc();
        List<ReceivingDetailResponse> responses = new ArrayList<>();

        for (ReceivingDetail detail : details) {
            responses.add(ReceivingDetailResponse.from(detail));
        }

        return responses;
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
