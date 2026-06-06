package com.wms.wms_backend.domain.shipping.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.shipping.entity.Shipping;
import com.wms.wms_backend.domain.shipping.entity.ShippingDetail;
import com.wms.wms_backend.domain.shipping.repository.ShippingDetailRepository;
import com.wms.wms_backend.domain.shipping.repository.ShippingRepository;
import com.wms.wms_backend.domain.shipping.service.ShippingProcessService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ShippingController {

    private final ShippingRepository shippingRepository;
    private final ShippingDetailRepository shippingDetailRepository;
    private final ShippingProcessService shippingProcessService;

    @GetMapping("/api/shippings")
    public List<ShippingResponse> findShippings() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return shippingRepository.findAllByTopAccountId(topAccountId).stream()
                .map(ShippingResponse::from)
                .toList();
    }

    @GetMapping("/api/shipping-details")
    public List<ShippingDetailResponse> findShippingDetails() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return shippingDetailRepository.findAllByTopAccountId(topAccountId).stream()
                .map(ShippingDetailResponse::from)
                .toList();
    }

    @PostMapping("/api/shippings/{shippingId}/confirm")
    public ShippingProcessService.ShippingConfirmResult confirmShipping(@PathVariable Long shippingId) {
        return shippingProcessService.confirmShipping(shippingId);
    }

    public record ShippingResponse(
            Long id,
            Long accountId,
            Long salesOrderId,
            String salesOrderNo,
            String shippingNo,
            String shippingStatusSubCode,
            LocalDate shippingDate
    ) {
        public static ShippingResponse from(Shipping shipping) {
            return new ShippingResponse(
                    shipping.getId(),
                    shipping.getAccount().getId(),
                    shipping.getSalesOrder().getId(),
                    shipping.getSalesOrder().getSalesOrderNo(),
                    shipping.getShippingNo(),
                    shipping.getShippingStatusSubCode(),
                    shipping.getShippingDate()
            );
        }
    }

    public record ShippingDetailResponse(
            Long id,
            Long shippingId,
            String shippingNo,
            Long itemId,
            String itemCode,
            String itemName,
            Long locationId,
            String locationCode,
            Integer shippedQuantity
    ) {
        public static ShippingDetailResponse from(ShippingDetail detail) {
            return new ShippingDetailResponse(
                    detail.getId(),
                    detail.getShipping().getId(),
                    detail.getShipping().getShippingNo(),
                    detail.getItem().getId(),
                    detail.getItem().getItemCode(),
                    detail.getItem().getItemName(),
                    detail.getLocation().getId(),
                    detail.getLocation().getLocationCode(),
                    detail.getShippedQuantity()
            );
        }
    }
}
