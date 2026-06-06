package com.wms.wms_backend.domain.purchase.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.purchase.entity.PurchaseOrder;
import com.wms.wms_backend.domain.purchase.entity.PurchaseOrderDetail;
import com.wms.wms_backend.domain.purchase.repository.PurchaseOrderDetailRepository;
import com.wms.wms_backend.domain.purchase.repository.PurchaseOrderRepository;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderDetailRepository purchaseOrderDetailRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/api/purchase-orders")
    public List<PurchaseOrderResponse> findPurchaseOrders(
            @RequestParam(required = false) String purchaseOrderNo,
            @RequestParam(required = false) String orderStatusSubCode,
            @RequestParam(required = false) LocalDate orderDateFrom,
            @RequestParam(required = false) LocalDate orderDateTo
    ) {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return purchaseOrderRepository.findAllByTopAccountId(topAccountId).stream()
                .filter(o -> purchaseOrderNo == null || o.getPurchaseOrderNo().contains(purchaseOrderNo))
                .filter(o -> orderStatusSubCode == null || o.getOrderStatusSubCode().equals(orderStatusSubCode))
                .filter(o -> orderDateFrom == null || !o.getOrderDate().isBefore(orderDateFrom))
                .filter(o -> orderDateTo == null || !o.getOrderDate().isAfter(orderDateTo))
                .map(PurchaseOrderResponse::from)
                .toList();
    }

    @PostMapping("/api/purchase-orders")
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseOrderResponse createPurchaseOrder(@Valid @RequestBody PurchaseOrderRequest request) {
        if (purchaseOrderRepository.existsByPurchaseOrderNo(request.purchaseOrderNo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 구매주문 번호입니다.");
        }

        Account account = findAccount(request.accountId(), "운영 거래처 정보를 찾을 수 없습니다.");
        Account supplierAccount = findAccount(request.supplierAccountId(), "공급처 정보를 찾을 수 없습니다.");

        PurchaseOrder purchaseOrder = purchaseOrderRepository.save(new PurchaseOrder(
                account,
                supplierAccount,
                request.purchaseOrderNo(),
                request.orderDate(),
                normalizeNote(request.note())
        ));

        return PurchaseOrderResponse.from(purchaseOrder);
    }

    @PutMapping("/api/purchase-orders/{id}")
    @Transactional
    public PurchaseOrderResponse updatePurchaseOrder(@PathVariable Long id, @Valid @RequestBody PurchaseOrderRequest request) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "구매주문 정보를 찾을 수 없습니다."));

        if (purchaseOrderRepository.existsByPurchaseOrderNoAndIdNot(request.purchaseOrderNo(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 구매주문 번호입니다.");
        }

        Account account = findAccount(request.accountId(), "운영 거래처 정보를 찾을 수 없습니다.");
        Account supplierAccount = findAccount(request.supplierAccountId(), "공급처 정보를 찾을 수 없습니다.");

        purchaseOrder.update(
                account,
                supplierAccount,
                request.purchaseOrderNo(),
                request.orderDate(),
                normalizeNote(request.note())
        );

        return PurchaseOrderResponse.from(purchaseOrder);
    }

    @GetMapping("/api/purchase-order-details")
    public List<PurchaseOrderDetailResponse> findPurchaseOrderDetails() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return purchaseOrderDetailRepository.findAllByTopAccountId(topAccountId).stream()
                .map(PurchaseOrderDetailResponse::from)
                .toList();
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

    public record PurchaseOrderRequest(
            @NotNull Long accountId,
            @NotNull Long supplierAccountId,
            @NotBlank String purchaseOrderNo,
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
