package com.wms.wms_backend.domain.sales.controller;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.sales.entity.SalesOrder;
import com.wms.wms_backend.domain.sales.entity.SalesOrderDetail;
import com.wms.wms_backend.domain.sales.repository.SalesOrderDetailRepository;
import com.wms.wms_backend.domain.sales.repository.SalesOrderRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class SalesOrderController {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderDetailRepository salesOrderDetailRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/api/sales-orders")
    public List<SalesOrderResponse> findSalesOrders() {
        List<SalesOrder> salesOrders = salesOrderRepository.findAllByOrderByIdAsc();
        List<SalesOrderResponse> responses = new ArrayList<>();

        for (SalesOrder salesOrder : salesOrders) {
            responses.add(SalesOrderResponse.from(salesOrder));
        }

        return responses;
    }

    @PostMapping("/api/sales-orders")
    @ResponseStatus(HttpStatus.CREATED)
    public SalesOrderResponse createSalesOrder(@Valid @RequestBody SalesOrderRequest request) {
        if (salesOrderRepository.existsBySalesOrderNo(request.salesOrderNo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 판매주문 번호입니다.");
        }

        Account account = findAccount(request.accountId(), "운영 거래처 정보를 찾을 수 없습니다.");
        Account customerAccount = findAccount(request.customerAccountId(), "고객사 정보를 찾을 수 없습니다.");

        SalesOrder salesOrder = salesOrderRepository.save(new SalesOrder(
                account,
                customerAccount,
                request.salesOrderNo(),
                request.orderDate(),
                normalizeNote(request.note())
        ));

        return SalesOrderResponse.from(salesOrder);
    }

    @PutMapping("/api/sales-orders/{id}")
    @Transactional
    public SalesOrderResponse updateSalesOrder(@PathVariable Long id, @Valid @RequestBody SalesOrderRequest request) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "판매주문 정보를 찾을 수 없습니다."));

        if (salesOrderRepository.existsBySalesOrderNoAndIdNot(request.salesOrderNo(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 판매주문 번호입니다.");
        }

        Account account = findAccount(request.accountId(), "운영 거래처 정보를 찾을 수 없습니다.");
        Account customerAccount = findAccount(request.customerAccountId(), "고객사 정보를 찾을 수 없습니다.");

        salesOrder.update(
                account,
                customerAccount,
                request.salesOrderNo(),
                request.orderDate(),
                normalizeNote(request.note())
        );

        return SalesOrderResponse.from(salesOrder);
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

    public record SalesOrderRequest(
            @NotNull Long accountId,
            @NotNull Long customerAccountId,
            @NotBlank String salesOrderNo,
            @NotNull LocalDate orderDate,
            String note
    ) {
    }

    private Account findAccount(Long id, String message) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, message));
    }

    private String normalizeNote(String note) {
        return note == null ? "" : note;
    }
}
