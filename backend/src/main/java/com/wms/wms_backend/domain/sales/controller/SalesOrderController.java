package com.wms.wms_backend.domain.sales.controller;

import com.wms.wms_backend.domain.sales.entity.SalesOrder;
import com.wms.wms_backend.domain.sales.entity.SalesOrderDetail;
import com.wms.wms_backend.domain.sales.repository.SalesOrderDetailRepository;
import com.wms.wms_backend.domain.sales.repository.SalesOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class SalesOrderController {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderDetailRepository salesOrderDetailRepository;

    @GetMapping("/api/sales-orders")
    public List<SalesOrderResponse> findSalesOrders() {
        List<SalesOrder> salesOrders = salesOrderRepository.findAllByOrderByIdAsc();
        List<SalesOrderResponse> responses = new ArrayList<>();

        for (SalesOrder salesOrder : salesOrders) {
            responses.add(SalesOrderResponse.from(salesOrder));
        }

        return responses;
    }

    @GetMapping("/api/sales-order-details")
    public List<SalesOrderDetailResponse> findSalesOrderDetails() {
        List<SalesOrderDetail> details = salesOrderDetailRepository.findAllByOrderByIdAsc();
        List<SalesOrderDetailResponse> responses = new ArrayList<>();

        for (SalesOrderDetail detail : details) {
            responses.add(SalesOrderDetailResponse.from(detail));
        }

        return responses;
    }

    public record SalesOrderResponse(
            Long id,
            Long accountId,
            Long customerAccountId,
            String customerAccountName,
            String salesOrderNo,
            String orderStatusSubCode,
            LocalDate orderDate,
            String note
    ) {
        public static SalesOrderResponse from(SalesOrder salesOrder) {
            return new SalesOrderResponse(
                    salesOrder.getId(),
                    salesOrder.getAccount().getId(),
                    salesOrder.getCustomerAccount().getId(),
                    salesOrder.getCustomerAccount().getAccountName(),
                    salesOrder.getSalesOrderNo(),
                    salesOrder.getOrderStatusSubCode(),
                    salesOrder.getOrderDate(),
                    salesOrder.getNote()
            );
        }
    }

    public record SalesOrderDetailResponse(
            Long id,
            Long salesOrderId,
            String salesOrderNo,
            Long itemId,
            String itemCode,
            String itemName,
            Integer orderQuantity,
            BigDecimal unitPrice,
            BigDecimal amount
    ) {
        public static SalesOrderDetailResponse from(SalesOrderDetail detail) {
            return new SalesOrderDetailResponse(
                    detail.getId(),
                    detail.getSalesOrder().getId(),
                    detail.getSalesOrder().getSalesOrderNo(),
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
