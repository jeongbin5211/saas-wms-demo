package com.wms.wms_backend.domain.purchase.controller;

import com.wms.wms_backend.domain.purchase.entity.PurchaseOrder;
import com.wms.wms_backend.domain.purchase.entity.PurchaseOrderDetail;
import com.wms.wms_backend.domain.purchase.repository.PurchaseOrderDetailRepository;
import com.wms.wms_backend.domain.purchase.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderDetailRepository purchaseOrderDetailRepository;

    @GetMapping("/api/purchase-orders")
    public List<PurchaseOrderResponse> findPurchaseOrders() {
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepository.findAllByOrderByIdAsc();
        List<PurchaseOrderResponse> responses = new ArrayList<>();

        for (PurchaseOrder purchaseOrder : purchaseOrders) {
            responses.add(PurchaseOrderResponse.from(purchaseOrder));
        }

        return responses;
    }

    @GetMapping("/api/purchase-order-details")
    public List<PurchaseOrderDetailResponse> findPurchaseOrderDetails() {
        List<PurchaseOrderDetail> details = purchaseOrderDetailRepository.findAllByOrderByIdAsc();
        List<PurchaseOrderDetailResponse> responses = new ArrayList<>();

        for (PurchaseOrderDetail detail : details) {
            responses.add(PurchaseOrderDetailResponse.from(detail));
        }

        return responses;
    }

    public record PurchaseOrderResponse(
            Long id,
            Long accountId,
            Long supplierAccountId,
            String supplierAccountName,
            String purchaseOrderNo,
            String orderStatusSubCode,
            LocalDate orderDate,
            String note
    ) {
        public static PurchaseOrderResponse from(PurchaseOrder purchaseOrder) {
            return new PurchaseOrderResponse(
                    purchaseOrder.getId(),
                    purchaseOrder.getAccount().getId(),
                    purchaseOrder.getSupplierAccount().getId(),
                    purchaseOrder.getSupplierAccount().getAccountName(),
                    purchaseOrder.getPurchaseOrderNo(),
                    purchaseOrder.getOrderStatusSubCode(),
                    purchaseOrder.getOrderDate(),
                    purchaseOrder.getNote()
            );
        }
    }

    public record PurchaseOrderDetailResponse(
            Long id,
            Long purchaseOrderId,
            String purchaseOrderNo,
            Long itemId,
            String itemCode,
            String itemName,
            Integer orderQuantity,
            BigDecimal unitPrice,
            BigDecimal amount
    ) {
        public static PurchaseOrderDetailResponse from(PurchaseOrderDetail detail) {
            return new PurchaseOrderDetailResponse(
                    detail.getId(),
                    detail.getPurchaseOrder().getId(),
                    detail.getPurchaseOrder().getPurchaseOrderNo(),
                    detail.getItem().getId(),
                    detail.getItem().getItemCode(),
                    detail.getItem().getItemName(),
                    detail.getOrderQuantity(),
                    detail.getUnitPrice(),
                    detail.getAmount()
            );
        }
    }
}
