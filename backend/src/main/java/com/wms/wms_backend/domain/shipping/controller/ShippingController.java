package com.wms.wms_backend.domain.shipping.controller;

import com.wms.wms_backend.domain.shipping.entity.Shipping;
import com.wms.wms_backend.domain.shipping.entity.ShippingDetail;
import com.wms.wms_backend.domain.shipping.repository.ShippingDetailRepository;
import com.wms.wms_backend.domain.shipping.repository.ShippingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ShippingController {

    private final ShippingRepository shippingRepository;
    private final ShippingDetailRepository shippingDetailRepository;

    @GetMapping("/api/shippings")
    public List<ShippingResponse> findShippings() {
        List<Shipping> shippings = shippingRepository.findAllByOrderByIdAsc();
        List<ShippingResponse> responses = new ArrayList<>();

        for (Shipping shipping : shippings) {
            responses.add(ShippingResponse.from(shipping));
        }

        return responses;
    }

    @GetMapping("/api/shipping-details")
    public List<ShippingDetailResponse> findShippingDetails() {
        List<ShippingDetail> details = shippingDetailRepository.findAllByOrderByIdAsc();
        List<ShippingDetailResponse> responses = new ArrayList<>();

        for (ShippingDetail detail : details) {
            responses.add(ShippingDetailResponse.from(detail));
        }

        return responses;
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
